import { inspect } from "node:util";
import type { HomeAssistantEntityInformation } from "@home-assistant-matter-hub/common";
import { ServiceAreaServer as Base } from "@matter/main/behaviors/service-area";
import { ServiceArea } from "@matter/main/clusters/service-area";
import { HomeAssistantEntityBehavior } from "../../../../behaviors/home-assistant-entity-behavior.js";
import {
  parseVacuumServiceAreaData,
  type VacuumServiceAreaActionValue,
  type VacuumServiceAreaData,
} from "../service-area-data.js";

interface SelectAreasLike {
  selectedAreas?: unknown;
  newAreas?: unknown;
  areaIds?: unknown;
  selectedAreaIds?: unknown;
  areas?: unknown;
}

interface SkipAreaLike {
  skippedArea?: unknown;
  area?: unknown;
  areaId?: unknown;
}

const AREA_ID_KEYS = [
  "areaId",
  "area_id",
  "id",
  "value",
  "segmentId",
  "segment_id",
  "roomId",
  "room_id",
] as const;

interface MutableServiceAreaState {
  supportedMaps: ServiceArea.Map[];
  supportedAreas: ServiceArea.Area[];
  selectedAreas: unknown[];
  currentArea: number | null;
  progress: ServiceArea.Progress[];
}

export class VacuumServiceAreaServerBase extends Base {
  #data: VacuumServiceAreaData | undefined;
  #actionValuesByAreaId = new Map<number, VacuumServiceAreaActionValue>();
  #selectedMatterAreaIds: number[] = [];

  private get supportsMaps(): boolean {
    const features = this.features as Record<string, unknown>;
    return features.maps === true;
  }

  private get supportsProgressReporting(): boolean {
    const features = this.features as Record<string, unknown>;
    return features.progressReporting === true;
  }

  override async initialize() {
    this.ensureStateDefaults();

    const homeAssistant = await this.agent.load(HomeAssistantEntityBehavior);
    this.update(homeAssistant.entity);
    this.reactTo(homeAssistant.onChange, this.update);
    await super.initialize();
  }

  private ensureStateDefaults() {
    const state = this.state as unknown as Partial<MutableServiceAreaState>;
    if (this.supportsMaps && !Array.isArray(state.supportedMaps)) {
      state.supportedMaps = [];
    }
    if (!Array.isArray(state.supportedAreas)) {
      state.supportedAreas = [];
    }
    if (!Array.isArray(state.selectedAreas)) {
      state.selectedAreas = [];
    }
    if (this.supportsProgressReporting && !Array.isArray(state.progress)) {
      state.progress = [];
    }
    if (state.currentArea === undefined) {
      state.currentArea = null;
    }
  }

  private update(entity: HomeAssistantEntityInformation) {
    this.ensureStateDefaults();
    const state = this.state as unknown as MutableServiceAreaState;

    const attributes = entity.state.attributes;
    const data = parseVacuumServiceAreaData(
      attributes as Parameters<typeof parseVacuumServiceAreaData>[0],
    );

    this.#data = data;
    this.#actionValuesByAreaId.clear();

    if (data == null) {
      this.setStoredSelectedAreas([], "no-data");
      if (this.supportsMaps) {
        state.supportedMaps = [];
      }
      state.supportedAreas = [];
      state.selectedAreas = [];
      state.currentArea = null;
      if (this.supportsProgressReporting) {
        state.progress = [];
      }
      return;
    }

    for (const area of data.areas) {
      this.#actionValuesByAreaId.set(area.matterAreaId, area.actionValue);
    }

    const selectedAreasFromState = this.getNormalizedStateSelectedAreaIds().filter(
      (areaId) => this.#actionValuesByAreaId.has(areaId),
    );
    if (selectedAreasFromState.length > 0) {
      this.setStoredSelectedAreas(selectedAreasFromState, "state");
    }

    const supportedMaps = this.supportsMaps
      ? data.maps.map((map) => ({
          mapId: map.mapId,
          name: map.name,
        }))
      : [];

    const supportedAreas = data.areas.map((area) => ({
      areaId: area.matterAreaId,
      mapId: this.supportsMaps ? area.mapId : null,
      areaInfo: {
        locationInfo: {
          locationName: area.name,
          floorNumber: null,
          areaType: null,
        },
        landmarkInfo: null,
      },
    }));
    disambiguateDuplicateAreaNames(supportedAreas);

    const selectedAreasFromAttributes = data.selectedMatterAreaIds.filter((areaId) =>
      this.#actionValuesByAreaId.has(areaId),
    );
    if (
      selectedAreasFromAttributes.length > 0 ||
      this.#selectedMatterAreaIds.length === 0
    ) {
      this.setStoredSelectedAreas(selectedAreasFromAttributes, "attributes");
    }

    const selectedAreas = this.#selectedMatterAreaIds.filter((areaId) =>
      this.#actionValuesByAreaId.has(areaId),
    );
    const progress = selectedAreas.map((areaId) => ({
      areaId,
      status: ServiceArea.OperationalStatus.Pending,
    }));

    if (this.supportsMaps) {
      state.supportedMaps = supportedMaps;
    }
    state.supportedAreas = supportedAreas;
    state.selectedAreas = selectedAreas;
    state.currentArea = data.currentMatterAreaId ?? null;
    if (this.supportsProgressReporting) {
      state.progress = progress;
    }
  }

  override async selectAreas(
    request: ServiceArea.SelectAreasRequest,
  ): Promise<ServiceArea.SelectAreasResponse> {
    const normalizedAreas = normalizeSelectedAreaIds(request);
    if (normalizedAreas.length === 0) {
      console.debug(
        `VacuumServiceArea selectAreas received unparsable payload: ${inspect(request, { depth: 4, breakLength: 120 })}`,
      );
    }

    const response = await super.selectAreas(
      normalizedAreas.length > 0 ? { newAreas: normalizedAreas } : request,
    );

    if (response.status !== ServiceArea.SelectAreasStatus.Success) {
      return response;
    }

    const selectedAreasFromState = this.getNormalizedStateSelectedAreaIds().filter(
      (areaId) => this.#actionValuesByAreaId.has(areaId),
    );
    const selectedAreasFromRequest = normalizedAreas.filter((areaId) =>
      this.#actionValuesByAreaId.has(areaId),
    );
    const selectedAreas =
      selectedAreasFromState.length > 0
        ? selectedAreasFromState
        : selectedAreasFromRequest;

    this.setStoredSelectedAreas(selectedAreas, "selectAreas");

    const state = this.state as unknown as MutableServiceAreaState;
    state.selectedAreas = selectedAreas;
    console.debug(
      `VacuumServiceArea selectAreas status=${response.status} selected=${JSON.stringify(this.#selectedMatterAreaIds)} fromState=${JSON.stringify(selectedAreasFromState)} fromRequest=${JSON.stringify(selectedAreasFromRequest)}`,
    );

    return response;
  }

  getSelectedMatterAreaIds(): number[] {
    return this.#selectedMatterAreaIds.filter((areaId) =>
      this.#actionValuesByAreaId.has(areaId),
    );
  }

  private setStoredSelectedAreas(areaIds: number[], source: string) {
    const normalized = toUniqueAreaIds(areaIds).filter((areaId) =>
      this.#actionValuesByAreaId.has(areaId),
    );
    if (areSameNumberArrays(this.#selectedMatterAreaIds, normalized)) {
      return;
    }
    this.#selectedMatterAreaIds = normalized;
    console.debug(
      `VacuumServiceArea stored selected areas updated (${source}): ${JSON.stringify(this.#selectedMatterAreaIds)}`,
    );
  }

  getSelectedAreasAction():
    | { action: string; data: Record<string, unknown> }
    | undefined {
    const data = this.#data;
    if (data == null) {
      return undefined;
    }

    const selectedAreaIdsFromState = this.getNormalizedStateSelectedAreaIds().filter(
      (areaId) => this.#actionValuesByAreaId.has(areaId),
    );
    const selectedAreaIds =
      selectedAreaIdsFromState.length > 0
        ? selectedAreaIdsFromState
        : this.getSelectedMatterAreaIds();

    const selectedAreaValues = selectedAreaIds
      .map((areaId) => this.#actionValuesByAreaId.get(areaId))
      .filter(
        (value): value is VacuumServiceAreaActionValue => value != null,
      );

    if (selectedAreaValues.length === 0) {
      return undefined;
    }

    return buildSelectAreasAction(data, selectedAreaValues);
  }

  // Optional command: emulate skip by re-selecting areas except the skipped one.
  override async skipArea(
    request: ServiceArea.SkipAreaRequest,
  ): Promise<ServiceArea.SkipAreaResponse> {
    const skipResult = this.assertSkipServiceArea(request);
    if (skipResult.status !== ServiceArea.SkipAreaStatus.Success) {
      return skipResult;
    }

    const remainingAreas = this.getNormalizedStateSelectedAreaIds().filter(
      (areaId) => areaId !== request.skippedArea,
    );

    const selectResult = await this.selectAreas({ newAreas: remainingAreas });
    if (selectResult.status !== ServiceArea.SelectAreasStatus.Success) {
      return {
        status: ServiceArea.SkipAreaStatus.InvalidSkippedArea,
        statusText: selectResult.statusText,
      };
    }

    return {
      status: ServiceArea.SkipAreaStatus.Success,
      statusText: "",
    };
  }

  private getNormalizedStateSelectedAreaIds(): number[] {
    const state = this.state as unknown as Partial<MutableServiceAreaState>;
    const selectedAreas = Array.isArray(state.selectedAreas)
      ? state.selectedAreas
      : [];
    return toUniqueAreaIds(
      selectedAreas
        .map((areaId) => toNumber(areaId))
        .filter((areaId): areaId is number => areaId != null),
    );
  }
}

export const VacuumServiceAreaServer = VacuumServiceAreaServerBase.with(
  ServiceArea.Feature.Maps,
  ServiceArea.Feature.ProgressReporting,
).set({});

export function createVacuumServiceAreaServer(): object {
  return VacuumServiceAreaServer;
}

function buildSelectAreasAction(
  data: VacuumServiceAreaData,
  selectedAreaValues: VacuumServiceAreaActionValue[],
): { action: string; data: Record<string, unknown> } {
  const payload: Record<string, unknown> = {
    [data.paramsKey]: data.paramsNested
      ? [selectedAreaValues]
      : selectedAreaValues,
  };

  if (data.command != null) {
    payload[data.commandKey] = data.command;
  }

  return {
    action: data.action,
    data: payload,
  };
}

export function normalizeSelectedAreaIds(request: unknown): number[] {
  if (Array.isArray(request)) {
    return toUniqueAreaIds(request.flatMap((value) => extractAreaIds(value)));
  }

  if (request != null && typeof request === "object") {
    const payload = request as SelectAreasLike;
    const selected =
      payload.selectedAreas ??
      payload.newAreas ??
      payload.areaIds ??
      payload.selectedAreaIds ??
      payload.areas;

    if (selected != null) {
      return toUniqueAreaIds(extractAreaIds(selected));
    }

    return toUniqueAreaIds(extractAreaIds(payload));
  }

  return [];
}

export function normalizeSkippedAreaId(request: unknown): number | undefined {
  if (request != null && typeof request === "object") {
    const payload = request as SkipAreaLike;
    const skippedArea = payload.skippedArea ?? payload.area ?? payload.areaId;
    const skippedAreaId = extractAreaId(skippedArea);
    if (skippedAreaId != null) {
      return skippedAreaId;
    }
  }

  return extractAreaId(request);
}

function extractAreaIds(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => extractAreaId(entry))
      .filter((entry): entry is number => entry != null);
  }

  if (isIterable(value)) {
    return toUniqueAreaIds(
      [...value]
        .map((entry) => extractAreaId(entry))
        .filter((entry): entry is number => entry != null),
    );
  }

  if (isArrayLike(value)) {
    return toUniqueAreaIds(
      Array.from(value)
        .map((entry) => extractAreaId(entry))
        .filter((entry): entry is number => entry != null),
    );
  }

  const areaId = extractAreaId(value);
  return areaId != null ? [areaId] : [];
}

function extractAreaId(value: unknown): number | undefined {
  const direct = toNumber(value);
  if (direct != null) {
    return direct;
  }

  if (value == null || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;

  for (const key of AREA_ID_KEYS) {
    const numeric = toNumber(record[key]);
    if (numeric != null) {
      return numeric;
    }
  }

  const nestedCandidates = [
    record.area,
    record.areaInfo,
    record.selectedArea,
    record.newArea,
    record.skippedArea,
    record.targetArea,
  ];

  for (const candidate of nestedCandidates) {
    const nested = extractAreaId(candidate);
    if (nested != null) {
      return nested;
    }
  }

  return undefined;
}

function toUniqueAreaIds(values: number[]): number[] {
  return [...new Set(values)];
}

function areSameNumberArrays(left: number[], right: number[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }
  return true;
}

function toNumber(value: unknown): number | undefined {
  if (value != null && typeof value === "object") {
    const valueOf = (value as { valueOf?: () => unknown }).valueOf;
    if (typeof valueOf === "function") {
      const primitive = valueOf.call(value);
      if (primitive !== value) {
        const parsedPrimitive = toNumber(primitive);
        if (parsedPrimitive != null) {
          return parsedPrimitive;
        }
      }
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "bigint") {
    const asNumber = Number(value);
    return Number.isFinite(asNumber) ? asNumber : undefined;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function isIterable(value: unknown): value is Iterable<unknown> {
  if (value == null || typeof value === "string") {
    return false;
  }

  return (
    typeof value === "object" &&
    typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] ===
      "function"
  );
}

function isArrayLike(value: unknown): value is ArrayLike<unknown> {
  if (value == null || typeof value === "string") {
    return false;
  }

  if (Array.isArray(value) || isIterable(value)) {
    return false;
  }

  if (typeof value !== "object") {
    return false;
  }

  const length = (value as { length?: unknown }).length;
  return typeof length === "number" && Number.isFinite(length) && length >= 0;
}

function disambiguateDuplicateAreaNames(areas: ServiceArea.Area[]) {
  const counts = new Map<string, number>();
  for (const area of areas) {
    const locationName = area.areaInfo.locationInfo?.locationName ?? "";
    const key = `${area.mapId}:${locationName}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  for (const area of areas) {
    const locationInfo = area.areaInfo.locationInfo;
    if (locationInfo == null) {
      continue;
    }

    const key = `${area.mapId}:${locationInfo.locationName}`;
    if ((counts.get(key) ?? 0) > 1) {
      area.areaInfo.locationInfo = {
        ...locationInfo,
        locationName: `${locationInfo.locationName} (${area.areaId})`,
      };
    }
  }
}

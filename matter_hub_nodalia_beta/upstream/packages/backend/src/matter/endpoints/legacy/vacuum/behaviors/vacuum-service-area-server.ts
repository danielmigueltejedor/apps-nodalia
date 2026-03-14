import { HomeAssistantEntityBehavior } from "../../../../behaviors/home-assistant-entity-behavior.js";
import {
  parseVacuumServiceAreaData,
  type VacuumServiceAreaData,
} from "../service-area-data.js";

import * as MatterBehaviors from "@matter/main/behaviors";

type ClusterBehaviorFactory = {
  set(config: object): object;
};

interface AgentLike {
  get(cluster: typeof HomeAssistantEntityBehavior): HomeAssistantEntityBehavior;
}

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

export function createVacuumServiceAreaServer(): object | undefined {
  const serviceAreaServer = (MatterBehaviors as Record<string, unknown>)
    .ServiceAreaServer as ClusterBehaviorFactory | undefined;

  if (serviceAreaServer?.set == null) {
    return undefined;
  }

  const configuration = {
    getSupportedMaps: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      return (data?.maps ?? []).map((map) =>
        ({
          mapId: map.mapId,
          mapName: map.name,
          name: map.name,
        }) as object,
      );
    },

    getSupportedAreas: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      return (data?.areas ?? []).map((area) =>
        ({
          areaId: area.matterAreaId,
          mapId: area.mapId,
          locationInfo: { locationName: area.name },
          areaInfo: { locationInfo: { locationName: area.name } },
        }) as object,
      );
    },

    getCurrentMap: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      if (data == null || data.maps.length === 0) {
        return undefined;
      }
      return data.maps[0].mapId;
    },

    getCurrentArea: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      if (data?.currentMatterAreaId == null) {
        return undefined;
      }
      const currentArea = data.areas.find(
        (area) => area.matterAreaId === data.currentMatterAreaId,
      );
      if (currentArea == null) {
        return undefined;
      }
      return {
        areaId: currentArea.matterAreaId,
        mapId: currentArea.mapId,
        locationInfo: { locationName: currentArea.name },
        areaInfo: { locationInfo: { locationName: currentArea.name } },
      } as object;
    },

    getProgress: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      if (data == null || data.selectedMatterAreaIds.length === 0) {
        return [];
      }
      return data.selectedMatterAreaIds.map((areaId) => ({ areaId })) as object[];
    },

    selectAreas: (request: unknown, agent: unknown) => {
      const data = getData(agent);
      const entity = getEntity(agent);
      if (data == null || entity == null) {
        return;
      }

      const selectedMatterAreaIds = normalizeSelectedAreaIds(request);
      const selectedAreaValues = selectedMatterAreaIds
        .map(
          (matterAreaId) =>
            data.areas.find((area) => area.matterAreaId === matterAreaId)
              ?.actionValue,
        )
        .filter((areaValue): areaValue is number | string => areaValue != null);

      if (selectedAreaValues.length === 0) {
        return;
      }

      entity.callAction(buildSelectAreasAction(data, selectedAreaValues));
    },

    skipArea: (request: unknown, agent: unknown) => {
      const areaId = normalizeSkippedAreaId(request);
      if (areaId == null) {
        return;
      }
      configuration.selectAreas([areaId], agent);
    },
  };

  return serviceAreaServer.set({
    config: configuration,
    configuration,
  });
}

function buildSelectAreasAction(
  data: VacuumServiceAreaData,
  selectedAreaValues: Array<number | string>,
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

function getEntity(agent: unknown): HomeAssistantEntityBehavior | undefined {
  const typedAgent = agent as AgentLike | undefined;
  if (typedAgent?.get == null) {
    return undefined;
  }

  try {
    return typedAgent.get(HomeAssistantEntityBehavior);
  } catch {
    return undefined;
  }
}

function getData(agent: unknown) {
  const entity = getEntity(agent);
  const attributes = entity?.entity?.state?.attributes;
  if (attributes == null || typeof attributes !== "object") {
    return undefined;
  }
  return parseVacuumServiceAreaData(
    attributes as Parameters<typeof parseVacuumServiceAreaData>[0],
  );
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

function toNumber(value: unknown): number | undefined {
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

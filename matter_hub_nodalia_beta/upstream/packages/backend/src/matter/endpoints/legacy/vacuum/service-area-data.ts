import type { VacuumDeviceAttributes } from "@home-assistant-matter-hub/common";

export interface VacuumServiceAreaMap {
  mapId: number;
  name: string;
}

export type VacuumServiceAreaActionValue = number | string;

export interface VacuumServiceAreaArea {
  matterAreaId: number;
  // Kept for backward compatibility with older segment-based flows.
  segmentId: number;
  actionValue: VacuumServiceAreaActionValue;
  mapId: number;
  name: string;
}

export interface VacuumServiceAreaData {
  maps: VacuumServiceAreaMap[];
  areas: VacuumServiceAreaArea[];
  selectedMatterAreaIds: number[];
  currentMatterAreaId?: number;
  action: string;
  command?: string;
  commandKey: string;
  paramsKey: string;
  paramsNested: boolean;
}

type Attributes = VacuumDeviceAttributes & Record<string, unknown>;

interface AreaCandidate {
  matterAreaId?: number;
  actionValue?: VacuumServiceAreaActionValue;
  mapId?: number;
  name?: string;
}

const AREA_ID_KEYS = [
  "id",
  "segment_id",
  "segmentId",
  "room_id",
  "roomId",
  "area_id",
  "areaId",
  "value",
] as const;

const AREA_ACTION_KEYS = [
  "cleaning_area_id",
  "cleaningAreaId",
  "area_slug",
  "areaSlug",
  "ha_area_id",
  "home_assistant_area_id",
  "action_value",
  "actionValue",
  ...AREA_ID_KEYS,
] as const;

const AREA_NAME_KEYS = ["name", "title", "label", "room_name"] as const;
const MAP_ID_KEYS = ["map_id", "mapId", "selected_map", "map"] as const;

const SELECTED_AREA_KEYS = [
  "selected_segments",
  "cleaning_segments",
  "active_segments",
  "current_segments",
  "selected_rooms",
  "current_rooms",
  "selected_areas",
  "active_areas",
] as const;

const CURRENT_AREA_KEYS = [
  "current_segment",
  "currentSegment",
  "current_segment_id",
  "currentSegmentId",
  "current_room",
  "currentRoom",
  "current_room_id",
  "currentRoomId",
  "current_area",
  "currentArea",
  "current_area_id",
  "currentAreaId",
  "active_segment",
  "activeSegment",
  "active_room",
  "activeRoom",
  "active_area",
  "activeArea",
  "room",
  "room_id",
  "segment",
  "segment_id",
  "area",
  "area_id",
] as const;

export function parseVacuumServiceAreaData(
  attributes: Attributes,
): VacuumServiceAreaData | undefined {
  const defaultMapId = toNumber(attributes.selected_map ?? attributes.map_id) ?? 1;
  const candidates = collectAreaCandidates(attributes, defaultMapId);
  const areas = createAreas(candidates, defaultMapId);

  if (areas.length === 0) {
    return undefined;
  }

  const mapIds = [...new Set(areas.map((area) => area.mapId))].sort((a, b) => a - b);
  const maps = mapIds.map((mapId) => ({
    mapId,
    name: mapIds.length === 1 ? "Map" : `Map ${mapId}`,
  }));

  const selectedAreaValues = parseSelectedAreaValues(attributes);
  const selectedMatterAreaIds = toMatterAreaIds(selectedAreaValues, areas);

  const currentAreaValue = extractAreaValue(
    attributes.current_segment ??
      attributes.current_area ??
      firstAreaValue(attributes, CURRENT_AREA_KEYS),
  );
  const currentMatterAreaId =
    currentAreaValue == null
      ? undefined
      : toMatterAreaIds([currentAreaValue], areas)[0];

  const action =
    toStringValue(attributes.matter_service_area_action) ?? "vacuum.send_command";
  const commandKey =
    toStringValue(attributes.matter_service_area_command_key) ?? "command";
  const paramsKey =
    toStringValue(attributes.matter_service_area_params_key) ?? "params";
  const command =
    toStringValue(attributes.matter_service_area_command) ??
    toStringValue(attributes.room_clean_command) ??
    toStringValue(attributes.segment_clean_command) ??
    (action === "vacuum.send_command" ? "app_segment_clean" : undefined);

  const paramsNested = toBoolean(attributes.matter_service_area_params_nested);

  return {
    maps,
    areas,
    selectedMatterAreaIds,
    currentMatterAreaId,
    action,
    command,
    commandKey,
    paramsKey,
    paramsNested,
  };
}

function collectAreaCandidates(
  attributes: Attributes,
  defaultMapId: number,
): AreaCandidate[] {
  const candidates: AreaCandidate[] = [];

  const areasFromArrays = parseArrayLikeAreas(attributes.rooms, defaultMapId).concat(
    parseArrayLikeAreas(attributes.segments, defaultMapId),
    parseArrayLikeAreas(attributes.room_mapping, defaultMapId),
    parseArrayLikeAreas(attributes.room_map, defaultMapId),
    parseArrayLikeAreas(attributes.segment_map, defaultMapId),
  );
  candidates.push(...areasFromArrays);

  const areasFromObjects = parseObjectLikeAreas(attributes.rooms, defaultMapId).concat(
    parseObjectLikeAreas(attributes.segments, defaultMapId),
    parseObjectLikeAreas(attributes.room_map, defaultMapId),
    parseObjectLikeAreas(attributes.segment_map, defaultMapId),
  );
  candidates.push(...areasFromObjects);

  const ids = parseNumberList(attributes.segment_ids).concat(
    parseNumberList(attributes.room_ids),
  );
  if (ids.length > 0) {
    const names = parseNamesById(attributes.segment_names, attributes.room_names);
    for (const segmentId of ids) {
      candidates.push({
        matterAreaId: segmentId,
        actionValue: segmentId,
        mapId: defaultMapId,
        name: names.get(segmentId),
      });
    }
  }

  return candidates;
}

function createAreas(
  candidates: AreaCandidate[],
  defaultMapId: number,
): VacuumServiceAreaArea[] {
  const usedMatterAreaIds = new Set<number>();
  const byMatterAreaId = new Map<number, VacuumServiceAreaArea>();

  for (const candidate of candidates) {
    const actionValue = candidate.actionValue ?? candidate.matterAreaId;
    if (actionValue == null) {
      continue;
    }

    const resolvedMatterAreaId =
      candidate.matterAreaId ?? createMatterAreaId(actionValue, usedMatterAreaIds);

    if (byMatterAreaId.has(resolvedMatterAreaId)) {
      continue;
    }

    usedMatterAreaIds.add(resolvedMatterAreaId);
    byMatterAreaId.set(resolvedMatterAreaId, {
      matterAreaId: resolvedMatterAreaId,
      segmentId: resolvedMatterAreaId,
      actionValue,
      mapId: candidate.mapId ?? defaultMapId,
      name: candidate.name ?? createDefaultAreaName(actionValue, resolvedMatterAreaId),
    });
  }

  return [...byMatterAreaId.values()].sort((a, b) => a.matterAreaId - b.matterAreaId);
}

function parseArrayLikeAreas(value: unknown, defaultMapId: number): AreaCandidate[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: AreaCandidate[] = [];
  for (const item of value) {
    if (item == null) {
      continue;
    }

    if (Array.isArray(item)) {
      const primaryValue = toAreaValue(item[0]);
      if (primaryValue == null) {
        continue;
      }

      const actionOverride = toAreaValue(item[3]);
      const actionValue = actionOverride ?? primaryValue;
      const matterAreaId = toNumber(primaryValue) ?? toNumber(actionOverride);

      result.push({
        matterAreaId,
        actionValue,
        mapId: toNumber(item[2]) ?? defaultMapId,
        name: toStringValue(item[1]),
      });
      continue;
    }

    if (typeof item === "number" || typeof item === "bigint") {
      const numeric = toNumber(item);
      if (numeric != null) {
        result.push({
          matterAreaId: numeric,
          actionValue: numeric,
          mapId: defaultMapId,
        });
      }
      continue;
    }

    if (typeof item === "string") {
      const actionValue = toAreaValue(item);
      if (actionValue != null) {
        result.push({
          matterAreaId: toNumber(actionValue),
          actionValue,
          mapId: defaultMapId,
        });
      }
      continue;
    }

    if (typeof item === "object") {
      const record = item as Record<string, unknown>;
      const matterAreaId = firstNumber(record, AREA_ID_KEYS);
      const actionValue =
        firstAreaValue(record, AREA_ACTION_KEYS) ??
        (matterAreaId != null ? matterAreaId : undefined);

      if (actionValue == null && matterAreaId == null) {
        continue;
      }

      result.push({
        matterAreaId,
        actionValue,
        mapId: firstNumber(record, MAP_ID_KEYS) ?? defaultMapId,
        name: firstString(record, AREA_NAME_KEYS),
      });
    }
  }

  return result;
}

function parseObjectLikeAreas(value: unknown, defaultMapId: number): AreaCandidate[] {
  if (value == null || Array.isArray(value) || typeof value !== "object") {
    return [];
  }

  const result: AreaCandidate[] = [];
  for (const [key, entry] of Object.entries(value)) {
    const keyActionValue = toAreaValue(key);
    const keyMatterAreaId = toNumber(keyActionValue);

    if (typeof entry === "string") {
      if (keyActionValue == null) {
        continue;
      }

      result.push({
        matterAreaId: keyMatterAreaId,
        actionValue: keyActionValue,
        mapId: defaultMapId,
        name: entry,
      });
      continue;
    }

    if (entry != null && typeof entry === "object") {
      const record = entry as Record<string, unknown>;
      const matterAreaId = firstNumber(record, AREA_ID_KEYS) ?? keyMatterAreaId;
      const actionValue =
        firstAreaValue(record, AREA_ACTION_KEYS) ??
        keyActionValue ??
        (matterAreaId != null ? matterAreaId : undefined);

      if (actionValue == null && matterAreaId == null) {
        continue;
      }

      result.push({
        matterAreaId,
        actionValue,
        mapId: firstNumber(record, MAP_ID_KEYS) ?? defaultMapId,
        name: firstString(record, AREA_NAME_KEYS),
      });
      continue;
    }

    if (keyActionValue != null && isSelectedValue(entry)) {
      result.push({
        matterAreaId: keyMatterAreaId,
        actionValue: keyActionValue,
        mapId: defaultMapId,
      });
    }
  }

  return result;
}

function parseSelectedAreaValues(attributes: Attributes): VacuumServiceAreaActionValue[] {
  const selected = SELECTED_AREA_KEYS.flatMap((key) =>
    parseAreaValueList(attributes[key]),
  );

  const currentAreaValue = extractAreaValue(
    attributes.current_segment ?? attributes.current_area,
  );
  if (currentAreaValue != null) {
    selected.push(currentAreaValue);
  }

  return uniqueAreaValues(selected);
}

function parseNamesById(...values: unknown[]): Map<number, string> {
  const names = new Map<number, string>();

  for (const value of values) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (Array.isArray(entry)) {
          const id = toNumber(entry[0]);
          const name = toStringValue(entry[1]);
          if (id != null && name != null) {
            names.set(id, name);
          }
          continue;
        }

        if (typeof entry === "object" && entry != null) {
          const record = entry as Record<string, unknown>;
          const id = firstNumber(record, AREA_ID_KEYS);
          const name = firstString(record, AREA_NAME_KEYS);
          if (id != null && name != null) {
            names.set(id, name);
          }
        }
      }
      continue;
    }

    if (value != null && typeof value === "object") {
      for (const [key, entry] of Object.entries(value)) {
        const id = toNumber(key);
        if (id != null && typeof entry === "string" && entry.trim() !== "") {
          names.set(id, entry);
          continue;
        }

        if (id != null && entry != null && typeof entry === "object") {
          const record = entry as Record<string, unknown>;
          const name = firstString(record, AREA_NAME_KEYS);
          if (name != null) {
            names.set(id, name);
          }
        }
      }
    }
  }

  return names;
}

function parseAreaValueList(value: unknown): VacuumServiceAreaActionValue[] {
  if (Array.isArray(value)) {
    return uniqueAreaValues(value.flatMap((entry) => parseAreaValueList(entry)));
  }

  if (value != null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const directAreaValue = firstAreaValue(record, AREA_ACTION_KEYS);
    if (directAreaValue != null) {
      return [directAreaValue];
    }

    const result: VacuumServiceAreaActionValue[] = [];

    for (const [key, entry] of Object.entries(record)) {
      const keyAreaValue = toAreaValue(key);
      if (keyAreaValue != null && isSelectedValue(entry)) {
        result.push(keyAreaValue);
      }

      if (entry != null && typeof entry === "object") {
        const nestedAreaValue = firstAreaValue(
          entry as Record<string, unknown>,
          AREA_ACTION_KEYS,
        );
        if (nestedAreaValue != null) {
          result.push(nestedAreaValue);
        }
      }
    }

    return uniqueAreaValues(result);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return [];
    }

    if (/[,;|\s]/.test(trimmed)) {
      const splitValues = trimmed
        .split(/[\s,;|]+/)
        .map((entry) => toAreaValue(entry))
        .filter((entry): entry is VacuumServiceAreaActionValue => entry != null);
      if (splitValues.length > 0) {
        return uniqueAreaValues(splitValues);
      }
    }
  }

  const areaValue = toAreaValue(value);
  return areaValue == null ? [] : [areaValue];
}

function parseNumberList(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => parseNumberList(entry));
  }

  if (value != null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const directAreaId = firstNumber(record, AREA_ID_KEYS);
    if (directAreaId != null) {
      return [directAreaId];
    }

    const result: number[] = [];
    for (const [key, entry] of Object.entries(record)) {
      const keyNumber = toNumber(key);
      if (keyNumber != null && isSelectedValue(entry)) {
        result.push(keyNumber);
        continue;
      }

      if (entry != null && typeof entry === "object") {
        const nestedId = firstNumber(entry as Record<string, unknown>, AREA_ID_KEYS);
        if (nestedId != null) {
          result.push(nestedId);
        }
      }
    }
    return [...new Set(result)];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return [];
    }
    if (/[,;|\s]/.test(trimmed) && toNumber(trimmed) == null) {
      return trimmed
        .split(/[\s,;|]+/)
        .map((entry) => toNumber(entry))
        .filter((entry): entry is number => entry != null);
    }
  }

  const numeric = toNumber(value);
  return numeric != null ? [numeric] : [];
}

function toMatterAreaIds(
  areaValues: VacuumServiceAreaActionValue[],
  areas: VacuumServiceAreaArea[],
): number[] {
  const byMatterAreaId = new Map<number, number>();
  const byActionValue = new Map<string, number>();
  const byAreaName = new Map<string, number>();

  for (const area of areas) {
    byMatterAreaId.set(area.matterAreaId, area.matterAreaId);
    byActionValue.set(toAreaValueKey(area.actionValue), area.matterAreaId);
    const normalizedAreaName = normalizeAreaLookup(area.name);
    if (normalizedAreaName != null) {
      byAreaName.set(normalizedAreaName, area.matterAreaId);
    }
    if (typeof area.actionValue === "string") {
      const normalizedActionValue = normalizeAreaLookup(area.actionValue);
      if (normalizedActionValue != null) {
        byAreaName.set(normalizedActionValue, area.matterAreaId);
      }
    }
  }

  const matterAreaIds: number[] = [];
  for (const areaValue of areaValues) {
    if (typeof areaValue === "number") {
      const byMatter = byMatterAreaId.get(areaValue);
      if (byMatter != null) {
        matterAreaIds.push(byMatter);
        continue;
      }
    }

    const byAction = byActionValue.get(toAreaValueKey(areaValue));
    if (byAction != null) {
      matterAreaIds.push(byAction);
      continue;
    }

    if (typeof areaValue === "string") {
      const normalizedAreaValue = normalizeAreaLookup(areaValue);
      if (normalizedAreaValue != null) {
        const byName = byAreaName.get(normalizedAreaValue);
        if (byName != null) {
          matterAreaIds.push(byName);
        }
      }
    }
  }

  return [...new Set(matterAreaIds)];
}

function firstNumber(
  record: Record<string, unknown>,
  keys: readonly string[],
): number | undefined {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value != null) {
      return value;
    }
  }
  return undefined;
}

function firstAreaValue(
  record: Record<string, unknown>,
  keys: readonly string[],
): VacuumServiceAreaActionValue | undefined {
  for (const key of keys) {
    const value = toAreaValue(record[key]);
    if (value != null) {
      return value;
    }
  }
  return undefined;
}

function firstString(
  record: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = toStringValue(record[key]);
    if (value != null) {
      return value;
    }
  }
  return undefined;
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

function toAreaValue(value: unknown): VacuumServiceAreaActionValue | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return undefined;
    }

    const numericPattern = /^-?\d+(\.\d+)?$/;
    if (numericPattern.test(trimmed)) {
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return trimmed;
  }

  const numeric = toNumber(value);
  return numeric != null ? numeric : undefined;
}

function toStringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function extractAreaValue(
  value: unknown,
): VacuumServiceAreaActionValue | undefined {
  const direct = toAreaValue(value);
  if (direct != null) {
    return direct;
  }

  if (value != null && typeof value === "object") {
    return firstAreaValue(value as Record<string, unknown>, AREA_ACTION_KEYS);
  }

  return undefined;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes";
  }
  return false;
}

function isSelectedValue(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized !== "" &&
      normalized !== "0" &&
      normalized !== "false" &&
      normalized !== "off" &&
      normalized !== "none"
    );
  }
  return true;
}

function toAreaValueKey(value: VacuumServiceAreaActionValue): string {
  return typeof value === "number" ? `n:${value}` : `s:${value}`;
}

function uniqueAreaValues(
  values: VacuumServiceAreaActionValue[],
): VacuumServiceAreaActionValue[] {
  const result: VacuumServiceAreaActionValue[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const key = toAreaValueKey(value);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(value);
  }

  return result;
}

function createMatterAreaId(
  actionValue: VacuumServiceAreaActionValue,
  usedMatterAreaIds: Set<number>,
): number {
  const numeric = toNumber(actionValue);
  if (numeric != null && !usedMatterAreaIds.has(numeric)) {
    return numeric;
  }

  const input = String(actionValue);
  const maxAreaId = 0x7ffffffe;
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  let candidate = (Math.abs(hash) % maxAreaId) + 1;
  while (usedMatterAreaIds.has(candidate)) {
    candidate = candidate + 1;
    if (candidate > maxAreaId) {
      candidate = 1;
    }
  }

  return candidate;
}

function createDefaultAreaName(
  actionValue: VacuumServiceAreaActionValue,
  matterAreaId: number,
): string {
  if (typeof actionValue === "string") {
    const humanized = actionValue
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (humanized !== "") {
      return humanized;
    }
  }

  return `Area ${matterAreaId}`;
}

function normalizeAreaLookup(value: string): string | undefined {
  const normalized = value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized.length > 0 ? normalized : undefined;
}

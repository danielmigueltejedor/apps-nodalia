import {
  type VacuumDeviceAttributes,
  VacuumDeviceFeature,
  VacuumState,
} from "@home-assistant-matter-hub/common";
import type { Agent } from "@matter/main";
import { RvcOperationalState } from "@matter/main/clusters";
import { testBit } from "../../../../../utils/test-bit.js";
import { HomeAssistantRegistry } from "../../../../../services/home-assistant/home-assistant-registry.js";
import { HomeAssistantEntityBehavior } from "../../../../behaviors/home-assistant-entity-behavior.js";
import { RvcOperationalStateServer } from "../../../../behaviors/rvc-operational-state-server.js";
import { resolveVacuumStartAction } from "./vacuum-start-action.js";

const CLEANING_MOP_HINTS = [
  "cleaning_mop",
  "mop_cleaning",
  "washing_mop",
  "washing_the_mop",
  "washing_the_mop_pad",
  "mop_washing",
  "mop_washing_in_progress",
  "mop_wash_in_progress",
  "washing_mop_pad",
  "mop_pad_washing",
  "mop_pad_cleaning",
  "wash_mop",
  "wash_mop_pad",
  "mop_wash",
  "washing",
  "mop_wash_pause",
  "mop_washing_pause",
  "mop_cleaning_paused",
  "self_clean",
  "self_cleaning",
  "auto_wash",
  "auto_washing",
  "dock_wash",
  "mopwash",
  "lavando_mopa",
  "lavando_la_mopa",
  "lavado_mopa",
  "lavado_de_mopa",
  "limpiando_mopa",
  "limpieza_mopa",
  "lavando",
] as const;

const FILLING_WATER_HINTS = [
  "filling_water_tank",
  "filling_water",
  "water_tank_filling",
  "fill_water",
  "water_refill",
  "filling",
  "rellenando",
  "llenando",
] as const;

const EMPTYING_DUST_HINTS = [
  "emptying_dust_bin",
  "emptying_dust",
  "auto_emptying",
  "auto_empty_dust",
  "emptying_dock_dust",
  "collecting_dust",
  "dust_collecting",
  "dust_collection_in_progress",
  "emptying",
  "auto_empty",
  "dust_collection",
  "auto_dust_collection",
  "dustbin_emptying",
  "vaciando",
  "vaciado",
] as const;

const UPDATING_MAPS_HINTS = [
  "updating_maps",
  "map_update",
  "mapping",
  "building_map",
  "actualizando_mapa",
  "mapeando",
] as const;

// RVC has no dedicated "drying mop" state, so we map drying-like statuses
// to Charging because this typically happens while docked on base.
const CHARGING_HINTS = [
  "charging",
  "charge",
  "docking_charge",
  "dock_charging",
  "drying",
  "drying_mop",
  "mop_drying",
  "mop_dry",
  "dry",
  "hot_air_drying",
  "secando_mopa",
  "secando",
  "cargando",
] as const;

const SEEKING_CHARGER_HINTS = [
  "returning",
  "returning_home",
  "go_to_dock",
  "seeking_charger",
  "going_to_charge",
  "volviendo_a_base",
  "retornando",
] as const;

const RUNNING_HINTS = [
  "cleaning",
  "running",
  "working",
  "spot_cleaning",
  "zone_cleaning",
  "segment_cleaning",
  "sweeping",
  "limpiando",
  "en_limpieza",
] as const;

const PAUSED_HINTS = ["paused", "idle", "standby", "pausado", "en_espera"] as const;
const DOCKED_HINTS = ["docked", "on_dock", "base", "en_base"] as const;
const ERROR_HINTS = ["error", "fault", "stuck", "atascado"] as const;

const OPERATIONAL_HINT_KEY_PARTS = [
  "status",
  "state",
  "mode",
  "task",
  "job",
  "phase",
  "activity",
  "action",
  "operation",
  "mop",
  "dock",
  "charge",
  "dust",
  "water",
  "clean",
  "wash",
  "dry",
  "empty",
] as const;

const RELATED_OPERATIONAL_ENTITY_DOMAINS = new Set([
  "sensor",
  "binary_sensor",
  "select",
  "text",
]);

const RELATED_OPERATIONAL_ENTITY_HINTS = [
  "status",
  "estado",
  "task",
  "phase",
  "job",
  "operation",
  "activity",
  "vacuum",
  "aspir",
  "clean",
  "limpi",
  "mop",
  "mopa",
  "wash",
  "lav",
  "dry",
  "sec",
  "dust",
  "polvo",
  "empty",
  "vaci",
  "dock",
  "base",
] as const;

export const VacuumRvcOperationalStateServer = RvcOperationalStateServer({
  getOperationalState(entity, agent): RvcOperationalState.OperationalState {
    const primaryHints = collectOperationalStateHints(
      entity.state,
      entity.attributes,
    );
    const primaryState = resolveOperationalStateFromHints(primaryHints);
    if (primaryState != null) {
      return primaryState;
    }

    // Companion entities (sensor/select/binary_sensor/text) are useful as
    // fallback, but should not override the vacuum entity itself when it has
    // an explicit operational state.
    const relatedHints = collectRelatedOperationalStateHints(agent);
    const relatedState = resolveOperationalStateFromHints(relatedHints);
    if (relatedState != null) {
      return relatedState;
    }

    const state = entity.state as VacuumState | "unavailable";
    switch (state) {
      case VacuumState.docked:
        return RvcOperationalState.OperationalState.Docked;
      case VacuumState.returning:
        return RvcOperationalState.OperationalState.SeekingCharger;
      case VacuumState.cleaning:
        return RvcOperationalState.OperationalState.Running;
      case VacuumState.paused:
      case VacuumState.idle:
        return RvcOperationalState.OperationalState.Paused;
      default:
        return RvcOperationalState.OperationalState.Error;
    }
  },
  pause: (_, agent) => {
    const supportedFeatures =
      agent.get(HomeAssistantEntityBehavior).entity.state.attributes
        .supported_features ?? 0;
    if (testBit(supportedFeatures, VacuumDeviceFeature.PAUSE)) {
      return { action: "vacuum.pause" };
    }
    return { action: "vacuum.stop" };
  },
  resume: (_, agent) => resolveVacuumStartAction(agent),
});

function resolveOperationalStateFromHints(
  hints: string[],
): RvcOperationalState.OperationalState | undefined {
  if (hasHint(hints, CLEANING_MOP_HINTS)) {
    return RvcOperationalState.OperationalState.CleaningMop;
  }
  if (hasHint(hints, FILLING_WATER_HINTS)) {
    return RvcOperationalState.OperationalState.FillingWaterTank;
  }
  if (hasHint(hints, EMPTYING_DUST_HINTS)) {
    return RvcOperationalState.OperationalState.EmptyingDustBin;
  }
  if (hasHint(hints, UPDATING_MAPS_HINTS)) {
    return RvcOperationalState.OperationalState.UpdatingMaps;
  }
  if (hasHint(hints, CHARGING_HINTS)) {
    return RvcOperationalState.OperationalState.Charging;
  }
  if (hasHint(hints, SEEKING_CHARGER_HINTS)) {
    return RvcOperationalState.OperationalState.SeekingCharger;
  }
  if (hasHint(hints, RUNNING_HINTS)) {
    return RvcOperationalState.OperationalState.Running;
  }
  if (hasHint(hints, PAUSED_HINTS)) {
    return RvcOperationalState.OperationalState.Paused;
  }
  if (hasHint(hints, DOCKED_HINTS)) {
    return RvcOperationalState.OperationalState.Docked;
  }
  if (hasHint(hints, ERROR_HINTS)) {
    return RvcOperationalState.OperationalState.Error;
  }
  return undefined;
}

function hasHint(values: string[], hints: readonly string[]): boolean {
  return values.some((value) => hints.some((hint) => hintMatches(value, hint)));
}

function hintMatches(value: string, hint: string): boolean {
  if (value === hint || value.includes(hint)) {
    return true;
  }

  // Accept "connector" words between tokens, e.g.
  // "lavando_la_mopa" should match "lavando_mopa".
  const valueTokens = value.split("_").filter(Boolean);
  const hintTokens = hint.split("_").filter(Boolean);
  if (valueTokens.length === 0 || hintTokens.length <= 1) {
    return false;
  }

  return hintTokens.every((token) => valueTokens.includes(token));
}

function collectOperationalStateHints(
  entityState: unknown,
  attributes: Record<string, unknown>,
): string[] {
  const hints = new Set<string>();

  const add = (value: unknown) => {
    addHint(hints, value);
  };

  add(entityState);

  const vacuumAttributes = attributes as VacuumDeviceAttributes & Record<string, unknown>;
  add(vacuumAttributes.status);

  add(attributes.state);
  add(attributes.activity);
  add(attributes.operation);
  add(attributes.task_status);
  add(attributes.cleaning_state);
  add(attributes.cleaning_mode);
  add(attributes.dock_state);
  add(attributes.charging_state);
  add(attributes.working_state);
  add(attributes.status_description);
  add(attributes.vacuum_status);
  add(attributes.state_text);
  add(attributes.status_text);
  add(attributes.current_task);
  add(attributes.task_phase);

  for (const [key, value] of Object.entries(attributes)) {
    const normalizedKey = normalizeHint(key);
    if (
      normalizedKey == null ||
      !OPERATIONAL_HINT_KEY_PARTS.some((part) => normalizedKey.includes(part))
    ) {
      continue;
    }

    if (typeof value === "boolean") {
      if (value) {
        add(normalizedKey);
      }
      continue;
    }

    if (typeof value === "string") {
      add(value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        add(item);
      }
      continue;
    }

    if (value != null && typeof value === "object") {
      for (const nestedValue of Object.values(value)) {
        add(nestedValue);
      }
    }
  }

  return [...hints];
}

function collectRelatedOperationalStateHints(agent: Agent): string[] {
  const hints = new Set<string>();
  const currentEntity = agent.get(HomeAssistantEntityBehavior).entity;
  const currentEntityId = currentEntity.entity_id;
  const deviceId =
    currentEntity.deviceRegistry?.id ?? currentEntity.registry?.device_id;

  if (deviceId == null) {
    return [];
  }

  let registry: HomeAssistantRegistry;
  try {
    registry = agent.env.get(HomeAssistantRegistry);
  } catch {
    return [];
  }

  for (const relatedEntity of Object.values(registry.entities)) {
    if (
      relatedEntity.device_id !== deviceId ||
      relatedEntity.entity_id === currentEntityId
    ) {
      continue;
    }

    const [domain] = relatedEntity.entity_id.split(".");
    if (!domain || !RELATED_OPERATIONAL_ENTITY_DOMAINS.has(domain)) {
      continue;
    }

    const relatedState = registry.states[relatedEntity.entity_id];
    if (relatedState == null) {
      continue;
    }

    if (
      !isLikelyOperationalCompanionEntity(
        relatedEntity.entity_id,
        relatedState.attributes?.friendly_name,
      )
    ) {
      continue;
    }

    addHint(hints, relatedState.state);
    collectHintValuesFromAttributes(hints, asRecord(relatedState.attributes));
  }

  return [...hints];
}

function isLikelyOperationalCompanionEntity(
  entityId: string,
  friendlyName: unknown,
): boolean {
  const normalizedEntityId = normalizeHint(entityId);
  const normalizedFriendlyName = normalizeHint(friendlyName);

  return RELATED_OPERATIONAL_ENTITY_HINTS.some((hint) => {
    return (
      normalizedEntityId?.includes(hint) ||
      normalizedFriendlyName?.includes(hint)
    );
  });
}

function collectHintValuesFromAttributes(
  hints: Set<string>,
  attributes: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(attributes)) {
    const normalizedKey = normalizeHint(key);
    if (
      normalizedKey == null ||
      !OPERATIONAL_HINT_KEY_PARTS.some((part) => normalizedKey.includes(part))
    ) {
      continue;
    }

    if (typeof value === "boolean") {
      if (value) {
        addHint(hints, normalizedKey);
      }
      continue;
    }

    if (typeof value === "string") {
      addHint(hints, value);
      continue;
    }

    // Avoid companion-entity static lists (possible states/options) that can
    // keep stale maintenance hints active for too long.
  }
}

function addHint(hints: Set<string>, value: unknown): void {
  const normalized = normalizeHint(value);
  if (normalized != null) {
    hints.add(normalized);
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value == null || typeof value !== "object") {
    return {};
  }
  return value as Record<string, unknown>;
}

function normalizeHint(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized.length > 0 ? normalized : undefined;
}

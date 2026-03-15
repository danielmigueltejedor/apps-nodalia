import type {
  BridgeData,
  HomeAssistantDeviceRegistry,
} from "@home-assistant-matter-hub/common";
import type { Environment, Logger } from "@matter/general";
import { Bridge } from "../../services/bridges/bridge.js";
import { BridgeDataProvider } from "../../services/bridges/bridge-data-provider.js";
import { BridgeEndpointManager } from "../../services/bridges/bridge-endpoint-manager.js";
import { BridgeFactory } from "../../services/bridges/bridge-factory.js";
import { BridgeRegistry } from "../../services/bridges/bridge-registry.js";
import { HomeAssistantClient } from "../../services/home-assistant/home-assistant-client.js";
import { HomeAssistantRegistry } from "../../services/home-assistant/home-assistant-registry.js";
import { LoggerService } from "../app/logger.js";
import type { AppEnvironment } from "./app-environment.js";
import { EnvironmentBase } from "./environment-base.js";

export class BridgeEnvironment extends EnvironmentBase {
  static async create(parent: Environment, initialData: BridgeData) {
    const bridge = new BridgeEnvironment(parent, initialData);
    await bridge.construction;
    return bridge;
  }

  private readonly construction: Promise<void>;
  private readonly endpointManagerLogger: Logger;

  private constructor(parent: Environment, initialData: BridgeData) {
    const loggerService = parent.get(LoggerService);
    const log = loggerService.get(`BridgeEnvironment / ${initialData.id}`);

    super({ id: initialData.id, parent, log });
    this.endpointManagerLogger = loggerService.get("BridgeEndpointManager");
    this.construction = this.init();

    this.set(BridgeDataProvider, new BridgeDataProvider(initialData));
  }

  private async init() {
    const homeAssistantRegistry = await this.load(HomeAssistantRegistry);
    const dataProvider = this.get(BridgeDataProvider);
    const bridgeRegistry = new BridgeRegistry(homeAssistantRegistry, dataProvider);
    applyAutoDeviceIdentityFromSingleDevice(
      homeAssistantRegistry,
      bridgeRegistry,
      dataProvider,
    );

    this.set(
      BridgeRegistry,
      bridgeRegistry,
    );
    this.set(
      BridgeEndpointManager,
      new BridgeEndpointManager(
        await this.load(HomeAssistantClient),
        this.get(BridgeRegistry),
        this.endpointManagerLogger,
      ),
    );
  }
}

function applyAutoDeviceIdentityFromSingleDevice(
  homeAssistantRegistry: HomeAssistantRegistry,
  bridgeRegistry: BridgeRegistry,
  dataProvider: BridgeDataProvider,
) {
  const exposedEntityIds = bridgeRegistry.entityIds;
  if (exposedEntityIds.length === 0) {
    return;
  }

  const exposedDeviceIds = Array.from(
    new Set(
      exposedEntityIds
        .map((entityId) => bridgeRegistry.entity(entityId)?.device_id)
        .filter((deviceId): deviceId is string => deviceId != null),
    ),
  );

  if (exposedDeviceIds.length !== 1) {
    return;
  }

  const primaryEntityId = selectPrimaryEntityId(exposedEntityIds);
  if (primaryEntityId == null) {
    return;
  }

  const primaryEntity = bridgeRegistry.entity(primaryEntityId);
  if (primaryEntity == null) {
    return;
  }

  const deviceId = exposedDeviceIds[0];
  const device = homeAssistantRegistry.devices[deviceId];
  const state = homeAssistantRegistry.states[primaryEntityId];
  const attributes = asRecord(state?.attributes);
  const relatedSoftwareVersion = resolveRelatedSoftwareVersion(
    homeAssistantRegistry,
    deviceId,
    primaryEntityId,
  );
  const relatedSerialNumber = resolveRelatedSerialNumber(
    homeAssistantRegistry,
    deviceId,
    primaryEntityId,
  );
  const vendorName = firstNonEmpty(
    toStringValue(attributes.matter_vendor_name),
    toStringValue(attributes.vendor_name),
    toStringValue(attributes.manufacturer),
    toStringValue(attributes.brand),
    device?.manufacturer,
    device?.default_manufacturer,
  );
  const productName = resolveProductName(device, attributes, vendorName);
  const productLabel = firstNonEmpty(
    toStringValue(attributes.matter_product_label),
    toStringValue(attributes.product_label),
    toStringValue(attributes.friendly_name),
    device?.name_by_user,
    device?.name,
    productName,
  );
  const serialNumber = firstNonEmpty(
    toSerialStringValue(attributes.serial_number),
    toSerialStringValue(attributes.serialNumber),
    toSerialStringValue(attributes.device_serial_number),
    toSerialStringValue(attributes.sn),
    toSerialStringValue(device?.serial_number),
    relatedSerialNumber,
  );
  const softwareVersionString = firstNonEmpty(
    toVersionStringValue(attributes.sw_version),
    toVersionStringValue(attributes.software_version),
    toVersionStringValue(attributes.firmware_version),
    relatedSoftwareVersion,
    toVersionStringValue(device?.sw_version),
    toFirmwareLikeVersionValue(attributes.version),
  );

  dataProvider.mergeDeviceIdentityDefaults({
    vendorName,
    productName,
    productLabel,
    serialNumber,
    softwareVersionString,
  });
}

function selectPrimaryEntityId(entityIds: string[]): string | undefined {
  const preferredDomains = [
    "vacuum",
    "climate",
    "light",
    "cover",
    "fan",
    "switch",
    "lock",
    "media_player",
  ];

  for (const domain of preferredDomains) {
    const preferred = entityIds.find((entityId) => entityId.startsWith(`${domain}.`));
    if (preferred != null) {
      return preferred;
    }
  }
  return entityIds[0];
}

function resolveProductName(
  device: HomeAssistantDeviceRegistry | undefined,
  attributes: Record<string, unknown>,
  vendorName: string | undefined,
): string | undefined {
  const humanName = stripVendorPrefix(
    firstNonEmpty(
      toStringValue(attributes.friendly_name),
      device?.name_by_user,
      device?.name,
    ),
    vendorName,
  );
  const modelName = firstNonEmpty(
    toStringValue(attributes.matter_product_name),
    toStringValue(attributes.product_name),
    toStringValue(attributes.model_name),
    toStringValue(attributes.model),
    toStringValue(attributes.device_model),
    device?.model,
    device?.default_model,
    device?.model_id,
  );

  if (modelName == null) {
    return humanName;
  }
  if (isLikelyOpaqueModelName(modelName) && humanName != null) {
    return humanName;
  }
  return modelName;
}

function resolveRelatedSoftwareVersion(
  homeAssistantRegistry: HomeAssistantRegistry,
  deviceId: string,
  primaryEntityId: string,
): string | undefined {
  for (const entity of Object.values(homeAssistantRegistry.entities)) {
    if (entity.device_id !== deviceId || entity.entity_id === primaryEntityId) {
      continue;
    }

    const state = homeAssistantRegistry.states[entity.entity_id];
    if (state == null) {
      continue;
    }

    const attributes = asRecord(state.attributes);
    const [domain] = entity.entity_id.split(".");

    if (domain === "update") {
      const updateVersion = firstNonEmpty(
        toVersionStringValue(attributes.installed_version),
        toVersionStringValue(attributes.latest_version),
        toVersionStringValue(attributes.current_version),
        toVersionStringValue(state.state),
      );
      if (updateVersion != null) {
        return updateVersion;
      }
    }

    if (
      !isLikelySoftwareVersionEntity(
        entity.entity_id,
        toStringValue(attributes.friendly_name),
      )
    ) {
      continue;
    }

    const version = firstNonEmpty(
      toVersionStringValue(attributes.sw_version),
      toVersionStringValue(attributes.software_version),
      toVersionStringValue(attributes.firmware_version),
      toFirmwareLikeVersionValue(attributes.version),
      toFirmwareLikeVersionValue(state.state),
    );
    if (version != null) {
      return version;
    }
  }

  return undefined;
}

function resolveRelatedSerialNumber(
  homeAssistantRegistry: HomeAssistantRegistry,
  deviceId: string,
  primaryEntityId: string,
): string | undefined {
  for (const entity of Object.values(homeAssistantRegistry.entities)) {
    if (entity.device_id !== deviceId || entity.entity_id === primaryEntityId) {
      continue;
    }

    const state = homeAssistantRegistry.states[entity.entity_id];
    if (state == null) {
      continue;
    }

    const attributes = asRecord(state.attributes);
    if (
      !isLikelySerialEntity(
        entity.entity_id,
        toStringValue(attributes.friendly_name),
      )
    ) {
      continue;
    }

    const serial = firstNonEmpty(
      toSerialStringValue(attributes.serial_number),
      toSerialStringValue(attributes.serialNumber),
      toSerialStringValue(attributes.device_serial_number),
      toSerialStringValue(attributes.sn),
      toSerialStringValue(state.state),
    );
    if (serial != null) {
      return serial;
    }
  }

  return undefined;
}

function isLikelySoftwareVersionEntity(
  entityId: string,
  friendlyName: string | undefined,
): boolean {
  const normalized = `${entityId} ${friendlyName ?? ""}`.toLowerCase();
  return (
    normalized.includes("firmware") ||
    normalized.includes("software") ||
    normalized.includes("version") ||
    normalized.includes("versi") ||
    normalized.includes("sw_version") ||
    normalized.includes("fw_version")
  );
}

function isLikelySerialEntity(
  entityId: string,
  friendlyName: string | undefined,
): boolean {
  const normalized = `${entityId} ${friendlyName ?? ""}`.toLowerCase();
  return (
    normalized.includes("serial") ||
    normalized.includes("serie") ||
    normalized.includes("sn")
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value == null || typeof value !== "object") {
    return {};
  }
  return value as Record<string, unknown>;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function toVersionStringValue(value: unknown): string | undefined {
  const normalized = toStringValue(value);
  if (normalized == null) {
    return undefined;
  }
  if (!/[0-9]/.test(normalized)) {
    return undefined;
  }
  if (/^(unknown|unavailable|none|null|on|off)$/i.test(normalized)) {
    return undefined;
  }
  return normalized;
}

function toFirmwareLikeVersionValue(value: unknown): string | undefined {
  const normalized = toVersionStringValue(value);
  if (normalized == null) {
    return undefined;
  }
  if (!/[._-]/.test(normalized)) {
    return undefined;
  }
  return normalized;
}

function toSerialStringValue(value: unknown): string | undefined {
  const normalized = toStringValue(value);
  if (normalized == null) {
    return undefined;
  }
  if (/^(unknown|unavailable|none|null)$/i.test(normalized)) {
    return undefined;
  }
  if (normalized.length < 6) {
    return undefined;
  }
  return normalized;
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value != null && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
}

function stripVendorPrefix(
  value: string | undefined,
  vendorName: string | undefined,
): string | undefined {
  if (value == null) {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const vendor = vendorName?.trim();
  if (vendor == null || vendor.length === 0) {
    return trimmed;
  }
  const prefixPattern = new RegExp(`^${escapeRegExp(vendor)}[\\s\\-_:|,.]*`, "i");
  const stripped = trimmed.replace(prefixPattern, "").trim();
  return stripped.length > 0 ? stripped : trimmed;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isLikelyOpaqueModelName(value: string): boolean {
  const normalized = value.trim();
  if (normalized.length === 0) {
    return false;
  }

  return (
    normalized.includes(".") ||
    normalized.includes("_") ||
    /[a-z]+\.[a-z]+/i.test(normalized) ||
    /[a-z]{2,}\d{2,}/i.test(normalized)
  );
}

export class BridgeEnvironmentFactory extends BridgeFactory {
  constructor(private readonly parent: AppEnvironment) {
    super("BridgeEnvironmentFactory");
  }

  async create(initialData: BridgeData): Promise<Bridge> {
    const env = await BridgeEnvironment.create(this.parent, initialData);

    class BridgeWithEnvironment extends Bridge {
      override async dispose(): Promise<void> {
        await super.dispose();
        await env.dispose();
      }
    }

    const bridge = new BridgeWithEnvironment(
      env,
      env.get(LoggerService),
      await env.load(BridgeDataProvider),
      await env.load(BridgeEndpointManager),
    );
    await bridge.initialize();
    return bridge;
  }
}

import crypto from "node:crypto";
import type {
  BridgeDeviceIdentityOverrides,
  HomeAssistantDeviceRegistry,
  HomeAssistantEntityInformation,
} from "@home-assistant-matter-hub/common";
import { VendorId } from "@matter/main";
import { BridgedDeviceBasicInformationServer as Base } from "@matter/main/behaviors";
import { HomeAssistantRegistry } from "../../services/home-assistant/home-assistant-registry.js";
import { BridgeDataProvider } from "../../services/bridges/bridge-data-provider.js";
import { applyPatchState } from "../../utils/apply-patch-state.js";
import { trimToLength } from "../../utils/trim-to-length.js";
import { HomeAssistantEntityBehavior } from "./home-assistant-entity-behavior.js";

export class BasicInformationServer extends Base {
  override async initialize(): Promise<void> {
    await super.initialize();
    const homeAssistant = await this.agent.load(HomeAssistantEntityBehavior);
    this.update(homeAssistant.entity);
    this.reactTo(homeAssistant.onChange, this.update);
  }

  private update(entity: HomeAssistantEntityInformation) {
    const { basicInformation, deviceIdentity } = this.env.get(BridgeDataProvider);
    const device = entity.deviceRegistry;
    const attributes = asRecord(entity.state?.attributes);
    const vendorName = resolveVendorName(
      device,
      attributes,
      deviceIdentity,
      basicInformation.vendorName,
    );
    const productName = resolveProductName(
      device,
      attributes,
      vendorName,
      deviceIdentity,
      basicInformation.productName,
    );
    const productLabel = resolveProductLabel(
      device,
      attributes,
      productName,
      deviceIdentity,
      basicInformation.productLabel,
    );
    const serialNumber = resolveSerialNumber(
      device,
      attributes,
      deviceIdentity,
      entity.entity_id,
    );
    const softwareVersionString = resolveSoftwareVersionString(
      device,
      attributes,
      deviceIdentity,
      this.resolveRelatedSoftwareVersionString(entity),
    );
    const softwareVersion = resolveSoftwareVersionNumber(
      basicInformation.softwareVersion,
      softwareVersionString,
    );

    applyPatchState(this.state, {
      vendorId: VendorId(basicInformation.vendorId),
      vendorName,
      productName,
      productLabel,
      hardwareVersion: basicInformation.hardwareVersion,
      softwareVersion,
      hardwareVersionString: ellipse(64, device?.hw_version),
      softwareVersionString,
      nodeLabel:
        ellipse(32, entity.state?.attributes?.friendly_name) ??
        ellipse(32, entity.entity_id),
      reachable:
        entity.state?.state != null && entity.state.state !== "unavailable",
      serialNumber,
    });
  }

  private resolveRelatedSoftwareVersionString(
    entity: HomeAssistantEntityInformation,
  ): string | undefined {
    const deviceId = entity.deviceRegistry?.id ?? entity.registry?.device_id;
    if (deviceId == null) {
      return undefined;
    }

    let registry: HomeAssistantRegistry;
    try {
      registry = this.env.get(HomeAssistantRegistry);
    } catch {
      return undefined;
    }

    for (const relatedEntity of Object.values(registry.entities)) {
      if (
        relatedEntity.device_id !== deviceId ||
        relatedEntity.entity_id === entity.entity_id
      ) {
        continue;
      }

      const relatedState = registry.states[relatedEntity.entity_id];
      if (relatedState == null) {
        continue;
      }

      const attributes = asRecord(relatedState.attributes);
      const [domain] = relatedEntity.entity_id.split(".");
      const fromUpdateEntity =
        domain === "update"
          ? firstNonEmpty(
              toVersionStringValue(attributes.installed_version),
              toVersionStringValue(attributes.current_version),
              toVersionStringValue(attributes.sw_version),
              toVersionStringValue(attributes.software_version),
              toVersionStringValue(attributes.firmware_version),
            )
          : undefined;

      if (fromUpdateEntity != null) {
        return fromUpdateEntity;
      }

      if (
        !isLikelySoftwareVersionEntity(
          relatedEntity.entity_id,
          toStringValue(attributes.friendly_name),
        )
      ) {
        continue;
      }

      const fromVersionEntity = firstNonEmpty(
        toVersionStringValue(attributes.sw_version),
        toVersionStringValue(attributes.software_version),
        toVersionStringValue(attributes.firmware_version),
        toFirmwareLikeVersionValue(attributes.version),
        toFirmwareLikeVersionValue(relatedState.state),
      );
      if (fromVersionEntity != null) {
        return fromVersionEntity;
      }
    }

    return undefined;
  }
}

function resolveVendorName(
  device: HomeAssistantDeviceRegistry | undefined,
  attributes: Record<string, unknown>,
  identityOverrides: BridgeDeviceIdentityOverrides | undefined,
  fallback: string,
): string {
  return (
    ellipse(
      32,
      firstNonEmpty(
        identityOverrides?.vendorName,
        toStringValue(attributes.matter_vendor_name),
        toStringValue(attributes.vendor_name),
        toStringValue(attributes.manufacturer),
        toStringValue(attributes.brand),
        device?.manufacturer,
        device?.default_manufacturer,
      ),
    ) ?? hash(32, fallback)
  );
}

function resolveProductName(
  device: HomeAssistantDeviceRegistry | undefined,
  attributes: Record<string, unknown>,
  vendorName: string,
  identityOverrides: BridgeDeviceIdentityOverrides | undefined,
  fallback: string,
): string {
  const humanName = stripVendorPrefix(
    firstNonEmpty(
      toStringValue(attributes.friendly_name),
      device?.name_by_user,
      device?.name,
    ),
    vendorName,
  );

  const modelName = firstNonEmpty(
    identityOverrides?.productName,
    toStringValue(attributes.matter_product_name),
    toStringValue(attributes.product_name),
    toStringValue(attributes.model_name),
    toStringValue(attributes.model),
    toStringValue(attributes.device_model),
    device?.model,
    device?.default_model,
    device?.model_id,
  );

  const preferredName =
    modelName == null
      ? humanName
      : isLikelyOpaqueModelName(modelName) && humanName != null
        ? humanName
        : modelName;

  return ellipse(32, preferredName) ?? hash(32, fallback);
}

function resolveProductLabel(
  device: HomeAssistantDeviceRegistry | undefined,
  attributes: Record<string, unknown>,
  productName: string,
  identityOverrides: BridgeDeviceIdentityOverrides | undefined,
  fallback: string,
): string {
  return (
    ellipse(
      64,
      firstNonEmpty(
        identityOverrides?.productLabel,
        toStringValue(attributes.matter_product_label),
        toStringValue(attributes.product_label),
        toStringValue(attributes.friendly_name),
        device?.name_by_user,
        device?.name,
        productName,
        device?.model,
        device?.default_model,
        device?.model_id,
      ),
    ) ?? hash(64, fallback)
  );
}

function resolveSerialNumber(
  device: HomeAssistantDeviceRegistry | undefined,
  attributes: Record<string, unknown>,
  identityOverrides: BridgeDeviceIdentityOverrides | undefined,
  fallback: string,
): string {
  return (
    ellipse(
      32,
      firstNonEmpty(
        identityOverrides?.serialNumber,
        toStringValue(attributes.serial_number),
        toStringValue(attributes.serialNumber),
        toStringValue(attributes.device_serial_number),
        toStringValue(attributes.sn),
        device?.serial_number,
      ),
    ) ?? hash(32, fallback)
  );
}

function resolveSoftwareVersionString(
  device: HomeAssistantDeviceRegistry | undefined,
  attributes: Record<string, unknown>,
  identityOverrides: BridgeDeviceIdentityOverrides | undefined,
  relatedSoftwareVersion: string | undefined,
): string | undefined {
  return ellipse(
    64,
    firstNonEmpty(
      identityOverrides?.softwareVersionString,
      toVersionStringValue(attributes.sw_version),
      toVersionStringValue(attributes.software_version),
      toVersionStringValue(attributes.firmware_version),
      relatedSoftwareVersion,
      device?.sw_version,
      toFirmwareLikeVersionValue(attributes.version),
    ),
  );
}

function resolveSoftwareVersionNumber(
  fallback: number,
  softwareVersionString: string | undefined,
): number {
  const parsed = parseVersionStringAsNumber(softwareVersionString);
  return parsed ?? fallback;
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
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
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
  // Avoid generic integer-like values (e.g. "2026") that are often
  // hardware revisions or placeholder versions.
  if (!/[._-]/.test(normalized)) {
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

function stripVendorPrefix(value: string | undefined, vendor: string): string | undefined {
  if (value == null) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const vendorTrimmed = vendor.trim();
  if (vendorTrimmed.length === 0) {
    return trimmed;
  }

  const prefixPattern = new RegExp(
    `^${escapeRegExp(vendorTrimmed)}[\\s\\-_:|,.]*`,
    "i",
  );
  const stripped = trimmed.replace(prefixPattern, "").trim();
  return stripped.length > 0 ? stripped : trimmed;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function ellipse(maxLength: number, value?: string) {
  return trimToLength(value, maxLength, "...");
}

function hash(maxLength: number, value?: string): string {
  const hashLength = 4;
  const suffix = crypto
    .createHash("md5")
    .update(value ?? "")
    .digest("hex")
    .substring(0, hashLength);
  return trimToLength(value, maxLength, suffix) ?? suffix;
}

function parseVersionStringAsNumber(
  softwareVersion: string | undefined,
): number | undefined {
  if (softwareVersion == null) {
    return undefined;
  }
  const digits = softwareVersion.replace(/[^0-9]/g, "");
  if (digits.length === 0) {
    return undefined;
  }
  const parsed = Number.parseInt(digits, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 0xffffffff) {
    return undefined;
  }
  return parsed;
}

import crypto from "node:crypto";
import type {
  BridgeDeviceIdentityOverrides,
  HomeAssistantDeviceRegistry,
  HomeAssistantEntityInformation,
} from "@home-assistant-matter-hub/common";
import { VendorId } from "@matter/main";
import { BridgedDeviceBasicInformationServer as Base } from "@matter/main/behaviors";
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

    applyPatchState(this.state, {
      vendorId: VendorId(basicInformation.vendorId),
      vendorName,
      productName,
      productLabel,
      hardwareVersion: basicInformation.hardwareVersion,
      softwareVersion: basicInformation.softwareVersion,
      hardwareVersionString: ellipse(64, device?.hw_version),
      softwareVersionString: ellipse(64, device?.sw_version),
      nodeLabel:
        ellipse(32, entity.state?.attributes?.friendly_name) ??
        ellipse(32, entity.entity_id),
      reachable:
        entity.state?.state != null && entity.state.state !== "unavailable",
      // The device serial number is available in `device?.serial_number`, but
      // we're keeping it as the entity ID for now to avoid breaking existing
      // deployments.
      serialNumber: hash(32, entity.entity_id),
    });
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

function hash(maxLength: number, value?: string) {
  const hashLength = 4;
  const suffix = crypto
    .createHash("md5")
    .update(value ?? "")
    .digest("hex")
    .substring(0, hashLength);
  return trimToLength(value, maxLength, suffix);
}

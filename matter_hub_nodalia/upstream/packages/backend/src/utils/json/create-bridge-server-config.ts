import crypto from "node:crypto";
import type { BridgeData } from "@home-assistant-matter-hub/common";
import { AggregatorEndpoint } from "@matter/main/endpoints";
import { type Node, ServerNode } from "@matter/main/node";
import { VendorId } from "@matter/main/types";
import { trimToLength } from "../trim-to-length.js";

export type BridgeServerNodeConfig =
  Node.Configuration<ServerNode.RootEndpoint>;

export function createBridgeServerConfig(
  data: BridgeData,
): BridgeServerNodeConfig {
  const vendorName = trimToLength(
    data.deviceIdentity?.vendorName ?? data.basicInformation.vendorName,
    32,
    "...",
  );
  const productName = trimToLength(
    data.deviceIdentity?.productName ?? data.basicInformation.productName,
    32,
    "...",
  );
  const productLabel = trimToLength(
    data.deviceIdentity?.productLabel ?? data.basicInformation.productLabel,
    64,
    "...",
  );
  const serialNumber =
    trimToLength(data.deviceIdentity?.serialNumber, 32, "...") ??
    hashSerial(data.id);
  const softwareVersionString = trimToLength(
    data.deviceIdentity?.softwareVersionString,
    64,
    "...",
  );
  const softwareVersion =
    parseVersionStringAsNumber(softwareVersionString) ??
    data.basicInformation.softwareVersion;

  return {
    type: ServerNode.RootEndpoint,
    id: data.id,
    network: {
      port: data.port,
    },
    productDescription: {
      name: data.name,
      deviceType: AggregatorEndpoint.deviceType,
    },
    basicInformation: {
      uniqueId: data.id,
      nodeLabel: trimToLength(data.name, 32, "..."),
      vendorId: VendorId(data.basicInformation.vendorId),
      vendorName,
      productId: data.basicInformation.productId,
      productName,
      productLabel,
      serialNumber,
      hardwareVersion: data.basicInformation.hardwareVersion,
      softwareVersion,
      ...(softwareVersionString ? { softwareVersionString } : {}),
      ...(data.countryCode ? { location: data.countryCode } : {}),
    },
  };
}

function hashSerial(value: string): string {
  return crypto.createHash("md5").update(`serial-${value}`).digest("hex").substring(0, 32);
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

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
      serialNumber: crypto
        .createHash("md5")
        .update(`serial-${data.id}`)
        .digest("hex")
        .substring(0, 32),
      hardwareVersion: data.basicInformation.hardwareVersion,
      softwareVersion: data.basicInformation.softwareVersion,
      ...(data.countryCode ? { location: data.countryCode } : {}),
    },
  };
}

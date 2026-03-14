"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var NodePhysicalProperties_exports = {};
__export(NodePhysicalProperties_exports, {
  NodePhysicalProperties: () => NodePhysicalProperties
});
module.exports = __toCommonJS(NodePhysicalProperties_exports);
var import_descriptor = require("#behaviors/descriptor");
var import_network_commissioning = require("#behaviors/network-commissioning");
var import_power_source = require("#behaviors/power-source");
var import_thread_network_diagnostics = require("#behaviors/thread-network-diagnostics");
var import_power_source2 = require("#clusters/power-source");
var import_thread_network_diagnostics2 = require("#clusters/thread-network-diagnostics");
var import_aggregator = require("#endpoints/aggregator");
var import_model = require("#model");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
function NodePhysicalProperties(node) {
  const rootEndpointServerList = [...node.maybeStateOf(import_descriptor.DescriptorClient)?.serverList ?? []];
  const properties = {
    threadConnected: false,
    wifiConnected: false,
    ethernetConnected: false,
    rootEndpointServerList,
    isMainsPowered: false,
    isBatteryPowered: false,
    isIntermittentlyConnected: rootEndpointServerList.includes(import_model.IcdManagement.id),
    isThreadSleepyEndDevice: false
  };
  inspectEndpoint(node, properties);
  return properties;
}
function inspectEndpoint(endpoint, properties) {
  const network = endpoint.behaviors.typeFor(import_network_commissioning.NetworkCommissioningClient);
  if (network) {
    const features = network.schema.supportedFeatures;
    if (features.has("WI")) {
      properties.wifiConnected = true;
    }
    if (features.has("TH")) {
      properties.threadConnected = true;
    }
    if (features.has("ET")) {
      properties.ethernetConnected = true;
    }
  }
  const powerSource = endpoint.behaviors.typeFor(import_power_source.PowerSourceClient);
  if (powerSource) {
    const features = powerSource.schema.supportedFeatures;
    const status = endpoint.stateOf(import_power_source.PowerSourceClient).status;
    if (features.has("WIRED")) {
      if (status === import_power_source2.PowerSource.PowerSourceStatus.Active) {
        properties.isMainsPowered = true;
      }
    } else if (features.has("BAT") || // Perform additional checks because we've encountered devices with incorrect features
    !features.has("WIRED") || endpoint.behaviors.elementsOf(powerSource).attributes.has("batChargeLevel")) {
      if (status === import_power_source2.PowerSource.PowerSourceStatus.Active || // Some devices do not properly specify state as active
      status === import_power_source2.PowerSource.PowerSourceStatus.Unspecified) {
        properties.isBatteryPowered = true;
      }
    }
  }
  const threadNetworkDiagnostics = endpoint.behaviors.typeFor(import_thread_network_diagnostics.ThreadNetworkDiagnosticsClient);
  if (threadNetworkDiagnostics && endpoint.stateOf(threadNetworkDiagnostics).routingRole === import_thread_network_diagnostics2.ThreadNetworkDiagnostics.RoutingRole.SleepyEndDevice) {
    properties.isThreadSleepyEndDevice = true;
  }
  for (const part of endpoint.parts) {
    if (part.number !== 0 && part.type.deviceType === import_aggregator.AggregatorEndpoint.deviceType) {
      continue;
    }
    inspectEndpoint(part, properties);
  }
}
//# sourceMappingURL=NodePhysicalProperties.js.map

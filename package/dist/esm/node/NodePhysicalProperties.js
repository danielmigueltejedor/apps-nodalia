/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { DescriptorClient } from "#behaviors/descriptor";
import { NetworkCommissioningClient } from "#behaviors/network-commissioning";
import { PowerSourceClient } from "#behaviors/power-source";
import { ThreadNetworkDiagnosticsClient } from "#behaviors/thread-network-diagnostics";
import { PowerSource } from "#clusters/power-source";
import { ThreadNetworkDiagnostics } from "#clusters/thread-network-diagnostics";
import { AggregatorEndpoint } from "#endpoints/aggregator";
import { IcdManagement } from "#model";
function NodePhysicalProperties(node) {
  const rootEndpointServerList = [...node.maybeStateOf(DescriptorClient)?.serverList ?? []];
  const properties = {
    threadConnected: false,
    wifiConnected: false,
    ethernetConnected: false,
    rootEndpointServerList,
    isMainsPowered: false,
    isBatteryPowered: false,
    isIntermittentlyConnected: rootEndpointServerList.includes(IcdManagement.id),
    isThreadSleepyEndDevice: false
  };
  inspectEndpoint(node, properties);
  return properties;
}
function inspectEndpoint(endpoint, properties) {
  const network = endpoint.behaviors.typeFor(NetworkCommissioningClient);
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
  const powerSource = endpoint.behaviors.typeFor(PowerSourceClient);
  if (powerSource) {
    const features = powerSource.schema.supportedFeatures;
    const status = endpoint.stateOf(PowerSourceClient).status;
    if (features.has("WIRED")) {
      if (status === PowerSource.PowerSourceStatus.Active) {
        properties.isMainsPowered = true;
      }
    } else if (features.has("BAT") || // Perform additional checks because we've encountered devices with incorrect features
    !features.has("WIRED") || endpoint.behaviors.elementsOf(powerSource).attributes.has("batChargeLevel")) {
      if (status === PowerSource.PowerSourceStatus.Active || // Some devices do not properly specify state as active
      status === PowerSource.PowerSourceStatus.Unspecified) {
        properties.isBatteryPowered = true;
      }
    }
  }
  const threadNetworkDiagnostics = endpoint.behaviors.typeFor(ThreadNetworkDiagnosticsClient);
  if (threadNetworkDiagnostics && endpoint.stateOf(threadNetworkDiagnostics).routingRole === ThreadNetworkDiagnostics.RoutingRole.SleepyEndDevice) {
    properties.isThreadSleepyEndDevice = true;
  }
  for (const part of endpoint.parts) {
    if (part.number !== 0 && part.type.deviceType === AggregatorEndpoint.deviceType) {
      continue;
    }
    inspectEndpoint(part, properties);
  }
}
export {
  NodePhysicalProperties
};
//# sourceMappingURL=NodePhysicalProperties.js.map

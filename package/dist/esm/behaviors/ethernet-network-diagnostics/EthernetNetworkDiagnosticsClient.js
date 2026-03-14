/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EthernetNetworkDiagnostics } from "#clusters/ethernet-network-diagnostics";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const EthernetNetworkDiagnosticsClientConstructor = ClientBehavior(EthernetNetworkDiagnostics.Complete);
const EthernetNetworkDiagnosticsClient = EthernetNetworkDiagnosticsClientConstructor;
export {
  EthernetNetworkDiagnosticsClient,
  EthernetNetworkDiagnosticsClientConstructor
};
//# sourceMappingURL=EthernetNetworkDiagnosticsClient.js.map

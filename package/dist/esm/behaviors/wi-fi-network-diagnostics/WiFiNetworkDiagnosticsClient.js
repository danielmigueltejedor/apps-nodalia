/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { WiFiNetworkDiagnostics } from "#clusters/wi-fi-network-diagnostics";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const WiFiNetworkDiagnosticsClientConstructor = ClientBehavior(WiFiNetworkDiagnostics.Complete);
const WiFiNetworkDiagnosticsClient = WiFiNetworkDiagnosticsClientConstructor;
export {
  WiFiNetworkDiagnosticsClient,
  WiFiNetworkDiagnosticsClientConstructor
};
//# sourceMappingURL=WiFiNetworkDiagnosticsClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ThreadNetworkDiagnostics } from "#clusters/thread-network-diagnostics";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ThreadNetworkDiagnosticsClientConstructor = ClientBehavior(ThreadNetworkDiagnostics.Complete);
const ThreadNetworkDiagnosticsClient = ThreadNetworkDiagnosticsClientConstructor;
export {
  ThreadNetworkDiagnosticsClient,
  ThreadNetworkDiagnosticsClientConstructor
};
//# sourceMappingURL=ThreadNetworkDiagnosticsClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { SoftwareDiagnostics } from "#clusters/software-diagnostics";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const SoftwareDiagnosticsClientConstructor = ClientBehavior(SoftwareDiagnostics.Complete);
const SoftwareDiagnosticsClient = SoftwareDiagnosticsClientConstructor;
export {
  SoftwareDiagnosticsClient,
  SoftwareDiagnosticsClientConstructor
};
//# sourceMappingURL=SoftwareDiagnosticsClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { DiagnosticLogs } from "#clusters/diagnostic-logs";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const DiagnosticLogsClientConstructor = ClientBehavior(DiagnosticLogs.Complete);
const DiagnosticLogsClient = DiagnosticLogsClientConstructor;
export {
  DiagnosticLogsClient,
  DiagnosticLogsClientConstructor
};
//# sourceMappingURL=DiagnosticLogsClient.js.map

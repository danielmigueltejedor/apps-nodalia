/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RvcRunMode } from "#clusters/rvc-run-mode";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const RvcRunModeClientConstructor = ClientBehavior(RvcRunMode.Complete);
const RvcRunModeClient = RvcRunModeClientConstructor;
export {
  RvcRunModeClient,
  RvcRunModeClientConstructor
};
//# sourceMappingURL=RvcRunModeClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RvcCleanMode } from "#clusters/rvc-clean-mode";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const RvcCleanModeClientConstructor = ClientBehavior(RvcCleanMode.Complete);
const RvcCleanModeClient = RvcCleanModeClientConstructor;
export {
  RvcCleanModeClient,
  RvcCleanModeClientConstructor
};
//# sourceMappingURL=RvcCleanModeClient.js.map

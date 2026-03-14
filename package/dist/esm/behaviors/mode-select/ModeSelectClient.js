/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ModeSelect } from "#clusters/mode-select";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ModeSelectClientConstructor = ClientBehavior(ModeSelect.Complete);
const ModeSelectClient = ModeSelectClientConstructor;
export {
  ModeSelectClient,
  ModeSelectClientConstructor
};
//# sourceMappingURL=ModeSelectClient.js.map

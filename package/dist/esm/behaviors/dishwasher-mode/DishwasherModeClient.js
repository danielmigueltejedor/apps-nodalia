/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { DishwasherMode } from "#clusters/dishwasher-mode";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const DishwasherModeClientConstructor = ClientBehavior(DishwasherMode.Complete);
const DishwasherModeClient = DishwasherModeClientConstructor;
export {
  DishwasherModeClient,
  DishwasherModeClientConstructor
};
//# sourceMappingURL=DishwasherModeClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { LaundryWasherMode } from "#clusters/laundry-washer-mode";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const LaundryWasherModeClientConstructor = ClientBehavior(LaundryWasherMode.Complete);
const LaundryWasherModeClient = LaundryWasherModeClientConstructor;
export {
  LaundryWasherModeClient,
  LaundryWasherModeClientConstructor
};
//# sourceMappingURL=LaundryWasherModeClient.js.map

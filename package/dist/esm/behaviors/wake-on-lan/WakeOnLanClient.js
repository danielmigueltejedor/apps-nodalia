/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { WakeOnLan } from "#clusters/wake-on-lan";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const WakeOnLanClientConstructor = ClientBehavior(WakeOnLan.Complete);
const WakeOnLanClient = WakeOnLanClientConstructor;
export {
  WakeOnLanClient,
  WakeOnLanClientConstructor
};
//# sourceMappingURL=WakeOnLanClient.js.map

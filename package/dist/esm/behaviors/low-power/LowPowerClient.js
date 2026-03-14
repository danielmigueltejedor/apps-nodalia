/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { LowPower } from "#clusters/low-power";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const LowPowerClientConstructor = ClientBehavior(LowPower.Complete);
const LowPowerClient = LowPowerClientConstructor;
export {
  LowPowerClient,
  LowPowerClientConstructor
};
//# sourceMappingURL=LowPowerClient.js.map

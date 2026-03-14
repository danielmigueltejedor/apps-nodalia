/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { PowerSource } from "#clusters/power-source";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const PowerSourceClientConstructor = ClientBehavior(PowerSource.Complete);
const PowerSourceClient = PowerSourceClientConstructor;
export {
  PowerSourceClient,
  PowerSourceClientConstructor
};
//# sourceMappingURL=PowerSourceClient.js.map

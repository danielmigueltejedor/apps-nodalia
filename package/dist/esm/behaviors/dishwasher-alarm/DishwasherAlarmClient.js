/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { DishwasherAlarm } from "#clusters/dishwasher-alarm";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const DishwasherAlarmClientConstructor = ClientBehavior(DishwasherAlarm.Complete);
const DishwasherAlarmClient = DishwasherAlarmClientConstructor;
export {
  DishwasherAlarmClient,
  DishwasherAlarmClientConstructor
};
//# sourceMappingURL=DishwasherAlarmClient.js.map

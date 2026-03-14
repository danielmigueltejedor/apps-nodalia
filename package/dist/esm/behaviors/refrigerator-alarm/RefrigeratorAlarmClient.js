/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RefrigeratorAlarm } from "#clusters/refrigerator-alarm";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const RefrigeratorAlarmClientConstructor = ClientBehavior(RefrigeratorAlarm.Complete);
const RefrigeratorAlarmClient = RefrigeratorAlarmClientConstructor;
export {
  RefrigeratorAlarmClient,
  RefrigeratorAlarmClientConstructor
};
//# sourceMappingURL=RefrigeratorAlarmClient.js.map

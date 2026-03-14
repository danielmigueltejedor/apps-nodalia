/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { SmokeCoAlarm } from "#clusters/smoke-co-alarm";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const SmokeCoAlarmClientConstructor = ClientBehavior(SmokeCoAlarm.Complete);
const SmokeCoAlarmClient = SmokeCoAlarmClientConstructor;
export {
  SmokeCoAlarmClient,
  SmokeCoAlarmClientConstructor
};
//# sourceMappingURL=SmokeCoAlarmClient.js.map

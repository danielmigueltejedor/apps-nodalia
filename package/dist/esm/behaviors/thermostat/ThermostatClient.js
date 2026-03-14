/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Thermostat } from "#clusters/thermostat";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ThermostatClientConstructor = ClientBehavior(Thermostat.Complete);
const ThermostatClient = ThermostatClientConstructor;
export {
  ThermostatClient,
  ThermostatClientConstructor
};
//# sourceMappingURL=ThermostatClient.js.map

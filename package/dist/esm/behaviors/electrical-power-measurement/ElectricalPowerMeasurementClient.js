/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ElectricalPowerMeasurement } from "#clusters/electrical-power-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ElectricalPowerMeasurementClientConstructor = ClientBehavior(ElectricalPowerMeasurement.Complete);
const ElectricalPowerMeasurementClient = ElectricalPowerMeasurementClientConstructor;
export {
  ElectricalPowerMeasurementClient,
  ElectricalPowerMeasurementClientConstructor
};
//# sourceMappingURL=ElectricalPowerMeasurementClient.js.map

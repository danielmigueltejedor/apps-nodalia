/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { TemperatureMeasurement } from "#clusters/temperature-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const TemperatureMeasurementClientConstructor = ClientBehavior(TemperatureMeasurement.Complete);
const TemperatureMeasurementClient = TemperatureMeasurementClientConstructor;
export {
  TemperatureMeasurementClient,
  TemperatureMeasurementClientConstructor
};
//# sourceMappingURL=TemperatureMeasurementClient.js.map

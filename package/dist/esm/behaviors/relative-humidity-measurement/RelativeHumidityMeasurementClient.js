/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RelativeHumidityMeasurement } from "#clusters/relative-humidity-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const RelativeHumidityMeasurementClientConstructor = ClientBehavior(RelativeHumidityMeasurement.Complete);
const RelativeHumidityMeasurementClient = RelativeHumidityMeasurementClientConstructor;
export {
  RelativeHumidityMeasurementClient,
  RelativeHumidityMeasurementClientConstructor
};
//# sourceMappingURL=RelativeHumidityMeasurementClient.js.map

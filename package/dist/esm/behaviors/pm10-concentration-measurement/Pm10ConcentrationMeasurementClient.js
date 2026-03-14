/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Pm10ConcentrationMeasurement } from "#clusters/pm10-concentration-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const Pm10ConcentrationMeasurementClientConstructor = ClientBehavior(Pm10ConcentrationMeasurement.Complete);
const Pm10ConcentrationMeasurementClient = Pm10ConcentrationMeasurementClientConstructor;
export {
  Pm10ConcentrationMeasurementClient,
  Pm10ConcentrationMeasurementClientConstructor
};
//# sourceMappingURL=Pm10ConcentrationMeasurementClient.js.map

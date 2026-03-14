/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { CarbonMonoxideConcentrationMeasurement } from "#clusters/carbon-monoxide-concentration-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const CarbonMonoxideConcentrationMeasurementClientConstructor = ClientBehavior(
  CarbonMonoxideConcentrationMeasurement.Complete
);
const CarbonMonoxideConcentrationMeasurementClient = CarbonMonoxideConcentrationMeasurementClientConstructor;
export {
  CarbonMonoxideConcentrationMeasurementClient,
  CarbonMonoxideConcentrationMeasurementClientConstructor
};
//# sourceMappingURL=CarbonMonoxideConcentrationMeasurementClient.js.map

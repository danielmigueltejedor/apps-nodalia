/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { CarbonDioxideConcentrationMeasurement } from "#clusters/carbon-dioxide-concentration-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const CarbonDioxideConcentrationMeasurementClientConstructor = ClientBehavior(
  CarbonDioxideConcentrationMeasurement.Complete
);
const CarbonDioxideConcentrationMeasurementClient = CarbonDioxideConcentrationMeasurementClientConstructor;
export {
  CarbonDioxideConcentrationMeasurementClient,
  CarbonDioxideConcentrationMeasurementClientConstructor
};
//# sourceMappingURL=CarbonDioxideConcentrationMeasurementClient.js.map

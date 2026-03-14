/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Pm1ConcentrationMeasurement } from "#clusters/pm1-concentration-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const Pm1ConcentrationMeasurementClientConstructor = ClientBehavior(Pm1ConcentrationMeasurement.Complete);
const Pm1ConcentrationMeasurementClient = Pm1ConcentrationMeasurementClientConstructor;
export {
  Pm1ConcentrationMeasurementClient,
  Pm1ConcentrationMeasurementClientConstructor
};
//# sourceMappingURL=Pm1ConcentrationMeasurementClient.js.map

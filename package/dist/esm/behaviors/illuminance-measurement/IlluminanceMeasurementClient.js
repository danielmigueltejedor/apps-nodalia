/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { IlluminanceMeasurement } from "#clusters/illuminance-measurement";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const IlluminanceMeasurementClientConstructor = ClientBehavior(IlluminanceMeasurement.Complete);
const IlluminanceMeasurementClient = IlluminanceMeasurementClientConstructor;
export {
  IlluminanceMeasurementClient,
  IlluminanceMeasurementClientConstructor
};
//# sourceMappingURL=IlluminanceMeasurementClient.js.map

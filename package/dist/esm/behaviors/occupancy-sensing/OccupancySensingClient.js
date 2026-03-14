/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { OccupancySensing } from "#clusters/occupancy-sensing";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const OccupancySensingClientConstructor = ClientBehavior(OccupancySensing.Complete);
const OccupancySensingClient = OccupancySensingClientConstructor;
export {
  OccupancySensingClient,
  OccupancySensingClientConstructor
};
//# sourceMappingURL=OccupancySensingClient.js.map

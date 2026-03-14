/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { WaterHeaterManagement } from "#clusters/water-heater-management";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const WaterHeaterManagementClientConstructor = ClientBehavior(WaterHeaterManagement.Complete);
const WaterHeaterManagementClient = WaterHeaterManagementClientConstructor;
export {
  WaterHeaterManagementClient,
  WaterHeaterManagementClientConstructor
};
//# sourceMappingURL=WaterHeaterManagementClient.js.map

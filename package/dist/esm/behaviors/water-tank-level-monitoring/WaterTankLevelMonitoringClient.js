/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { WaterTankLevelMonitoring } from "#clusters/water-tank-level-monitoring";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const WaterTankLevelMonitoringClientConstructor = ClientBehavior(WaterTankLevelMonitoring.Complete);
const WaterTankLevelMonitoringClient = WaterTankLevelMonitoringClientConstructor;
export {
  WaterTankLevelMonitoringClient,
  WaterTankLevelMonitoringClientConstructor
};
//# sourceMappingURL=WaterTankLevelMonitoringClient.js.map

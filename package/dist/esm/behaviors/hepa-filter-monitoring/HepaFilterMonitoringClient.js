/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { HepaFilterMonitoring } from "#clusters/hepa-filter-monitoring";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const HepaFilterMonitoringClientConstructor = ClientBehavior(HepaFilterMonitoring.Complete);
const HepaFilterMonitoringClient = HepaFilterMonitoringClientConstructor;
export {
  HepaFilterMonitoringClient,
  HepaFilterMonitoringClientConstructor
};
//# sourceMappingURL=HepaFilterMonitoringClient.js.map

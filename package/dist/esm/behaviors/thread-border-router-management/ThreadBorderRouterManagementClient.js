/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ThreadBorderRouterManagement } from "#clusters/thread-border-router-management";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ThreadBorderRouterManagementClientConstructor = ClientBehavior(ThreadBorderRouterManagement.Complete);
const ThreadBorderRouterManagementClient = ThreadBorderRouterManagementClientConstructor;
export {
  ThreadBorderRouterManagementClient,
  ThreadBorderRouterManagementClientConstructor
};
//# sourceMappingURL=ThreadBorderRouterManagementClient.js.map

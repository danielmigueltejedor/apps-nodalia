/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ScenesManagement } from "#clusters/scenes-management";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ScenesManagementClientConstructor = ClientBehavior(ScenesManagement.Complete);
const ScenesManagementClient = ScenesManagementClientConstructor;
export {
  ScenesManagementClient,
  ScenesManagementClientConstructor
};
//# sourceMappingURL=ScenesManagementClient.js.map

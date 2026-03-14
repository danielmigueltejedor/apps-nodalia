/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { GroupKeyManagement } from "#clusters/group-key-management";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const GroupKeyManagementClientConstructor = ClientBehavior(GroupKeyManagement.Complete);
const GroupKeyManagementClient = GroupKeyManagementClientConstructor;
export {
  GroupKeyManagementClient,
  GroupKeyManagementClientConstructor
};
//# sourceMappingURL=GroupKeyManagementClient.js.map

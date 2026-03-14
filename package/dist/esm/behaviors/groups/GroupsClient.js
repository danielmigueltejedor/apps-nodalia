/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Groups } from "#clusters/groups";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const GroupsClientConstructor = ClientBehavior(Groups.Complete);
const GroupsClient = GroupsClientConstructor;
export {
  GroupsClient,
  GroupsClientConstructor
};
//# sourceMappingURL=GroupsClient.js.map

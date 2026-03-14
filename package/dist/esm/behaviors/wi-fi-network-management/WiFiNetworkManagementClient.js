/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { WiFiNetworkManagement } from "#clusters/wi-fi-network-management";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const WiFiNetworkManagementClientConstructor = ClientBehavior(WiFiNetworkManagement.Complete);
const WiFiNetworkManagementClient = WiFiNetworkManagementClientConstructor;
export {
  WiFiNetworkManagementClient,
  WiFiNetworkManagementClientConstructor
};
//# sourceMappingURL=WiFiNetworkManagementClient.js.map

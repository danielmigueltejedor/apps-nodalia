/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { PowerTopology } from "#clusters/power-topology";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const PowerTopologyClientConstructor = ClientBehavior(PowerTopology.Complete);
const PowerTopologyClient = PowerTopologyClientConstructor;
export {
  PowerTopologyClient,
  PowerTopologyClientConstructor
};
//# sourceMappingURL=PowerTopologyClient.js.map

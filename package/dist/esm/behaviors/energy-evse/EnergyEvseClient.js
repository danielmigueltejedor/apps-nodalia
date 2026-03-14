/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EnergyEvse } from "#clusters/energy-evse";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const EnergyEvseClientConstructor = ClientBehavior(EnergyEvse.Complete);
const EnergyEvseClient = EnergyEvseClientConstructor;
export {
  EnergyEvseClient,
  EnergyEvseClientConstructor
};
//# sourceMappingURL=EnergyEvseClient.js.map

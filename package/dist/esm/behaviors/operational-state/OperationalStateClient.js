/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { OperationalState } from "#clusters/operational-state";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const OperationalStateClientConstructor = ClientBehavior(OperationalState.Complete);
const OperationalStateClient = OperationalStateClientConstructor;
export {
  OperationalStateClient,
  OperationalStateClientConstructor
};
//# sourceMappingURL=OperationalStateClient.js.map

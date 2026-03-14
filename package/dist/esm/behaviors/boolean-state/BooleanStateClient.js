/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { BooleanState } from "#clusters/boolean-state";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const BooleanStateClientConstructor = ClientBehavior(BooleanState.Complete);
const BooleanStateClient = BooleanStateClientConstructor;
export {
  BooleanStateClient,
  BooleanStateClientConstructor
};
//# sourceMappingURL=BooleanStateClient.js.map

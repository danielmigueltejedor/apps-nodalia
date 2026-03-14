/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Actions } from "#clusters/actions";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ActionsClientConstructor = ClientBehavior(Actions.Complete);
const ActionsClient = ActionsClientConstructor;
export {
  ActionsClient,
  ActionsClientConstructor
};
//# sourceMappingURL=ActionsClient.js.map

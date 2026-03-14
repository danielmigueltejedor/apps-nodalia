/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { TargetNavigator } from "#clusters/target-navigator";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const TargetNavigatorClientConstructor = ClientBehavior(TargetNavigator.Complete);
const TargetNavigatorClient = TargetNavigatorClientConstructor;
export {
  TargetNavigatorClient,
  TargetNavigatorClientConstructor
};
//# sourceMappingURL=TargetNavigatorClient.js.map

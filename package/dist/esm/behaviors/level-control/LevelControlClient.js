/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { LevelControl } from "#clusters/level-control";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const LevelControlClientConstructor = ClientBehavior(LevelControl.Complete);
const LevelControlClient = LevelControlClientConstructor;
export {
  LevelControlClient,
  LevelControlClientConstructor
};
//# sourceMappingURL=LevelControlClient.js.map

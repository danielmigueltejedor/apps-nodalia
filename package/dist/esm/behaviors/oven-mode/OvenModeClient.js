/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { OvenMode } from "#clusters/oven-mode";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const OvenModeClientConstructor = ClientBehavior(OvenMode.Complete);
const OvenModeClient = OvenModeClientConstructor;
export {
  OvenModeClient,
  OvenModeClientConstructor
};
//# sourceMappingURL=OvenModeClient.js.map

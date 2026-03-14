/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { WindowCovering } from "#clusters/window-covering";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const WindowCoveringClientConstructor = ClientBehavior(WindowCovering.Complete);
const WindowCoveringClient = WindowCoveringClientConstructor;
export {
  WindowCoveringClient,
  WindowCoveringClientConstructor
};
//# sourceMappingURL=WindowCoveringClient.js.map

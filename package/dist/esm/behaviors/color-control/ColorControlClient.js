/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ColorControl } from "#clusters/color-control";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ColorControlClientConstructor = ClientBehavior(ColorControl.Complete);
const ColorControlClient = ColorControlClientConstructor;
export {
  ColorControlClient,
  ColorControlClientConstructor
};
//# sourceMappingURL=ColorControlClient.js.map

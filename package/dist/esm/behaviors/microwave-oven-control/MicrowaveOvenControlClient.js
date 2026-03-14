/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MicrowaveOvenControl } from "#clusters/microwave-oven-control";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const MicrowaveOvenControlClientConstructor = ClientBehavior(MicrowaveOvenControl.Complete);
const MicrowaveOvenControlClient = MicrowaveOvenControlClientConstructor;
export {
  MicrowaveOvenControlClient,
  MicrowaveOvenControlClientConstructor
};
//# sourceMappingURL=MicrowaveOvenControlClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { OnOff } from "#clusters/on-off";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const OnOffClientConstructor = ClientBehavior(OnOff.Complete);
const OnOffClient = OnOffClientConstructor;
export {
  OnOffClient,
  OnOffClientConstructor
};
//# sourceMappingURL=OnOffClient.js.map

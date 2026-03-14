/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Identify } from "#clusters/identify";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const IdentifyClientConstructor = ClientBehavior(Identify.Complete);
const IdentifyClient = IdentifyClientConstructor;
export {
  IdentifyClient,
  IdentifyClientConstructor
};
//# sourceMappingURL=IdentifyClient.js.map

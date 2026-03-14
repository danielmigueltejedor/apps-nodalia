/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ContentControl } from "#clusters/content-control";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ContentControlClientConstructor = ClientBehavior(ContentControl.Complete);
const ContentControlClient = ContentControlClientConstructor;
export {
  ContentControlClient,
  ContentControlClientConstructor
};
//# sourceMappingURL=ContentControlClient.js.map

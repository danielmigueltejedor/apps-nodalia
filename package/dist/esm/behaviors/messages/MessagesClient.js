/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Messages } from "#clusters/messages";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const MessagesClientConstructor = ClientBehavior(Messages.Complete);
const MessagesClient = MessagesClientConstructor;
export {
  MessagesClient,
  MessagesClientConstructor
};
//# sourceMappingURL=MessagesClient.js.map

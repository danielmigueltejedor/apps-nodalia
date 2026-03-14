/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ThreadNetworkDirectory } from "#clusters/thread-network-directory";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ThreadNetworkDirectoryClientConstructor = ClientBehavior(ThreadNetworkDirectory.Complete);
const ThreadNetworkDirectoryClient = ThreadNetworkDirectoryClientConstructor;
export {
  ThreadNetworkDirectoryClient,
  ThreadNetworkDirectoryClientConstructor
};
//# sourceMappingURL=ThreadNetworkDirectoryClient.js.map

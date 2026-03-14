/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ClusterBehavior } from "./ClusterBehavior.js";
import { markClientBehavior } from "./cluster-behavior-utils.js";
function ClientBehavior(cluster) {
  const behavior = ClusterBehavior.for(cluster, void 0, `${cluster.name}Client`);
  markClientBehavior(behavior);
  return behavior;
}
export {
  ClientBehavior
};
//# sourceMappingURL=ClientBehavior.js.map

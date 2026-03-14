/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const behaviorCache = /* @__PURE__ */ new WeakMap();
const clientCache = /* @__PURE__ */ new WeakMap();
var ClusterBehaviorCache;
((ClusterBehaviorCache2) => {
  function get(cluster, base, schema, forClient) {
    const cache = forClient ? clientCache : behaviorCache;
    const baseCache = cache.get(base);
    if (baseCache === void 0) {
      return;
    }
    const clusterCache = baseCache.get(cluster);
    if (clusterCache === void 0) {
      return;
    }
    return clusterCache.get(schema)?.deref();
  }
  ClusterBehaviorCache2.get = get;
  function set(cluster, base, schema, type) {
    let baseCache = behaviorCache.get(base);
    if (baseCache === void 0) {
      behaviorCache.set(base, baseCache = /* @__PURE__ */ new WeakMap());
    }
    let clusterCache = baseCache.get(cluster);
    if (clusterCache === void 0) {
      baseCache.set(cluster, clusterCache = /* @__PURE__ */ new WeakMap());
    }
    clusterCache.set(schema, new WeakRef(type));
  }
  ClusterBehaviorCache2.set = set;
})(ClusterBehaviorCache || (ClusterBehaviorCache = {}));
export {
  ClusterBehaviorCache
};
//# sourceMappingURL=ClusterBehaviorCache.js.map

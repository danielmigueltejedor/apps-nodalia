/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Behavior } from "#behavior/Behavior.js";
import { Schema } from "#model";
import { ClusterType } from "#types";
import type { ClusterBehavior } from "./ClusterBehavior.js";
/**
 * To save memory we cache behavior implementations specialized for specific clusters.  This allows for efficient
 * configuration of behaviors with conditional runtime logic.
 *
 * We use the cluster and schema as cache keys so this relies on similar caching for those items.
 */
export declare namespace ClusterBehaviorCache {
    function get(cluster: ClusterType, base: Behavior.Type, schema: Schema, forClient?: boolean): ClusterBehavior.Type<any, Behavior.Type, import("./ClusterInterface.js").ClusterInterface<{}>> | undefined;
    function set(cluster: ClusterType, base: Behavior.Type, schema: Schema, type: ClusterBehavior.Type): void;
}
//# sourceMappingURL=ClusterBehaviorCache.d.ts.map
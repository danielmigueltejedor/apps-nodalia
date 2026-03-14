/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Datasource } from "#behavior/state/managed/Datasource.js";
import { MaybePromise } from "#general";
import { Val } from "#protocol";
import type { ClientEndpointStore } from "./ClientEndpointStore.js";
/**
 * The default implementation of {@link Datasource.ExternallyMutableStore}.
 *
 * This implements storage for attribute values for a single cluster loaded from peers.
 */
export interface DatasourceCache extends Datasource.ExternallyMutableStore {
    /**
     * Reset the cache to "uninitialized" state by reclaiming {@link initialValues} from an active datasource.
     */
    reclaimValues(): void;
    /**
     * Erase values just for this datasource.
     */
    erase(): MaybePromise<void>;
}
export declare function DatasourceCache(store: ClientEndpointStore, behaviorId: string, initialValues: Val.Struct | undefined): DatasourceCache;
export declare namespace DatasourceCache {
    /**
     * Standard key for storing the version.
     *
     * This conveys the version to the {@link Datasource}.
     */
    const VERSION_KEY = "__version__";
}
//# sourceMappingURL=DatasourceCache.d.ts.map
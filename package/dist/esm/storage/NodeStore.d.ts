/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Endpoint } from "#endpoint/Endpoint.js";
import { Construction, MaybePromise, StorageContext, StorageContextFactory } from "#general";
import { EndpointStore } from "./EndpointStore.js";
/**
 * Non-volatile state management for a {@link Node}.
 *
 * We eagerly load all available data from disk on startup.  This prevents storage from forcing asynchronous
 * {@link Endpoint} initialization.  We then can initialize most behaviors synchronously.
 */
export declare abstract class NodeStore {
    #private;
    get bdxStore(): StorageContext;
    get construction(): Construction<NodeStore>;
    constructor(storageFactory: StorageContextFactory);
    toString(): string;
    [Construction.construct](): MaybePromise<void>;
    abstract storeForEndpoint(endpoint: Endpoint): EndpointStore;
    abstract erase(): MaybePromise<void>;
    protected abstract load(): MaybePromise<void>;
    protected createStorageContext(name: string): StorageContext;
    protected get storageFactory(): StorageContextFactory;
}
//# sourceMappingURL=NodeStore.d.ts.map
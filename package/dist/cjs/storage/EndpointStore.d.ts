/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { StorageContext } from "#general";
import { Val } from "#protocol";
/**
 * Persistence for state values associated with a specific endpoint.
 */
export declare class EndpointStore {
    #private;
    protected initialValues: Map<string, Val.Struct>;
    constructor(storage: StorageContext);
    /**
     * Retrieve the primary key used to identify this store.
     */
    get id(): string;
    /**
     * Extract initial values for a behavior.  Derivatives invoke this when instantiating a store.  The values are then
     * owned by the store.
     */
    protected consumeInitialValues(behaviorId: string): Val.Struct | undefined;
    /**
     * Patch values.  Keyed by {@link Behavior.id} then property name.
     *
     * See {@link Datasource.Store.set} for the patch semantics the individual structs use.
     */
    set(values: Record<string, undefined | Val.Struct>): Promise<void>;
    /**
     * Description used in diagnostic messages.
     */
    toString(): string;
    /**
     * IDs for behaviors persisted in this store.
     */
    get knownBehaviors(): Set<string>;
    /**
     * Load the store with persisted values.
     */
    load(): Promise<void>;
    /**
     * Remove all persisted information for the {@link Endpoint}.
     */
    erase(): import("#general").MaybePromise<void>;
    /**
     * Remove all persisted information for a single behavior on the {@link Endpoint}.
     */
    eraseStoreForBehavior(behaviorId: string): import("#general").MaybePromise<void>;
    protected get storage(): StorageContext;
}
//# sourceMappingURL=EndpointStore.d.ts.map
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { StorageContext, Transaction } from "#general";
import { EndpointStore } from "#storage/EndpointStore.js";
import type { EndpointNumber } from "#types";
import type { ClientNodeStore } from "./ClientNodeStore.js";
import { DatasourceCache } from "./DatasourceCache.js";
export declare class ClientEndpointStore extends EndpointStore {
    #private;
    constructor(owner: ClientNodeStore, number: EndpointNumber, storage: StorageContext);
    get number(): EndpointNumber;
    /**
     * Shortcut to persisted peer address so we can use in logging prior to full initialization.
     */
    get peerAddress(): unknown;
    participantFor(transaction: Transaction): import("#general").Participant;
    /**
     * Create a {@link Datasource.ExternallyMutableStore} for a behavior.
     */
    createStoreForBehavior(behaviorId: string): DatasourceCache;
    /**
     * Create a {@link Datasource.Store} for a behavior that does not track a remote cluster.
     */
    createStoreForLocalBehavior(behaviorId: string): import("../../behavior/state/managed/Datasource.js").Datasource.Store;
}
//# sourceMappingURL=ClientEndpointStore.d.ts.map
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Behavior } from "#behavior/Behavior.js";
import { ClusterBehavior } from "#behavior/cluster/ClusterBehavior.js";
import { Datasource } from "#behavior/state/managed/Datasource.js";
import { Endpoint } from "#endpoint/Endpoint.js";
import { Observable } from "#general";
import type { ClientNode } from "#node/ClientNode.js";
import { type Read, type ReadResult } from "#protocol";
import { DatasourceCache } from "#storage/client/DatasourceCache.js";
import type { ClusterId, ClusterType, EndpointNumber } from "#types";
import { PeerBehavior } from "./PeerBehavior.js";
/**
 * Manages endpoint and behavior structure for a single client node.
 */
export declare class ClientStructure {
    #private;
    constructor(node: ClientNode);
    get changed(): Observable<[void], void>;
    /**
     * Load initial structure from cache.
     */
    loadCache(): void;
    /**
     * Obtain the store for a remote cluster.
     */
    storeForRemote(endpoint: Endpoint, type: ClusterBehavior.Type): DatasourceCache;
    /**
     * Obtain the store for a non-cluster behavior.
     *
     * The data for these behaviors is managed locally and not synced from the peer.
     */
    storeForLocal(endpoint: Endpoint, type: Behavior.Type): Datasource.Store;
    /**
     * Inject version filters into a Read or Subscribe request.
     */
    injectVersionFilters<T extends Read>(request: T): T;
    /**
     * Update the node structure by applying attribute changes.
     */
    mutate(request: Read, changes: ReadResult): AsyncGenerator<ReadResult.Report[], void, unknown>;
    /** Determines if the subscription is fabric filtered */
    protected get subscribedFabricFiltered(): boolean;
    /**
     * Obtain the {@link ClusterType} for an {@link EndpointNumber} and {@link ClusterId}.
     */
    clusterFor(endpoint: EndpointNumber, cluster: ClusterId): ClusterType | undefined;
    /**
     * Obtain the {@link Endpoint} for a {@link EndpointNumber}.
     */
    endpointFor(endpoint: EndpointNumber): Endpoint | undefined;
}
interface EndpointStructure {
    pendingOwner?: EndpointStructure;
    endpoint: Endpoint;
    clusters: Map<ClusterId, ClusterStructure>;
}
interface ClusterStructure extends Partial<PeerBehavior.DiscoveredClusterShape> {
    kind: "discovered";
    id: ClusterId;
    behavior?: ClusterBehavior.Type;
    pendingBehavior?: ClusterBehavior.Type;
    pendingDelete?: boolean;
    store: DatasourceCache;
}
/**
 * Queue entry for pending notifications.
 */
export type PendingEvent = EndpointEvent | ClusterEvent;
interface EndpointEvent {
    kind: "endpoint";
    endpoint: EndpointStructure;
}
interface ClusterEvent {
    kind: "cluster";
    subkind: "add" | "delete" | "replace";
    endpoint: EndpointStructure;
    cluster: ClusterStructure;
}
export {};
//# sourceMappingURL=ClientStructure.d.ts.map
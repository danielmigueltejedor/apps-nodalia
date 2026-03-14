/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Endpoint } from "#endpoint/Endpoint.js";
import { Destructable, Environment, StorageManager } from "#general";
import { NodeStore } from "../NodeStore.js";
import { ClientNodeStores } from "../client/ClientNodeStores.js";
import { ServerEndpointStores } from "./ServerEndpointStores.js";
/**
 * {@link ServerNode} persistence.
 *
 * Each {@link ServerNode} has an instance of this store.
 *
 * TODO - create global locking mechanism to ensure single reader/writer across host
 */
export declare class ServerNodeStore extends NodeStore implements Destructable {
    #private;
    constructor(environment: Environment, nodeId: string);
    static create(environment: Environment, nodeId: string): Promise<ServerNodeStore>;
    close(): Promise<void>;
    /**
     * Stores associated with server endpoints supported by this node.
     */
    get endpointStores(): ServerEndpointStores;
    /**
     * Stores associated with remote nodes known by this node.
     */
    get clientStores(): ClientNodeStores;
    /**
     * The underlying {@link StorageManager} that provides node data.
     */
    get storage(): StorageManager;
    storeForEndpoint(endpoint: Endpoint): import("./ServerEndpointStore.js").ServerEndpointStore;
    erase(): Promise<void>;
    load(): Promise<void>;
}
//# sourceMappingURL=ServerNodeStore.d.ts.map
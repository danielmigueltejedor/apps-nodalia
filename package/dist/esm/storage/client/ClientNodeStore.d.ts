/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Endpoint } from "#endpoint/Endpoint.js";
import { StorageContextFactory } from "#general";
import { NodeStore } from "../NodeStore.js";
import { ClientEndpointStore } from "./ClientEndpointStore.js";
import type { RemoteWriter } from "./RemoteWriter.js";
/**
 * {@link ClientNode} persistence.
 */
export declare class ClientNodeStore extends NodeStore {
    #private;
    constructor(id: string, storage: StorageContextFactory, isPreexisting: boolean);
    toString(): string;
    get id(): string;
    get isPreexisting(): boolean;
    get write(): RemoteWriter;
    set write(write: RemoteWriter);
    get endpointStores(): MapIterator<ClientEndpointStore>;
    erase(): import("#general").MaybePromise<void> | undefined;
    storeForEndpoint(endpoint: Endpoint): ClientEndpointStore;
    protected load(): Promise<void>;
}
//# sourceMappingURL=ClientNodeStore.d.ts.map
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { AppAddress, Lifetime } from "#general";
import type { ServerNode } from "#node/ServerNode.js";
import { ApiPath } from "./api/ApiPath.js";
/**
 * An implementation of a non-Matter network protocol for accessing a {@link ServerNode}.
 */
export declare abstract class RemoteInterface {
    #private;
    constructor(node: ServerNode, address: AppAddress);
    join(...name: unknown[]): Lifetime;
    get root(): ApiPath;
    get env(): import("#general").Environment;
    get node(): ServerNode<ServerNode.RootEndpoint>;
    get address(): AppAddress;
    get isAborted(): boolean;
    get abort(): AbortSignal;
    static create<This extends new (node: ServerNode, address: AppAddress) => RemoteInterface>(this: This, node: ServerNode, address: AppAddress): Promise<RemoteInterface>;
    close(): Promise<void>;
    protected assertProtocol(appProtocol: string): void;
    protected addWorker(worker: Promise<void>): void;
    static protocol: string;
    /**
     * Initialize and begin handling requests to the interface.
     */
    protected abstract start(): Promise<void>;
    /**
     * Stop servicing requests.  Called on close.  The default implementation just waits for any workers to complete.
     */
    protected stop(): Promise<void>;
}
export declare namespace RemoteInterface {
    interface Type {
        protocol: string;
        create(node: ServerNode, address: AppAddress): Promise<RemoteInterface>;
    }
}
//# sourceMappingURL=RemoteInterface.d.ts.map
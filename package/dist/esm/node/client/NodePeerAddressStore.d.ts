/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ClientNode } from "#node/ClientNode.js";
import type { ServerNode } from "#node/ServerNode.js";
import { PeerAddress, PeerAddressStore, PeerDescriptor } from "#protocol";
import { FabricIndex, NodeId } from "#types";
/**
 * This is an adapter for lower-level components in the protocol package.
 */
export declare class NodePeerAddressStore extends PeerAddressStore {
    #private;
    constructor(owner: ServerNode);
    assignNewAddress(node: ClientNode, fabricIndex: FabricIndex, nodeId?: NodeId): Promise<{
        fabricIndex: FabricIndex;
        nodeId: NodeId;
    }>;
    loadPeers(): PeerDescriptor[];
    updatePeer(peer: PeerDescriptor): Promise<void>;
    deletePeer(address: PeerAddress): void;
}
//# sourceMappingURL=NodePeerAddressStore.d.ts.map
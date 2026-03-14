/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RemoteDescriptor } from "#behavior/system/commissioning/RemoteDescriptor.js";
import { ControllerBehavior } from "#behavior/system/controller/ControllerBehavior.js";
import { Crypto, ServerAddress } from "#general";
import { IdentityService } from "#node/server/IdentityService.js";
import { PeerAddress, PeerAddressMap, PeerAddressStore } from "#protocol";
import { NodeId } from "#types";
class NodePeerAddressStore extends PeerAddressStore {
  #owner;
  /**
   * This is the map of all addresses allocated to nodes.  A node may appear in this map even if not yet commissioned
   * if commissioning is underway.
   */
  #assignedAddresses = new PeerAddressMap();
  constructor(owner) {
    super();
    this.#owner = owner;
    const identityService = owner.env.get(IdentityService);
    identityService.assignNodeAddress = this.assignNewAddress.bind(this);
    identityService.releaseNodeAddress = this.deletePeer.bind(this);
  }
  async assignNewAddress(node, fabricIndex, nodeId) {
    const useSequentialIds = node.owner?.stateOf(ControllerBehavior).nodeIdAssignment !== "random";
    let nextNodeId = node.owner?.stateOf(ControllerBehavior).nextNodeId ?? NodeId(1);
    while (nodeId === void 0) {
      if (useSequentialIds) {
        nodeId = nextNodeId;
        nextNodeId++;
      } else {
        nodeId = NodeId.randomOperationalNodeId(this.#owner.env.get(Crypto));
      }
      if (this.#assignedAddresses.has({ fabricIndex, nodeId })) {
        nodeId = void 0;
      }
    }
    const address = PeerAddress({ fabricIndex, nodeId });
    if (useSequentialIds) {
      await node.owner?.setStateOf(ControllerBehavior, { nextNodeId });
    }
    this.#assignedAddresses.set(address, node);
    return address;
  }
  loadPeers() {
    this.#assignedAddresses = new PeerAddressMap();
    return [...this.#owner.peers].map((node) => {
      const commissioning = node.state.commissioning;
      if (!commissioning.peerAddress) {
        return;
      }
      this.#assignedAddresses.set(commissioning.peerAddress, node);
      const addr = commissioning.addresses?.find((addr2) => addr2.type === "udp");
      return {
        address: commissioning.peerAddress,
        operationalAddress: addr && ServerAddress(addr),
        discoveryData: RemoteDescriptor.fromLongForm(commissioning)
      };
    }).filter((addr) => addr !== void 0);
  }
  async updatePeer(peer) {
    const node = this.#owner.peers.get(peer.address);
    if (!node || !node.lifecycle.isInstalled) {
      return;
    }
    await node.act(async (agent) => {
      await agent.context.transaction.addResources(agent.commissioning);
      await agent.context.transaction.begin();
      const state = agent.commissioning.state;
      RemoteDescriptor.toLongForm(peer.discoveryData, state);
      if (peer.operationalAddress) {
        state.addresses = [peer.operationalAddress];
      }
      await agent.context.transaction.commit();
    });
  }
  deletePeer(address) {
    this.#assignedAddresses.delete(address);
  }
}
export {
  NodePeerAddressStore
};
//# sourceMappingURL=NodePeerAddressStore.js.map

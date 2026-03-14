/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { CommissioningClient } from "#behavior/system/commissioning/CommissioningClient.js";
import { ClientNetworkRuntime } from "#behavior/system/network/ClientNetworkRuntime.js";
import { NetworkClient } from "#behavior/system/network/NetworkClient.js";
import { ClientNodeEndpoints } from "#endpoint/properties/ClientNodeEndpoints.js";
import { EndpointInitializer } from "#endpoint/properties/EndpointInitializer.js";
import { EndpointLifecycle } from "#endpoint/properties/EndpointLifecycle.js";
import { EndpointType } from "#endpoint/type/EndpointType.js";
import { MutableEndpoint } from "#endpoint/type/MutableEndpoint.js";
import { Diagnostic, InternalError, Lifecycle, Logger } from "#general";
import { Matter } from "#model";
import { OccurrenceManager, PeerAddress } from "#protocol";
import { ClientNodeStore } from "#storage/client/ClientNodeStore.js";
import { RemoteWriter } from "#storage/client/RemoteWriter.js";
import { ServerNodeStore } from "#storage/server/ServerNodeStore.js";
import { ClientEndpointInitializer } from "./client/ClientEndpointInitializer.js";
import { ClientNodeInteraction } from "./client/ClientNodeInteraction.js";
import { Node } from "./Node.js";
const logger = Logger.get("ClientNode");
class ClientNode extends Node {
  #matter;
  #interaction;
  constructor(options) {
    const opts = {
      ...options,
      number: 0,
      // Create an unfrozen type so we can set the revision when we see the descriptor
      type: MutableEndpoint(ClientNode.RootEndpoint)
    };
    super(opts);
    this.env.close(OccurrenceManager);
    this.env.set(Node, this);
    this.env.set(ClientNode, this);
    this.#matter = options.matter ?? Matter;
  }
  get isGroup() {
    return false;
  }
  /**
   * Model of Matter semantics understood by this node.
   *
   * Matter elements missing from this model will not support all functionality.
   */
  get matter() {
    return this.#matter;
  }
  get endpoints() {
    return new ClientNodeEndpoints(this);
  }
  get store() {
    return this.env.get(ServerNodeStore).clientStores.storeForNode(this);
  }
  // This needs to be sync to ensure a sync initialization
  initialize() {
    const store = this.store;
    this.env.set(ClientNodeStore, store);
    const initializer = new ClientEndpointInitializer(this);
    this.env.set(EndpointInitializer, initializer);
    store.write = RemoteWriter(this, initializer.structure);
    initializer.structure.loadCache();
    const promise = super.initialize();
    if (store.isPreexisting && promise !== void 0) {
      throw new InternalError("Unsupported async initialization detected when loading known peer");
    }
    return promise;
  }
  get owner() {
    return super.owner;
  }
  set owner(owner) {
    super.owner = owner;
  }
  /**
   * Add this node to a fabric.
   */
  async commission(options) {
    await this.act("commission", (agent) => agent.commissioning.commission(options));
  }
  /**
   * Remove this node from the fabric (if commissioned) and locally.
   * This method tries to communicate with the device to decommission it properly and will fail if the device is
   * unreachable.
   * If you cannot reach the device, use {@link delete} instead.
   */
  async decommission() {
    this.lifecycle.change(EndpointLifecycle.Change.Destroying);
    if (this.lifecycle.isCommissioned) {
      this.statusUpdate("decommissioning");
      await this.act("decommission", (agent) => agent.commissioning.decommission());
    }
    await this.delete();
  }
  /**
   * Force-remove the node without first decommissioning.
   *
   * If the node is still available, you should use {@link decommission} to remove it properly from the fabric and only use
   * this method as fallback.  You should also tell the user that he needs to manually factory-reset the device.
   */
  async delete() {
    await super.delete();
  }
  async erase() {
    await this.lifecycle.mutex.produce(this.eraseWithMutex.bind(this));
  }
  /**
   * Disable the node.
   *
   * This shuts down any active connections and prevents future connections until re-enabled.
   */
  async disable() {
    if (this.state.network.isDisabled) {
      return;
    }
    await this.lifecycle.mutex.produce(async () => {
      await this.cancelWithMutex();
      await this.setStateOf(NetworkClient, { isDisabled: true });
    });
  }
  /**
   * Enable the node.
   *
   * If the node is disabled but reachable, this brings it online.
   */
  async enable() {
    if (!this.state.network.isDisabled) {
      return;
    }
    await this.setStateOf(NetworkClient, { isDisabled: false });
    await this.start();
  }
  async eraseWithMutex() {
    await this.cancelWithMutex();
    await super.resetWithMutex();
    await this.env.get(EndpointInitializer).eraseDescendant(this);
  }
  createRuntime() {
    return new ClientNetworkRuntime(this);
  }
  async prepareRuntimeShutdown() {
  }
  get container() {
    return this.owner?.peers;
  }
  act(actorOrPurpose, actor) {
    if (this.construction.status === Lifecycle.Status.Inactive) {
      this.construction.start();
    }
    if (this.construction.status === Lifecycle.Status.Initializing) {
      return this.construction.then(() => super.act(actorOrPurpose, actor));
    }
    return super.act(actorOrPurpose, actor);
  }
  get interaction() {
    if (this.#interaction === void 0) {
      this.#interaction = new ClientNodeInteraction(this);
    }
    return this.#interaction;
  }
  get identity() {
    let address = this.behaviors.maybeStateOf("commissioning")?.peerAddress;
    if (!address) {
      address = this.store.storeForEndpoint(this).peerAddress;
    }
    if (address) {
      return PeerAddress(address).toString();
    }
    return super.identity;
  }
  statusUpdate(message) {
    logger.info(Diagnostic.strong(this.toString()), message);
  }
}
((ClientNode2) => {
  ClientNode2.RootEndpoint = MutableEndpoint({
    ...Node.CommonRootEndpoint,
    deviceRevision: EndpointType.UNKNOWN_DEVICE_REVISION
  }).with(CommissioningClient, NetworkClient);
})(ClientNode || (ClientNode = {}));
Object.freeze(ClientNode.RootEndpoint);
export {
  ClientNode
};
//# sourceMappingURL=ClientNode.js.map

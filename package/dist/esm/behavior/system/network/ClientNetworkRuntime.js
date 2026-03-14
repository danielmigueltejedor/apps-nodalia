/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { InternalError, Logger, MatterError, ObserverGroup } from "#general";
import {
  ClientInteraction,
  ExchangeProvider,
  InteractionQueue,
  PeerAddress,
  PeerSet,
  QueuedClientInteraction,
  SessionManager
} from "#protocol";
import { CommissioningClient } from "../commissioning/CommissioningClient.js";
import { RemoteDescriptor } from "../commissioning/RemoteDescriptor.js";
import { NetworkRuntime } from "./NetworkRuntime.js";
class UncommissionedError extends MatterError {
}
class OfflineError extends MatterError {
}
const logger = Logger.get("ClientNetworkRuntime");
class ClientNetworkRuntime extends NetworkRuntime {
  #client;
  #queuedClient;
  #observers = new ObserverGroup();
  constructor(owner) {
    super(owner);
  }
  get owner() {
    return super.owner;
  }
  async start() {
    if (!this.owner.lifecycle.isCommissioned) {
      throw new UncommissionedError(`Cannot interact with ${this.owner} because it is uncommissioned`);
    }
    if (this.owner.state.network.isDisabled) {
      throw new UncommissionedError(`Cannot interact with ${this.owner} because it is disabled`);
    }
    const address = this.owner.stateOf(CommissioningClient).peerAddress;
    if (address === void 0) {
      throw new InternalError(`Commissioned node ${this.owner} has no peer address`);
    }
    const { env, lifecycle } = this.owner;
    const peers = env.get(PeerSet);
    const commissioningState = this.owner.stateOf(CommissioningClient);
    const networkState = this.owner.state.network;
    const exchangeProvider = await peers.exchangeProviderFor(address, {
      discoveryOptions: {
        discoveryData: RemoteDescriptor.fromLongForm(commissioningState)
      },
      caseAuthenticatedTags: networkState.caseAuthenticatedTags ? [...networkState.caseAuthenticatedTags] : void 0
    });
    env.set(ExchangeProvider, exchangeProvider);
    this.#client = new ClientInteraction({ environment: env, abort: this.abortSignal });
    env.set(ClientInteraction, this.#client);
    this.#queuedClient = new QueuedClientInteraction({
      environment: env,
      abort: this.abortSignal,
      queue: env.get(InteractionQueue)
      // created and owned by Peers
    });
    env.set(QueuedClientInteraction, this.#queuedClient);
    const { sessions } = env.get(SessionManager);
    if (sessions.find((session) => session.peerIs(address))) {
      this.owner.act(({ context }) => lifecycle.online.emit(context));
    }
    this.#observers.on(sessions.added, (session) => {
      if (lifecycle.isOnline) {
        return;
      }
      const address2 = PeerAddress(commissioningState.peerAddress);
      if (!address2 || !PeerAddress.is(session.peerAddress, address2)) {
        return;
      }
      this.owner.act(({ context }) => lifecycle.online.emit(context));
    });
    this.#observers.on(sessions.deleted, (session) => {
      if (!lifecycle.isOnline) {
        return;
      }
      const address2 = PeerAddress(commissioningState.peerAddress);
      if (!PeerAddress.is(session.peerAddress, address2)) {
        return;
      }
      if (address2 && sessions.find(({ peerAddress }) => PeerAddress.is(peerAddress, address2))) {
        return;
      }
      this.owner.act(({ context }) => lifecycle.offline.emit(context));
    });
  }
  async stop() {
    await this.construction;
    this.owner.env.delete(ClientInteraction, this.#client);
    this.owner.env.delete(QueuedClientInteraction, this.#queuedClient);
    try {
      await this.#client?.close();
    } catch (e) {
      logger.error(`Error closing connection to ${this.owner}`, e);
    }
    this.#observers.close();
  }
}
export {
  ClientNetworkRuntime,
  OfflineError,
  UncommissionedError
};
//# sourceMappingURL=ClientNetworkRuntime.js.map

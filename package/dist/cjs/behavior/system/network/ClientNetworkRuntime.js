"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ClientNetworkRuntime_exports = {};
__export(ClientNetworkRuntime_exports, {
  ClientNetworkRuntime: () => ClientNetworkRuntime,
  OfflineError: () => OfflineError,
  UncommissionedError: () => UncommissionedError
});
module.exports = __toCommonJS(ClientNetworkRuntime_exports);
var import_general = require("#general");
var import_protocol = require("#protocol");
var import_CommissioningClient = require("../commissioning/CommissioningClient.js");
var import_RemoteDescriptor = require("../commissioning/RemoteDescriptor.js");
var import_NetworkRuntime = require("./NetworkRuntime.js");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class UncommissionedError extends import_general.MatterError {
}
class OfflineError extends import_general.MatterError {
}
const logger = import_general.Logger.get("ClientNetworkRuntime");
class ClientNetworkRuntime extends import_NetworkRuntime.NetworkRuntime {
  #client;
  #queuedClient;
  #observers = new import_general.ObserverGroup();
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
    const address = this.owner.stateOf(import_CommissioningClient.CommissioningClient).peerAddress;
    if (address === void 0) {
      throw new import_general.InternalError(`Commissioned node ${this.owner} has no peer address`);
    }
    const { env, lifecycle } = this.owner;
    const peers = env.get(import_protocol.PeerSet);
    const commissioningState = this.owner.stateOf(import_CommissioningClient.CommissioningClient);
    const networkState = this.owner.state.network;
    const exchangeProvider = await peers.exchangeProviderFor(address, {
      discoveryOptions: {
        discoveryData: import_RemoteDescriptor.RemoteDescriptor.fromLongForm(commissioningState)
      },
      caseAuthenticatedTags: networkState.caseAuthenticatedTags ? [...networkState.caseAuthenticatedTags] : void 0
    });
    env.set(import_protocol.ExchangeProvider, exchangeProvider);
    this.#client = new import_protocol.ClientInteraction({ environment: env, abort: this.abortSignal });
    env.set(import_protocol.ClientInteraction, this.#client);
    this.#queuedClient = new import_protocol.QueuedClientInteraction({
      environment: env,
      abort: this.abortSignal,
      queue: env.get(import_protocol.InteractionQueue)
      // created and owned by Peers
    });
    env.set(import_protocol.QueuedClientInteraction, this.#queuedClient);
    const { sessions } = env.get(import_protocol.SessionManager);
    if (sessions.find((session) => session.peerIs(address))) {
      this.owner.act(({ context }) => lifecycle.online.emit(context));
    }
    this.#observers.on(sessions.added, (session) => {
      if (lifecycle.isOnline) {
        return;
      }
      const address2 = (0, import_protocol.PeerAddress)(commissioningState.peerAddress);
      if (!address2 || !import_protocol.PeerAddress.is(session.peerAddress, address2)) {
        return;
      }
      this.owner.act(({ context }) => lifecycle.online.emit(context));
    });
    this.#observers.on(sessions.deleted, (session) => {
      if (!lifecycle.isOnline) {
        return;
      }
      const address2 = (0, import_protocol.PeerAddress)(commissioningState.peerAddress);
      if (!import_protocol.PeerAddress.is(session.peerAddress, address2)) {
        return;
      }
      if (address2 && sessions.find(({ peerAddress }) => import_protocol.PeerAddress.is(peerAddress, address2))) {
        return;
      }
      this.owner.act(({ context }) => lifecycle.offline.emit(context));
    });
  }
  async stop() {
    await this.construction;
    this.owner.env.delete(import_protocol.ClientInteraction, this.#client);
    this.owner.env.delete(import_protocol.QueuedClientInteraction, this.#queuedClient);
    try {
      await this.#client?.close();
    } catch (e) {
      logger.error(`Error closing connection to ${this.owner}`, e);
    }
    this.#observers.close();
  }
}
//# sourceMappingURL=ClientNetworkRuntime.js.map

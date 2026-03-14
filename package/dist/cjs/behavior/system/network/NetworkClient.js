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
var NetworkClient_exports = {};
__export(NetworkClient_exports, {
  NetworkClient: () => NetworkClient
});
module.exports = __toCommonJS(NetworkClient_exports);
var import_RemoteDescriptor = require("#behavior/system/commissioning/RemoteDescriptor.js");
var import_basic_information = require("#behaviors/basic-information");
var import_general = require("#general");
var import_model = require("#model");
var import_Node = require("#node/Node.js");
var import_protocol = require("#protocol");
var import_types = require("#types");
var import_NetworkBehavior = require("./NetworkBehavior.js");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class NetworkClient extends import_NetworkBehavior.NetworkBehavior {
  initialize() {
    if (this.#node.isGroup) {
      this.state.autoSubscribe = false;
      this.state.defaultSubscription = void 0;
    } else {
      this.reactTo(this.events.autoSubscribe$Changed, this.#handleAutoSubscribeChanged, { offline: true });
      this.reactTo(this.events.defaultSubscription$Changed, this.#handleDefaultSubscriptionChange);
    }
  }
  async startup() {
    const peerAddress = this.#node.state.commissioning.peerAddress;
    if (peerAddress !== void 0) {
      const peerSet = this.env.get(import_protocol.PeerSet);
      if (!peerSet.has(peerAddress)) {
        const udpAddresses = this.#node.state.commissioning.addresses?.filter((a) => a.type === "udp") ?? [];
        if (udpAddresses.length) {
          const latestUdpAddress = (0, import_general.ServerAddress)(udpAddresses[udpAddresses.length - 1]);
          await peerSet.addKnownPeer(
            peerAddress,
            latestUdpAddress,
            import_RemoteDescriptor.RemoteDescriptor.fromLongForm(this.#node.state.commissioning)
          );
        }
      }
      if (!this.#node.lifecycle.isCommissioned) {
        const capabilityMinima = this.#node.maybeStateOf(import_basic_information.BasicInformationClient)?.capabilityMinima;
        if (capabilityMinima !== void 0) {
          peerSet.for(peerAddress).limits = capabilityMinima;
        }
      }
    }
    await this.#handleAutoSubscribeChanged();
  }
  async #handleDefaultSubscriptionChange() {
    await this.#handleAutoSubscribeChanged(false);
    if (this.state.autoSubscribe && !this.state.isDisabled) {
      await this.#handleAutoSubscribeChanged(true);
    }
  }
  async #handleAutoSubscribeChanged(desiredState = this.state.autoSubscribe) {
    const { isDisabled } = this.state;
    const subscriptionDesired = desiredState && !isDisabled;
    if (subscriptionDesired === !!this.internal.activeSubscription) {
      return;
    }
    if (subscriptionDesired) {
      const subscribe = (0, import_protocol.Subscribe)({
        fabricFilter: true,
        keepSubscriptions: false,
        attributes: [{}],
        events: [{ isUrgent: true }],
        ...this.state.defaultSubscription
      });
      for await (const _chunk of this.#node.interaction.read({
        ...subscribe,
        eventFilters: void 0,
        eventRequests: void 0
      })) ;
      this.internal.activeSubscription = await this.#node.interaction.subscribe({
        sustain: true,
        ...subscribe,
        eventFilters: [{ eventMin: this.state.maxEventNumber + 1n }],
        updated: async (update) => {
          for await (const _chunk of update) ;
          this.events.subscriptionAlive.emit();
        },
        closed: () => {
          if (!(this.internal.activeSubscription instanceof import_protocol.SustainedSubscription)) {
            this.events.subscriptionStatusChanged.emit(false);
          }
          this.internal.activeSubscription = void 0;
        }
      });
      if (this.internal.activeSubscription instanceof import_protocol.SustainedSubscription) {
        this.internal.activeSubscription.active.on(() => this.events.subscriptionStatusChanged.emit(true));
        this.internal.activeSubscription.inactive.on(() => this.events.subscriptionStatusChanged.emit(false));
      } else {
        this.events.subscriptionStatusChanged.emit(true);
      }
    } else {
      this.internal.activeSubscription?.close();
      this.internal.activeSubscription = void 0;
    }
  }
  /**
   * Returns if we actually have an active and established subscription
   * When a Sustained subscription is used we return the active value, otherwise we know when the subscription instance
   * is set.
   */
  get subscriptionActive() {
    const activeSubscription = this.internal.activeSubscription;
    if (activeSubscription === void 0) {
      return false;
    }
    return activeSubscription instanceof import_protocol.SustainedSubscription ? activeSubscription.active.value : true;
  }
  async [Symbol.asyncDispose]() {
    this.internal.activeSubscription?.close();
    this.internal.activeSubscription = void 0;
  }
  get #node() {
    return this.env.get(import_Node.Node);
  }
  /**
   * Define logical schema for fields that should persist.
   */
  static schema = new import_model.DatatypeModel({
    name: "NetworkState",
    type: "struct",
    children: [
      (0, import_model.FieldElement)({
        name: "defaultSubscription",
        type: "any",
        default: { type: "properties", properties: {} },
        conformance: "O",
        quality: "N"
      }),
      (0, import_model.FieldElement)({
        name: "isDisabled",
        type: "bool",
        quality: "N",
        default: false
      }),
      (0, import_model.FieldElement)({
        name: "autoSubscribe",
        type: "bool",
        quality: "N",
        default: false
      }),
      (0, import_model.FieldElement)({
        name: "maxEventNumber",
        type: "event-no",
        quality: "N",
        default: (0, import_types.EventNumber)(0)
      }),
      (0, import_model.FieldElement)({
        name: "caseAuthenticatedTags",
        type: "list",
        quality: "N",
        conformance: "O",
        children: [
          (0, import_model.FieldElement)({
            name: "entry",
            type: "uint32"
          })
        ]
      })
    ]
  });
}
((NetworkClient2) => {
  class Internal extends import_NetworkBehavior.NetworkBehavior.Internal {
    /**
     * The active default subscription.
     */
    activeSubscription;
  }
  NetworkClient2.Internal = Internal;
  class State extends import_NetworkBehavior.NetworkBehavior.State {
    /**
     * This subscription defines the default set of attributes and events to which the node will automatically
     * subscribe when started, if autoSubscribe is true. Alternatively, also just Subscribe.Options can be provided
     * to adjust chosen default subscription parameters (see below).
     *
     * The default subscription is a wildcard for all attributes of the node.  You can set to undefined or filter
     * the fields and values but only values selected by this subscription will update automatically.
     *
     * The default subscription updates automatically if you change this property.
     */
    defaultSubscription;
    /**
     * Represents the current operational network state of the node. When true the node is enabled and operational.
     * When false the node is disabled and not operational.
     *
     * This state can be changed at any time to enable or disable the node.
     */
    isDisabled = false;
    /**
     * If true, automatically subscribe to the provided default subscription (or all attributes and events) when
     * the node is started. If false, do not automatically subscribe.
     *
     * The subscription will activate or deactivate automatically if you change this property.
     *
     * Newly commissioned nodes default to true.
     */
    autoSubscribe = false;
    /**
     * Case Authenticated Tags (CATs) to use for operational CASE sessions with this node.
     *
     * CATs provide additional authentication context for Matter operational sessions. They are only used
     * for operational CASE connections after commissioning is complete, not during the initial PASE
     * commissioning process.
     */
    caseAuthenticatedTags;
    /**
     * The highest event number seen from this node for the default read/subscription.
     */
    maxEventNumber = (0, import_types.EventNumber)(0);
  }
  NetworkClient2.State = State;
  class Events extends import_NetworkBehavior.NetworkBehavior.Events {
    autoSubscribe$Changed = new import_general.Observable();
    defaultSubscription$Changed = new import_general.Observable();
    subscriptionStatusChanged = new import_general.Observable();
    subscriptionAlive = new import_general.Observable();
  }
  NetworkClient2.Events = Events;
})(NetworkClient || (NetworkClient = {}));
//# sourceMappingURL=NetworkClient.js.map

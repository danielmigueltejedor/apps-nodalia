/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RemoteDescriptor } from "#behavior/system/commissioning/RemoteDescriptor.js";
import { BasicInformationClient } from "#behaviors/basic-information";
import { Observable, ServerAddress } from "#general";
import { DatatypeModel, FieldElement } from "#model";
import { Node } from "#node/Node.js";
import { PeerSet, Subscribe, SustainedSubscription } from "#protocol";
import { EventNumber } from "#types";
import { NetworkBehavior } from "./NetworkBehavior.js";
class NetworkClient extends NetworkBehavior {
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
      const peerSet = this.env.get(PeerSet);
      if (!peerSet.has(peerAddress)) {
        const udpAddresses = this.#node.state.commissioning.addresses?.filter((a) => a.type === "udp") ?? [];
        if (udpAddresses.length) {
          const latestUdpAddress = ServerAddress(udpAddresses[udpAddresses.length - 1]);
          await peerSet.addKnownPeer(
            peerAddress,
            latestUdpAddress,
            RemoteDescriptor.fromLongForm(this.#node.state.commissioning)
          );
        }
      }
      if (!this.#node.lifecycle.isCommissioned) {
        const capabilityMinima = this.#node.maybeStateOf(BasicInformationClient)?.capabilityMinima;
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
      const subscribe = Subscribe({
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
          if (!(this.internal.activeSubscription instanceof SustainedSubscription)) {
            this.events.subscriptionStatusChanged.emit(false);
          }
          this.internal.activeSubscription = void 0;
        }
      });
      if (this.internal.activeSubscription instanceof SustainedSubscription) {
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
    return activeSubscription instanceof SustainedSubscription ? activeSubscription.active.value : true;
  }
  async [Symbol.asyncDispose]() {
    this.internal.activeSubscription?.close();
    this.internal.activeSubscription = void 0;
  }
  get #node() {
    return this.env.get(Node);
  }
  /**
   * Define logical schema for fields that should persist.
   */
  static schema = new DatatypeModel({
    name: "NetworkState",
    type: "struct",
    children: [
      FieldElement({
        name: "defaultSubscription",
        type: "any",
        default: { type: "properties", properties: {} },
        conformance: "O",
        quality: "N"
      }),
      FieldElement({
        name: "isDisabled",
        type: "bool",
        quality: "N",
        default: false
      }),
      FieldElement({
        name: "autoSubscribe",
        type: "bool",
        quality: "N",
        default: false
      }),
      FieldElement({
        name: "maxEventNumber",
        type: "event-no",
        quality: "N",
        default: EventNumber(0)
      }),
      FieldElement({
        name: "caseAuthenticatedTags",
        type: "list",
        quality: "N",
        conformance: "O",
        children: [
          FieldElement({
            name: "entry",
            type: "uint32"
          })
        ]
      })
    ]
  });
}
((NetworkClient2) => {
  class Internal extends NetworkBehavior.Internal {
    /**
     * The active default subscription.
     */
    activeSubscription;
  }
  NetworkClient2.Internal = Internal;
  class State extends NetworkBehavior.State {
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
    maxEventNumber = EventNumber(0);
  }
  NetworkClient2.State = State;
  class Events extends NetworkBehavior.Events {
    autoSubscribe$Changed = new Observable();
    defaultSubscription$Changed = new Observable();
    subscriptionStatusChanged = new Observable();
    subscriptionAlive = new Observable();
  }
  NetworkClient2.Events = Events;
})(NetworkClient || (NetworkClient = {}));
export {
  NetworkClient
};
//# sourceMappingURL=NetworkClient.js.map

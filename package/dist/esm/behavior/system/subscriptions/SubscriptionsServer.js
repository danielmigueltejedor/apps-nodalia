/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { deepCopy, isIpNetworkChannel, Logger, MatterError, Seconds } from "#general";
import { DatatypeModel, FieldElement } from "#model";
import { InteractionServer } from "#node/server/InteractionServer.js";
import { ServerSubscription } from "#node/server/ServerSubscription.js";
import { NodeDiscoveryType, PeerAddress, PeerAddressSet, PeerSet, SessionManager, Subscription } from "#protocol";
import { StatusCode, StatusResponseError } from "#types";
import { Behavior } from "../../Behavior.js";
import { SessionsBehavior } from "../sessions/SessionsBehavior.js";
const logger = Logger.get("SubscriptionsBehavior");
const REESTABLISH_SUBSCRIPTIONS_TIMEOUT = Seconds(2);
class SubscriptionsBehavior extends Behavior {
  static id = "subscriptions";
  initialize() {
    if (this.state.subscriptions !== void 0 && this.state.persistenceEnabled !== false) {
      this.internal.formerSubscriptions = deepCopy(this.state.subscriptions);
    }
    this.state.subscriptions = [];
    const sessions = this.agent.get(SessionsBehavior);
    this.reactTo(sessions.events.subscriptionAdded, this.#addSubscription, { lock: true });
  }
  static schema = new DatatypeModel(
    {
      name: "SubscriptionState",
      type: "struct"
    },
    FieldElement(
      {
        name: "subscriptions",
        type: "list",
        quality: "N",
        conformance: "M",
        default: []
      },
      FieldElement(
        {
          name: "entry",
          type: "struct"
        },
        FieldElement({ name: "subscriptionId", type: "uint32" }),
        FieldElement(
          {
            name: "peerAddress",
            type: "struct"
          },
          FieldElement({ name: "fabricIndex", type: "fabric-id" }),
          FieldElement({ name: "nodeId", type: "node-id" })
        ),
        FieldElement(
          {
            name: "attributeRequests",
            type: "list"
          },
          FieldElement(
            {
              name: "entry",
              type: "struct"
            },
            FieldElement({ name: "enableTagCompression", type: "bool", conformance: "O" }),
            FieldElement({ name: "nodeId", type: "node-id", conformance: "O" }),
            FieldElement({ name: "endpointId", type: "endpoint-no", conformance: "O" }),
            FieldElement({ name: "clusterId", type: "cluster-id", conformance: "O" }),
            FieldElement({ name: "attributeId", type: "attrib-id", conformance: "O" }),
            FieldElement({ name: "listIndex", type: "uint16", conformance: "O" }),
            FieldElement({
              name: "wildcardPathFlags",
              type: "WildcardPathFlagsBitmap",
              conformance: "O"
            })
          )
        ),
        FieldElement(
          {
            name: "eventRequests",
            type: "list"
          },
          FieldElement(
            {
              name: "entry",
              type: "struct"
            },
            FieldElement({ name: "nodeId", type: "node-id", quality: "O" }),
            FieldElement({ name: "endpointId", type: "endpoint-no", quality: "O" }),
            FieldElement({ name: "clusterId", type: "cluster-id", quality: "O" }),
            FieldElement({ name: "eventId", type: "event-id", quality: "O" }),
            FieldElement({ name: "isUrgent", type: "bool", quality: "O" })
          )
        ),
        FieldElement({ name: "isFabricFiltered", type: "bool" }),
        FieldElement({ name: "maxIntervalCeiling", type: "duration" }),
        FieldElement({ name: "minIntervalFloor", type: "duration" }),
        FieldElement({ name: "maxInterval", type: "duration" }),
        FieldElement({ name: "sendInterval", type: "duration" }),
        FieldElement(
          {
            name: "operationalAddress",
            type: "struct",
            conformance: "O"
          },
          FieldElement({ name: "type", type: "string" }),
          FieldElement({ name: "ip", type: "string" }),
          FieldElement({ name: "port", type: "uint16" })
        )
      )
    )
  );
  #addSubscription(subscription) {
    if (this.state.persistenceEnabled === false || !(subscription instanceof ServerSubscription)) return;
    const {
      request: { attributeRequests, eventRequests, isFabricFiltered },
      session,
      maxInterval,
      sendInterval,
      subscriptionId: id,
      maxIntervalCeiling,
      minIntervalFloor
    } = subscription;
    const { peerAddress } = session;
    const { fabricIndex, nodeId } = peerAddress;
    const operationalAddress = !session.isClosed && isIpNetworkChannel(session.channel) ? session.channel.networkAddress : void 0;
    const peerSubscription = {
      subscriptionId: id,
      peerAddress: { fabricIndex, nodeId },
      maxIntervalCeiling,
      minIntervalFloor,
      attributeRequests,
      eventRequests,
      isFabricFiltered,
      maxInterval,
      sendInterval,
      operationalAddress
    };
    this.reactTo(subscription.cancelled, this.#subscriptionCancelled);
    const existingIndex = this.state.subscriptions.findIndex(({ subscriptionId }) => id === subscriptionId);
    if (existingIndex !== -1) {
      this.state.subscriptions[existingIndex] = peerSubscription;
      return;
    }
    this.state.subscriptions.push(peerSubscription);
  }
  #subscriptionCancelled(subscription) {
    if (subscription.isCanceledByPeer && this.state.persistenceEnabled !== false) {
      const { subscriptionId: id } = subscription;
      const subscriptionIndex = this.state.subscriptions.findIndex(({ subscriptionId }) => id === subscriptionId);
      if (subscriptionIndex !== -1) {
        return this.#removeSubscriptionIndex(subscriptionIndex);
      }
    }
  }
  async #removeSubscriptionIndex(index) {
    await this.context.transaction.addResources(this);
    await this.context.transaction.begin();
    this.state.subscriptions.splice(index, 1);
    await this.context.transaction.commit();
  }
  async reestablishFormerSubscriptions() {
    if (this.state.persistenceEnabled === false) return;
    const { formerSubscriptions } = this.internal;
    if (!formerSubscriptions.length) {
      logger.debug("No former subscriptions to re-establish");
      return;
    } else {
      this.internal.formerSubscriptions = [];
      await this.context.transaction.commit();
    }
    const peers = this.env.get(PeerSet);
    const sessions = this.env.get(SessionManager);
    const interactionServer = this.env.get(InteractionServer);
    const peerStopList = new PeerAddressSet();
    const blockHandler = (peerAddress) => void peerStopList.add(peerAddress);
    interactionServer.subscriptionEstablishmentStarted.on(blockHandler);
    const successfullReEstablishments = Array();
    for (const subscription of formerSubscriptions) {
      const { peerAddress: peerAddressDetails, operationalAddress, subscriptionId } = subscription;
      const peerAddress = PeerAddress(peerAddressDetails);
      if (peerStopList.has(peerAddress)) {
        logger.debug(`Skip reestablishing former subscription to ${peerAddress}`);
        continue;
      }
      logger.debug(
        `Try to reestablish former subscription ${Subscription.idStrOf(subscription)} to ${peerAddress}`
      );
      if (sessions.maybeSessionFor(peerAddress) !== void 0) {
        logger.debug(`We already have and existing session for peer ${peerAddress}`);
      } else {
        try {
          await peers.connect(peerAddress, {
            discoveryOptions: {
              discoveryType: NodeDiscoveryType.TimedDiscovery,
              timeout: REESTABLISH_SUBSCRIPTIONS_TIMEOUT
            },
            operationalAddress
          });
        } catch (error) {
          peerStopList.add(peerAddress);
          logger.debug(
            `Failed to connect to ${peerAddress}`,
            error instanceof MatterError ? error.message : error
          );
          continue;
        }
      }
      try {
        if (peerStopList.has(peerAddress)) {
          logger.debug(
            `Skip re-establishing former subscription ${Subscription.idStrOf(subscriptionId)} to ${peerAddress}`
          );
          continue;
        }
        const session = sessions.maybeSessionFor(peerAddress);
        if (session === void 0) {
          peerStopList.add(peerAddress);
          logger.debug(`Could not connect to peer ${peerAddress}`);
          continue;
        }
        await interactionServer.establishFormerSubscription(subscription, session);
      } catch (error) {
        logger.debug(
          `Failed to re-establish former subscription ${Subscription.idStrOf(subscriptionId)} to ${peerAddress}`,
          StatusResponseError.is(error) ? error.code === StatusCode.InvalidSubscription ? "Subscription no langer valid for peer" : error.message : error
        );
        continue;
      }
      successfullReEstablishments.push(subscriptionId);
    }
    interactionServer.subscriptionEstablishmentStarted.off(blockHandler);
    logger.info(
      `Reestablished ${successfullReEstablishments.length}${successfullReEstablishments.length ? ` (${successfullReEstablishments.join(",")})` : ""} of ${formerSubscriptions.length} former subscriptions successfully`
    );
  }
}
((SubscriptionsBehavior2) => {
  class State {
    /** Set to false if persistence of subscriptions should be disabled */
    persistenceEnabled = true;
    /**
     * List of subscriptions. This list is collected automatically.
     * The state value should not be initialized by the developer.
     */
    subscriptions = [];
  }
  SubscriptionsBehavior2.State = State;
  class Internal {
    /**
     * Subscriptions that were established on the former device run. On initialization this will be initialized
     * with the persisted subscriptions and then used to re-establish the subscriptions.
     */
    formerSubscriptions = Array();
  }
  SubscriptionsBehavior2.Internal = Internal;
})(SubscriptionsBehavior || (SubscriptionsBehavior = {}));
export {
  SubscriptionsBehavior
};
//# sourceMappingURL=SubscriptionsServer.js.map

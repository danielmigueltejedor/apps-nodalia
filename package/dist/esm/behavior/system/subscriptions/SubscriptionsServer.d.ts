/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { DatatypeModel } from "#model";
import { PeerSubscription } from "#node/server/InteractionServer.js";
import { Behavior } from "../../Behavior.js";
/**
 * Subscriptions Persistence handling.
 *
 * This behavior collects and stores active subscriptions to allow re-activating them on restart in order to try to
 * speed up the controller reconnection process. This can mean a bit more memory usage on start of the device. To
 * disable this feature set `persistenceEnabled` as state of the `subscription` behavior to `false`.
 */
export declare class SubscriptionsBehavior extends Behavior {
    #private;
    static readonly id = "subscriptions";
    state: SubscriptionsBehavior.State;
    internal: SubscriptionsBehavior.Internal;
    initialize(): void;
    static readonly schema: DatatypeModel;
    reestablishFormerSubscriptions(): Promise<void>;
}
export declare namespace SubscriptionsBehavior {
    class State {
        /** Set to false if persistence of subscriptions should be disabled */
        persistenceEnabled: boolean;
        /**
         * List of subscriptions. This list is collected automatically.
         * The state value should not be initialized by the developer.
         */
        subscriptions: PeerSubscription[];
    }
    class Internal {
        /**
         * Subscriptions that were established on the former device run. On initialization this will be initialized
         * with the persisted subscriptions and then used to re-establish the subscriptions.
         */
        formerSubscriptions: PeerSubscription[];
    }
}
//# sourceMappingURL=SubscriptionsServer.d.ts.map
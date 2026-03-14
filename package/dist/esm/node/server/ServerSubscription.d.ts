/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RemoteActorContext } from "#behavior/context/server/RemoteActorContext.js";
import { AsyncObservable, Duration } from "#general";
import type { ServerNode } from "#node/ServerNode.js";
import type { MessageExchange, NodeSession, Session } from "#protocol";
import { InteractionServerMessenger, PeerAddress, Subscription } from "#protocol";
import { AttributeId, ClusterId, EndpointNumber, SubscribeRequest } from "#types";
export declare const MAX_INTERVAL_PUBLISHER_LIMIT: Duration;
export declare const INTERNAL_INTERVAL_PUBLISHER_LIMIT: Duration;
export declare const MIN_INTERVAL: Duration;
export declare const DEFAULT_RANDOMIZATION_WINDOW: Duration;
/**
 * Server options that control subscription handling.
 */
export interface ServerSubscriptionConfig {
    /**
     * Optional maximum subscription interval to use for sending subscription reports. It will be used if not too
     * low and inside the range requested by the connected controller.
     */
    maxInterval: Duration;
    /**
     * Optional minimum subscription interval to use for sending subscription reports. It will be used when other
     * calculated values are smaller than it. Use this to make sure your device hardware can handle the load and to
     * set limits.
     */
    minInterval: Duration;
    /**
     * Optional subscription randomization window to use for sending subscription reports. This specifies a window
     * in seconds from which a random part is added to the calculated maximum interval to make sure that devices
     * that get powered on in parallel not all send at the same timepoint.
     */
    randomizationWindow: Duration;
}
export declare namespace ServerSubscriptionConfig {
    /**
     * Validate options and set defaults.
     *
     * @returns the resulting options
     */
    function of(options?: Partial<ServerSubscriptionConfig>): {
        maxInterval: Duration;
        minInterval: Duration;
        randomizationWindow: Duration;
    };
}
/**
 * Interface between {@link ServerSubscription} and the local Matter environment.
 */
export interface ServerSubscriptionContext {
    session: NodeSession;
    node: ServerNode;
    initiateExchange(addressOrSession: PeerAddress | Session, protocolId: number): MessageExchange;
}
/**
 * Implements the server side of a single subscription.
 */
export declare class ServerSubscription implements Subscription {
    #private;
    constructor(options: {
        id: number;
        context: ServerSubscriptionContext;
        request: Omit<SubscribeRequest, "interactionModelRevision" | "keepSubscriptions">;
        subscriptionOptions: ServerSubscriptionConfig;
        useAsMaxInterval?: Duration;
        useAsSendInterval?: Duration;
    });
    get subscriptionId(): number;
    get idStr(): string;
    get session(): NodeSession;
    get isCanceledByPeer(): boolean;
    get request(): Omit<import("#types").TypeFromFields<{
        keepSubscriptions: import("#types").FieldType<boolean>;
        minIntervalFloorSeconds: import("#types").FieldType<number>;
        maxIntervalCeilingSeconds: import("#types").FieldType<number>;
        attributeRequests: import("#types").OptionalFieldType<import("#types").TypeFromFields<{
            enableTagCompression: import("#types").OptionalFieldType<boolean>;
            nodeId: import("#types").OptionalFieldType<import("#types").NodeId>;
            endpointId: import("#types").OptionalFieldType<import("#types").EndpointNumber>;
            clusterId: import("#types").OptionalFieldType<import("#types").ClusterId>;
            attributeId: import("#types").OptionalFieldType<import("#types").AttributeId>;
            listIndex: import("#types").OptionalFieldType<number | null>;
            wildcardPathFlags: import("#types").OptionalFieldType<import("#types").TypeFromPartialBitSchema<{
                skipRootNode: import("#types").BitFlag;
                skipGlobalAttributes: import("#types").BitFlag;
                skipAttributeList: import("#types").BitFlag;
                reserved1: import("#types").BitFlag;
                skipCommandLists: import("#types").BitFlag;
                skipCustomElements: import("#types").BitFlag;
                skipFixedAttributes: import("#types").BitFlag;
                skipChangesOmittedAttributes: import("#types").BitFlag;
                skipDiagnosticsClusters: import("#types").BitFlag;
            }>>;
        }>[]>;
        eventRequests: import("#types").OptionalFieldType<import("#types").TypeFromFields<{
            nodeId: import("#types").OptionalFieldType<import("#types").NodeId>;
            endpointId: import("#types").OptionalFieldType<import("#types").EndpointNumber>;
            clusterId: import("#types").OptionalFieldType<import("#types").ClusterId>;
            eventId: import("#types").OptionalFieldType<import("#types").EventId>;
            isUrgent: import("#types").OptionalFieldType<boolean>;
        }>[]>;
        eventFilters: import("#types").OptionalFieldType<import("#types").TypeFromFields<{
            nodeId: import("#types").OptionalFieldType<import("#types").NodeId>;
            eventMin: import("#types").FieldType<number | bigint>;
        }>[]>;
        isFabricFiltered: import("#types").FieldType<boolean>;
        dataVersionFilters: import("#types").OptionalFieldType<import("#types").TypeFromFields<{
            path: import("#types").FieldType<import("#types").TypeFromFields<{
                nodeId: import("#types").OptionalFieldType<import("#types").NodeId>;
                endpointId: import("#types").FieldType<import("#types").EndpointNumber>;
                clusterId: import("#types").FieldType<import("#types").ClusterId>;
            }>>;
            dataVersion: import("#types").FieldType<number>;
        }>[]>;
        interactionModelRevision: import("#types").FieldType<number>;
    }>, "interactionModelRevision" | "keepSubscriptions">;
    get cancelled(): AsyncObservable<[subscription: Subscription], void>;
    get maxInterval(): Duration;
    get sendInterval(): Duration;
    get minIntervalFloor(): Duration;
    get maxIntervalCeiling(): Duration;
    set maxInterval(value: Duration);
    handlePeerCancel(): Promise<void>;
    activate(): void;
    sendInitialReport(messenger: InteractionServerMessenger, readContext: RemoteActorContext.Options, suppressStatusReports?: boolean): Promise<void>;
    /**
     * Closes the subscription and flushes all outstanding data updates if requested.
     */
    close(flushViaSession?: Session): Promise<void>;
}
//# sourceMappingURL=ServerSubscription.d.ts.map
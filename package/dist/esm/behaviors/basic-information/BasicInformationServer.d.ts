/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { BasicInformation } from "#clusters/basic-information";
import { Schema } from "#model";
import { VendorId } from "#types";
declare const Base: import("../../index.js").ClusterBehavior.Type<import("#types").ClusterTypeModifier.WithAlterations<BasicInformation.Cluster, import("#types").ClusterTypeModifier.ElementFlagAlterations<{
    readonly events: {
        readonly startUp: true;
        readonly shutDown: true;
        readonly leave: true;
    };
}>>, import("./BasicInformationBehavior.js").BasicInformationBehaviorConstructor, {
    components: never[];
}>;
/**
 * This is the default server implementation of BasicInformationBehavior.
 */
export declare class BasicInformationServer extends Base {
    #private;
    initialize(): void;
    static readonly schema: import("#model").ClusterModel;
    static enableUniqueIdPersistence(schema: Schema.Cluster): Schema.Cluster;
    static createUniqueId(): string;
}
export declare namespace BasicInformationServer {
    interface ProductDescription {
        /**
         * The device name for commissioning announcements.
         */
        readonly name: string;
        /**
         * The device type for commissioning announcements.
         */
        readonly deviceType: number;
        /**
         * The vendor ID for commissioning announcements.
         */
        readonly vendorId: VendorId;
        /**
         * The product ID for commissioning announcements.
         */
        readonly productId: number;
    }
}
export {};
//# sourceMappingURL=BasicInformationServer.d.ts.map
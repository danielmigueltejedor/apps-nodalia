/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Schema } from "#model";
import { ClusterType } from "#types";
import { Behavior } from "../Behavior.js";
import type { ClusterBehavior } from "./ClusterBehavior.js";
/**
 * Generates a {@link ClusterBehavior.Type}.
 *
 * This factory performs runtime class generation of behaviors associated with a Matter cluster.  It implements
 * ClusterBehavior.for() directly and is a core component of PeerBehavior().
 */
export declare function ClusterBehaviorType<const C extends ClusterType>({ cluster, base, schema, name, forClient, commandFactory, }: ClusterBehaviorType.Configuration<C>): ClusterBehavior.Type<any, Behavior.Type, import("./ClusterInterface.js").ClusterInterface<{}>>;
export declare namespace ClusterBehaviorType {
    interface Configuration<C extends ClusterType> {
        /**
         * The ClusterType for the new behavior.
         */
        cluster: C;
        /**
         * The behavior to extend.
         */
        base: Behavior.Type;
        /**
         * The schema for the new behavior.
         *
         * If omitted uses the schema from the standard Matter data model.
         */
        schema?: Schema.Cluster;
        /**
         * Name used for the generated class.
         *
         * If omitted derives name from the schema.
         */
        name?: string;
        /**
         * Modify generation for client instrumentation.
         *
         * This affects a few things like how quieter events generate.
         */
        forClient?: boolean;
        /**
         * Factory for command implementations.
         *
         * By default, commands install as {@link Behavior.unimplemented}.  In client scenarios this allows the caller to
         * provide a useful default implementation.
         */
        commandFactory?: CommandFactory;
    }
    interface CommandFactory {
        (name: string): (this: ClusterBehavior, fields?: {}) => unknown;
    }
}
//# sourceMappingURL=ClusterBehaviorType.d.ts.map
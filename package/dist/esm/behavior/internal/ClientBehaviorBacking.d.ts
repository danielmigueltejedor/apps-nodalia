/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { SupportedElements } from "#endpoint/properties/Behaviors.js";
import { MaybePromise } from "#general";
import { BehaviorBacking } from "./BehaviorBacking.js";
/**
 * This class backs the client implementation of a behavior.
 */
export declare class ClientBehaviorBacking extends BehaviorBacking {
    #private;
    get elements(): SupportedElements | undefined;
    protected get datasourceOptions(): import("../state/managed/Datasource.js").Datasource.Options<import("../index.js").StateType>;
    close(): MaybePromise;
}
//# sourceMappingURL=ClientBehaviorBacking.d.ts.map
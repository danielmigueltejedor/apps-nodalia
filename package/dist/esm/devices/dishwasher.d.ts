/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
/*** THIS FILE IS GENERATED, DO NOT EDIT ***/
import { OperationalStateServer as BaseOperationalStateServer } from "../behaviors/operational-state/OperationalStateServer.js";
import { IdentifyServer as BaseIdentifyServer } from "../behaviors/identify/IdentifyServer.js";
import { OnOffServer as BaseOnOffServer } from "../behaviors/on-off/OnOffServer.js";
import { TemperatureControlServer as BaseTemperatureControlServer } from "../behaviors/temperature-control/TemperatureControlServer.js";
import { DishwasherModeServer as BaseDishwasherModeServer } from "../behaviors/dishwasher-mode/DishwasherModeServer.js";
import { DishwasherAlarmServer as BaseDishwasherAlarmServer } from "../behaviors/dishwasher-alarm/DishwasherAlarmServer.js";
import { MutableEndpoint } from "../endpoint/type/MutableEndpoint.js";
import { Identity } from "#general";
/**
 * A dishwasher is a device that is generally installed in residential homes and is capable of washing dishes, cutlery,
 * and other items associate with food preparation and consumption. The device can be permanently installed or portable
 * and can have variety of filling and draining methods.
 *
 * @see {@link MatterSpecification.v142.Device} § 13.5
 */
export interface DishwasherDevice extends Identity<typeof DishwasherDeviceDefinition> {
}
export declare namespace DishwasherRequirements {
    /**
     * The OperationalState cluster is required by the Matter specification.
     *
     * This version of {@link OperationalStateServer} is specialized per the specification.
     */
    const OperationalStateServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/operational-state").OperationalState.Cluster, {
        readonly events: {
            readonly operationCompletion: {
                readonly optional: false;
            };
        };
    }>, typeof BaseOperationalStateServer, import("../behaviors/index.js").OperationalStateInterface>;
    /**
     * The Identify cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link IdentifyServer} for convenience.
     */
    const IdentifyServer: typeof BaseIdentifyServer;
    /**
     * The OnOff cluster is optional per the Matter specification.
     *
     * This version of {@link OnOffServer} is specialized per the specification.
     */
    const OnOffServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["DeadFrontBehavior"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
    /**
     * The TemperatureControl cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link TemperatureControlServer} for convenience.
     */
    const TemperatureControlServer: typeof BaseTemperatureControlServer;
    /**
     * The DishwasherMode cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link DishwasherModeServer} for convenience.
     */
    const DishwasherModeServer: typeof BaseDishwasherModeServer;
    /**
     * The DishwasherAlarm cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link DishwasherAlarmServer} for convenience.
     */
    const DishwasherAlarmServer: typeof BaseDishwasherAlarmServer;
    /**
     * An implementation for each server cluster supported by the endpoint per the Matter specification.
     */
    const server: {
        mandatory: {
            OperationalState: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/operational-state").OperationalState.Cluster, {
                readonly events: {
                    readonly operationCompletion: {
                        readonly optional: false;
                    };
                };
            }>, typeof BaseOperationalStateServer, import("../behaviors/index.js").OperationalStateInterface>;
        };
        optional: {
            Identify: typeof BaseIdentifyServer;
            OnOff: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["DeadFrontBehavior"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
            TemperatureControl: typeof BaseTemperatureControlServer;
            DishwasherMode: typeof BaseDishwasherModeServer;
            DishwasherAlarm: typeof BaseDishwasherAlarmServer;
        };
    };
}
export declare const DishwasherDeviceDefinition: MutableEndpoint.With<import("../index.js").EndpointType.For<{
    readonly name: "Dishwasher";
    readonly deviceType: 117;
    readonly deviceRevision: 2;
    readonly requirements: typeof DishwasherRequirements;
    readonly behaviors: {
        readonly operationalState: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/operational-state").OperationalState.Cluster, {
            readonly events: {
                readonly operationCompletion: {
                    readonly optional: false;
                };
            };
        }>, typeof BaseOperationalStateServer, import("../behaviors/index.js").OperationalStateInterface>;
    };
}>, {
    readonly operationalState: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/operational-state").OperationalState.Cluster, {
        readonly events: {
            readonly operationCompletion: {
                readonly optional: false;
            };
        };
    }>, typeof BaseOperationalStateServer, import("../behaviors/index.js").OperationalStateInterface>;
}>;
export declare const DishwasherDevice: DishwasherDevice;
//# sourceMappingURL=dishwasher.d.ts.map
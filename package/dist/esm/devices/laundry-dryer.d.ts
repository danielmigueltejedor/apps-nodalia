/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
/*** THIS FILE IS GENERATED, DO NOT EDIT ***/
import { OperationalStateServer as BaseOperationalStateServer } from "../behaviors/operational-state/OperationalStateServer.js";
import { IdentifyServer as BaseIdentifyServer } from "../behaviors/identify/IdentifyServer.js";
import { LaundryWasherModeServer as BaseLaundryWasherModeServer } from "../behaviors/laundry-washer-mode/LaundryWasherModeServer.js";
import { OnOffServer as BaseOnOffServer } from "../behaviors/on-off/OnOffServer.js";
import { LaundryDryerControlsServer as BaseLaundryDryerControlsServer } from "../behaviors/laundry-dryer-controls/LaundryDryerControlsServer.js";
import { TemperatureControlServer as BaseTemperatureControlServer } from "../behaviors/temperature-control/TemperatureControlServer.js";
import { MutableEndpoint } from "../endpoint/type/MutableEndpoint.js";
import { Identity } from "#general";
/**
 * A Laundry Dryer represents a device that is capable of drying laundry items.
 *
 * @see {@link MatterSpecification.v142.Device} § 13.6
 */
export interface LaundryDryerDevice extends Identity<typeof LaundryDryerDeviceDefinition> {
}
export declare namespace LaundryDryerRequirements {
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
     * The LaundryWasherMode cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link LaundryWasherModeServer} for convenience.
     */
    const LaundryWasherModeServer: typeof BaseLaundryWasherModeServer;
    /**
     * The OnOff cluster is optional per the Matter specification.
     *
     * This version of {@link OnOffServer} is specialized per the specification.
     */
    const OnOffServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["DeadFrontBehavior"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
    /**
     * The LaundryDryerControls cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link LaundryDryerControlsServer} for convenience.
     */
    const LaundryDryerControlsServer: typeof BaseLaundryDryerControlsServer;
    /**
     * The TemperatureControl cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link TemperatureControlServer} for convenience.
     */
    const TemperatureControlServer: typeof BaseTemperatureControlServer;
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
            LaundryWasherMode: typeof BaseLaundryWasherModeServer;
            OnOff: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["DeadFrontBehavior"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
            LaundryDryerControls: typeof BaseLaundryDryerControlsServer;
            TemperatureControl: typeof BaseTemperatureControlServer;
        };
    };
}
export declare const LaundryDryerDeviceDefinition: MutableEndpoint.With<import("../index.js").EndpointType.For<{
    readonly name: "LaundryDryer";
    readonly deviceType: 124;
    readonly deviceRevision: 2;
    readonly requirements: typeof LaundryDryerRequirements;
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
export declare const LaundryDryerDevice: LaundryDryerDevice;
//# sourceMappingURL=laundry-dryer.d.ts.map
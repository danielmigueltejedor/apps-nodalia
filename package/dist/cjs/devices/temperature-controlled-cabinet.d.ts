/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
/*** THIS FILE IS GENERATED, DO NOT EDIT ***/
import { TemperatureControlServer as BaseTemperatureControlServer } from "../behaviors/temperature-control/TemperatureControlServer.js";
import { TemperatureMeasurementServer as BaseTemperatureMeasurementServer } from "../behaviors/temperature-measurement/TemperatureMeasurementServer.js";
import { RefrigeratorAndTemperatureControlledCabinetModeServer as BaseRefrigeratorAndTemperatureControlledCabinetModeServer } from "../behaviors/refrigerator-and-temperature-controlled-cabinet-mode/RefrigeratorAndTemperatureControlledCabinetModeServer.js";
import { OvenModeServer as BaseOvenModeServer } from "../behaviors/oven-mode/OvenModeServer.js";
import { OvenCavityOperationalStateServer as BaseOvenCavityOperationalStateServer } from "../behaviors/oven-cavity-operational-state/OvenCavityOperationalStateServer.js";
import { MutableEndpoint } from "../endpoint/type/MutableEndpoint.js";
import { Identity } from "#general";
/**
 * A Temperature Controlled Cabinet only exists composed as part of another device type. It represents a single cabinet
 * that is capable of having its temperature controlled. Such a cabinet may be chilling or freezing food, for example as
 * part of a refrigerator, freezer, wine chiller, or other similar device. Equally, such a cabinet may be warming or
 * heating food, for example as part of an oven, range, or similar device.
 *
 * TemperatureControlledCabinetDevice requires TemperatureControl cluster but TemperatureControl is not added by default
 * because you must select the features your device supports. You can add manually using
 * TemperatureControlledCabinetDevice.with().
 *
 * @see {@link MatterSpecification.v142.Device} § 13.4
 */
export interface TemperatureControlledCabinetDevice extends Identity<typeof TemperatureControlledCabinetDeviceDefinition> {
}
export declare namespace TemperatureControlledCabinetRequirements {
    /**
     * The TemperatureControl cluster is required by the Matter specification.
     *
     * This version of {@link TemperatureControlServer} is specialized per the specification.
     */
    const TemperatureControlServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterType.Of<{
        readonly id: 86;
        readonly name: "TemperatureControl";
        readonly revision: 1;
        readonly features: {
            readonly temperatureNumber: import("@matter/types").BitFlag;
            readonly temperatureLevel: import("@matter/types").BitFlag;
            readonly temperatureStep: import("@matter/types").BitFlag;
        };
        readonly commands: {
            readonly setTemperature: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                targetTemperature: import("@matter/types").OptionalFieldType<number>;
                targetTemperatureLevel: import("@matter/types").OptionalFieldType<number>;
            }>, void, any>;
        };
        readonly extensions: readonly [{
            readonly flags: {
                readonly temperatureNumber: true;
            };
            readonly component: {
                readonly attributes: {
                    readonly temperatureSetpoint: import("@matter/types").Attribute<number, any>;
                    readonly minTemperature: import("@matter/types").FixedAttribute<number, any>;
                    readonly maxTemperature: import("@matter/types").FixedAttribute<number, any>;
                };
            };
        }, {
            readonly flags: {
                readonly temperatureStep: true;
            };
            readonly component: {
                readonly attributes: {
                    readonly step: import("@matter/types").FixedAttribute<number, any>;
                };
            };
        }, {
            readonly flags: {
                readonly temperatureLevel: true;
            };
            readonly component: {
                readonly attributes: {
                    readonly selectedTemperatureLevel: import("@matter/types").Attribute<number, any>;
                    readonly supportedTemperatureLevels: import("@matter/types").Attribute<string[], any>;
                };
            };
        }, {
            readonly flags: {
                readonly temperatureStep: true;
                readonly temperatureNumber: false;
            };
            readonly component: false;
        }, {
            readonly flags: {
                readonly temperatureNumber: true;
                readonly temperatureLevel: true;
            };
            readonly component: false;
        }, {
            readonly flags: {
                readonly temperatureNumber: false;
                readonly temperatureLevel: false;
            };
            readonly component: false;
        }];
    }>, readonly ["TemperatureNumber"]>, typeof BaseTemperatureControlServer, import("../behaviors/index.js").TemperatureControlInterface>;
    /**
     * The TemperatureMeasurement cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link TemperatureMeasurementServer} for convenience.
     */
    const TemperatureMeasurementServer: typeof BaseTemperatureMeasurementServer;
    /**
     * The RefrigeratorAndTemperatureControlledCabinetMode cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link RefrigeratorAndTemperatureControlledCabinetModeServer}
     * for convenience.
     */
    const RefrigeratorAndTemperatureControlledCabinetModeServer: typeof BaseRefrigeratorAndTemperatureControlledCabinetModeServer;
    /**
     * The OvenMode cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link OvenModeServer} for convenience.
     */
    const OvenModeServer: typeof BaseOvenModeServer;
    /**
     * The OvenCavityOperationalState cluster is optional per the Matter specification.
     *
     * This version of {@link OvenCavityOperationalStateServer} is specialized per the specification.
     */
    const OvenCavityOperationalStateServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/oven-cavity-operational-state").OvenCavityOperationalState.Cluster, {
        readonly events: {
            readonly operationCompletion: {
                readonly optional: false;
            };
        };
    }>, typeof BaseOvenCavityOperationalStateServer, import("../behaviors/index.js").OvenCavityOperationalStateInterface>;
    /**
     * An implementation for each server cluster supported by the endpoint per the Matter specification.
     */
    const server: {
        mandatory: {
            TemperatureControl: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterType.Of<{
                readonly id: 86;
                readonly name: "TemperatureControl";
                readonly revision: 1;
                readonly features: {
                    readonly temperatureNumber: import("@matter/types").BitFlag;
                    readonly temperatureLevel: import("@matter/types").BitFlag;
                    readonly temperatureStep: import("@matter/types").BitFlag;
                };
                readonly commands: {
                    readonly setTemperature: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        targetTemperature: import("@matter/types").OptionalFieldType<number>;
                        targetTemperatureLevel: import("@matter/types").OptionalFieldType<number>;
                    }>, void, any>;
                };
                readonly extensions: readonly [{
                    readonly flags: {
                        readonly temperatureNumber: true;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly temperatureSetpoint: import("@matter/types").Attribute<number, any>;
                            readonly minTemperature: import("@matter/types").FixedAttribute<number, any>;
                            readonly maxTemperature: import("@matter/types").FixedAttribute<number, any>;
                        };
                    };
                }, {
                    readonly flags: {
                        readonly temperatureStep: true;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly step: import("@matter/types").FixedAttribute<number, any>;
                        };
                    };
                }, {
                    readonly flags: {
                        readonly temperatureLevel: true;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly selectedTemperatureLevel: import("@matter/types").Attribute<number, any>;
                            readonly supportedTemperatureLevels: import("@matter/types").Attribute<string[], any>;
                        };
                    };
                }, {
                    readonly flags: {
                        readonly temperatureStep: true;
                        readonly temperatureNumber: false;
                    };
                    readonly component: false;
                }, {
                    readonly flags: {
                        readonly temperatureNumber: true;
                        readonly temperatureLevel: true;
                    };
                    readonly component: false;
                }, {
                    readonly flags: {
                        readonly temperatureNumber: false;
                        readonly temperatureLevel: false;
                    };
                    readonly component: false;
                }];
            }>, readonly ["TemperatureNumber"]>, typeof BaseTemperatureControlServer, import("../behaviors/index.js").TemperatureControlInterface>;
        };
        optional: {
            TemperatureMeasurement: typeof BaseTemperatureMeasurementServer;
            RefrigeratorAndTemperatureControlledCabinetMode: typeof BaseRefrigeratorAndTemperatureControlledCabinetModeServer;
            OvenMode: typeof BaseOvenModeServer;
            OvenCavityOperationalState: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/oven-cavity-operational-state").OvenCavityOperationalState.Cluster, {
                readonly events: {
                    readonly operationCompletion: {
                        readonly optional: false;
                    };
                };
            }>, typeof BaseOvenCavityOperationalStateServer, import("../behaviors/index.js").OvenCavityOperationalStateInterface>;
        };
    };
}
export declare const TemperatureControlledCabinetDeviceDefinition: MutableEndpoint.With<import("../index.js").EndpointType.For<{
    readonly name: "TemperatureControlledCabinet";
    readonly deviceType: 113;
    readonly deviceRevision: 5;
    readonly requirements: typeof TemperatureControlledCabinetRequirements;
    readonly behaviors: {};
}>, {}>;
export declare const TemperatureControlledCabinetDevice: TemperatureControlledCabinetDevice;
//# sourceMappingURL=temperature-controlled-cabinet.d.ts.map
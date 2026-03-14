/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
/*** THIS FILE IS GENERATED, DO NOT EDIT ***/
import { TemperatureControlServer as BaseTemperatureControlServer } from "../behaviors/temperature-control/TemperatureControlServer.js";
import { TemperatureMeasurementServer as BaseTemperatureMeasurementServer } from "../behaviors/temperature-measurement/TemperatureMeasurementServer.js";
import { OnOffServer as BaseOnOffServer } from "../behaviors/on-off/OnOffServer.js";
import { MutableEndpoint } from "../endpoint/type/MutableEndpoint.js";
import { Identity } from "#general";
/**
 * A Cook Surface device type represents a heating object on a cooktop or other similar device. It shall only be used
 * when composed as part of another device type.
 *
 * @see {@link MatterSpecification.v142.Device} § 13.7
 */
export interface CookSurfaceDevice extends Identity<typeof CookSurfaceDeviceDefinition> {
}
export declare namespace CookSurfaceRequirements {
    /**
     * The TemperatureControl cluster is optional per the Matter specification.
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
    }>, readonly ["TemperatureLevel"]>, typeof BaseTemperatureControlServer, import("../behaviors/index.js").TemperatureControlInterface>;
    /**
     * The TemperatureMeasurement cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link TemperatureMeasurementServer} for convenience.
     */
    const TemperatureMeasurementServer: typeof BaseTemperatureMeasurementServer;
    /**
     * The OnOff cluster is optional per the Matter specification.
     *
     * This version of {@link OnOffServer} is specialized per the specification.
     */
    const OnOffServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["OffOnly"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
    /**
     * An implementation for each server cluster supported by the endpoint per the Matter specification.
     */
    const server: {
        optional: {
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
            }>, readonly ["TemperatureLevel"]>, typeof BaseTemperatureControlServer, import("../behaviors/index.js").TemperatureControlInterface>;
            TemperatureMeasurement: typeof BaseTemperatureMeasurementServer;
            OnOff: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["OffOnly"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
        };
        mandatory: {};
    };
}
export declare const CookSurfaceDeviceDefinition: MutableEndpoint.With<import("../index.js").EndpointType.For<{
    readonly name: "CookSurface";
    readonly deviceType: 119;
    readonly deviceRevision: 2;
    readonly requirements: typeof CookSurfaceRequirements;
    readonly behaviors: {};
}>, {}>;
export declare const CookSurfaceDevice: CookSurfaceDevice;
//# sourceMappingURL=cook-surface.d.ts.map
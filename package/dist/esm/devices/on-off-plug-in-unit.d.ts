/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
/*** THIS FILE IS GENERATED, DO NOT EDIT ***/
import { IdentifyServer as BaseIdentifyServer } from "../behaviors/identify/IdentifyServer.js";
import { GroupsServer as BaseGroupsServer } from "../behaviors/groups/GroupsServer.js";
import { ScenesManagementServer as BaseScenesManagementServer } from "../behaviors/scenes-management/ScenesManagementServer.js";
import { OnOffServer as BaseOnOffServer } from "../behaviors/on-off/OnOffServer.js";
import { LevelControlServer as BaseLevelControlServer } from "../behaviors/level-control/LevelControlServer.js";
import { MutableEndpoint } from "../endpoint/type/MutableEndpoint.js";
import { Identity } from "#general";
/**
 * An On/Off Plug-in Unit is a device that provides power to another device that is plugged into it, and is capable of
 * switching that provided power on or off.
 *
 * The Mounted On/Off Control (added in Matter 1.4) has identical cluster requirements as the On/Off Plug-In Unit, and
 * is marked as superset of this device type (since Matter 1.4.2). For devices intended to be mounted permanently, the
 * Mounted On/Off Control device type shall be used, with the On/Off Plug-In Unit device type optionally added in the
 * DeviceTypeList of the Descriptor cluster in addition to the On/Off Plug-In Unit device type (see
 * [ref_MountedOnOffControlServerGuidance]).
 *
 * Before Matter 1.4, mounted units typically used the On/Off Plug-In Unit device type. Clients can encounter devices
 * which were made before or after these specification updates. Therefore, clients SHOULD use the following heuristic to
 * distinguish the type of physical device based on the device type revision found on an endpoint ("--" means the device
 * type is not listed).
 *
 * @see {@link MatterSpecification.v142.Device} § 5.1
 */
export interface OnOffPlugInUnitDevice extends Identity<typeof OnOffPlugInUnitDeviceDefinition> {
}
export declare namespace OnOffPlugInUnitRequirements {
    /**
     * The Identify cluster is required by the Matter specification.
     *
     * This version of {@link IdentifyServer} is specialized per the specification.
     */
    const IdentifyServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/identify").Identify.Cluster, {
        readonly commands: {
            readonly triggerEffect: {
                readonly optional: false;
            };
        };
    }>, typeof BaseIdentifyServer, import("../behaviors/index.js").IdentifyInterface>;
    /**
     * The Groups cluster is required by the Matter specification.
     *
     * We provide this alias to the default implementation {@link GroupsServer} for convenience.
     */
    const GroupsServer: typeof BaseGroupsServer;
    /**
     * The ScenesManagement cluster is required by the Matter specification.
     *
     * This version of {@link ScenesManagementServer} is specialized per the specification.
     */
    const ScenesManagementServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/scenes-management").ScenesManagement.Cluster, readonly [import("@matter/types/clusters/scenes-management").ScenesManagement.Feature]>, {
        readonly commands: {
            readonly copyScene: {
                readonly optional: false;
            };
        };
    }>, typeof BaseScenesManagementServer, import("../behaviors/index.js").ScenesManagementInterface>;
    /**
     * The OnOff cluster is required by the Matter specification.
     *
     * This version of {@link OnOffServer} is specialized per the specification.
     */
    const OnOffServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["Lighting"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
    /**
     * The LevelControl cluster is optional per the Matter specification.
     *
     * This version of {@link LevelControlServer} is specialized per the specification.
     */
    const LevelControlServer: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterType.Of<{
        readonly id: 8;
        readonly name: "LevelControl";
        readonly revision: 6;
        readonly features: {
            readonly onOff: import("@matter/types").BitFlag;
            readonly lighting: import("@matter/types").BitFlag;
            readonly frequency: import("@matter/types").BitFlag;
        };
        readonly attributes: {
            readonly currentLevel: import("@matter/types").Attribute<number | null, any>;
            readonly maxLevel: import("@matter/types").OptionalAttribute<number, any>;
            readonly options: import("@matter/types").WritableAttribute<import("@matter/types").TypeFromPartialBitSchema<{
                executeIfOff: import("@matter/types").BitFlag;
                coupleColorTempToLevel: import("@matter/types").BitFlag;
            }>, any>;
            readonly onOffTransitionTime: import("@matter/types").OptionalWritableAttribute<number, any>;
            readonly onLevel: import("@matter/types").WritableAttribute<number | null, any>;
            readonly onTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
            readonly offTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
            readonly defaultMoveRate: import("@matter/types").OptionalWritableAttribute<number | null, any>;
        };
        readonly commands: {
            readonly moveToLevel: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                level: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly move: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                rate: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly step: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                stepSize: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly stop: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly moveToLevelWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                level: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly moveWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                rate: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly stepWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                stepSize: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly stopWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
        };
        readonly extensions: readonly [{
            readonly flags: {
                readonly lighting: true;
            };
            readonly component: {
                readonly attributes: {
                    readonly remainingTime: import("@matter/types").Attribute<number, any>;
                    readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                    readonly startUpCurrentLevel: import("@matter/types").WritableAttribute<number | null, any>;
                };
            };
        }, {
            readonly flags: {
                readonly lighting: false;
            };
            readonly component: {
                readonly attributes: {
                    readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                };
            };
        }, {
            readonly flags: {
                readonly frequency: true;
            };
            readonly component: {
                readonly attributes: {
                    readonly currentFrequency: import("@matter/types").Attribute<number, any>;
                    readonly minFrequency: import("@matter/types").Attribute<number, any>;
                    readonly maxFrequency: import("@matter/types").Attribute<number, any>;
                };
                readonly commands: {
                    readonly moveToClosestFrequency: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        frequency: import("@matter/types").FieldType<number>;
                    }>, void, any>;
                };
            };
        }];
    }>, readonly ["OnOff", "Lighting"]>, {
        readonly attributes: {
            readonly currentLevel: {
                readonly min: 1;
                readonly max: 254;
            };
            readonly minLevel: {
                readonly default: 1;
                readonly min: 1;
                readonly max: 2;
            };
            readonly maxLevel: {
                readonly default: 254;
                readonly min: 254;
                readonly max: 255;
            };
        };
    }>, import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterType.Of<{
        readonly id: 8;
        readonly name: "LevelControl";
        readonly revision: 6;
        readonly features: {
            readonly onOff: import("@matter/types").BitFlag;
            readonly lighting: import("@matter/types").BitFlag;
            readonly frequency: import("@matter/types").BitFlag;
        };
        readonly attributes: {
            readonly currentLevel: import("@matter/types").Attribute<number | null, any>;
            readonly maxLevel: import("@matter/types").OptionalAttribute<number, any>;
            readonly options: import("@matter/types").WritableAttribute<import("@matter/types").TypeFromPartialBitSchema<{
                executeIfOff: import("@matter/types").BitFlag;
                coupleColorTempToLevel: import("@matter/types").BitFlag;
            }>, any>;
            readonly onOffTransitionTime: import("@matter/types").OptionalWritableAttribute<number, any>;
            readonly onLevel: import("@matter/types").WritableAttribute<number | null, any>;
            readonly onTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
            readonly offTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
            readonly defaultMoveRate: import("@matter/types").OptionalWritableAttribute<number | null, any>;
        };
        readonly commands: {
            readonly moveToLevel: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                level: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly move: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                rate: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly step: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                stepSize: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly stop: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly moveToLevelWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                level: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly moveWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                rate: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly stepWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                stepSize: import("@matter/types").FieldType<number>;
                transitionTime: import("@matter/types").FieldType<number | null>;
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
            readonly stopWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
                optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                    executeIfOff: import("@matter/types").BitFlag;
                    coupleColorTempToLevel: import("@matter/types").BitFlag;
                }>>;
            }>, void, any>;
        };
        readonly extensions: readonly [{
            readonly flags: {
                readonly lighting: true;
            };
            readonly component: {
                readonly attributes: {
                    readonly remainingTime: import("@matter/types").Attribute<number, any>;
                    readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                    readonly startUpCurrentLevel: import("@matter/types").WritableAttribute<number | null, any>;
                };
            };
        }, {
            readonly flags: {
                readonly lighting: false;
            };
            readonly component: {
                readonly attributes: {
                    readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                };
            };
        }, {
            readonly flags: {
                readonly frequency: true;
            };
            readonly component: {
                readonly attributes: {
                    readonly currentFrequency: import("@matter/types").Attribute<number, any>;
                    readonly minFrequency: import("@matter/types").Attribute<number, any>;
                    readonly maxFrequency: import("@matter/types").Attribute<number, any>;
                };
                readonly commands: {
                    readonly moveToClosestFrequency: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        frequency: import("@matter/types").FieldType<number>;
                    }>, void, any>;
                };
            };
        }];
    }>, readonly ["OnOff", "Lighting"]>, typeof BaseLevelControlServer, import("../behaviors/index.js").LevelControlInterface>, import("../behaviors/index.js").LevelControlInterface>;
    /**
     * The OccupancySensing cluster is optional per the Matter specification.
     *
     * We provide this alias to the default implementation {@link OccupancySensingBehavior} for convenience.
     */
    const OccupancySensingBehavior: import("../behaviors/occupancy-sensing/OccupancySensingBehavior.js").OccupancySensingBehaviorConstructor;
    /**
     * An implementation for each server cluster supported by the endpoint per the Matter specification.
     */
    const server: {
        mandatory: {
            Identify: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/identify").Identify.Cluster, {
                readonly commands: {
                    readonly triggerEffect: {
                        readonly optional: false;
                    };
                };
            }>, typeof BaseIdentifyServer, import("../behaviors/index.js").IdentifyInterface>;
            Groups: typeof BaseGroupsServer;
            ScenesManagement: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/scenes-management").ScenesManagement.Cluster, readonly [import("@matter/types/clusters/scenes-management").ScenesManagement.Feature]>, {
                readonly commands: {
                    readonly copyScene: {
                        readonly optional: false;
                    };
                };
            }>, typeof BaseScenesManagementServer, import("../behaviors/index.js").ScenesManagementInterface>;
            OnOff: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["Lighting"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
        };
        optional: {
            LevelControl: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterType.Of<{
                readonly id: 8;
                readonly name: "LevelControl";
                readonly revision: 6;
                readonly features: {
                    readonly onOff: import("@matter/types").BitFlag;
                    readonly lighting: import("@matter/types").BitFlag;
                    readonly frequency: import("@matter/types").BitFlag;
                };
                readonly attributes: {
                    readonly currentLevel: import("@matter/types").Attribute<number | null, any>;
                    readonly maxLevel: import("@matter/types").OptionalAttribute<number, any>;
                    readonly options: import("@matter/types").WritableAttribute<import("@matter/types").TypeFromPartialBitSchema<{
                        executeIfOff: import("@matter/types").BitFlag;
                        coupleColorTempToLevel: import("@matter/types").BitFlag;
                    }>, any>;
                    readonly onOffTransitionTime: import("@matter/types").OptionalWritableAttribute<number, any>;
                    readonly onLevel: import("@matter/types").WritableAttribute<number | null, any>;
                    readonly onTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
                    readonly offTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
                    readonly defaultMoveRate: import("@matter/types").OptionalWritableAttribute<number | null, any>;
                };
                readonly commands: {
                    readonly moveToLevel: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        level: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly move: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                        rate: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly step: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                        stepSize: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly stop: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly moveToLevelWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        level: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly moveWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                        rate: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly stepWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                        stepSize: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly stopWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                };
                readonly extensions: readonly [{
                    readonly flags: {
                        readonly lighting: true;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly remainingTime: import("@matter/types").Attribute<number, any>;
                            readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                            readonly startUpCurrentLevel: import("@matter/types").WritableAttribute<number | null, any>;
                        };
                    };
                }, {
                    readonly flags: {
                        readonly lighting: false;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                        };
                    };
                }, {
                    readonly flags: {
                        readonly frequency: true;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly currentFrequency: import("@matter/types").Attribute<number, any>;
                            readonly minFrequency: import("@matter/types").Attribute<number, any>;
                            readonly maxFrequency: import("@matter/types").Attribute<number, any>;
                        };
                        readonly commands: {
                            readonly moveToClosestFrequency: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                                frequency: import("@matter/types").FieldType<number>;
                            }>, void, any>;
                        };
                    };
                }];
            }>, readonly ["OnOff", "Lighting"]>, {
                readonly attributes: {
                    readonly currentLevel: {
                        readonly min: 1;
                        readonly max: 254;
                    };
                    readonly minLevel: {
                        readonly default: 1;
                        readonly min: 1;
                        readonly max: 2;
                    };
                    readonly maxLevel: {
                        readonly default: 254;
                        readonly min: 254;
                        readonly max: 255;
                    };
                };
            }>, import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterType.Of<{
                readonly id: 8;
                readonly name: "LevelControl";
                readonly revision: 6;
                readonly features: {
                    readonly onOff: import("@matter/types").BitFlag;
                    readonly lighting: import("@matter/types").BitFlag;
                    readonly frequency: import("@matter/types").BitFlag;
                };
                readonly attributes: {
                    readonly currentLevel: import("@matter/types").Attribute<number | null, any>;
                    readonly maxLevel: import("@matter/types").OptionalAttribute<number, any>;
                    readonly options: import("@matter/types").WritableAttribute<import("@matter/types").TypeFromPartialBitSchema<{
                        executeIfOff: import("@matter/types").BitFlag;
                        coupleColorTempToLevel: import("@matter/types").BitFlag;
                    }>, any>;
                    readonly onOffTransitionTime: import("@matter/types").OptionalWritableAttribute<number, any>;
                    readonly onLevel: import("@matter/types").WritableAttribute<number | null, any>;
                    readonly onTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
                    readonly offTransitionTime: import("@matter/types").OptionalWritableAttribute<number | null, any>;
                    readonly defaultMoveRate: import("@matter/types").OptionalWritableAttribute<number | null, any>;
                };
                readonly commands: {
                    readonly moveToLevel: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        level: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly move: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                        rate: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly step: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                        stepSize: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly stop: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly moveToLevelWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        level: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly moveWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        moveMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.MoveMode>;
                        rate: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly stepWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        stepMode: import("@matter/types").FieldType<import("@matter/types/clusters/level-control").LevelControl.StepMode>;
                        stepSize: import("@matter/types").FieldType<number>;
                        transitionTime: import("@matter/types").FieldType<number | null>;
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                    readonly stopWithOnOff: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                        optionsMask: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                        optionsOverride: import("@matter/types").FieldType<import("@matter/types").TypeFromPartialBitSchema<{
                            executeIfOff: import("@matter/types").BitFlag;
                            coupleColorTempToLevel: import("@matter/types").BitFlag;
                        }>>;
                    }>, void, any>;
                };
                readonly extensions: readonly [{
                    readonly flags: {
                        readonly lighting: true;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly remainingTime: import("@matter/types").Attribute<number, any>;
                            readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                            readonly startUpCurrentLevel: import("@matter/types").WritableAttribute<number | null, any>;
                        };
                    };
                }, {
                    readonly flags: {
                        readonly lighting: false;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly minLevel: import("@matter/types").OptionalAttribute<number, any>;
                        };
                    };
                }, {
                    readonly flags: {
                        readonly frequency: true;
                    };
                    readonly component: {
                        readonly attributes: {
                            readonly currentFrequency: import("@matter/types").Attribute<number, any>;
                            readonly minFrequency: import("@matter/types").Attribute<number, any>;
                            readonly maxFrequency: import("@matter/types").Attribute<number, any>;
                        };
                        readonly commands: {
                            readonly moveToClosestFrequency: import("@matter/types").Command<import("@matter/types").TypeFromFields<{
                                frequency: import("@matter/types").FieldType<number>;
                            }>, void, any>;
                        };
                    };
                }];
            }>, readonly ["OnOff", "Lighting"]>, typeof BaseLevelControlServer, import("../behaviors/index.js").LevelControlInterface>, import("../behaviors/index.js").LevelControlInterface>;
        };
    };
    /**
     * A definition for each client cluster supported by the endpoint per the Matter specification.
     */
    const client: {
        optional: {
            OccupancySensing: import("../behaviors/occupancy-sensing/OccupancySensingBehavior.js").OccupancySensingBehaviorConstructor;
        };
        mandatory: {};
    };
}
export declare const OnOffPlugInUnitDeviceDefinition: MutableEndpoint.With<import("../index.js").EndpointType.For<{
    readonly name: "OnOffPlugInUnit";
    readonly deviceType: 266;
    readonly deviceRevision: 4;
    readonly requirements: typeof OnOffPlugInUnitRequirements;
    readonly behaviors: {
        readonly identify: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/identify").Identify.Cluster, {
            readonly commands: {
                readonly triggerEffect: {
                    readonly optional: false;
                };
            };
        }>, typeof BaseIdentifyServer, import("../behaviors/index.js").IdentifyInterface>;
    } & {
        readonly groups: typeof BaseGroupsServer;
    } & {
        readonly scenesManagement: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/scenes-management").ScenesManagement.Cluster, readonly [import("@matter/types/clusters/scenes-management").ScenesManagement.Feature]>, {
            readonly commands: {
                readonly copyScene: {
                    readonly optional: false;
                };
            };
        }>, typeof BaseScenesManagementServer, import("../behaviors/index.js").ScenesManagementInterface>;
    } & {
        readonly onOff: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["Lighting"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
    };
}>, {
    readonly identify: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types/clusters/identify").Identify.Cluster, {
        readonly commands: {
            readonly triggerEffect: {
                readonly optional: false;
            };
        };
    }>, typeof BaseIdentifyServer, import("../behaviors/index.js").IdentifyInterface>;
} & {
    readonly groups: typeof BaseGroupsServer;
} & {
    readonly scenesManagement: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterTypeModifier.WithAlterations<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/scenes-management").ScenesManagement.Cluster, readonly [import("@matter/types/clusters/scenes-management").ScenesManagement.Feature]>, {
        readonly commands: {
            readonly copyScene: {
                readonly optional: false;
            };
        };
    }>, typeof BaseScenesManagementServer, import("../behaviors/index.js").ScenesManagementInterface>;
} & {
    readonly onOff: import("../index.js").ClusterBehavior.Type<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types").ClusterComposer.WithFeatures<import("@matter/types/clusters/on-off").OnOff.Cluster, readonly [import("@matter/types/clusters/on-off").OnOff.Feature.Lighting]>, readonly []>, readonly ["Lighting"]>, typeof BaseOnOffServer, import("../behaviors/index.js").OnOffInterface>;
}>;
export declare const OnOffPlugInUnitDevice: OnOffPlugInUnitDevice;
//# sourceMappingURL=on-off-plug-in-unit.d.ts.map
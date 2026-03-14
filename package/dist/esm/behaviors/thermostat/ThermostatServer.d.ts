/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ActionContext } from "#behavior/context/ActionContext.js";
import { ValueSupervisor } from "#behavior/supervision/ValueSupervisor.js";
import { Thermostat } from "#clusters/thermostat";
import { Endpoint } from "#endpoint/Endpoint.js";
import { Observable } from "#general";
import { Val } from "#protocol";
import { ClusterType, TypeFromPartialBitSchema } from "#types";
declare const ThermostatBehaviorLogicBase: import("../../index.js").ClusterBehavior.Type<import("#types").ClusterComposer.WithFeatures<ClusterType.Of<{
    readonly id: 513;
    readonly name: "Thermostat";
    readonly revision: 9;
    readonly features: {
        readonly heating: import("#types").BitFlag;
        readonly cooling: import("#types").BitFlag;
        readonly occupancy: import("#types").BitFlag;
        readonly scheduleConfiguration: import("#types").BitFlag;
        readonly setback: import("#types").BitFlag;
        readonly autoMode: import("#types").BitFlag;
        readonly localTemperatureNotExposed: import("#types").BitFlag;
        readonly matterScheduleConfiguration: import("#types").BitFlag;
        readonly presets: import("#types").BitFlag;
    };
    readonly attributes: {
        readonly localTemperature: import("#types").Attribute<number | null, any>;
        readonly outdoorTemperature: import("#types").OptionalAttribute<number | null, any>;
        readonly hvacSystemTypeConfiguration: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            coolingStage: import("#types").BitField;
            heatingStage: import("#types").BitField;
            heatingIsHeatPump: import("#types").BitFlag;
            heatingUsesFuel: import("#types").BitFlag;
        }>, any>;
        readonly remoteSensing: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            localTemperature: import("#types").BitFlag;
            outdoorTemperature: import("#types").BitFlag;
            occupancy: import("#types").BitFlag;
        }>, any>;
        readonly controlSequenceOfOperation: import("#types").WritableAttribute<Thermostat.ControlSequenceOfOperation, any>;
        readonly systemMode: import("#types").WritableAttribute<Thermostat.SystemMode, any>;
        readonly temperatureSetpointHold: import("#types").OptionalWritableAttribute<Thermostat.TemperatureSetpointHold, any>;
        readonly temperatureSetpointHoldDuration: import("#types").OptionalWritableAttribute<number | null, any>;
        readonly thermostatProgrammingOperationMode: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            scheduleActive: import("#types").BitFlag;
            autoRecovery: import("#types").BitFlag;
            economy: import("#types").BitFlag;
        }>, any>;
        readonly thermostatRunningState: import("#types").OptionalAttribute<TypeFromPartialBitSchema<{
            heat: import("#types").BitFlag;
            cool: import("#types").BitFlag;
            fan: import("#types").BitFlag;
            heatStage2: import("#types").BitFlag;
            coolStage2: import("#types").BitFlag;
            fanStage2: import("#types").BitFlag;
            fanStage3: import("#types").BitFlag;
        }>, any>;
        readonly setpointChangeSource: import("#types").OptionalAttribute<Thermostat.SetpointChangeSource, any>;
        readonly setpointChangeAmount: import("#types").OptionalAttribute<number | null, any>;
        readonly setpointChangeSourceTimestamp: import("#types").OptionalAttribute<number, any>;
        readonly emergencyHeatDelta: import("#types").OptionalWritableAttribute<number, any>;
        readonly acType: import("#types").OptionalWritableAttribute<Thermostat.AcType, any>;
        readonly acCapacity: import("#types").OptionalWritableAttribute<number, any>;
        readonly acRefrigerantType: import("#types").OptionalWritableAttribute<Thermostat.AcRefrigerantType, any>;
        readonly acCompressorType: import("#types").OptionalWritableAttribute<Thermostat.AcCompressorType, any>;
        readonly acErrorCode: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            compressorFail: import("#types").BitFlag;
            roomSensorFail: import("#types").BitFlag;
            outdoorSensorFail: import("#types").BitFlag;
            coilSensorFail: import("#types").BitFlag;
            fanFail: import("#types").BitFlag;
        }>, any>;
        readonly acLouverPosition: import("#types").OptionalWritableAttribute<Thermostat.AcLouverPosition, any>;
        readonly acCoilTemperature: import("#types").OptionalAttribute<number | null, any>;
        readonly acCapacityFormat: import("#types").OptionalWritableAttribute<Thermostat.AcCapacityFormat, any>;
        readonly setpointHoldExpiryTimestamp: import("#types").OptionalAttribute<number | null, any>;
    };
    readonly commands: {
        readonly setpointRaiseLower: import("#types").Command<import("#types").TypeFromFields<{
            mode: import("#types").FieldType<Thermostat.SetpointRaiseLowerMode>;
            amount: import("#types").FieldType<number>;
        }>, void, any>;
        readonly atomicRequest: import("#types").Command<import("#types").TypeFromFields<{
            requestType: import("#types").FieldType<Thermostat.RequestType>;
            attributeRequests: import("#types").FieldType<import("#types").AttributeId[]>;
            timeout: import("#types").OptionalFieldType<number>;
        }>, import("#types").TypeFromFields<{
            statusCode: import("#types").FieldType<import("#types").Status>;
            attributeStatus: import("#types").FieldType<import("#types").TypeFromFields<{
                attributeId: import("#types").FieldType<import("#types").AttributeId>;
                statusCode: import("#types").FieldType<import("#types").Status>;
            }>[]>;
            timeout: import("#types").OptionalFieldType<number>;
        }>, any>;
    };
    readonly extensions: readonly [{
        readonly flags: {
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly occupancy: import("#types").Attribute<TypeFromPartialBitSchema<{
                    occupied: import("#types").BitFlag;
                }>, any>;
            };
        };
    }, {
        readonly flags: {
            readonly heating: true;
        };
        readonly component: {
            readonly attributes: {
                readonly absMinHeatSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly absMaxHeatSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly piHeatingDemand: import("#types").OptionalAttribute<number, any>;
                readonly occupiedHeatingSetpoint: import("#types").WritableAttribute<number, any>;
                readonly minHeatSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
                readonly maxHeatSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly cooling: true;
        };
        readonly component: {
            readonly attributes: {
                readonly absMinCoolSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly absMaxCoolSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly piCoolingDemand: import("#types").OptionalAttribute<number, any>;
                readonly occupiedCoolingSetpoint: import("#types").WritableAttribute<number, any>;
                readonly minCoolSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
                readonly maxCoolSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly localTemperatureNotExposed: false;
        };
        readonly component: {
            readonly attributes: {
                readonly localTemperatureCalibration: import("#types").OptionalWritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly cooling: true;
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly unoccupiedCoolingSetpoint: import("#types").WritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly heating: true;
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly unoccupiedHeatingSetpoint: import("#types").WritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly autoMode: true;
        };
        readonly component: {
            readonly attributes: {
                readonly minSetpointDeadBand: import("#types").WritableAttribute<number, any>;
                readonly thermostatRunningMode: import("#types").OptionalAttribute<Thermostat.ThermostatRunningMode, any>;
            };
        };
    }, {
        readonly flags: {
            readonly scheduleConfiguration: true;
        };
        readonly component: {
            readonly attributes: {
                readonly startOfWeek: import("#types").FixedAttribute<Thermostat.StartOfWeek, any>;
                readonly numberOfWeeklyTransitions: import("#types").FixedAttribute<number, any>;
                readonly numberOfDailyTransitions: import("#types").FixedAttribute<number, any>;
            };
            readonly commands: {
                readonly setWeeklySchedule: import("#types").Command<import("#types").TypeFromFields<{
                    numberOfTransitionsForSequence: import("#types").FieldType<number>;
                    dayOfWeekForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        sunday: import("#types").BitFlag;
                        monday: import("#types").BitFlag;
                        tuesday: import("#types").BitFlag;
                        wednesday: import("#types").BitFlag;
                        thursday: import("#types").BitFlag;
                        friday: import("#types").BitFlag;
                        saturday: import("#types").BitFlag;
                        away: import("#types").BitFlag;
                    }>>;
                    modeForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        heatSetpointPresent: import("#types").BitFlag;
                        coolSetpointPresent: import("#types").BitFlag;
                    }>>;
                    transitions: import("#types").FieldType<import("#types").TypeFromFields<{
                        transitionTime: import("#types").FieldType<number>;
                        heatSetpoint: import("#types").FieldType<number | null>;
                        coolSetpoint: import("#types").FieldType<number | null>;
                    }>[]>;
                }>, void, any>;
                readonly getWeeklySchedule: import("#types").Command<import("#types").TypeFromFields<{
                    daysToReturn: import("#types").FieldType<TypeFromPartialBitSchema<{
                        sunday: import("#types").BitFlag;
                        monday: import("#types").BitFlag;
                        tuesday: import("#types").BitFlag;
                        wednesday: import("#types").BitFlag;
                        thursday: import("#types").BitFlag;
                        friday: import("#types").BitFlag;
                        saturday: import("#types").BitFlag;
                        away: import("#types").BitFlag;
                    }>>;
                    modeToReturn: import("#types").FieldType<TypeFromPartialBitSchema<{
                        heatSetpointPresent: import("#types").BitFlag;
                        coolSetpointPresent: import("#types").BitFlag;
                    }>>;
                }>, import("#types").TypeFromFields<{
                    numberOfTransitionsForSequence: import("#types").FieldType<number>;
                    dayOfWeekForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        sunday: import("#types").BitFlag;
                        monday: import("#types").BitFlag;
                        tuesday: import("#types").BitFlag;
                        wednesday: import("#types").BitFlag;
                        thursday: import("#types").BitFlag;
                        friday: import("#types").BitFlag;
                        saturday: import("#types").BitFlag;
                        away: import("#types").BitFlag;
                    }>>;
                    modeForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        heatSetpointPresent: import("#types").BitFlag;
                        coolSetpointPresent: import("#types").BitFlag;
                    }>>;
                    transitions: import("#types").FieldType<import("#types").TypeFromFields<{
                        transitionTime: import("#types").FieldType<number>;
                        heatSetpoint: import("#types").FieldType<number | null>;
                        coolSetpoint: import("#types").FieldType<number | null>;
                    }>[]>;
                }>, any>;
                readonly clearWeeklySchedule: import("#types").Command<void, void, any>;
            };
        };
    }, {
        readonly flags: {
            readonly setback: true;
        };
        readonly component: {
            readonly attributes: {
                readonly occupiedSetback: import("#types").WritableAttribute<number | null, any>;
                readonly occupiedSetbackMin: import("#types").FixedAttribute<number | null, any>;
                readonly occupiedSetbackMax: import("#types").FixedAttribute<number | null, any>;
            };
        };
    }, {
        readonly flags: {
            readonly setback: true;
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly unoccupiedSetback: import("#types").WritableAttribute<number | null, any>;
                readonly unoccupiedSetbackMin: import("#types").FixedAttribute<number | null, any>;
                readonly unoccupiedSetbackMax: import("#types").FixedAttribute<number | null, any>;
            };
        };
    }, {
        readonly flags: {
            readonly presets: true;
        };
        readonly component: {
            readonly attributes: {
                readonly presetTypes: import("#types").FixedAttribute<import("#types").TypeFromFields<{
                    presetScenario: import("#types").FieldType<Thermostat.PresetScenario>;
                    numberOfPresets: import("#types").FieldType<number>;
                    presetTypeFeatures: import("#types").FieldType<TypeFromPartialBitSchema<{
                        automatic: import("#types").BitFlag;
                        supportsNames: import("#types").BitFlag;
                    }>>;
                }>[], any>;
                readonly numberOfPresets: import("#types").FixedAttribute<number, any>;
                readonly activePresetHandle: import("#types").Attribute<AllowSharedBufferSource | null, any>;
                readonly presets: import("#types").WritableAttribute<import("#types").TypeFromFields<{
                    presetHandle: import("#types").FieldType<AllowSharedBufferSource | null>;
                    presetScenario: import("#types").FieldType<Thermostat.PresetScenario>;
                    name: import("#types").OptionalFieldType<string | null>;
                    coolingSetpoint: import("#types").OptionalFieldType<number>;
                    heatingSetpoint: import("#types").OptionalFieldType<number>;
                    builtIn: import("#types").FieldType<boolean | null>;
                }>[], any>;
            };
            readonly commands: {
                readonly setActivePresetRequest: import("#types").Command<import("#types").TypeFromFields<{
                    presetHandle: import("#types").FieldType<AllowSharedBufferSource | null>;
                }>, void, any>;
            };
        };
    }, {
        readonly flags: {
            readonly matterScheduleConfiguration: true;
        };
        readonly component: {
            readonly attributes: {
                readonly scheduleTypes: import("#types").FixedAttribute<import("#types").TypeFromFields<{
                    systemMode: import("#types").FieldType<Thermostat.SystemMode>;
                    numberOfSchedules: import("#types").FieldType<number>;
                    scheduleTypeFeatures: import("#types").FieldType<TypeFromPartialBitSchema<{
                        supportsPresets: import("#types").BitFlag;
                        supportsSetpoints: import("#types").BitFlag;
                        supportsNames: import("#types").BitFlag;
                        supportsOff: import("#types").BitFlag;
                    }>>;
                }>[], any>;
                readonly numberOfSchedules: import("#types").FixedAttribute<number, any>;
                readonly numberOfScheduleTransitions: import("#types").FixedAttribute<number, any>;
                readonly numberOfScheduleTransitionPerDay: import("#types").FixedAttribute<number | null, any>;
                readonly activeScheduleHandle: import("#types").Attribute<AllowSharedBufferSource | null, any>;
                readonly schedules: import("#types").WritableAttribute<import("#types").TypeFromFields<{
                    scheduleHandle: import("#types").FieldType<AllowSharedBufferSource | null>;
                    systemMode: import("#types").FieldType<Thermostat.SystemMode>;
                    name: import("#types").OptionalFieldType<string>;
                    presetHandle: import("#types").OptionalFieldType<AllowSharedBufferSource>;
                    transitions: import("#types").FieldType<import("#types").TypeFromFields<{
                        dayOfWeek: import("#types").FieldType<TypeFromPartialBitSchema<{
                            sunday: import("#types").BitFlag;
                            monday: import("#types").BitFlag;
                            tuesday: import("#types").BitFlag;
                            wednesday: import("#types").BitFlag;
                            thursday: import("#types").BitFlag;
                            friday: import("#types").BitFlag;
                            saturday: import("#types").BitFlag;
                            away: import("#types").BitFlag;
                        }>>;
                        transitionTime: import("#types").FieldType<number>;
                        presetHandle: import("#types").OptionalFieldType<AllowSharedBufferSource>;
                        systemMode: import("#types").OptionalFieldType<Thermostat.SystemMode>;
                        coolingSetpoint: import("#types").OptionalFieldType<number>;
                        heatingSetpoint: import("#types").OptionalFieldType<number>;
                    }>[]>;
                    builtIn: import("#types").FieldType<boolean | null>;
                }>[], any>;
            };
            readonly commands: {
                readonly setActiveScheduleRequest: import("#types").Command<import("#types").TypeFromFields<{
                    scheduleHandle: import("#types").FieldType<AllowSharedBufferSource>;
                }>, void, any>;
            };
        };
    }, {
        readonly flags: {
            readonly autoMode: true;
            readonly heating: false;
        };
        readonly component: false;
    }, {
        readonly flags: {
            readonly autoMode: true;
            readonly cooling: false;
        };
        readonly component: false;
    }, {
        readonly flags: {
            readonly heating: false;
            readonly cooling: false;
        };
        readonly component: false;
    }];
}>, readonly [Thermostat.Feature.Heating, Thermostat.Feature.Cooling, Thermostat.Feature.Occupancy, Thermostat.Feature.AutoMode, Thermostat.Feature.Presets]>, import("./ThermostatBehavior.js").ThermostatBehaviorConstructor, import("./ThermostatInterface.js").ThermostatInterface>;
/**
 * This is the default server implementation of {@link ThermostatBehavior}.
 *
 * The Matter specification requires the Thermostat cluster to support features we do not enable by default. You should
 * use {@link ThermostatServer.with} to specialize the class for the features your implementation supports.
 * We implement all features beside the following:
 * * MatterScheduleConfiguration: This feature is provisional.
 * * ScheduleConfiguration: This feature is deprecated and not allowed to be enabled.
 * * Setback: This feature is considered deprecated.
 * * The use of the "setpointHoldExpiryTimestamp" attribute is currently not supported.
 *
 * This implementation mainly provides all validation and base logic required by the Matter specification.
 * It implements some thermostat logic, partially beyond Matter specification definition, notably:
 * * Adjust the setpoints when a preset is activated
 * If this behavior is not desired, you can override the setActivePresetRequest method but should call
 * handleSetActivePresetRequest() to ensure compliance with the specification.
 *
 * The implementation also adds enhanced system mode logic that can be enabled by setting the state field
 * useAutomaticModeManagement to true. When enabled, the thermostat will:
 * * Adjust the thermostat running mode when in Auto system mode and the Setback feature is also supported
 * * Determine the system mode and/or running mode based on temperature changes
 *
 * For local temperature or occupancy values we check if there is a local cluster available on the same endpoint and use
 * them, alternatively raw measurements can be set in the states externalMeasuredIndoorTemperature and
 * externallyMeasuredOccupancy. The OutdoorTemperature can be set directly on the attribute if supported.
 * The RemoteSensing attribute need to be set correctly as needed by the developer to identify the measurement source.
 *
 * The following custom events are provided:
 * * calibratedTemperature$Changed: Emitted when the measured local temperature changes including any calibration applied. This event is mainly useful when the localTemperatureNotExposed feature is used.
 *
 * Important note: To access the current local temperature (including all calibrations applied) please use
 * this.internal.localTemperature because the localTemperature attribute in state might be null depending on the
 * configured features.
 *
 * TODO: Currently the general purpose "atomic write" Matter feature is only implemented in this specific cluster because
 *  only used here so far. Also see information in AtomicWriteHandler.ts.
 */
export declare class ThermostatBaseServer extends ThermostatBehaviorLogicBase {
    #private;
    protected internal: ThermostatBaseServer.Internal;
    state: ThermostatBaseServer.State;
    events: ThermostatBaseServer.Events;
    static readonly schema: import("#model").ClusterModel;
    initialize(): Promise<void>;
    /**
     * The default implementation of the SetpointRaiseLower command. It handles all validation and setpoint adjustments
     * required by the Matter specification. This method only changes the Occupied setpoints.
     */
    setpointRaiseLower({ mode, amount }: Thermostat.SetpointRaiseLowerRequest): void;
    /**
     * Performs basic validation and sets the active preset handle when valid.
     * This fulfills the basic requirements of the SetActivePresetRequest matter command. Use this method if you need
     * to override setActivePresetRequest to ensure compliance.
     */
    protected handleSetActivePresetRequest({ presetHandle }: Thermostat.SetActivePresetRequest): Thermostat.Preset | undefined;
    /**
     * This default implementation of the SetActivePresetRequest command handler sets the active preset and
     * (additionally to specification requirements!) adjusts the setpoints to the preset values if defined.
     *
     * If you do not want this behavior, you can override this method but should call handleSetActivePresetRequest to
     * ensure compliance with the specification.
     */
    setActivePresetRequest({ presetHandle }: Thermostat.SetActivePresetRequest): void;
    /**
     * Whether the thermostat is currently considered occupied
     * Uses the occupancy state if the feature is supported, otherwise always true
     */
    protected get occupied(): boolean;
    /** The current heating setpoint depending on occupancy */
    protected get heatingSetpoint(): number;
    protected set heatingSetpoint(value: number);
    /** The current cooling setpoint depending on occupancy */
    protected get coolingSetpoint(): number;
    protected set coolingSetpoint(value: number);
    /** Whether heating is allowed in the current ControlSequenceOfOperation and features */
    protected get heatingAllowed(): boolean;
    /** Whether cooling is allowed in the current ControlSequenceOfOperation and features */
    protected get coolingAllowed(): boolean;
    /**
     * Adjust the running mode of the thermostat based on the new system mode when the thermostatRunningMode is supported
     */
    protected adjustRunningMode(newState: Thermostat.ThermostatRunningMode): void;
    /**
     * The current mode the thermostat is considered to be in based on local temperature and setpoints
     */
    protected get temperatureConsideration(): "belowTarget" | "onTarget" | "aboveTarget" | undefined;
    get heatSetpointMinimum(): number;
    get heatSetpointMaximum(): number;
    get coolSetpointMinimum(): number;
    get coolSetpointMaximum(): number;
    get setpointDeadBand(): number;
    [Symbol.asyncDispose](): Promise<void>;
    /** Implementation of the atomic request handling */
    atomicRequest(request: Thermostat.AtomicRequest): Promise<Thermostat.AtomicResponse>;
}
export declare namespace ThermostatBaseServer {
    class State extends ThermostatBehaviorLogicBase.State {
        /**
         * Otherwise measured temperature in Matter format as uint16 with a factor of 100. A calibration offset is applied
         * additionally from localTemperatureCalibration if set.
         * Use this if you have an external temperature sensor that should be used for thermostat control instead of a
         * local temperature measurement cluster.
         */
        externalMeasuredIndoorTemperature?: number;
        /**
         * Endpoint (Number or string-Id) where to find the indoor temperature measurement cluster to use as
         * local temperature measurement for the thermostat behavior.
         */
        localIndoorTemperatureMeasurementEndpoint?: number | string;
        /**
         * Otherwise measured occupancy as boolean.
         * Use this if you have an external occupancy sensor that should be used for thermostat control instead of a
         * internal occupancy sensing cluster.
         */
        externallyMeasuredOccupancy?: boolean;
        /**
         * Endpoint (Number or string-Id) where to find the occupancy sensing cluster to use as
         * local occupancy measurement for the thermostat behavior.
         */
        localOccupancyMeasurementEndpoint?: number | string;
        /**
         * Use to enable the automatic mode management, implemented by this standard implementation.  This is beyond
         * Matter specification! It reacts to temperature changes to adjust system running mode automatically. It also
         * requires the Auto feature to be  enabled and the ThermostatRunningMode attribute to be present.
         */
        useAutomaticModeManagement: boolean;
        /**
         * Persisted presets stored in the device, needed because the original "presets" is a virtual property
         */
        persistedPresets?: Thermostat.Preset[];
        /**
         * Implementation of the needed Preset attribute logic for Atomic Write handling.
         */
        [Val.properties](endpoint: Endpoint, session: ValueSupervisor.Session): {};
    }
    class Events extends ThermostatBehaviorLogicBase.Events {
        externalMeasuredIndoorTemperature$Changed: Observable<[value: number, oldValue: number, context: ActionContext], void>;
        externallyMeasuredOccupancy$Changed: Observable<[value: boolean, oldValue: boolean, context: ActionContext], void>;
        persistedPresets$Changed: Observable<[value: Thermostat.Preset[], oldValue: Thermostat.Preset[], context: ActionContext], void>;
        persistedPresets$Changing: Observable<[value: Thermostat.Preset[], oldValue: Thermostat.Preset[], context: ActionContext], void>;
        /**
         * Custom event emitted when the calibrated temperature changes.
         */
        calibratedTemperature$Changed: Observable<[value: number | null, oldValue: number | null, context: ActionContext], void>;
        /**
         * Custom event emitted when the Presets attribute is "virtually" changing as part of an atomic write operation.
         * Info: The events is currently needed to be a pure Observable to get errors thrown in the event handler be
         *  reported back to the emitter.
         */
        presets$AtomicChanging: Observable<[value: Thermostat.Preset[], oldValue: Thermostat.Preset[], context: ActionContext], void>;
        /**
         * Custom event emitted when the Presets attribute has "virtually" changed as part of an atomic write operation.
         * Info: The events is currently needed to be a pure Observable to get errors thrown in the event handler be
         * reported back to the emitter.
         */
        presets$AtomicChanged: Observable<[value: Thermostat.Preset[], oldValue: Thermostat.Preset[], context: ActionContext], void>;
        /**
         * Custom event emitted to inform the behavior implementation of an update of the PersistedPresets attribute.
         */
        updatePresets: Observable<[value: Thermostat.Preset[]], void>;
    }
    class Internal {
        /**
         * Local temperature in Matter format as uint16 with a factor of 100. It is the same value as the one reported
         * in the localTemperature Attribute, but also present when the LocalTemperatureNotExposed feature is enabled.
         * Means all logic and calculations are always done with this value.
         * The value will be updated on initialization and when the localTemperature Attribute changes.
         */
        localTemperature: number | null;
        /**
         * Storing fixed value internally to ensure it can not be modified.
         * This value will be initialized when the behavior is initialized and is static afterward.
         */
        minSetpointDeadBand: number;
        /**
         * Storing fixed value internally to ensure it can not be modified.
         * This value will be initialized when the behavior is initialized and is static afterward.
         */
        controlSequenceOfOperation: Thermostat.ControlSequenceOfOperation;
    }
}
declare const ThermostatServer_base: import("../../index.js").ClusterBehavior.Type<ClusterType.Of<{
    readonly id: 513;
    readonly name: "Thermostat";
    readonly revision: 9;
    readonly features: {
        readonly heating: import("#types").BitFlag;
        readonly cooling: import("#types").BitFlag;
        readonly occupancy: import("#types").BitFlag;
        readonly scheduleConfiguration: import("#types").BitFlag;
        readonly setback: import("#types").BitFlag;
        readonly autoMode: import("#types").BitFlag;
        readonly localTemperatureNotExposed: import("#types").BitFlag;
        readonly matterScheduleConfiguration: import("#types").BitFlag;
        readonly presets: import("#types").BitFlag;
    };
    readonly attributes: {
        readonly localTemperature: import("#types").Attribute<number | null, any>;
        readonly outdoorTemperature: import("#types").OptionalAttribute<number | null, any>;
        readonly hvacSystemTypeConfiguration: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            coolingStage: import("#types").BitField;
            heatingStage: import("#types").BitField;
            heatingIsHeatPump: import("#types").BitFlag;
            heatingUsesFuel: import("#types").BitFlag;
        }>, any>;
        readonly remoteSensing: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            localTemperature: import("#types").BitFlag;
            outdoorTemperature: import("#types").BitFlag;
            occupancy: import("#types").BitFlag;
        }>, any>;
        readonly controlSequenceOfOperation: import("#types").WritableAttribute<Thermostat.ControlSequenceOfOperation, any>;
        readonly systemMode: import("#types").WritableAttribute<Thermostat.SystemMode, any>;
        readonly temperatureSetpointHold: import("#types").OptionalWritableAttribute<Thermostat.TemperatureSetpointHold, any>;
        readonly temperatureSetpointHoldDuration: import("#types").OptionalWritableAttribute<number | null, any>;
        readonly thermostatProgrammingOperationMode: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            scheduleActive: import("#types").BitFlag;
            autoRecovery: import("#types").BitFlag;
            economy: import("#types").BitFlag;
        }>, any>;
        readonly thermostatRunningState: import("#types").OptionalAttribute<TypeFromPartialBitSchema<{
            heat: import("#types").BitFlag;
            cool: import("#types").BitFlag;
            fan: import("#types").BitFlag;
            heatStage2: import("#types").BitFlag;
            coolStage2: import("#types").BitFlag;
            fanStage2: import("#types").BitFlag;
            fanStage3: import("#types").BitFlag;
        }>, any>;
        readonly setpointChangeSource: import("#types").OptionalAttribute<Thermostat.SetpointChangeSource, any>;
        readonly setpointChangeAmount: import("#types").OptionalAttribute<number | null, any>;
        readonly setpointChangeSourceTimestamp: import("#types").OptionalAttribute<number, any>;
        readonly emergencyHeatDelta: import("#types").OptionalWritableAttribute<number, any>;
        readonly acType: import("#types").OptionalWritableAttribute<Thermostat.AcType, any>;
        readonly acCapacity: import("#types").OptionalWritableAttribute<number, any>;
        readonly acRefrigerantType: import("#types").OptionalWritableAttribute<Thermostat.AcRefrigerantType, any>;
        readonly acCompressorType: import("#types").OptionalWritableAttribute<Thermostat.AcCompressorType, any>;
        readonly acErrorCode: import("#types").OptionalWritableAttribute<TypeFromPartialBitSchema<{
            compressorFail: import("#types").BitFlag;
            roomSensorFail: import("#types").BitFlag;
            outdoorSensorFail: import("#types").BitFlag;
            coilSensorFail: import("#types").BitFlag;
            fanFail: import("#types").BitFlag;
        }>, any>;
        readonly acLouverPosition: import("#types").OptionalWritableAttribute<Thermostat.AcLouverPosition, any>;
        readonly acCoilTemperature: import("#types").OptionalAttribute<number | null, any>;
        readonly acCapacityFormat: import("#types").OptionalWritableAttribute<Thermostat.AcCapacityFormat, any>;
        readonly setpointHoldExpiryTimestamp: import("#types").OptionalAttribute<number | null, any>;
    };
    readonly commands: {
        readonly setpointRaiseLower: import("#types").Command<import("#types").TypeFromFields<{
            mode: import("#types").FieldType<Thermostat.SetpointRaiseLowerMode>;
            amount: import("#types").FieldType<number>;
        }>, void, any>;
        readonly atomicRequest: import("#types").Command<import("#types").TypeFromFields<{
            requestType: import("#types").FieldType<Thermostat.RequestType>;
            attributeRequests: import("#types").FieldType<import("#types").AttributeId[]>;
            timeout: import("#types").OptionalFieldType<number>;
        }>, import("#types").TypeFromFields<{
            statusCode: import("#types").FieldType<import("#types").Status>;
            attributeStatus: import("#types").FieldType<import("#types").TypeFromFields<{
                attributeId: import("#types").FieldType<import("#types").AttributeId>;
                statusCode: import("#types").FieldType<import("#types").Status>;
            }>[]>;
            timeout: import("#types").OptionalFieldType<number>;
        }>, any>;
    };
    readonly extensions: readonly [{
        readonly flags: {
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly occupancy: import("#types").Attribute<TypeFromPartialBitSchema<{
                    occupied: import("#types").BitFlag;
                }>, any>;
            };
        };
    }, {
        readonly flags: {
            readonly heating: true;
        };
        readonly component: {
            readonly attributes: {
                readonly absMinHeatSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly absMaxHeatSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly piHeatingDemand: import("#types").OptionalAttribute<number, any>;
                readonly occupiedHeatingSetpoint: import("#types").WritableAttribute<number, any>;
                readonly minHeatSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
                readonly maxHeatSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly cooling: true;
        };
        readonly component: {
            readonly attributes: {
                readonly absMinCoolSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly absMaxCoolSetpointLimit: import("#types").OptionalFixedAttribute<number, any>;
                readonly piCoolingDemand: import("#types").OptionalAttribute<number, any>;
                readonly occupiedCoolingSetpoint: import("#types").WritableAttribute<number, any>;
                readonly minCoolSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
                readonly maxCoolSetpointLimit: import("#types").OptionalWritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly localTemperatureNotExposed: false;
        };
        readonly component: {
            readonly attributes: {
                readonly localTemperatureCalibration: import("#types").OptionalWritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly cooling: true;
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly unoccupiedCoolingSetpoint: import("#types").WritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly heating: true;
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly unoccupiedHeatingSetpoint: import("#types").WritableAttribute<number, any>;
            };
        };
    }, {
        readonly flags: {
            readonly autoMode: true;
        };
        readonly component: {
            readonly attributes: {
                readonly minSetpointDeadBand: import("#types").WritableAttribute<number, any>;
                readonly thermostatRunningMode: import("#types").OptionalAttribute<Thermostat.ThermostatRunningMode, any>;
            };
        };
    }, {
        readonly flags: {
            readonly scheduleConfiguration: true;
        };
        readonly component: {
            readonly attributes: {
                readonly startOfWeek: import("#types").FixedAttribute<Thermostat.StartOfWeek, any>;
                readonly numberOfWeeklyTransitions: import("#types").FixedAttribute<number, any>;
                readonly numberOfDailyTransitions: import("#types").FixedAttribute<number, any>;
            };
            readonly commands: {
                readonly setWeeklySchedule: import("#types").Command<import("#types").TypeFromFields<{
                    numberOfTransitionsForSequence: import("#types").FieldType<number>;
                    dayOfWeekForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        sunday: import("#types").BitFlag;
                        monday: import("#types").BitFlag;
                        tuesday: import("#types").BitFlag;
                        wednesday: import("#types").BitFlag;
                        thursday: import("#types").BitFlag;
                        friday: import("#types").BitFlag;
                        saturday: import("#types").BitFlag;
                        away: import("#types").BitFlag;
                    }>>;
                    modeForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        heatSetpointPresent: import("#types").BitFlag;
                        coolSetpointPresent: import("#types").BitFlag;
                    }>>;
                    transitions: import("#types").FieldType<import("#types").TypeFromFields<{
                        transitionTime: import("#types").FieldType<number>;
                        heatSetpoint: import("#types").FieldType<number | null>;
                        coolSetpoint: import("#types").FieldType<number | null>;
                    }>[]>;
                }>, void, any>;
                readonly getWeeklySchedule: import("#types").Command<import("#types").TypeFromFields<{
                    daysToReturn: import("#types").FieldType<TypeFromPartialBitSchema<{
                        sunday: import("#types").BitFlag;
                        monday: import("#types").BitFlag;
                        tuesday: import("#types").BitFlag;
                        wednesday: import("#types").BitFlag;
                        thursday: import("#types").BitFlag;
                        friday: import("#types").BitFlag;
                        saturday: import("#types").BitFlag;
                        away: import("#types").BitFlag;
                    }>>;
                    modeToReturn: import("#types").FieldType<TypeFromPartialBitSchema<{
                        heatSetpointPresent: import("#types").BitFlag;
                        coolSetpointPresent: import("#types").BitFlag;
                    }>>;
                }>, import("#types").TypeFromFields<{
                    numberOfTransitionsForSequence: import("#types").FieldType<number>;
                    dayOfWeekForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        sunday: import("#types").BitFlag;
                        monday: import("#types").BitFlag;
                        tuesday: import("#types").BitFlag;
                        wednesday: import("#types").BitFlag;
                        thursday: import("#types").BitFlag;
                        friday: import("#types").BitFlag;
                        saturday: import("#types").BitFlag;
                        away: import("#types").BitFlag;
                    }>>;
                    modeForSequence: import("#types").FieldType<TypeFromPartialBitSchema<{
                        heatSetpointPresent: import("#types").BitFlag;
                        coolSetpointPresent: import("#types").BitFlag;
                    }>>;
                    transitions: import("#types").FieldType<import("#types").TypeFromFields<{
                        transitionTime: import("#types").FieldType<number>;
                        heatSetpoint: import("#types").FieldType<number | null>;
                        coolSetpoint: import("#types").FieldType<number | null>;
                    }>[]>;
                }>, any>;
                readonly clearWeeklySchedule: import("#types").Command<void, void, any>;
            };
        };
    }, {
        readonly flags: {
            readonly setback: true;
        };
        readonly component: {
            readonly attributes: {
                readonly occupiedSetback: import("#types").WritableAttribute<number | null, any>;
                readonly occupiedSetbackMin: import("#types").FixedAttribute<number | null, any>;
                readonly occupiedSetbackMax: import("#types").FixedAttribute<number | null, any>;
            };
        };
    }, {
        readonly flags: {
            readonly setback: true;
            readonly occupancy: true;
        };
        readonly component: {
            readonly attributes: {
                readonly unoccupiedSetback: import("#types").WritableAttribute<number | null, any>;
                readonly unoccupiedSetbackMin: import("#types").FixedAttribute<number | null, any>;
                readonly unoccupiedSetbackMax: import("#types").FixedAttribute<number | null, any>;
            };
        };
    }, {
        readonly flags: {
            readonly presets: true;
        };
        readonly component: {
            readonly attributes: {
                readonly presetTypes: import("#types").FixedAttribute<import("#types").TypeFromFields<{
                    presetScenario: import("#types").FieldType<Thermostat.PresetScenario>;
                    numberOfPresets: import("#types").FieldType<number>;
                    presetTypeFeatures: import("#types").FieldType<TypeFromPartialBitSchema<{
                        automatic: import("#types").BitFlag;
                        supportsNames: import("#types").BitFlag;
                    }>>;
                }>[], any>;
                readonly numberOfPresets: import("#types").FixedAttribute<number, any>;
                readonly activePresetHandle: import("#types").Attribute<AllowSharedBufferSource | null, any>;
                readonly presets: import("#types").WritableAttribute<import("#types").TypeFromFields<{
                    presetHandle: import("#types").FieldType<AllowSharedBufferSource | null>;
                    presetScenario: import("#types").FieldType<Thermostat.PresetScenario>;
                    name: import("#types").OptionalFieldType<string | null>;
                    coolingSetpoint: import("#types").OptionalFieldType<number>;
                    heatingSetpoint: import("#types").OptionalFieldType<number>;
                    builtIn: import("#types").FieldType<boolean | null>;
                }>[], any>;
            };
            readonly commands: {
                readonly setActivePresetRequest: import("#types").Command<import("#types").TypeFromFields<{
                    presetHandle: import("#types").FieldType<AllowSharedBufferSource | null>;
                }>, void, any>;
            };
        };
    }, {
        readonly flags: {
            readonly matterScheduleConfiguration: true;
        };
        readonly component: {
            readonly attributes: {
                readonly scheduleTypes: import("#types").FixedAttribute<import("#types").TypeFromFields<{
                    systemMode: import("#types").FieldType<Thermostat.SystemMode>;
                    numberOfSchedules: import("#types").FieldType<number>;
                    scheduleTypeFeatures: import("#types").FieldType<TypeFromPartialBitSchema<{
                        supportsPresets: import("#types").BitFlag;
                        supportsSetpoints: import("#types").BitFlag;
                        supportsNames: import("#types").BitFlag;
                        supportsOff: import("#types").BitFlag;
                    }>>;
                }>[], any>;
                readonly numberOfSchedules: import("#types").FixedAttribute<number, any>;
                readonly numberOfScheduleTransitions: import("#types").FixedAttribute<number, any>;
                readonly numberOfScheduleTransitionPerDay: import("#types").FixedAttribute<number | null, any>;
                readonly activeScheduleHandle: import("#types").Attribute<AllowSharedBufferSource | null, any>;
                readonly schedules: import("#types").WritableAttribute<import("#types").TypeFromFields<{
                    scheduleHandle: import("#types").FieldType<AllowSharedBufferSource | null>;
                    systemMode: import("#types").FieldType<Thermostat.SystemMode>;
                    name: import("#types").OptionalFieldType<string>;
                    presetHandle: import("#types").OptionalFieldType<AllowSharedBufferSource>;
                    transitions: import("#types").FieldType<import("#types").TypeFromFields<{
                        dayOfWeek: import("#types").FieldType<TypeFromPartialBitSchema<{
                            sunday: import("#types").BitFlag;
                            monday: import("#types").BitFlag;
                            tuesday: import("#types").BitFlag;
                            wednesday: import("#types").BitFlag;
                            thursday: import("#types").BitFlag;
                            friday: import("#types").BitFlag;
                            saturday: import("#types").BitFlag;
                            away: import("#types").BitFlag;
                        }>>;
                        transitionTime: import("#types").FieldType<number>;
                        presetHandle: import("#types").OptionalFieldType<AllowSharedBufferSource>;
                        systemMode: import("#types").OptionalFieldType<Thermostat.SystemMode>;
                        coolingSetpoint: import("#types").OptionalFieldType<number>;
                        heatingSetpoint: import("#types").OptionalFieldType<number>;
                    }>[]>;
                    builtIn: import("#types").FieldType<boolean | null>;
                }>[], any>;
            };
            readonly commands: {
                readonly setActiveScheduleRequest: import("#types").Command<import("#types").TypeFromFields<{
                    scheduleHandle: import("#types").FieldType<AllowSharedBufferSource>;
                }>, void, any>;
            };
        };
    }, {
        readonly flags: {
            readonly autoMode: true;
            readonly heating: false;
        };
        readonly component: false;
    }, {
        readonly flags: {
            readonly autoMode: true;
            readonly cooling: false;
        };
        readonly component: false;
    }, {
        readonly flags: {
            readonly heating: false;
            readonly cooling: false;
        };
        readonly component: false;
    }];
}>, typeof ThermostatBaseServer, import("./ThermostatInterface.js").ThermostatInterface>;
export declare class ThermostatServer extends ThermostatServer_base {
}
export {};
//# sourceMappingURL=ThermostatServer.d.ts.map
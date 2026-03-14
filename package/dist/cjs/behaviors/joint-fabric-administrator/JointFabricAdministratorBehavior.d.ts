/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
/*** THIS FILE IS GENERATED, DO NOT EDIT ***/
import { JointFabricAdministrator } from "#clusters/joint-fabric-administrator";
import { ClusterBehavior } from "../../behavior/cluster/ClusterBehavior.js";
import { JointFabricAdministratorInterface } from "./JointFabricAdministratorInterface.js";
import { Identity } from "#general";
/**
 * JointFabricAdministratorBehavior is the base class for objects that support interaction with
 * {@link JointFabricAdministrator.Cluster}.
 */
export declare const JointFabricAdministratorBehaviorConstructor: ClusterBehavior.Type<JointFabricAdministrator.Cluster, ClusterBehavior.Type<import("@matter/types").ClusterType.Of<{
    readonly id: 0;
    readonly revision: 0;
    readonly name: "Unknown";
    readonly attributes: {};
    readonly commands: {};
    readonly events: {};
}>, typeof ClusterBehavior, JointFabricAdministratorInterface>, JointFabricAdministratorInterface>;
export interface JointFabricAdministratorBehaviorConstructor extends Identity<typeof JointFabricAdministratorBehaviorConstructor> {
}
export declare const JointFabricAdministratorBehavior: JointFabricAdministratorBehaviorConstructor;
export interface JointFabricAdministratorBehavior extends InstanceType<JointFabricAdministratorBehaviorConstructor> {
}
export declare namespace JointFabricAdministratorBehavior {
    interface State extends InstanceType<typeof JointFabricAdministratorBehavior.State> {
    }
}
//# sourceMappingURL=JointFabricAdministratorBehavior.d.ts.map
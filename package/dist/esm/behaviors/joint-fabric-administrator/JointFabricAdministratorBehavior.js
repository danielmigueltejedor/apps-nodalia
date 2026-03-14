/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { JointFabricAdministrator } from "#clusters/joint-fabric-administrator";
import { ClusterBehavior } from "../../behavior/cluster/ClusterBehavior.js";
const JointFabricAdministratorBehaviorConstructor = ClusterBehavior.withInterface().for(JointFabricAdministrator.Cluster);
const JointFabricAdministratorBehavior = JointFabricAdministratorBehaviorConstructor;
export {
  JointFabricAdministratorBehavior,
  JointFabricAdministratorBehaviorConstructor
};
//# sourceMappingURL=JointFabricAdministratorBehavior.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { JointFabricDatastore } from "#clusters/joint-fabric-datastore";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const JointFabricDatastoreClientConstructor = ClientBehavior(JointFabricDatastore.Complete);
const JointFabricDatastoreClient = JointFabricDatastoreClientConstructor;
export {
  JointFabricDatastoreClient,
  JointFabricDatastoreClientConstructor
};
//# sourceMappingURL=JointFabricDatastoreClient.js.map

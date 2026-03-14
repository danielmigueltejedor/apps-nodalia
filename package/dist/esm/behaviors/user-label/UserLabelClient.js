/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { UserLabel } from "#clusters/user-label";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const UserLabelClientConstructor = ClientBehavior(UserLabel.Complete);
const UserLabelClient = UserLabelClientConstructor;
export {
  UserLabelClient,
  UserLabelClientConstructor
};
//# sourceMappingURL=UserLabelClient.js.map

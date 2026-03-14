/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { AccountLogin } from "#clusters/account-login";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const AccountLoginClientConstructor = ClientBehavior(AccountLogin.Complete);
const AccountLoginClient = AccountLoginClientConstructor;
export {
  AccountLoginClient,
  AccountLoginClientConstructor
};
//# sourceMappingURL=AccountLoginClient.js.map

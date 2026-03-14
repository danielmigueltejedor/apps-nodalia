/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { GeneralCommissioning } from "#clusters/general-commissioning";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const GeneralCommissioningClientConstructor = ClientBehavior(GeneralCommissioning.Complete);
const GeneralCommissioningClient = GeneralCommissioningClientConstructor;
export {
  GeneralCommissioningClient,
  GeneralCommissioningClientConstructor
};
//# sourceMappingURL=GeneralCommissioningClient.js.map

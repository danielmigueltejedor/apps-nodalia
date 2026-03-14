/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { BasicInformation } from "#clusters/basic-information";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const BasicInformationClientConstructor = ClientBehavior(BasicInformation.Complete);
const BasicInformationClient = BasicInformationClientConstructor;
export {
  BasicInformationClient,
  BasicInformationClientConstructor
};
//# sourceMappingURL=BasicInformationClient.js.map

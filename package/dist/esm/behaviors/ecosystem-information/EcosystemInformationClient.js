/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EcosystemInformation } from "#clusters/ecosystem-information";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const EcosystemInformationClientConstructor = ClientBehavior(EcosystemInformation.Complete);
const EcosystemInformationClient = EcosystemInformationClientConstructor;
export {
  EcosystemInformationClient,
  EcosystemInformationClientConstructor
};
//# sourceMappingURL=EcosystemInformationClient.js.map

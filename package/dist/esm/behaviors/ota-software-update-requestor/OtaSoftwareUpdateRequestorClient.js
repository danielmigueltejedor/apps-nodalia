/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { OtaSoftwareUpdateRequestor } from "#clusters/ota-software-update-requestor";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const OtaSoftwareUpdateRequestorClientConstructor = ClientBehavior(OtaSoftwareUpdateRequestor.Complete);
const OtaSoftwareUpdateRequestorClient = OtaSoftwareUpdateRequestorClientConstructor;
export {
  OtaSoftwareUpdateRequestorClient,
  OtaSoftwareUpdateRequestorClientConstructor
};
//# sourceMappingURL=OtaSoftwareUpdateRequestorClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { UnitLocalization } from "#clusters/unit-localization";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const UnitLocalizationClientConstructor = ClientBehavior(UnitLocalization.Complete);
const UnitLocalizationClient = UnitLocalizationClientConstructor;
export {
  UnitLocalizationClient,
  UnitLocalizationClientConstructor
};
//# sourceMappingURL=UnitLocalizationClient.js.map

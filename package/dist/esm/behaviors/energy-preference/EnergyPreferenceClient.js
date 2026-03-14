/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EnergyPreference } from "#clusters/energy-preference";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const EnergyPreferenceClientConstructor = ClientBehavior(EnergyPreference.Complete);
const EnergyPreferenceClient = EnergyPreferenceClientConstructor;
export {
  EnergyPreferenceClient,
  EnergyPreferenceClientConstructor
};
//# sourceMappingURL=EnergyPreferenceClient.js.map

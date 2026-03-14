/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ValveConfigurationAndControl } from "#clusters/valve-configuration-and-control";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ValveConfigurationAndControlClientConstructor = ClientBehavior(ValveConfigurationAndControl.Complete);
const ValveConfigurationAndControlClient = ValveConfigurationAndControlClientConstructor;
export {
  ValveConfigurationAndControlClient,
  ValveConfigurationAndControlClientConstructor
};
//# sourceMappingURL=ValveConfigurationAndControlClient.js.map

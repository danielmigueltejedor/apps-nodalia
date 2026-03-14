/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ApplicationLauncher } from "#clusters/application-launcher";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const ApplicationLauncherClientConstructor = ClientBehavior(ApplicationLauncher.Complete);
const ApplicationLauncherClient = ApplicationLauncherClientConstructor;
export {
  ApplicationLauncherClient,
  ApplicationLauncherClientConstructor
};
//# sourceMappingURL=ApplicationLauncherClient.js.map

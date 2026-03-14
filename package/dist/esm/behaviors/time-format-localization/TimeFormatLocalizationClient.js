/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { TimeFormatLocalization } from "#clusters/time-format-localization";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const TimeFormatLocalizationClientConstructor = ClientBehavior(TimeFormatLocalization.Complete);
const TimeFormatLocalizationClient = TimeFormatLocalizationClientConstructor;
export {
  TimeFormatLocalizationClient,
  TimeFormatLocalizationClientConstructor
};
//# sourceMappingURL=TimeFormatLocalizationClient.js.map

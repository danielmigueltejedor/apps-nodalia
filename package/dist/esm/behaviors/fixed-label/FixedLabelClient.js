/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { FixedLabel } from "#clusters/fixed-label";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const FixedLabelClientConstructor = ClientBehavior(FixedLabel.Complete);
const FixedLabelClient = FixedLabelClientConstructor;
export {
  FixedLabelClient,
  FixedLabelClientConstructor
};
//# sourceMappingURL=FixedLabelClient.js.map

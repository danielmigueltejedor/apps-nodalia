/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { AirQuality } from "#clusters/air-quality";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const AirQualityClientConstructor = ClientBehavior(AirQuality.Complete);
const AirQualityClient = AirQualityClientConstructor;
export {
  AirQualityClient,
  AirQualityClientConstructor
};
//# sourceMappingURL=AirQualityClient.js.map

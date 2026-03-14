"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var PowerSourceServer_exports = {};
__export(PowerSourceServer_exports, {
  PowerSourceBaseServer: () => PowerSourceBaseServer,
  PowerSourceServer: () => PowerSourceServer
});
module.exports = __toCommonJS(PowerSourceServer_exports);
var import_descriptor = require("#behaviors/descriptor");
var import_power_source = require("#clusters/power-source");
var import_general = require("#general");
var import_types = require("#types");
var import_PowerSourceBehavior = require("./PowerSourceBehavior.js");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const PowerSourceLevelBase = import_PowerSourceBehavior.PowerSourceBehavior.with(import_power_source.PowerSource.Feature.Battery, import_power_source.PowerSource.Feature.Rechargeable);
class PowerSourceBaseServer extends PowerSourceLevelBase {
  async initialize() {
    (await this.agent.load(import_descriptor.DescriptorServer)).addDeviceTypes("PowerSource");
    [
      this.events.batPercentRemaining$Changed,
      this.events.batTimeRemaining$Changed,
      this.events.batTimeToFullCharge$Changed
    ].forEach((event) => {
      if (event !== void 0) {
        event.quiet.minimumEmitInterval = (0, import_general.Seconds)(10);
      }
    });
    if (this.state.status === void 0) {
      this.state.status = import_power_source.PowerSource.PowerSourceStatus.Unspecified;
    }
    if (this.state.description === void 0) {
      if (this.features.wired) {
        this.state.description = "Mains power";
      } else if (this.features.battery) {
        this.state.description = "Battery power";
      }
    }
    if (this.features.battery) {
      if (this.state.batChargeLevel === void 0) {
        this.state.batChargeLevel = import_power_source.PowerSource.BatChargeLevel.Ok;
      }
      if (this.state.batReplaceability === void 0) {
        this.state.batReplaceability = import_power_source.PowerSource.BatReplaceability.Unspecified;
      }
    }
    if (this.features.wired) {
      const state = this.state;
      if (state.wiredCurrentType === void 0) {
        state.wiredCurrentType = import_power_source.PowerSource.WiredCurrentType.Ac;
      }
    }
  }
}
class PowerSourceServer extends PowerSourceBaseServer.for((0, import_types.ClusterType)(import_power_source.PowerSource.Base)) {
}
//# sourceMappingURL=PowerSourceServer.js.map

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
var ControllerBehavior_exports = {};
__export(ControllerBehavior_exports, {
  ControllerBehavior: () => ControllerBehavior
});
module.exports = __toCommonJS(ControllerBehavior_exports);
var import_Behavior = require("#behavior/Behavior.js");
var import_basic_information = require("#behaviors/basic-information");
var import_general = require("#general");
var import_Node = require("#node/Node.js");
var import_protocol = require("#protocol");
var import_CommissioningServer = require("../commissioning/CommissioningServer.js");
var import_NetworkServer = require("../network/NetworkServer.js");
var import_ActiveDiscoveries = require("./discovery/ActiveDiscoveries.js");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const logger = import_general.Logger.get("ControllerBehavior");
class ControllerBehavior extends import_Behavior.Behavior {
  static id = "controller";
  async initialize() {
    if (this.state.adminFabricLabel === void 0 || this.state.adminFabricLabel === "") {
      throw new import_general.ImplementationError("adminFabricLabel must be set for ControllerBehavior");
    }
    const node = import_Node.Node.forEndpoint(this.endpoint);
    if (this.state.ip === void 0) {
      this.state.ip = true;
    }
    if (this.state.ip !== false) {
      this.internal.services = this.env.asDependent();
      this.env.get(import_protocol.ScannerSet).add((await this.internal.services.load(import_protocol.MdnsService)).client);
    }
    if (this.state.ble === void 0) {
      this.state.ble = (await this.agent.load(import_NetworkServer.NetworkServer)).state.ble;
    }
    if (this.state.ble !== false) {
      try {
        this.env.get(import_protocol.ScannerSet).add(this.env.get(import_protocol.Ble).scanner);
      } catch (error) {
        logger.error("Disabling BLE due to initialization error:", error);
        this.state.ble = false;
      }
    }
    await this.env.load(import_protocol.FabricAuthority);
    const commissioning = this.agent.get(import_CommissioningServer.CommissioningServer);
    if (commissioning.state.enabled === void 0) {
      const totalFabrics = this.env.get(import_protocol.FabricManager).length;
      const controlledFabrics = this.env.get(import_protocol.FabricAuthority).fabrics.length;
      if (controlledFabrics === totalFabrics) {
        commissioning.state.enabled = false;
      }
    }
    this.reactTo(node.lifecycle.online, this.#nodeOnline);
    if (node.lifecycle.isOnline) {
      await this.#nodeOnline();
    }
    this.reactTo(node.lifecycle.goingOffline, this.#nodeGoingOffline);
  }
  async [Symbol.asyncDispose]() {
    await this.env.close(import_ActiveDiscoveries.ActiveDiscoveries);
    this.env.delete(import_protocol.FabricAuthority);
    this.env.delete(import_protocol.ScannerSet);
    await this.internal.services?.close();
  }
  get fabricAuthorityConfig() {
    const biState = this.endpoint.stateOf(import_basic_information.BasicInformationBehavior);
    return {
      adminVendorId: biState.vendorId,
      ...this.state
    };
  }
  async #nodeOnline() {
    const netTransports = this.env.get(import_general.ConnectionlessTransportSet);
    if (this.state.ble) {
      netTransports.add(this.env.get(import_protocol.Ble).centralInterface);
    }
    const authority = this.env.get(import_protocol.FabricAuthority);
    for (const fabric of authority.fabrics) {
      if (fabric.label !== this.state.adminFabricLabel) {
        await fabric.setLabel(this.state.adminFabricLabel);
      }
      this.#enableScanningForFabric(fabric);
    }
    this.reactTo(authority.fabricAdded, this.#enableScanningForFabric);
    const scanners = this.env.get(import_protocol.ScannerSet);
    for (const scanner of scanners) {
      this.#enableScanningForScanner(scanner);
    }
    this.reactTo(scanners.added, this.#enableScanningForScanner);
  }
  async #nodeGoingOffline() {
    await this.env.close(import_protocol.ClientSubscriptions);
    const scanners = this.env.get(import_protocol.ScannerSet);
    for (const scanner of scanners) {
      if (scanner instanceof import_protocol.MdnsClient) {
        scanner.targetCriteriaProviders.delete(this.internal.mdnsTargetCriteria);
      }
    }
    this.internal.mdnsTargetCriteria.operationalTargets.length = 0;
    const netTransports = this.env.get(import_general.ConnectionlessTransportSet);
    if (this.state.ble) {
      netTransports.delete(this.env.get(import_protocol.Ble).centralInterface);
    }
  }
  #enableScanningForFabric(fabric) {
    this.internal.mdnsTargetCriteria.operationalTargets.push({ fabricId: fabric.globalId });
  }
  #enableScanningForScanner(scanner) {
    if (!(scanner instanceof import_protocol.MdnsClient)) {
      return;
    }
    scanner.targetCriteriaProviders.add(this.internal.mdnsTargetCriteria);
  }
}
((ControllerBehavior2) => {
  class Internal {
    /**
     * MDNS scanner criteria for each controlled fabric (keyed by operational ID).
     */
    mdnsTargetCriteria = {
      commissionable: true,
      operationalTargets: []
    };
    services;
  }
  ControllerBehavior2.Internal = Internal;
  class State {
    /**
     * Set to false to disable scanning on BLE.
     *
     * By default the controller scans via BLE if BLE is available.
     */
    ble = void 0;
    /**
     * Set to false to disable scanning on IP networks.
     *
     * By default the controller always scans on IP networks.
     */
    ip = void 0;
    /**
     * Node ID assignment strategy.
     */
    nodeIdAssignment = "sequential";
    /**
     * Next assigned ID when {@link nodeIdAssignment} is "sequential".
     *
     * matter.js increments this value automatically after allocating a new node ID.  This means that the
     * "sequential" strategy does not reuse IDs from decommissioned nodes.
     *
     * If there is a conflict with an existing ID, matter.js increments this value until it identifies a free ID.
     */
    nextNodeId;
    /**
     * Contains the label of the admin fabric which is set for all commissioned devices
     */
    adminFabricLabel = "matter.js";
    /**
     * Contains the FabricId of the admin fabric when a defined number needs to be used because special Certificates
     * are used.
     * If not provided, a random FabricId will be generated.
     */
    adminFabricId = void 0;
    /**
     * Contains the NodeId of the admin node when a defined number needs to be used because special Certificates
     * are used.
     * If not provided, a random NodeId will be generated.
     */
    adminNodeId = void 0;
    /**
     * Case Authenticated Tags to be used to commission and connect to devices.
     */
    caseAuthenticatedTags = void 0;
  }
  ControllerBehavior2.State = State;
})(ControllerBehavior || (ControllerBehavior = {}));
//# sourceMappingURL=ControllerBehavior.js.map

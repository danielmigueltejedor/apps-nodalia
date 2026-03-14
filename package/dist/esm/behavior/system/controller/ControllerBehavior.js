/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Behavior } from "#behavior/Behavior.js";
import { BasicInformationBehavior } from "#behaviors/basic-information";
import { ConnectionlessTransportSet, ImplementationError, Logger } from "#general";
import { Node } from "#node/Node.js";
import {
  Ble,
  ClientSubscriptions,
  FabricAuthority,
  FabricManager,
  MdnsClient,
  MdnsService,
  ScannerSet
} from "#protocol";
import { CommissioningServer } from "../commissioning/CommissioningServer.js";
import { NetworkServer } from "../network/NetworkServer.js";
import { ActiveDiscoveries } from "./discovery/ActiveDiscoveries.js";
const logger = Logger.get("ControllerBehavior");
class ControllerBehavior extends Behavior {
  static id = "controller";
  async initialize() {
    if (this.state.adminFabricLabel === void 0 || this.state.adminFabricLabel === "") {
      throw new ImplementationError("adminFabricLabel must be set for ControllerBehavior");
    }
    const node = Node.forEndpoint(this.endpoint);
    if (this.state.ip === void 0) {
      this.state.ip = true;
    }
    if (this.state.ip !== false) {
      this.internal.services = this.env.asDependent();
      this.env.get(ScannerSet).add((await this.internal.services.load(MdnsService)).client);
    }
    if (this.state.ble === void 0) {
      this.state.ble = (await this.agent.load(NetworkServer)).state.ble;
    }
    if (this.state.ble !== false) {
      try {
        this.env.get(ScannerSet).add(this.env.get(Ble).scanner);
      } catch (error) {
        logger.error("Disabling BLE due to initialization error:", error);
        this.state.ble = false;
      }
    }
    await this.env.load(FabricAuthority);
    const commissioning = this.agent.get(CommissioningServer);
    if (commissioning.state.enabled === void 0) {
      const totalFabrics = this.env.get(FabricManager).length;
      const controlledFabrics = this.env.get(FabricAuthority).fabrics.length;
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
    await this.env.close(ActiveDiscoveries);
    this.env.delete(FabricAuthority);
    this.env.delete(ScannerSet);
    await this.internal.services?.close();
  }
  get fabricAuthorityConfig() {
    const biState = this.endpoint.stateOf(BasicInformationBehavior);
    return {
      adminVendorId: biState.vendorId,
      ...this.state
    };
  }
  async #nodeOnline() {
    const netTransports = this.env.get(ConnectionlessTransportSet);
    if (this.state.ble) {
      netTransports.add(this.env.get(Ble).centralInterface);
    }
    const authority = this.env.get(FabricAuthority);
    for (const fabric of authority.fabrics) {
      if (fabric.label !== this.state.adminFabricLabel) {
        await fabric.setLabel(this.state.adminFabricLabel);
      }
      this.#enableScanningForFabric(fabric);
    }
    this.reactTo(authority.fabricAdded, this.#enableScanningForFabric);
    const scanners = this.env.get(ScannerSet);
    for (const scanner of scanners) {
      this.#enableScanningForScanner(scanner);
    }
    this.reactTo(scanners.added, this.#enableScanningForScanner);
  }
  async #nodeGoingOffline() {
    await this.env.close(ClientSubscriptions);
    const scanners = this.env.get(ScannerSet);
    for (const scanner of scanners) {
      if (scanner instanceof MdnsClient) {
        scanner.targetCriteriaProviders.delete(this.internal.mdnsTargetCriteria);
      }
    }
    this.internal.mdnsTargetCriteria.operationalTargets.length = 0;
    const netTransports = this.env.get(ConnectionlessTransportSet);
    if (this.state.ble) {
      netTransports.delete(this.env.get(Ble).centralInterface);
    }
  }
  #enableScanningForFabric(fabric) {
    this.internal.mdnsTargetCriteria.operationalTargets.push({ fabricId: fabric.globalId });
  }
  #enableScanningForScanner(scanner) {
    if (!(scanner instanceof MdnsClient)) {
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
export {
  ControllerBehavior
};
//# sourceMappingURL=ControllerBehavior.js.map

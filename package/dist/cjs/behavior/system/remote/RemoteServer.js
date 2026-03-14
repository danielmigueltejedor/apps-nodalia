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
var RemoteServer_exports = {};
__export(RemoteServer_exports, {
  RemoteServer: () => RemoteServer
});
module.exports = __toCommonJS(RemoteServer_exports);
var import_Behavior = require("#behavior/Behavior.js");
var import_EndpointInitializer = require("#endpoint/properties/EndpointInitializer.js");
var import_general = require("#general");
var import_model = require("#model");
var import_ServerEndpointInitializer = require("#node/server/ServerEndpointInitializer.js");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class RemoteServer extends import_Behavior.Behavior {
  static early = true;
  static interfaceType;
  async initialize() {
    if (!(this.env.get(import_EndpointInitializer.EndpointInitializer) instanceof import_ServerEndpointInitializer.ServerEndpointInitializer)) {
      throw new import_general.ImplementationError("Remote server is not installed in a ServerNode");
    }
    this.reactTo(this.endpoint.lifecycle.online, this.#start);
    this.reactTo(this.endpoint.lifecycle.offline, this.#onOffline);
    this.reactTo(this.endpoint.lifecycle.destroying, this.#stop);
    if (this.state.allowOfflineUse) {
      await this.#start();
    }
  }
  [Symbol.asyncDispose]() {
    return this.#stop();
  }
  async #start() {
    if (!this.state.enabled || this.internal.interface) {
      return;
    }
    const interfaceType = this.constructor.interfaceType;
    if (typeof interfaceType !== "function") {
      throw new import_general.InternalError(`Remote server ${this.constructor.name} does not define a remote interface`);
    }
    const address = new import_general.AppAddress(this.state.address);
    const intf = await interfaceType.create(this.endpoint, address);
    this.internal.interface = intf;
  }
  async #stop() {
    const { interface: intf } = this.internal;
    if (!intf) {
      return;
    }
    this.internal.interface = void 0;
    await intf.close();
  }
  async #onOffline() {
    if (!this.state.allowOfflineUse) {
      await this.#stop();
    }
  }
  static schema = new import_model.DatatypeModel(
    {
      name: "ApiState",
      type: "struct"
    },
    (0, import_model.FieldElement)({ name: "address", type: "string" }),
    (0, import_model.FieldElement)({ name: "enabled", type: "bool" }),
    (0, import_model.FieldElement)({ name: "allowOfflineUse", type: "bool" })
  );
}
((RemoteServer2) => {
  class Internal {
    interface;
  }
  RemoteServer2.Internal = Internal;
  class State {
    /**
     * The public address at which the service endpoint is accessible.
     *
     * The address is a URL.  See subclasses for supported protocols.  An "s" suffix indicates standard TLS support.
     * The "+unix" suffix indicates that the hostname is a URL encoded path to a UNIX socket.  The socket path may
     * be absolute or relative to the node's storage root.
     *
     * The path portion of the URL generally acts as a namespace prefix for the relevant protocol implementation.
     * Matter.js replaces the special token `{node}` in the URL with the {@link ServerNode.id}.  This allows for
     * multiple nodes to participate in a protocol in separate namespaces.
     */
    address = "";
    /**
     * Set to false to disable this service.
     */
    enabled = true;
    /**
     * By default the HTTP endpoint is available as soon as the {@link Node} initializes.
     *
     * If you set this to false, the HTTP endpoint is only available when the {@link Node}'s Matter networking is
     * also online.
     */
    allowOfflineUse = true;
  }
  RemoteServer2.State = State;
})(RemoteServer || (RemoteServer = {}));
//# sourceMappingURL=RemoteServer.js.map

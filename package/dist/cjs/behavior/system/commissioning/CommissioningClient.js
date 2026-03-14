"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var CommissioningClient_exports = {};
__export(CommissioningClient_exports, {
  CommissioningClient: () => CommissioningClient
});
module.exports = __toCommonJS(CommissioningClient_exports);
var import_Behavior = require("#behavior/Behavior.js");
var import_Events = require("#behavior/Events.js");
var import_SoftwareUpdateManager = require("#behavior/system/software-update/SoftwareUpdateManager.js");
var import_operational_credentials = require("#behaviors/operational-credentials");
var import_ota_software_update_provider = require("#behaviors/ota-software-update-provider");
var import_operational_credentials2 = require("#clusters/operational-credentials");
var import_general = require("#general");
var import_model = require("#model");
var import_IdentityService = require("#node/server/IdentityService.js");
var import_protocol = require("#protocol");
var import_types = require("#types");
var import_ControllerBehavior = require("../controller/ControllerBehavior.js");
var import_NetworkClient = require("../network/NetworkClient.js");
var import_RemoteDescriptor = require("./RemoteDescriptor.js");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const logger = import_general.Logger.get("CommissioningClient");
class CommissioningClient extends import_Behavior.Behavior {
  static early = true;
  static id = "commissioning";
  initialize(options) {
    const descriptor = options?.descriptor;
    if (descriptor) {
      this.descriptor = descriptor;
    }
    if (this.state.discoveredAt === void 0) {
      this.state.discoveredAt = import_general.Time.nowMs;
    }
    if (this.state.peerAddress !== void 0) {
      this.state.peerAddress = (0, import_protocol.PeerAddress)(this.state.peerAddress);
    }
    const node = this.endpoint;
    this.reactTo(node.lifecycle.partsReady, this.#initializeNode);
    this.reactTo(node.lifecycle.online, this.#nodeOnline);
    this.reactTo(this.events.peerAddress$Changed, this.#peerAddressChanged);
    this.reactTo(this.events.addresses$Changed, this.#operationalAddressesChanged);
  }
  #nodeOnline() {
    if (this.state.peerAddress !== void 0) {
      this.#updateAddresses(this.state.peerAddress);
    }
  }
  #findServerOtaProviderEndpoint() {
    const node = this.endpoint.owner;
    for (const endpoint of node.endpoints) {
      if (endpoint.behaviors.has(import_ota_software_update_provider.OtaSoftwareUpdateProviderServer)) {
        return endpoint;
      }
    }
  }
  async commission(options) {
    const node = this.endpoint;
    if (this.state.peerAddress !== void 0) {
      throw new import_general.ImplementationError(`${node} is already commissioned`);
    }
    if (typeof options === "number") {
      options = { passcode: options };
    } else if (typeof options === "string") {
      options = { pairingCode: options };
    }
    const opts = CommissioningClient.PasscodeOptions(options);
    let { passcode } = opts;
    if (!Number.isFinite(passcode)) {
      passcode = Number.parseInt(passcode);
      if (!Number.isFinite(passcode)) {
        throw new import_general.ImplementationError(`You must provide the numeric passcode to commission a node`);
      }
    }
    await node.owner?.act((agent) => agent.load(import_ControllerBehavior.ControllerBehavior));
    const fabricAuthority = opts.fabricAuthority ?? this.env.get(import_protocol.FabricAuthority);
    let { fabric } = opts;
    if (fabric === void 0) {
      if (this.context.fabric === void 0) {
        const config = await node.owner?.act((agent) => agent.get(import_ControllerBehavior.ControllerBehavior).fabricAuthorityConfig);
        if (config === void 0) {
          throw new import_general.ImplementationError(
            `Cannot commission ${node} because no fabric was specified and the controller has no fabric configuration`
          );
        }
        fabric = await fabricAuthority.defaultFabric(config);
      } else {
        fabric = node.env.get(import_protocol.FabricManager).for(this.context.fabric);
      }
    }
    if (!fabricAuthority.hasControlOf(fabric)) {
      throw new import_general.ImplementationError(
        `Cannot commission ${node} fabric ${fabric.fabricIndex} because we do not control this fabric`
      );
    }
    const addresses = this.state.addresses;
    if (!addresses?.length) {
      throw new import_general.ImplementationError(`Cannot commission ${node} because the node has not been located`);
    }
    const commissioner = node.env.get(import_protocol.ControllerCommissioner);
    const identityService = node.env.get(import_IdentityService.IdentityService);
    const address = await identityService.assignNodeAddress(node, fabric.fabricIndex, opts.nodeId);
    const commissioningOptions = {
      addresses: addresses.map(import_general.ServerAddress),
      fabric,
      nodeId: address.nodeId,
      passcode,
      discoveryData: this.descriptor,
      commissioningFlowImpl: options.commissioningFlowImpl
      // TODO Allow to configure all relevant commissioning options like
      //  * wifi/thread credentials
      //  * regulatory config
      //  * custom otaUpdateProviderLocation
    };
    const otaProviderEndpoint = this.#findServerOtaProviderEndpoint();
    if (otaProviderEndpoint !== void 0 && otaProviderEndpoint.stateOf(import_SoftwareUpdateManager.SoftwareUpdateManager).announceAsDefaultProvider) {
      commissioningOptions.otaUpdateProviderLocation = {
        nodeId: fabric.rootNodeId,
        endpoint: otaProviderEndpoint.number
      };
    }
    if (this.finalizeCommissioning !== CommissioningClient.prototype.finalizeCommissioning) {
      commissioningOptions.finalizeCommissioning = this.finalizeCommissioning.bind(this);
    }
    try {
      await commissioner.commission(commissioningOptions);
      this.state.peerAddress = address;
      this.state.commissionedAt = import_general.Time.nowMs;
    } catch (e) {
      identityService.releaseNodeAddress(address);
      throw e;
    }
    await this.context.transaction.commit();
    const network = this.agent.get(import_NetworkClient.NetworkClient);
    network.state.defaultSubscription = opts.defaultSubscription;
    network.state.autoSubscribe = opts.autoSubscribe !== false;
    network.state.caseAuthenticatedTags = opts.caseAuthenticatedTags;
    logger.notice(
      "Commissioned",
      import_general.Diagnostic.strong(this.endpoint.id),
      "as",
      import_general.Diagnostic.strong(this.endpoint.identity)
    );
    node.lifecycle.commissioned.emit(this.context);
    await node.start();
    return node;
  }
  /**
   * Remove this node from the fabric.
   *
   * After removal the {@link ClientNode} remains intact.  You can use {@link ClientNode#delete} to remove the node
   * permanently.
   *
   * Only legal if this node controls the peer's fabric.
   */
  async decommission() {
    const { peerAddress } = this.state;
    if (peerAddress === void 0) {
      throw new import_general.ImplementationError("Cannot decommission node that is not commissioned");
    }
    const formerAddress = (0, import_protocol.PeerAddress)(peerAddress).toString();
    const opcreds = this.agent.get(import_operational_credentials.OperationalCredentialsClient);
    const fabricIndex = opcreds.state.currentFabricIndex;
    logger.debug(`Removing node ${formerAddress} by removing fabric ${fabricIndex} on the node`);
    const result = await opcreds.removeFabric({ fabricIndex });
    if (result.statusCode !== import_operational_credentials2.OperationalCredentials.NodeOperationalCertStatus.Ok) {
      throw new import_general.MatterError(
        `Removing node ${formerAddress} failed with status ${result.statusCode} "${result.debugText}".`
      );
    }
    this.state.peerAddress = void 0;
    this.state.commissionedAt = void 0;
    await this.context.transaction.commit();
    logger.info(
      "Decommissioned",
      import_general.Diagnostic.strong(this.endpoint.id),
      "formerly",
      import_general.Diagnostic.strong(formerAddress)
    );
  }
  /**
   * Override to implement CASE commissioning yourself.
   *
   * If you override, matter.js commissions to the point where commissioning over PASE is complete.  You must then
   * complete commissioning yourself by connecting to the device and invokeint the "CommissioningComplete" command.
   */
  async finalizeCommissioning(_address, _discoveryData) {
    throw new import_general.NotImplementedError();
  }
  get descriptor() {
    return import_RemoteDescriptor.RemoteDescriptor.fromLongForm(this.state);
  }
  set descriptor(descriptor) {
    import_RemoteDescriptor.RemoteDescriptor.toLongForm(descriptor, this.state);
  }
  #initializeNode() {
    const endpoint = this.endpoint;
    endpoint.lifecycle.initialized.emit(this.state.peerAddress !== void 0);
  }
  #operationalAddressesChanged(newAddresses, oldAddresses) {
    if (newAddresses === void 0) {
      logger.info("Operational address for", import_general.Diagnostic.strong((0, import_protocol.PeerAddress)(this.state.peerAddress)), "cleared");
      return;
    }
    const newAddressesStr = newAddresses?.map((a) => import_general.ServerAddress.urlFor(a)).join(", ");
    if (oldAddresses === void 0) {
      logger.info(
        "Operational address for",
        import_general.Diagnostic.strong((0, import_protocol.PeerAddress)(this.state.peerAddress)),
        "set to",
        import_general.Diagnostic.weak(newAddressesStr)
      );
      return;
    }
    const oldAddressesStr = oldAddresses.map((a) => import_general.ServerAddress.urlFor(a)).join(", ");
    if (oldAddressesStr !== newAddressesStr) {
      logger.info(
        "Operational address changed for",
        import_general.Diagnostic.strong((0, import_protocol.PeerAddress)(this.state.peerAddress)),
        "from",
        import_general.Diagnostic.weak(oldAddressesStr),
        "to",
        import_general.Diagnostic.weak(newAddressesStr)
      );
    }
  }
  #updateAddresses(addr) {
    const node = this.endpoint;
    if (!node.env.has(import_protocol.PeerSet)) {
      return;
    }
    const peer = node.env.get(import_protocol.PeerSet).for(addr);
    if (peer) {
      if (peer.descriptor.operationalAddress) {
        this.state.addresses = [peer.descriptor.operationalAddress];
      }
      this.descriptor = peer.descriptor.discoveryData;
    }
  }
  #peerAddressChanged(addr) {
    const node = this.endpoint;
    if (addr) {
      this.#updateAddresses(addr);
      node.lifecycle.commissioned.emit(this.context);
    } else {
      node.lifecycle.decommissioned.emit(this.context);
    }
  }
}
((CommissioningClient2) => {
  var _nodeId_dec, _fabricIndex_dec, _init, _activeThreshold_dec, _activeInterval_dec, _idleInterval_dec, _init2, _discoveredAt_dec, _ttl_dec, _peripheralAddress_dec, _port_dec, _ip_dec, _type_dec, _init3, _longIdleTimeOperatingMode_dec, _tcpSupport_dec, _sessionIntervals_dec, _pairingInstructions_dec, _pairingHint_dec, _rotatingIdentifier_dec, _deviceName_dec, _deviceType_dec, _productId_dec, _vendorId_dec, _commissioningMode_dec, _discriminator_dec, _deviceIdentifier_dec, _ttl_dec2, _commissionedAt_dec, _offlineAt_dec, _onlineAt_dec, _discoveredAt_dec2, _addresses_dec, _peerAddress_dec, _init4;
  _fabricIndex_dec = [(0, import_model.field)(import_model.fabricIdx, import_model.mandatory)], _nodeId_dec = [(0, import_model.field)(import_model.nodeId, import_model.mandatory)];
  class PeerAddress2 {
    constructor(fabricIndex, nodeId2) {
      __publicField(this, "fabricIndex", __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
      __publicField(this, "nodeId", __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
      this.fabricIndex = fabricIndex;
      this.nodeId = nodeId2;
    }
  }
  _init = __decoratorStart(null);
  __decorateElement(_init, 5, "fabricIndex", _fabricIndex_dec, PeerAddress2);
  __decorateElement(_init, 5, "nodeId", _nodeId_dec, PeerAddress2);
  __decoratorMetadata(_init, PeerAddress2);
  CommissioningClient2.PeerAddress = PeerAddress2;
  _idleInterval_dec = [(0, import_model.field)(import_model.duration.extend({ constraint: "max 3600000" }))], _activeInterval_dec = [(0, import_model.field)(import_model.duration.extend({ constraint: "max 3600000" }))], _activeThreshold_dec = [(0, import_model.field)(import_model.duration.extend({ constraint: "max 65535" }))];
  class SessionIntervals {
    constructor(intervals) {
      __publicField(this, "idleInterval", __runInitializers(_init2, 8, this)), __runInitializers(_init2, 11, this);
      __publicField(this, "activeInterval", __runInitializers(_init2, 12, this)), __runInitializers(_init2, 15, this);
      __publicField(this, "activeThreshold", __runInitializers(_init2, 16, this)), __runInitializers(_init2, 19, this);
      this.idleInterval = intervals.idleInterval;
      this.activeInterval = intervals.activeInterval;
      this.activeThreshold = intervals.activeThreshold;
    }
  }
  _init2 = __decoratorStart(null);
  __decorateElement(_init2, 5, "idleInterval", _idleInterval_dec, SessionIntervals);
  __decorateElement(_init2, 5, "activeInterval", _activeInterval_dec, SessionIntervals);
  __decorateElement(_init2, 5, "activeThreshold", _activeThreshold_dec, SessionIntervals);
  __decoratorMetadata(_init2, SessionIntervals);
  CommissioningClient2.SessionIntervals = SessionIntervals;
  _type_dec = [(0, import_model.field)(import_model.string, import_model.mandatory)], _ip_dec = [(0, import_model.field)(import_model.string)], _port_dec = [(0, import_model.field)(import_model.uint16)], _peripheralAddress_dec = [(0, import_model.field)(import_model.string)], _ttl_dec = [(0, import_model.field)(import_model.uint32)], _discoveredAt_dec = [(0, import_model.field)(import_model.systimeMs)];
  class NetworkAddress {
    constructor(address) {
      __publicField(this, "type", __runInitializers(_init3, 8, this)), __runInitializers(_init3, 11, this);
      __publicField(this, "ip", __runInitializers(_init3, 12, this)), __runInitializers(_init3, 15, this);
      __publicField(this, "port", __runInitializers(_init3, 16, this)), __runInitializers(_init3, 19, this);
      __publicField(this, "peripheralAddress", __runInitializers(_init3, 20, this)), __runInitializers(_init3, 23, this);
      __publicField(this, "ttl", __runInitializers(_init3, 24, this)), __runInitializers(_init3, 27, this);
      __publicField(this, "discoveredAt", __runInitializers(_init3, 28, this)), __runInitializers(_init3, 31, this);
      this.type = address.type;
      this.ip = address.ip;
      this.port = address.port;
      this.peripheralAddress = address.peripheralAddress;
      this.ttl = address.ttl;
      this.discoveredAt = address.discoveredAt;
    }
  }
  _init3 = __decoratorStart(null);
  __decorateElement(_init3, 5, "type", _type_dec, NetworkAddress);
  __decorateElement(_init3, 5, "ip", _ip_dec, NetworkAddress);
  __decorateElement(_init3, 5, "port", _port_dec, NetworkAddress);
  __decorateElement(_init3, 5, "peripheralAddress", _peripheralAddress_dec, NetworkAddress);
  __decorateElement(_init3, 5, "ttl", _ttl_dec, NetworkAddress);
  __decorateElement(_init3, 5, "discoveredAt", _discoveredAt_dec, NetworkAddress);
  __decoratorMetadata(_init3, NetworkAddress);
  CommissioningClient2.NetworkAddress = NetworkAddress;
  _peerAddress_dec = [(0, import_model.field)(PeerAddress2, import_model.nonvolatile)], _addresses_dec = [(0, import_model.field)((0, import_model.listOf)(NetworkAddress), import_model.nonvolatile)], _discoveredAt_dec2 = [(0, import_model.field)(import_model.systimeMs, import_model.nonvolatile)], _onlineAt_dec = [(0, import_model.field)(import_model.systimeMs)], _offlineAt_dec = [(0, import_model.field)(import_model.systimeMs)], _commissionedAt_dec = [(0, import_model.field)(import_model.systimeMs, import_model.nonvolatile)], _ttl_dec2 = [(0, import_model.field)(import_model.duration, import_model.nonvolatile)], _deviceIdentifier_dec = [(0, import_model.field)(import_model.string, import_model.nonvolatile)], _discriminator_dec = [(0, import_model.field)(import_model.uint16, import_model.nonvolatile)], _commissioningMode_dec = [(0, import_model.field)(import_model.uint8, import_model.nonvolatile)], _vendorId_dec = [(0, import_model.field)(import_model.vendorId, import_model.nonvolatile)], _productId_dec = [(0, import_model.field)(import_model.uint16, import_model.nonvolatile)], _deviceType_dec = [(0, import_model.field)(import_model.uint16, import_model.nonvolatile)], _deviceName_dec = [(0, import_model.field)(import_model.string, import_model.nonvolatile)], _rotatingIdentifier_dec = [(0, import_model.field)(import_model.string, import_model.nonvolatile)], _pairingHint_dec = [(0, import_model.field)(import_model.uint32, import_model.nonvolatile)], _pairingInstructions_dec = [(0, import_model.field)(import_model.string, import_model.nonvolatile)], _sessionIntervals_dec = [(0, import_model.field)(SessionIntervals, import_model.nonvolatile)], _tcpSupport_dec = [(0, import_model.field)(import_model.uint8, import_model.nonvolatile)], _longIdleTimeOperatingMode_dec = [(0, import_model.field)(import_model.bool, import_model.nonvolatile)];
  class State {
    constructor() {
      __publicField(this, "peerAddress", __runInitializers(_init4, 8, this)), __runInitializers(_init4, 11, this);
      __publicField(this, "addresses", __runInitializers(_init4, 12, this)), __runInitializers(_init4, 15, this);
      __publicField(this, "discoveredAt", __runInitializers(_init4, 16, this)), __runInitializers(_init4, 19, this);
      __publicField(this, "onlineAt", __runInitializers(_init4, 20, this)), __runInitializers(_init4, 23, this);
      __publicField(this, "offlineAt", __runInitializers(_init4, 24, this)), __runInitializers(_init4, 27, this);
      __publicField(this, "commissionedAt", __runInitializers(_init4, 28, this)), __runInitializers(_init4, 31, this);
      __publicField(this, "ttl", __runInitializers(_init4, 32, this)), __runInitializers(_init4, 35, this);
      __publicField(this, "deviceIdentifier", __runInitializers(_init4, 36, this)), __runInitializers(_init4, 39, this);
      __publicField(this, "discriminator", __runInitializers(_init4, 40, this)), __runInitializers(_init4, 43, this);
      __publicField(this, "commissioningMode", __runInitializers(_init4, 44, this)), __runInitializers(_init4, 47, this);
      __publicField(this, "vendorId", __runInitializers(_init4, 48, this)), __runInitializers(_init4, 51, this);
      __publicField(this, "productId", __runInitializers(_init4, 52, this)), __runInitializers(_init4, 55, this);
      __publicField(this, "deviceType", __runInitializers(_init4, 56, this)), __runInitializers(_init4, 59, this);
      __publicField(this, "deviceName", __runInitializers(_init4, 60, this)), __runInitializers(_init4, 63, this);
      __publicField(this, "rotatingIdentifier", __runInitializers(_init4, 64, this)), __runInitializers(_init4, 67, this);
      __publicField(this, "pairingHint", __runInitializers(_init4, 68, this)), __runInitializers(_init4, 71, this);
      __publicField(this, "pairingInstructions", __runInitializers(_init4, 72, this)), __runInitializers(_init4, 75, this);
      __publicField(this, "sessionIntervals", __runInitializers(_init4, 76, this)), __runInitializers(_init4, 79, this);
      __publicField(this, "tcpSupport", __runInitializers(_init4, 80, this)), __runInitializers(_init4, 83, this);
      __publicField(this, "longIdleTimeOperatingMode", __runInitializers(_init4, 84, this)), __runInitializers(_init4, 87, this);
    }
  }
  _init4 = __decoratorStart(null);
  __decorateElement(_init4, 5, "peerAddress", _peerAddress_dec, State);
  __decorateElement(_init4, 5, "addresses", _addresses_dec, State);
  __decorateElement(_init4, 5, "discoveredAt", _discoveredAt_dec2, State);
  __decorateElement(_init4, 5, "onlineAt", _onlineAt_dec, State);
  __decorateElement(_init4, 5, "offlineAt", _offlineAt_dec, State);
  __decorateElement(_init4, 5, "commissionedAt", _commissionedAt_dec, State);
  __decorateElement(_init4, 5, "ttl", _ttl_dec2, State);
  __decorateElement(_init4, 5, "deviceIdentifier", _deviceIdentifier_dec, State);
  __decorateElement(_init4, 5, "discriminator", _discriminator_dec, State);
  __decorateElement(_init4, 5, "commissioningMode", _commissioningMode_dec, State);
  __decorateElement(_init4, 5, "vendorId", _vendorId_dec, State);
  __decorateElement(_init4, 5, "productId", _productId_dec, State);
  __decorateElement(_init4, 5, "deviceType", _deviceType_dec, State);
  __decorateElement(_init4, 5, "deviceName", _deviceName_dec, State);
  __decorateElement(_init4, 5, "rotatingIdentifier", _rotatingIdentifier_dec, State);
  __decorateElement(_init4, 5, "pairingHint", _pairingHint_dec, State);
  __decorateElement(_init4, 5, "pairingInstructions", _pairingInstructions_dec, State);
  __decorateElement(_init4, 5, "sessionIntervals", _sessionIntervals_dec, State);
  __decorateElement(_init4, 5, "tcpSupport", _tcpSupport_dec, State);
  __decorateElement(_init4, 5, "longIdleTimeOperatingMode", _longIdleTimeOperatingMode_dec, State);
  __decoratorMetadata(_init4, State);
  CommissioningClient2.State = State;
  class Events extends import_Events.Events {
    peerAddress$Changed = new import_general.Observable();
    addresses$Changed = new import_general.Observable();
  }
  CommissioningClient2.Events = Events;
  function PasscodeOptions(options) {
    let opts;
    if ("pairingCode" in options) {
      const decoded = import_types.ManualPairingCodeCodec.decode(options.pairingCode);
      opts = {
        ...options,
        ...decoded
      };
    } else {
      opts = options;
    }
    let { passcode } = opts;
    if (typeof passcode !== "number" || !Number.isFinite(passcode)) {
      passcode = Number.parseInt(passcode);
      if (!Number.isFinite(passcode)) {
        throw new import_general.ImplementationError("You must provide a pairing code or passcode to pair a node");
      }
    }
    return opts;
  }
  CommissioningClient2.PasscodeOptions = PasscodeOptions;
})(CommissioningClient || (CommissioningClient = {}));
//# sourceMappingURL=CommissioningClient.js.map

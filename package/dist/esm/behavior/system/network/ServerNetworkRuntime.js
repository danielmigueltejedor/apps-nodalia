var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __using = (stack, value, async) => {
  if (value != null) {
    if (typeof value !== "object" && typeof value !== "function") __typeError("Object expected");
    var dispose, inner;
    if (async) dispose = value[__knownSymbol("asyncDispose")];
    if (dispose === void 0) {
      dispose = value[__knownSymbol("dispose")];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") __typeError("Object not disposable");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    stack.push([async, dispose, value]);
  } else if (async) {
    stack.push([async]);
  }
  return value;
};
var __callDispose = (stack, error, hasError) => {
  var E = typeof SuppressedError === "function" ? SuppressedError : function(e, s, m, _) {
    return _ = Error(m), _.name = "SuppressedError", _.error = e, _.suppressed = s, _;
  };
  var fail = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
  var next = (it) => {
    while (it = stack.pop()) {
      try {
        var result = it[1] && it[1].call(it[2]);
        if (it[0]) return Promise.resolve(result).then(next, (e) => (fail(e), next()));
      } catch (e) {
        fail(e);
      }
    }
    if (hasError) throw error;
  };
  return next();
};
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  ConnectionlessTransportSet,
  Crypto,
  InterfaceType,
  Logger,
  Network,
  NoAddressAvailableError,
  ObserverGroup,
  UdpInterface
} from "#general";
import { InteractionServer } from "#node/server/InteractionServer.js";
import {
  Ble,
  BleAdvertiser,
  DeviceAdvertiser,
  DeviceCommissioner,
  ExchangeManager,
  MdnsAdvertiser,
  MdnsService,
  PeerSet,
  ScannerSet,
  SecureChannelProtocol,
  SessionManager
} from "#protocol";
import { CommissioningServer } from "../commissioning/CommissioningServer.js";
import { ProductDescriptionServer } from "../product-description/ProductDescriptionServer.js";
import { SessionsBehavior } from "../sessions/SessionsBehavior.js";
import { NetworkRuntime } from "./NetworkRuntime.js";
import { ServerGroupNetworking } from "./ServerGroupNetworking.js";
const logger = Logger.get("ServerNetworkRuntime");
function convertNetworkEnvironmentType(type) {
  const convertedType = typeof type === "string" ? InterfaceType[type] : type;
  if (typeof convertedType !== "number" || convertedType < 1 || convertedType > 4) {
    return void 0;
  }
  return convertedType;
}
class ServerNetworkRuntime extends NetworkRuntime {
  #mdnsAdvertiser;
  #bleAdvertiser;
  #bleTransport;
  #ipv6UdpInterface;
  #observers = new ObserverGroup(this);
  #groupNetworking;
  #services;
  constructor(owner) {
    super(owner);
    this.#services = owner.env.asDependent();
  }
  get owner() {
    return super.owner;
  }
  /**
   * Access the MDNS advertiser for the node.
   */
  get mdnsAdvertiser() {
    if (!this.#mdnsAdvertiser) {
      const port = this.owner.state.network.operationalPort;
      const options = {
        lifetime: this.construction,
        ...this.owner.state.commissioning.mdns
      };
      const crypto = this.owner.env.get(Crypto);
      const { server } = this.#services.get(MdnsService);
      this.#mdnsAdvertiser = new MdnsAdvertiser(crypto, server, { ...options, port });
    }
    return this.#mdnsAdvertiser;
  }
  get networkInterfaceConfiguration() {
    const interfaceConfig = this.owner.env.vars.get(
      "network.interface",
      {}
    );
    return Object.entries(interfaceConfig).map(([name, { type }]) => ({
      name,
      type: convertNetworkEnvironmentType(type)
    }));
  }
  async getNetworkInterfaces() {
    const network = this.owner.env.get(Network);
    const interfaces = await network.getNetInterfaces(this.networkInterfaceConfiguration);
    const interfaceDetails = new Array();
    for (const { name, type } of interfaces) {
      const details = await network.getIpMac(name);
      if (details !== void 0) {
        interfaceDetails.push({ name, type, ...details });
      }
    }
    return interfaceDetails;
  }
  /**
   * A BLE advertiser.
   */
  get bleAdvertiser() {
    if (this.#bleAdvertiser === void 0) {
      const { peripheralInterface } = this.owner.env.get(Ble);
      const options = {
        lifetime: this.construction,
        ...this.owner.state.commissioning.ble
      };
      this.#bleAdvertiser = new BleAdvertiser(peripheralInterface, options);
    }
    return this.#bleAdvertiser;
  }
  /**
   * A BLE transport.
   */
  get bleTransport() {
    if (this.#bleTransport === void 0) {
      this.#bleTransport = this.owner.env.get(Ble).peripheralInterface;
    }
    return this.#bleTransport;
  }
  /**
   * Add transports to the {@link ConnectionlessTransportSet}.
   */
  async addTransports(interfaces) {
    const netconf = this.owner.state.network;
    const port = this.owner.state.network.port;
    try {
      this.#ipv6UdpInterface = await UdpInterface.create(
        this.owner.env.get(Network),
        "udp6",
        port ? port : void 0,
        netconf.listeningAddressIpv6
      );
      interfaces.add(this.#ipv6UdpInterface);
      await this.owner.set({ network: { operationalPort: this.#ipv6UdpInterface.port } });
    } catch (error) {
      NoAddressAvailableError.accept(error);
      logger.info(`IPv6 UDP interface not created because IPv6 is not available, but required my Matter.`);
      throw error;
    }
    if (netconf.ipv4) {
      try {
        interfaces.add(
          await UdpInterface.create(
            this.owner.env.get(Network),
            "udp4",
            netconf.port,
            netconf.listeningAddressIpv4
          )
        );
      } catch (error) {
        NoAddressAvailableError.accept(error);
        logger.info(`IPv4 UDP interface not created because IPv4 is not available`);
      }
    }
    if (netconf.ble) {
      interfaces.add(this.bleTransport);
    }
  }
  /**
   * Add broadcasters to the {@link DeviceAdvertiser}.
   */
  async addBroadcasters(advertiser) {
    await advertiser.clearAdvertisers();
    const isCommissioned = !!this.#commissionedFabrics;
    let discoveryCapabilities = this.owner.state.network.discoveryCapabilities;
    if (isCommissioned) {
      discoveryCapabilities = { onIpNetwork: true };
    }
    if (discoveryCapabilities.onIpNetwork) {
      advertiser.addAdvertiser(this.mdnsAdvertiser);
    }
    if (!isCommissioned && discoveryCapabilities.ble) {
      advertiser.addAdvertiser(this.bleAdvertiser);
    }
  }
  /**
   * When the first Fabric gets added we need to enable MDNS broadcasting.
   */
  ensureMdnsAdvertiser() {
    const device = this.owner.env.get(DeviceAdvertiser);
    const mdnsAdvertiser = this.mdnsAdvertiser;
    if (!device.hasAdvertiser(mdnsAdvertiser)) {
      logger.debug("Enabling MDNS advertising");
      device.addAdvertiser(mdnsAdvertiser);
    }
  }
  /**
   * On commission, we turn off bluetooth and join the IP network if we haven't already.
   *
   * On decommission, we're destroyed so don't need to handle that case.
   */
  endUncommissionedMode() {
    this.ensureMdnsAdvertiser();
    if (this.#bleAdvertiser) {
      this.owner.env.runtime.add(this.#deleteAdvertiser(this.#bleAdvertiser));
      this.#bleAdvertiser = void 0;
    }
    if (this.#bleTransport) {
      this.owner.env.runtime.add(this.#deleteTransport(this.#bleTransport));
      this.#bleTransport = void 0;
    }
  }
  async #deleteAdvertiser(advertiser) {
    const device = this.owner.env.get(DeviceAdvertiser);
    await device.deleteAdvertiser(advertiser);
  }
  async #deleteTransport(transport) {
    const netInterfaces = this.owner.env.get(ConnectionlessTransportSet);
    netInterfaces.delete(transport);
    await transport.close();
  }
  get #commissionedFabrics() {
    return this.owner.state.operationalCredentials.commissionedFabrics;
  }
  async start() {
    const { owner } = this;
    const { env } = owner;
    const interfaces = env.get(ConnectionlessTransportSet);
    await this.addTransports(interfaces);
    const mdns = await this.#services.load(MdnsService);
    const advertiser = env.get(DeviceAdvertiser);
    await this.addBroadcasters(advertiser);
    await owner.act("start-network", (agent) => agent.load(ProductDescriptionServer));
    env.get(SessionManager).sessionParameters = {
      maxPathsPerInvoke: this.owner.state.basicInformation.maxPathsPerInvoke
    };
    await this.#initializeGroupNetworking();
    const interactionServer = new InteractionServer(this.owner, env.get(SessionManager));
    env.set(InteractionServer, interactionServer);
    env.get(ExchangeManager).addProtocolHandler(interactionServer);
    env.get(SecureChannelProtocol);
    await this.owner.act("load-sessions", (agent) => agent.load(SessionsBehavior));
    this.#observers.on(this.owner.eventsOf(CommissioningServer).commissioned, this.endUncommissionedMode);
    if (this.owner.stateOf(CommissioningServer).commissioned) {
      this.ensureMdnsAdvertiser();
    }
    this.owner.env.get(ScannerSet).add(mdns.client);
    await env.load(PeerSet);
    this.abortSignal.addEventListener(
      "abort",
      () => this.owner.env.maybeGet(InteractionServer)?.blockNewActivity()
    );
    await this.owner.act((agent) => this.owner.lifecycle.online.emit(agent.context));
  }
  async stop() {
    this.#observers.close();
    const { env } = this.owner;
    {
      var _stack = [];
      try {
        const _lifetime = __using(_stack, this.construction.join("commissioner"));
        await env.close(DeviceCommissioner);
      } catch (_) {
        var _error = _, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    const advertisementShutdown = this.owner.env.has(DeviceAdvertiser) ? this.owner.env.close(DeviceAdvertiser) : this.#mdnsAdvertiser?.close();
    this.#mdnsAdvertiser = void 0;
    {
      var _stack2 = [];
      try {
        const _lifetime = __using(_stack2, this.construction.join("preparing"));
        await this.owner.prepareRuntimeShutdown();
      } catch (_2) {
        var _error2 = _2, _hasError2 = true;
      } finally {
        __callDispose(_stack2, _error2, _hasError2);
      }
    }
    this.#groupNetworking?.close();
    this.#groupNetworking = void 0;
    {
      var _stack3 = [];
      try {
        const _advertiser = __using(_stack3, this.construction.join("advertisement"));
        await advertisementShutdown;
      } catch (_3) {
        var _error3 = _3, _hasError3 = true;
      } finally {
        __callDispose(_stack3, _error3, _hasError3);
      }
    }
    {
      var _stack4 = [];
      try {
        const _lifetime = __using(_stack4, this.construction.join("services"));
        await this.#services.close();
      } catch (_4) {
        var _error4 = _4, _hasError4 = true;
      } finally {
        __callDispose(_stack4, _error4, _hasError4);
      }
    }
    {
      var _stack5 = [];
      try {
        const _lifetime = __using(_stack5, this.construction.join("exchanges"));
        await env.close(ExchangeManager);
      } catch (_5) {
        var _error5 = _5, _hasError5 = true;
      } finally {
        __callDispose(_stack5, _error5, _hasError5);
      }
    }
    {
      var _stack6 = [];
      try {
        const _lifetime = __using(_stack6, this.construction.join("protocols"));
        await env.close(SecureChannelProtocol);
      } catch (_6) {
        var _error6 = _6, _hasError6 = true;
      } finally {
        __callDispose(_stack6, _error6, _hasError6);
      }
    }
    {
      var _stack7 = [];
      try {
        const _lifetime = __using(_stack7, this.construction.join("transports"));
        await env.close(ConnectionlessTransportSet);
      } catch (_7) {
        var _error7 = _7, _hasError7 = true;
      } finally {
        __callDispose(_stack7, _error7, _hasError7);
      }
    }
    {
      var _stack8 = [];
      try {
        const _lifetime = __using(_stack8, this.construction.join("interactions"));
        await env.close(InteractionServer);
      } catch (_8) {
        var _error8 = _8, _hasError8 = true;
      } finally {
        __callDispose(_stack8, _error8, _hasError8);
      }
    }
    {
      var _stack9 = [];
      try {
        const _lifetime = __using(_stack9, this.construction.join("peers"));
        await env.close(PeerSet);
      } catch (_9) {
        var _error9 = _9, _hasError9 = true;
      } finally {
        __callDispose(_stack9, _error9, _hasError9);
      }
    }
    env.delete(ScannerSet);
  }
  async #initializeGroupNetworking() {
    if (this.#groupNetworking) {
      logger.warn("Group networking already initialized, skipping.");
      return;
    }
    if (this.#ipv6UdpInterface === void 0) {
      logger.warn("No IPv6 UDP interface available, skipping group networking initialization.");
      return;
    }
    this.#groupNetworking = new ServerGroupNetworking(this.owner.env, this.#ipv6UdpInterface);
    await this.#groupNetworking.construction;
  }
}
export {
  ServerNetworkRuntime
};
//# sourceMappingURL=ServerNetworkRuntime.js.map

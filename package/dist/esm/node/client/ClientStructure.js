/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Datasource } from "#behavior/state/managed/Datasource.js";
import { Descriptor } from "#clusters/descriptor";
import { Endpoint } from "#endpoint/Endpoint.js";
import { EndpointType } from "#endpoint/type/EndpointType.js";
import { RootEndpoint } from "#endpoints/root";
import { Diagnostic, hex, InternalError, isDeepEqual, Logger, Observable } from "#general";
import {
  AcceptedCommandList,
  AttributeList,
  ClusterRevision,
  DeviceClassification,
  DeviceTypeModel,
  FeatureMap,
  GeneratedCommandList,
  Matter
} from "#model";
import { ReadScope } from "#protocol";
import { ClientNodeStore } from "#storage/client/ClientNodeStore.js";
import { DatasourceCache } from "#storage/client/DatasourceCache.js";
import { Status } from "#types";
import { ClientEventEmitter } from "./ClientEventEmitter.js";
import { ClientStructureEvents } from "./ClientStructureEvents.js";
import { PeerBehavior } from "./PeerBehavior.js";
const logger = Logger.get("ClientStructure");
const DESCRIPTOR_ID = Descriptor.Cluster.id;
const DEVICE_TYPE_LIST_ATTR_ID = Descriptor.Cluster.attributes.deviceTypeList.id;
const SERVER_LIST_ATTR_ID = Descriptor.Cluster.attributes.serverList.id;
const PARTS_LIST_ATTR_ID = Descriptor.Cluster.attributes.partsList.id;
class ClientStructure {
  #nodeStore;
  #endpoints = /* @__PURE__ */ new Map();
  #eventEmitter;
  #node;
  #subscribedFabricFiltered;
  #pendingChanges = /* @__PURE__ */ new Map();
  #pendingStructureEvents = Array();
  #delayedClusterEvents = new Array();
  #events;
  #changed = Observable();
  constructor(node) {
    this.#node = node;
    this.#nodeStore = node.env.get(ClientNodeStore);
    this.#endpoints.set(node.number, {
      endpoint: node,
      clusters: /* @__PURE__ */ new Map()
    });
    this.#eventEmitter = ClientEventEmitter(node, this);
    this.#events = this.#node.env.get(ClientStructureEvents);
  }
  get changed() {
    return this.#changed;
  }
  /**
   * Load initial structure from cache.
   */
  loadCache() {
    for (const store of this.#nodeStore.endpointStores) {
      const id = store.id;
      const number = Number.parseInt(id);
      if (!Number.isFinite(number)) {
        continue;
      }
      const endpoint = this.#endpointFor(number);
      const knownBehaviors = [...store.knownBehaviors].map((idStr) => Number.parseInt(idStr)).filter((id2) => Number.isFinite(id2));
      const descriptorIndex = knownBehaviors.indexOf(DESCRIPTOR_ID);
      if (descriptorIndex !== -1) {
        knownBehaviors.splice(descriptorIndex, 1);
        knownBehaviors.unshift(DESCRIPTOR_ID);
      }
      for (const id2 of knownBehaviors) {
        this.#synchronizeCluster(endpoint, this.#clusterFor(endpoint, id2));
      }
    }
    const changes = this.#pendingChanges;
    this.#pendingChanges = /* @__PURE__ */ new Map();
    for (const [structure, change] of changes.entries()) {
      if (!change.install || change.erase || change.rebuild) {
        throw new InternalError(
          `Unexpected erase and/or rebuild during initialization of ${structure.endpoint}`
        );
      }
      this.#pendingChanges.delete(structure);
      this.#install(structure);
    }
    this.#emitPendingStructureEvents();
  }
  /**
   * Obtain the store for a remote cluster.
   */
  storeForRemote(endpoint, type) {
    const endpointStructure = this.#endpointFor(endpoint.number);
    const clusterStructure = this.#clusterFor(endpointStructure, type.cluster.id);
    return clusterStructure.store;
  }
  /**
   * Obtain the store for a non-cluster behavior.
   *
   * The data for these behaviors is managed locally and not synced from the peer.
   */
  storeForLocal(endpoint, type) {
    return this.#nodeStore.storeForEndpoint(endpoint).createStoreForLocalBehavior(type.id);
  }
  /**
   * Inject version filters into a Read or Subscribe request.
   */
  injectVersionFilters(request) {
    const scope = ReadScope(request);
    let result = request;
    for (const {
      endpoint: { number: endpointId },
      clusters
    } of this.#endpoints.values()) {
      for (const {
        id: clusterId,
        store: { version }
      } of clusters.values()) {
        if (!scope.isRelevant(endpointId, clusterId)) {
          continue;
        }
        if (version === Datasource.UNKNOWN_VERSION) {
          continue;
        }
        if (result === request) {
          result = { ...request };
        }
        if (result.dataVersionFilters === void 0) {
          result.dataVersionFilters = [];
        }
        result.dataVersionFilters.push({ path: { endpointId, clusterId }, dataVersion: version });
      }
    }
    return result;
  }
  /**
   * Update the node structure by applying attribute changes.
   */
  async *mutate(request, changes) {
    let currentUpdates;
    const scope = ReadScope(request);
    for await (const chunk of changes) {
      const chunkData = new Array();
      for (const change of chunk) {
        chunkData.push(change);
        switch (change.kind) {
          case "attr-value":
            currentUpdates = await this.#mutateAttribute(change, scope, currentUpdates);
            break;
          case "event-value":
            await this.#emitEvent(change, currentUpdates);
            break;
          case "attr-status":
          case "event-status":
            logger.debug(
              "Received status for",
              change.kind === "attr-status" ? "attribute" : "event",
              Diagnostic.strong(Diagnostic.dict(change.path)),
              `: ${Status[change.status]}#${change.status}${change.clusterStatus !== void 0 ? `/${Status[change.clusterStatus]}#${change.clusterStatus}` : ""}`
            );
            break;
        }
      }
      yield chunkData;
    }
    if (currentUpdates) {
      await this.#updateCluster(currentUpdates);
    }
    for (const [endpoint, change] of this.#pendingChanges.entries()) {
      this.#pendingChanges.delete(endpoint);
      if (change.erase) {
        await this.#erase(endpoint);
        continue;
      }
      if (change.rebuild) {
        await this.#rebuild(endpoint);
      }
      if (change.install) {
        this.#install(endpoint);
      }
    }
    this.#emitPendingStructureEvents();
    await this.#emitPendingEvents();
  }
  /** Determines if the subscription is fabric filtered */
  get subscribedFabricFiltered() {
    if (this.#subscribedFabricFiltered === void 0) {
      const defaultSubscription = this.#node.state.network.defaultSubscription ?? {};
      this.#subscribedFabricFiltered = ("isFabricFiltered" in defaultSubscription ? defaultSubscription.isFabricFiltered : "fabricFiltered" in defaultSubscription ? defaultSubscription.fabricFiltered : true) ?? true;
      this.#node.events.network.defaultSubscription$Changed.on((newSubscription) => {
        this.#subscribedFabricFiltered = newSubscription?.isFabricFiltered ?? true;
      });
    }
    return this.#subscribedFabricFiltered;
  }
  async #mutateAttribute(change, scope, currentUpdates) {
    if (this.subscribedFabricFiltered !== scope.isFabricFiltered) {
      return currentUpdates;
    }
    const { endpointId, clusterId, attributeId } = change.path;
    if (currentUpdates && (currentUpdates.endpointId !== endpointId || currentUpdates.clusterId !== clusterId)) {
      await this.#updateCluster(currentUpdates);
      currentUpdates = void 0;
    }
    if (currentUpdates === void 0) {
      currentUpdates = {
        endpointId,
        clusterId,
        values: {
          [attributeId]: change.value
        }
      };
      if (scope.isWildcard(endpointId, clusterId)) {
        currentUpdates.values[DatasourceCache.VERSION_KEY] = change.version;
      }
    } else {
      currentUpdates.values[attributeId] = change.value;
    }
    return currentUpdates;
  }
  async #emitEvent(occurrence, currentUpdates) {
    const { endpointId, clusterId } = occurrence.path;
    const endpoint = this.#endpoints.get(endpointId);
    if (currentUpdates && (currentUpdates.endpointId === endpointId || currentUpdates.clusterId === clusterId) || endpoint !== void 0 && this.#pendingChanges?.has(endpoint)) {
      this.#delayedClusterEvents.push(occurrence);
    } else {
      await this.#eventEmitter(occurrence);
    }
  }
  /**
   * Obtain the {@link ClusterType} for an {@link EndpointNumber} and {@link ClusterId}.
   */
  clusterFor(endpoint, cluster) {
    const ep = this.#endpointFor(endpoint);
    if (!ep) {
      return;
    }
    return this.#clusterFor(ep, cluster)?.behavior?.cluster;
  }
  /**
   * Obtain the {@link Endpoint} for a {@link EndpointNumber}.
   */
  endpointFor(endpoint) {
    return this.#endpoints.get(endpoint)?.endpoint;
  }
  /**
   * Apply new attribute values for a specific endpoint / cluster.
   *
   * This is invoked in a batch when we've collected all sequential values for the current endpoint/cluster.
   */
  async #updateCluster(attrs) {
    const endpoint = this.#endpointFor(attrs.endpointId);
    const cluster = this.#clusterFor(endpoint, attrs.clusterId);
    if (cluster.behavior && FeatureMap.id in attrs.values) {
      if (!isDeepEqual(cluster.features, attrs.values[FeatureMap.id])) {
        cluster.behavior = void 0;
      }
    }
    if (cluster.behavior && AttributeList.id in attrs.values) {
      const attributeList = attrs.values[AttributeList.id];
      if (Array.isArray(attributeList) && !isDeepEqual(
        cluster.attributes,
        attributeList.sort((a, b) => a - b)
      )) {
        cluster.behavior = void 0;
      }
    }
    if (cluster.behavior && AcceptedCommandList.id in attrs.values) {
      const acceptedCommands = attrs.values[AcceptedCommandList.id];
      if (Array.isArray(acceptedCommands) && !isDeepEqual(
        cluster.commands,
        acceptedCommands.sort((a, b) => a - b)
      )) {
        cluster.behavior = void 0;
      }
    }
    await cluster.store.externalSet(attrs.values);
    this.#synchronizeCluster(endpoint, cluster);
  }
  /**
   * If enough attributes are present, installs a behavior on an endpoint
   *
   * If the cluster is Descriptor, performs additional {@link Endpoint} configuration such as installing parts and
   * device types.
   *
   * Invoked once we've loaded all attributes in an interaction.
   */
  #synchronizeCluster(structure, cluster) {
    const { endpoint } = structure;
    if (cluster.behavior === void 0) {
      if (cluster.store.initialValues) {
        const {
          [ClusterRevision.id]: clusterRevision,
          [FeatureMap.id]: features,
          [AttributeList.id]: attributeList,
          [AcceptedCommandList.id]: commandList,
          [GeneratedCommandList.id]: generatedCommandList
        } = cluster.store.initialValues;
        if (typeof clusterRevision === "number") {
          cluster.revision = clusterRevision;
        }
        if (typeof features === "object" && features !== null && !Array.isArray(features)) {
          cluster.features = features;
        }
        if (Array.isArray(attributeList)) {
          cluster.attributes = attributeList.filter((attr) => typeof attr === "number").sort(
            (a, b) => a - b
          );
        }
        if (Array.isArray(commandList)) {
          cluster.commands = commandList.filter((cmd) => typeof cmd === "number").sort(
            (a, b) => a - b
          );
        }
        if (Array.isArray(generatedCommandList)) {
          cluster.generatedCommands = generatedCommandList.filter((cmd) => typeof cmd === "number").sort((a, b) => a - b);
        }
      }
      if (
        // All global attributes have fallbacks, so we can't wait until we're sure we have them all.  Instead,
        // wait until we are sure there is something useful.  We therefore rely on unspecified behavior that all
        // attributes travel consecutively to ensure we initialize fully as we have no other choice
        cluster.attributes?.length || cluster.commands?.length || cluster.generatedCommands?.length
      ) {
        const behaviorType = PeerBehavior(cluster);
        if (endpoint.lifecycle.isInstalled) {
          cluster.pendingBehavior = behaviorType;
          this.#scheduleStructureChange(
            structure,
            endpoint.behaviors.supported[behaviorType.id] ? "rebuild" : "install"
          );
        } else {
          cluster.behavior = behaviorType;
          endpoint.behaviors.inject(behaviorType);
        }
      }
    }
    if (cluster.id === Descriptor.Cluster.id) {
      let attrs;
      if (cluster.behavior && endpoint.behaviors.isActive(cluster.behavior.id)) {
        attrs = endpoint.stateOf(cluster.behavior);
      } else {
        attrs = cluster.store.initialValues ?? {};
      }
      this.#synchronizeDescriptor(structure, attrs);
    }
  }
  #synchronizeDescriptor(structure, attrs) {
    const { endpoint } = structure;
    const deviceTypeList = attrs[DEVICE_TYPE_LIST_ATTR_ID];
    if (Array.isArray(deviceTypeList)) {
      const endpointType = endpoint.type;
      for (const dt of deviceTypeList) {
        if (typeof dt?.deviceType !== "number") {
          continue;
        }
        let isApp = false;
        const model = Matter.get(DeviceTypeModel, dt.deviceType);
        if (model !== void 0) {
          isApp = DeviceClassification.isApplication(model.classification);
        }
        if (!endpoint.number && endpointType.deviceType !== RootEndpoint.deviceType) {
          endpointType.deviceRevision = dt.revision;
          break;
        }
        if (endpointType.deviceType !== void 0 && !isApp) {
          continue;
        }
        endpointType.deviceType = dt.deviceType;
        endpointType.deviceRevision = dt.revision;
        endpointType.deviceClass = model?.classification ?? DeviceClassification.Simple;
        endpointType.name = model?.name ?? `Unknown#${hex.word(dt.deviceType)}`;
        if (isApp) {
          break;
        }
      }
    }
    const serverList = attrs[SERVER_LIST_ATTR_ID];
    if (Array.isArray(serverList)) {
      const currentlySupported = new Set(
        Object.values(endpoint.behaviors.supported).map((type) => type.cluster?.id).filter((id) => id !== void 0)
      );
      for (const cluster of serverList) {
        if (typeof cluster === "number") {
          this.#clusterFor(structure, cluster);
          currentlySupported.delete(cluster);
        }
      }
      if (currentlySupported.size) {
        for (const id of currentlySupported) {
          this.#clusterFor(structure, id).pendingDelete = true;
        }
        this.#scheduleStructureChange(structure, "rebuild");
      }
    }
    const partsList = attrs[PARTS_LIST_ATTR_ID];
    if (!Array.isArray(partsList)) {
      return;
    }
    for (const partNo of partsList) {
      if (typeof partNo !== "number") {
        continue;
      }
      const part = this.#endpointFor(partNo);
      let isAlreadyDescendant = false;
      for (let owner = this.#ownerOf(part); owner; owner = this.#ownerOf(owner)) {
        if (owner === structure) {
          isAlreadyDescendant = true;
          break;
        }
      }
      if (isAlreadyDescendant) {
        continue;
      }
      part.pendingOwner = structure;
      this.#scheduleStructureChange(part, "install");
    }
    if (endpoint.maybeNumber === 0) {
      const numbersUsed = new Set(partsList);
      for (const descendent of endpoint.endpoints) {
        if (!descendent.maybeNumber) {
          continue;
        }
        if (!numbersUsed.has(descendent.number)) {
          const endpoint2 = this.#endpoints.get(descendent.number);
          if (endpoint2) {
            this.#scheduleStructureChange(endpoint2, "erase");
          }
        }
      }
    }
  }
  #endpointFor(number) {
    let endpoint = this.#endpoints.get(number);
    if (endpoint) {
      return endpoint;
    }
    endpoint = {
      endpoint: new Endpoint({
        id: `ep${number}`,
        number,
        type: EndpointType({
          name: "Unknown",
          deviceType: EndpointType.UNKNOWN_DEVICE_TYPE,
          deviceRevision: EndpointType.UNKNOWN_DEVICE_REVISION
        })
      }),
      clusters: /* @__PURE__ */ new Map()
    };
    this.#endpoints.set(number, endpoint);
    return endpoint;
  }
  #clusterFor(endpoint, id) {
    let cluster = endpoint.clusters.get(id);
    if (cluster) {
      return cluster;
    }
    cluster = {
      kind: "discovered",
      id,
      store: this.#nodeStore.storeForEndpoint(endpoint.endpoint).createStoreForBehavior(id.toString()),
      behavior: void 0,
      pendingBehavior: void 0,
      pendingDelete: void 0
    };
    endpoint.clusters.set(id, cluster);
    return cluster;
  }
  #ownerOf(endpoint) {
    if (endpoint.pendingOwner) {
      return endpoint.pendingOwner;
    }
    if (endpoint.endpoint.number === 0) {
      return;
    }
    const ownerNumber = endpoint.endpoint.owner?.maybeNumber;
    if (ownerNumber !== void 0) {
      return this.#endpointFor(ownerNumber);
    }
  }
  /**
   * Erase an endpoint that disappeared from the peer.
   */
  async #erase(structure) {
    const { endpoint } = structure;
    logger.debug(
      "Removing endpoint",
      Diagnostic.strong(endpoint.toString()),
      "because it is no longer present on the peer"
    );
    this.#endpoints.delete(endpoint.number);
    try {
      await endpoint.delete();
    } catch (e) {
      logger.error(`Error erasing peer endpoint ${endpoint}:`, e);
    }
  }
  /**
   * Replace clusters after activation because fixed global attributes have changed.
   *
   * Currently, we apply granular updates to clusters.  This will possibly result in subtle errors if peers change in
   * incompatible ways, but the backings are designed to be fairly resilient to this.  This is simpler for API users
   * to deal with in the common case where they can just ignore. If it becomes problematic, we can revert to replacing
   * entire endpoints or behaviors when there are structural changes.
   */
  async #rebuild(structure) {
    const { endpoint, clusters } = structure;
    for (const cluster of clusters.values()) {
      const { behavior, pendingBehavior, pendingDelete } = cluster;
      if (pendingDelete) {
        if (!behavior) {
          continue;
        }
        await endpoint.behaviors.drop(behavior.id);
        try {
          await cluster.store.erase();
        } catch (e) {
          logger.error("Error clearing cluster storage:", e);
        }
        this.#pendingStructureEvents.push({
          kind: "cluster",
          endpoint: structure,
          cluster,
          subkind: "delete"
        });
        continue;
      }
      if (!pendingBehavior) {
        continue;
      }
      const subkind = pendingBehavior.id in endpoint.behaviors.supported ? "replace" : "add";
      endpoint.behaviors.inject(pendingBehavior);
      cluster.behavior = pendingBehavior;
      delete cluster.pendingBehavior;
      this.#pendingStructureEvents.push({
        kind: "cluster",
        subkind,
        endpoint: structure,
        cluster
      });
    }
  }
  /**
   * Install the endpoint and/or new behaviors.
   */
  #install(structure) {
    const { endpoint, pendingOwner, clusters } = structure;
    if (pendingOwner) {
      endpoint.owner = pendingOwner.endpoint;
      structure.pendingOwner = void 0;
      this.#pendingStructureEvents.push({ kind: "endpoint", endpoint: structure });
    }
    for (const cluster of clusters.values()) {
      const { pendingBehavior } = cluster;
      if (!pendingBehavior || endpoint.behaviors.supported[pendingBehavior.id]) {
        continue;
      }
      endpoint.behaviors.inject(pendingBehavior);
      cluster.behavior = pendingBehavior;
      cluster.pendingBehavior = void 0;
      if (!pendingOwner) {
        this.#pendingStructureEvents.push({
          kind: "cluster",
          subkind: "add",
          endpoint: structure,
          cluster
        });
      }
    }
  }
  /**
   * Queue a structural change for processing once a read response is fully processed.
   */
  #scheduleStructureChange(endpoint, kind) {
    const pending = this.#pendingChanges.get(endpoint);
    if (pending) {
      pending[kind] = true;
    } else {
      this.#pendingChanges.set(endpoint, { [kind]: true });
    }
  }
  /**
   * Emit pending events.
   *
   * We do this after all structural updates are complete so that listeners can expect composed parts and dependent
   * behaviors to be installed.
   */
  #emitPendingStructureEvents() {
    const structureEvents = this.#pendingStructureEvents;
    this.#pendingStructureEvents = [];
    for (const event of structureEvents) {
      switch (event.kind) {
        case "endpoint": {
          const {
            endpoint: { endpoint, clusters }
          } = event;
          this.#events.emitEndpoint(endpoint);
          for (const { behavior } of clusters.values()) {
            if (behavior) {
              this.#events.emitCluster(endpoint, behavior);
            }
          }
          break;
        }
        case "cluster": {
          const {
            endpoint: { endpoint },
            cluster: { behavior }
          } = event;
          if (!behavior) {
            break;
          }
          switch (event.subkind) {
            case "add":
              this.#events.emitCluster(endpoint, behavior);
              break;
            case "delete":
              this.#events.emitClusterDeleted(endpoint, behavior);
              break;
            case "replace":
              this.#events.emitClusterReplaced(endpoint, behavior);
          }
          break;
        }
      }
    }
    this.#changed.emit();
  }
  async #emitPendingEvents() {
    const clusterEvents = this.#delayedClusterEvents;
    this.#delayedClusterEvents = [];
    for (const occurrence of clusterEvents) {
      await this.#eventEmitter(occurrence);
    }
  }
}
export {
  ClientStructure
};
//# sourceMappingURL=ClientStructure.js.map

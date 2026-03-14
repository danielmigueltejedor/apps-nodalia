/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { NetworkClient } from "#behavior/system/network/NetworkClient.js";
import { camelize, Diagnostic, isObject, Logger } from "#general";
import { ClusterModel, EventModel } from "#model";
import { ChangeNotificationService } from "#node/integration/ChangeNotificationService.js";
const logger = Logger.get("ClientEventEmitter");
const nameCache = /* @__PURE__ */ new WeakMap();
const warnedForUnknown = /* @__PURE__ */ new Set();
function ClientEventEmitter(node, structure) {
  const changes = node.env.get(ChangeNotificationService);
  return emitClientEvent;
  async function emitClientEvent(occurrence) {
    const names = getNames(node.matter, occurrence);
    if (!names) {
      return;
    }
    const target = getTarget(node, occurrence, names.cluster, names.event);
    if (!target) {
      return;
    }
    await node.act(async (agent) => {
      target.event.emit(occurrence.value, agent.context);
      const network = agent.get(NetworkClient);
      if (occurrence.number > network.state.maxEventNumber) {
        await agent.context.transaction.addResources(network);
        await agent.context.transaction.begin();
        network.state.maxEventNumber = occurrence.number;
        await agent.context.transaction.commit();
      }
    });
    const behavior = target.endpoint.behaviors.supported[names.cluster];
    if (behavior) {
      const { number, timestamp, priority, value } = occurrence;
      changes.broadcastEvent(target.endpoint, behavior, target.event.schema, {
        number,
        timestamp,
        priority,
        payload: value
      });
    }
  }
  function getTarget(node2, occurrence, clusterName, eventName) {
    const {
      value,
      path: { endpointId }
    } = occurrence;
    const endpoint = structure.endpointFor(endpointId);
    if (endpoint === void 0) {
      logger.warn(`Received event for unknown endpoint #${endpointId} on ${node2}`);
      return;
    }
    const events = endpoint.events[clusterName];
    if (events === void 0) {
      logger.warn(`Received event ${eventName} for unsupported cluster ${clusterName} on ${endpoint}`);
      return;
    }
    logger.info(
      "Received event",
      Diagnostic.strong(`${clusterName}.${eventName}`),
      " on ",
      Diagnostic.strong(endpoint.toString()),
      Diagnostic.weak(isObject(value) ? Diagnostic.dict(value) : value)
    );
    const event = events[eventName];
    if (event) {
      return { endpoint, event };
    }
  }
}
function getNames(matter, { path: { clusterId, eventId } }) {
  let matterCache = nameCache.get(matter);
  if (matterCache === void 0) {
    matterCache = {};
    nameCache.set(matter, matterCache);
  }
  const key = `${clusterId}-${eventId}`;
  if (key in matterCache) {
    return matterCache[key];
  }
  const cluster = matter.get(ClusterModel, clusterId);
  if (cluster === void 0) {
    if (!warnedForUnknown.has(clusterId)) {
      logger.warn(`Ignoring events for unknown cluster #${clusterId}`);
      warnedForUnknown.add(clusterId);
      matterCache[key] = void 0;
    }
    return;
  }
  const event = cluster.get(EventModel, eventId);
  if (event === void 0) {
    if (!warnedForUnknown.has(key)) {
      logger.warn(`Ignoring unknown event #${eventId} for ${cluster.name} cluster`);
      warnedForUnknown.add(key);
      matterCache[key] = void 0;
    }
    return;
  }
  return matterCache[key] = { cluster: camelize(cluster.name), event: camelize(event.name) };
}
export {
  ClientEventEmitter
};
//# sourceMappingURL=ClientEventEmitter.js.map

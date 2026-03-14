/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ClusterBehavior } from "#behavior/cluster/ClusterBehavior.js";
import { ClusterBehaviorType } from "#behavior/cluster/ClusterBehaviorType.js";
import { camelize, capitalize, InternalError } from "#general";
import {
  AttributeModel,
  ClusterModel,
  CommandModel,
  Conformance,
  EncodedBitmap,
  Matter
} from "#model";
import {
  ClusterComposer,
  ClusterRegistry,
  MutableCluster,
  TlvAny,
  TlvNoResponse,
  UnknownAttribute,
  UnknownCommand
} from "#types";
import { ClientCommandMethod } from "./ClientCommandMethod.js";
const BIT_BLOCK_SIZE = Math.log2(Number.MAX_SAFE_INTEGER);
const discoveredCache = {};
const knownCache = /* @__PURE__ */ new WeakMap();
const isPeer = /* @__PURE__ */ Symbol("is-peer");
function PeerBehavior(shape) {
  let type;
  switch (shape.kind) {
    case "known":
      if (Object.hasOwn(shape.behavior, isPeer)) {
        return shape.behavior;
      }
      type = instrumentKnownShape(shape);
      break;
    case "discovered":
      type = instrumentDiscoveredShape(shape);
      break;
    default:
      throw new InternalError(`Unknown cluster shape kind ${shape.kind}`);
  }
  type[isPeer] = true;
  return type;
}
function instrumentDiscoveredShape(shape) {
  const analysis = DiscoveredShapeAnalysis(shape);
  const fingerprint = createFingerprint(analysis);
  let type = discoveredCache[fingerprint];
  if (type) {
    return type;
  }
  let baseType;
  const standardCluster = ClusterRegistry.get(shape.id);
  if (standardCluster && !standardCluster.name.startsWith("Unknown cluster 0x")) {
    baseType = ClusterBehavior.for(standardCluster);
  }
  type = discoveredCache[fingerprint] = generateDiscoveredType(analysis, baseType);
  return type;
}
function instrumentKnownShape(shape) {
  let type = knownCache.get(shape.behavior);
  if (type) {
    return type;
  }
  const base = shape.behavior;
  type = ClusterBehaviorType({
    base,
    cluster: base.cluster,
    schema: base.schema,
    name: `${base.schema.name}Client`,
    forClient: true,
    commandFactory: ClientCommandMethod
  });
  knownCache.set(shape.behavior, type);
  return type;
}
function generateDiscoveredType(analysis, baseType) {
  let { schema } = analysis;
  let isExtended;
  let cluster;
  if (baseType) {
    isExtended = false;
    if (!ClusterBehavior.is(baseType)) {
      throw new InternalError(`Base for cluster ${analysis.schema.name} is not a ClusterBehavior`);
    }
    cluster = baseType.cluster;
  } else {
    isExtended = true;
    cluster = MutableCluster({ id: schema.id, name: schema.name, revision: schema.revision });
    baseType = ClusterBehavior;
  }
  const { attrSupportOverrides, extraAttrs, commandSupportOverrides, extraCommands } = analysis;
  let supportedFeatures = analysis.shape.features;
  if (typeof supportedFeatures === "number") {
    supportedFeatures = cluster.attributes.featureMap.schema.decode(supportedFeatures);
  }
  if (supportedFeatures === void 0) {
    supportedFeatures = {};
  }
  const featureNames = Object.entries(supportedFeatures).filter(([, v]) => v).map(([k]) => k);
  if (featureNames.length) {
    extendSchema();
    cluster = new ClusterComposer(cluster, true).compose(featureNames.map(capitalize));
  }
  if (schema.revision !== analysis.shape.revision || extraAttrs.size || extraCommands.size || attrSupportOverrides.size || commandSupportOverrides.size) {
    extendSchema();
    cluster = {
      ...cluster,
      supportedFeatures,
      attributes: { ...cluster.attributes },
      commands: { ...cluster.commands }
    };
    if (attrSupportOverrides.size) {
      for (const [attr, isSupported] of attrSupportOverrides.entries()) {
        schema.children.push(attr.extend({ operationalIsSupported: isSupported }));
      }
    }
    for (const id of extraAttrs) {
      const name = createUnknownName("attr", id);
      cluster.attributes[camelize(name, false)] = UnknownAttribute(id);
      schema.children.push(new AttributeModel({ id, name, type: "any" }));
    }
    if (commandSupportOverrides.size) {
      for (const [command, isSupported] of commandSupportOverrides.entries()) {
        schema.children.push(command.extend({ operationalIsSupported: isSupported }));
      }
    }
    for (const id of extraCommands) {
      const name = createUnknownName("command", id);
      cluster.commands[camelize(name, false)] = UnknownCommand(id, TlvAny, 0, TlvNoResponse);
      schema.children.push(new CommandModel({ id, name, type: "any" }));
    }
  }
  return ClusterBehaviorType({
    base: baseType,
    cluster,
    schema,
    name: `${schema.name}Client`,
    forClient: true,
    commandFactory: ClientCommandMethod
  });
  function extendSchema() {
    if (isExtended) {
      return;
    }
    schema = schema.extend();
    isExtended = true;
  }
}
function createFingerprint(analysis) {
  const fingerprint = [analysis.shape.id];
  if (analysis.featureBitmap) {
    fingerprint.push("f", analysis.featureBitmap);
  }
  if (analysis.attrSupportOverrides.size) {
    addSupportFingerprints("a", analysis.attrSupportOverrides);
  }
  if (analysis.extraAttrs.size) {
    fingerprint.push("a", createElementFingerprint(analysis.extraAttrs));
  }
  if (analysis.commandSupportOverrides.size) {
    addSupportFingerprints("c", analysis.commandSupportOverrides);
  }
  if (analysis.extraCommands.size) {
    fingerprint.push("c", createElementFingerprint(analysis.extraCommands));
  }
  return fingerprint.join(";");
  function createElementFingerprint(ids) {
    const blocks = {};
    for (const id of ids) {
      const block = Math.floor(id / BIT_BLOCK_SIZE);
      blocks[block] = (blocks[block] ?? 0) | 1 << id % BIT_BLOCK_SIZE;
    }
    return Object.entries(blocks).sort(([a], [b]) => a.localeCompare(b)).map(([block, map]) => block ? `${block}:${map}` : map).join(",");
  }
  function addSupportFingerprints(prefix, elements) {
    let supported;
    let unsupported;
    for (const [{ id }, isSupported] of elements) {
      if (id === void 0) {
        continue;
      }
      if (isSupported) {
        if (supported) {
          supported.push(id);
        } else {
          supported = [id];
        }
      } else {
        if (unsupported) {
          unsupported.push(id);
        } else {
          unsupported = [id];
        }
      }
    }
    if (supported) {
      fingerprint.push(`${prefix}+`, createElementFingerprint(supported));
    }
    if (unsupported) {
      fingerprint.push(`${prefix}-`, createElementFingerprint(unsupported));
    }
  }
}
function createUnknownName(prefix, id) {
  return `${prefix}$${id.toString(16)}`;
}
function DiscoveredShapeAnalysis(shape) {
  const standardCluster = Matter.get(ClusterModel, shape.id);
  const schema = standardCluster ?? new ClusterModel({ id: shape.id, name: createUnknownName("Cluster", shape.id), revision: shape.revision });
  let featureBitmap;
  if (typeof shape.features === "number") {
    featureBitmap = shape.features;
  } else {
    featureBitmap = EncodedBitmap(schema.featureMap, shape.features ?? {});
  }
  const attrSupportOverrides = /* @__PURE__ */ new Map();
  const extraAttrs = new Set(shape.attributes ?? []);
  for (const attr of schema.attributes) {
    maybeOverrideSupport(standardCluster, attr, extraAttrs, attrSupportOverrides);
    extraAttrs.delete(attr.id);
  }
  const commandSupportOverrides = /* @__PURE__ */ new Map();
  const extraCommands = new Set(shape.commands ?? []);
  for (const command of schema.commands) {
    maybeOverrideSupport(standardCluster, command, extraCommands, commandSupportOverrides);
    extraCommands.delete(command.id);
  }
  return {
    schema,
    featureBitmap,
    shape,
    attrSupportOverrides,
    extraAttrs,
    commandSupportOverrides,
    extraCommands
  };
}
function maybeOverrideSupport(standardCluster, element, supported, overrides) {
  if (!standardCluster) {
    return;
  }
  const isSupported = supported === true || supported.has(element.id);
  const applicability = element.effectiveConformance.applicabilityFor(standardCluster);
  if (!isSupported) {
    if (applicability === Conformance.Applicability.Mandatory) {
      overrides.set(element, false);
    }
  } else {
    if (applicability !== Conformance.Applicability.Mandatory) {
      overrides.set(element, true);
    }
  }
}
export {
  PeerBehavior
};
//# sourceMappingURL=PeerBehavior.js.map

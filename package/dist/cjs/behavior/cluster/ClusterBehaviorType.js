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
var ClusterBehaviorType_exports = {};
__export(ClusterBehaviorType_exports, {
  ClusterBehaviorType: () => ClusterBehaviorType
});
module.exports = __toCommonJS(ClusterBehaviorType_exports);
var import_Events = require("#behavior/Events.js");
var import_general = require("#general");
var import_model = require("#model");
var import_Behavior = require("../Behavior.js");
var import_StateType = require("../state/StateType.js");
var import_ClusterBehaviorCache = require("./ClusterBehaviorCache.js");
var import_cluster_behavior_utils = require("./cluster-behavior-utils.js");
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
function ClusterBehaviorType({
  cluster,
  base,
  schema,
  name,
  forClient,
  commandFactory
}) {
  if (schema === void 0) {
    if (base.schema.tag === import_model.ElementTag.Cluster) {
      schema = base.schema;
    }
    if (!schema) {
      schema = schemaForCluster(cluster);
    }
  }
  schema = syncFeatures(schema, cluster);
  const useCache = name === void 0;
  if (useCache) {
    const cached = import_ClusterBehaviorCache.ClusterBehaviorCache.get(cluster, base, schema, forClient);
    if (cached) {
      return cached;
    }
    if (base.name.startsWith(cluster.name)) {
      name = base.name;
    } else {
      name = `${cluster.name}Behavior`;
    }
  }
  const context = {
    scope: (0, import_model.Scope)(schema),
    cluster,
    base,
    newProps: {},
    forClient,
    commandFactory
  };
  const type = (0, import_general.GeneratedClass)({
    name,
    base,
    // These are really read-only but installing as getters on the prototype prevents us from overriding using
    // namespace overrides.  If we instead override as static properties then we lose the automatic interface type.
    // So just publish as static properties.
    staticProperties: {
      State: createDerivedState(context),
      Events: createDerivedEvents(context)
    },
    staticDescriptors: {
      id: {
        value: (0, import_general.camelize)(cluster.name),
        enumerable: true
      },
      cluster: {
        value: cluster,
        enumerable: true
      }
    },
    instanceDescriptors: createDefaultCommandDescriptors(context)
  });
  import_model.ClassSemantics.of(type).mutableModel = schema;
  if (type.schema !== schema) {
    Object.defineProperty(type, "schema", { value: schema });
  }
  schema.finalize();
  if (useCache) {
    import_ClusterBehaviorCache.ClusterBehaviorCache.set(cluster, base, schema, type);
  }
  return type;
}
const KNOWN_DEFAULTS = /* @__PURE__ */ Symbol("knownDefaults");
function createDerivedState({ cluster, scope, base, newProps }) {
  const BaseState = base["State"];
  if (BaseState === void 0) {
    throw new import_general.ImplementationError(`No state class defined for behavior class ${base.name}`);
  }
  const oldDefaults = new BaseState();
  let knownDefaults = BaseState[KNOWN_DEFAULTS];
  const props = {};
  for (const member of scope.membersOf(scope.owner, { conformance: "deconflicted" })) {
    const name = (0, import_general.camelize)(member.name);
    if (props[name]) {
      props[name].push(member);
    } else {
      props[name] = [member];
    }
  }
  const defaults = {};
  for (const name in props) {
    const attrs = props[name];
    let propSchema;
    for (const attr of attrs) {
      if (!attr.effectiveConformance.applicabilityFor(scope)) {
        continue;
      }
      propSchema = attr;
      break;
    }
    if (!propSchema) {
      if (oldDefaults[name] !== void 0) {
        if (!knownDefaults) {
          knownDefaults = {};
        } else if (knownDefaults === BaseState[KNOWN_DEFAULTS]) {
          knownDefaults = { ...knownDefaults };
        }
        knownDefaults[name] = oldDefaults[name];
        defaults[name] = void 0;
      }
      continue;
    }
    newProps[name] = propSchema;
    const attribute = cluster.attributes[name];
    if (attribute?.id === import_model.FeatureMap.id) {
      defaults[name] = cluster.supportedFeatures;
      continue;
    }
    defaults[name] = selectDefaultValue(
      scope,
      oldDefaults[name] === void 0 ? knownDefaults?.[name] : oldDefaults[name],
      propSchema
    );
  }
  const StateType = (0, import_StateType.DerivedState)({
    name: `${cluster.name}$State`,
    base: base.State,
    values: defaults
  });
  if (knownDefaults) {
    StateType[KNOWN_DEFAULTS] = knownDefaults;
  }
  return StateType;
}
function createDerivedEvents({ scope, base, newProps, forClient }) {
  const instanceDescriptors = {};
  const baseInstance = new base.Events();
  const eventNames = /* @__PURE__ */ new Set();
  const quieterImplementation = forClient ? import_Events.OnlineEvent : import_Events.QuietEvent;
  const applicableClusterEvents = /* @__PURE__ */ new Set();
  for (const event of scope.membersOf(scope.owner, {
    conformance: "conformant",
    tags: [import_model.ElementTag.Event]
  })) {
    const name = (0, import_general.camelize)(event.name);
    applicableClusterEvents.add(name);
    if (baseInstance[name] !== void 0) {
      continue;
    }
    if (!forClient && !scope.hasOperationalSupport(event)) {
      continue;
    }
    eventNames.add(name);
    instanceDescriptors[name] = createEventDescriptor(
      name,
      event,
      event.quality.quieter ? quieterImplementation : import_Events.OnlineEvent
    );
  }
  for (const attrName in newProps) {
    const changing = `${attrName}$Changing`;
    const prop = newProps[attrName];
    if (baseInstance[changing] === void 0) {
      eventNames.add(changing);
      instanceDescriptors[changing] = createEventDescriptor(changing, prop, import_Events.OfflineEvent);
    }
    const changed = `${attrName}$Changed`;
    if (baseInstance[changed] === void 0) {
      eventNames.add(changed);
      instanceDescriptors[changed] = createEventDescriptor(
        changed,
        prop,
        prop.quality.quieter ? quieterImplementation : import_Events.OnlineEvent
      );
    }
  }
  return (0, import_general.GeneratedClass)({
    name: `${base.name}$Events`,
    base: base.Events,
    instanceDescriptors,
    initialize() {
      this.interactionBegin = new import_general.Observable();
      this.interactionEnd = new import_general.Observable();
      this.stateChanged = new import_general.Observable();
      for (const name of eventNames) {
        this.addEvent(name);
      }
    }
  });
}
function schemaForCluster(cluster) {
  let schema;
  for (const child of import_model.Matter.children) {
    if (child.tag === import_model.ElementTag.Cluster && child.id === cluster.id) {
      schema = child;
      break;
    }
  }
  if (schema === void 0) {
    throw new import_general.ImplementationError(`Cannot locate schema for cluster ${cluster.id}, please supply manually`);
  }
  return schema;
}
const configuredSchemaCache = /* @__PURE__ */ new Map();
function syncFeatures(schema, cluster) {
  const incomingFeatures = new import_model.FeatureSet(cluster.supportedFeatures);
  if (new import_model.FeatureSet(cluster.supportedFeatures).is(schema.supportedFeatures)) {
    return schema;
  }
  const featureKey = [...incomingFeatures].sort().join(",");
  let schemaBucket = configuredSchemaCache.get(schema);
  if (schemaBucket === void 0) {
    schemaBucket = {};
    configuredSchemaCache.set(schema, schemaBucket);
  } else {
    if (featureKey in schemaBucket) {
      return schemaBucket[featureKey];
    }
  }
  schema = schema.clone();
  schema.supportedFeatures = incomingFeatures;
  schemaBucket[featureKey] = schema;
  return schema;
}
const sourceFactory = /* @__PURE__ */ Symbol("source-factory");
function createDefaultCommandDescriptors({ scope, base, commandFactory }) {
  const result = {};
  const instance = (0, import_cluster_behavior_utils.introspectionInstanceOf)(base);
  const names = new Set(
    scope.membersOf(scope.owner, { tags: [import_model.ElementTag.Command] }).map((command) => (0, import_general.camelize)(command.name))
  );
  const conformantNames = new Set(
    scope.membersOf(scope.owner, { tags: [import_model.ElementTag.Command], conformance: "conformant" }).map((command) => (0, import_general.camelize)(command.name))
  );
  for (const name of names) {
    let implementation;
    if (!conformantNames.has(name)) {
      if (instance[name] && instance[name] !== import_Behavior.Behavior.unimplemented) {
        continue;
      }
    }
    if (commandFactory) {
      if (instance[name]?.[sourceFactory] === commandFactory) {
        continue;
      }
      implementation = commandFactory(name);
      implementation[sourceFactory] = commandFactory;
    } else {
      if (instance[name]) {
        continue;
      }
      implementation = import_Behavior.Behavior.unimplemented;
    }
    result[name] = {
      value: implementation,
      writable: true
    };
  }
  return result;
}
function selectDefaultValue(scope, oldDefault, member) {
  if (oldDefault !== void 0) {
    return oldDefault;
  }
  if (!scope.hasOperationalSupport(member)) {
    return;
  }
  const effectiveDefault = (0, import_model.DefaultValue)(scope, member);
  if (effectiveDefault !== void 0) {
    if (member.effectiveMetatype === "bitmap") {
      return (0, import_model.DecodedBitmap)(member, effectiveDefault);
    }
    return effectiveDefault;
  }
  if (member.nullable) {
    return null;
  }
  switch (member.effectiveMetatype) {
    case import_model.Metatype.integer:
    case import_model.Metatype.float:
      return 0;
    case import_model.Metatype.boolean:
      return false;
    case import_model.Metatype.bitmap:
    case import_model.Metatype.object:
      return {};
    case import_model.Metatype.array:
      return [];
  }
}
function createEventDescriptor(name, schema, constructor) {
  return {
    get() {
      if (this.hasEvent(name, true)) {
        return this.getEvent(name);
      }
      const event = new constructor(schema, this);
      this.addEvent(name, event);
      return event;
    },
    enumerable: true
  };
}
//# sourceMappingURL=ClusterBehaviorType.js.map

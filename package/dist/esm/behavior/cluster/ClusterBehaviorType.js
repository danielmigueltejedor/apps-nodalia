/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { OfflineEvent, OnlineEvent, QuietEvent } from "#behavior/Events.js";
import { camelize, GeneratedClass, ImplementationError, Observable } from "#general";
import {
  ClassSemantics,
  DecodedBitmap,
  DefaultValue,
  ElementTag,
  FeatureMap,
  FeatureSet,
  Matter,
  Metatype,
  Scope
} from "#model";
import { Behavior } from "../Behavior.js";
import { DerivedState } from "../state/StateType.js";
import { ClusterBehaviorCache } from "./ClusterBehaviorCache.js";
import { introspectionInstanceOf } from "./cluster-behavior-utils.js";
function ClusterBehaviorType({
  cluster,
  base,
  schema,
  name,
  forClient,
  commandFactory
}) {
  if (schema === void 0) {
    if (base.schema.tag === ElementTag.Cluster) {
      schema = base.schema;
    }
    if (!schema) {
      schema = schemaForCluster(cluster);
    }
  }
  schema = syncFeatures(schema, cluster);
  const useCache = name === void 0;
  if (useCache) {
    const cached = ClusterBehaviorCache.get(cluster, base, schema, forClient);
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
    scope: Scope(schema),
    cluster,
    base,
    newProps: {},
    forClient,
    commandFactory
  };
  const type = GeneratedClass({
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
        value: camelize(cluster.name),
        enumerable: true
      },
      cluster: {
        value: cluster,
        enumerable: true
      }
    },
    instanceDescriptors: createDefaultCommandDescriptors(context)
  });
  ClassSemantics.of(type).mutableModel = schema;
  if (type.schema !== schema) {
    Object.defineProperty(type, "schema", { value: schema });
  }
  schema.finalize();
  if (useCache) {
    ClusterBehaviorCache.set(cluster, base, schema, type);
  }
  return type;
}
const KNOWN_DEFAULTS = /* @__PURE__ */ Symbol("knownDefaults");
function createDerivedState({ cluster, scope, base, newProps }) {
  const BaseState = base["State"];
  if (BaseState === void 0) {
    throw new ImplementationError(`No state class defined for behavior class ${base.name}`);
  }
  const oldDefaults = new BaseState();
  let knownDefaults = BaseState[KNOWN_DEFAULTS];
  const props = {};
  for (const member of scope.membersOf(scope.owner, { conformance: "deconflicted" })) {
    const name = camelize(member.name);
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
    if (attribute?.id === FeatureMap.id) {
      defaults[name] = cluster.supportedFeatures;
      continue;
    }
    defaults[name] = selectDefaultValue(
      scope,
      oldDefaults[name] === void 0 ? knownDefaults?.[name] : oldDefaults[name],
      propSchema
    );
  }
  const StateType = DerivedState({
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
  const quieterImplementation = forClient ? OnlineEvent : QuietEvent;
  const applicableClusterEvents = /* @__PURE__ */ new Set();
  for (const event of scope.membersOf(scope.owner, {
    conformance: "conformant",
    tags: [ElementTag.Event]
  })) {
    const name = camelize(event.name);
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
      event.quality.quieter ? quieterImplementation : OnlineEvent
    );
  }
  for (const attrName in newProps) {
    const changing = `${attrName}$Changing`;
    const prop = newProps[attrName];
    if (baseInstance[changing] === void 0) {
      eventNames.add(changing);
      instanceDescriptors[changing] = createEventDescriptor(changing, prop, OfflineEvent);
    }
    const changed = `${attrName}$Changed`;
    if (baseInstance[changed] === void 0) {
      eventNames.add(changed);
      instanceDescriptors[changed] = createEventDescriptor(
        changed,
        prop,
        prop.quality.quieter ? quieterImplementation : OnlineEvent
      );
    }
  }
  return GeneratedClass({
    name: `${base.name}$Events`,
    base: base.Events,
    instanceDescriptors,
    initialize() {
      this.interactionBegin = new Observable();
      this.interactionEnd = new Observable();
      this.stateChanged = new Observable();
      for (const name of eventNames) {
        this.addEvent(name);
      }
    }
  });
}
function schemaForCluster(cluster) {
  let schema;
  for (const child of Matter.children) {
    if (child.tag === ElementTag.Cluster && child.id === cluster.id) {
      schema = child;
      break;
    }
  }
  if (schema === void 0) {
    throw new ImplementationError(`Cannot locate schema for cluster ${cluster.id}, please supply manually`);
  }
  return schema;
}
const configuredSchemaCache = /* @__PURE__ */ new Map();
function syncFeatures(schema, cluster) {
  const incomingFeatures = new FeatureSet(cluster.supportedFeatures);
  if (new FeatureSet(cluster.supportedFeatures).is(schema.supportedFeatures)) {
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
  const instance = introspectionInstanceOf(base);
  const names = new Set(
    scope.membersOf(scope.owner, { tags: [ElementTag.Command] }).map((command) => camelize(command.name))
  );
  const conformantNames = new Set(
    scope.membersOf(scope.owner, { tags: [ElementTag.Command], conformance: "conformant" }).map((command) => camelize(command.name))
  );
  for (const name of names) {
    let implementation;
    if (!conformantNames.has(name)) {
      if (instance[name] && instance[name] !== Behavior.unimplemented) {
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
      implementation = Behavior.unimplemented;
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
  const effectiveDefault = DefaultValue(scope, member);
  if (effectiveDefault !== void 0) {
    if (member.effectiveMetatype === "bitmap") {
      return DecodedBitmap(member, effectiveDefault);
    }
    return effectiveDefault;
  }
  if (member.nullable) {
    return null;
  }
  switch (member.effectiveMetatype) {
    case Metatype.integer:
    case Metatype.float:
      return 0;
    case Metatype.boolean:
      return false;
    case Metatype.bitmap:
    case Metatype.object:
      return {};
    case Metatype.array:
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
export {
  ClusterBehaviorType
};
//# sourceMappingURL=ClusterBehaviorType.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ClusterBehavior } from "#behavior/cluster/ClusterBehavior.js";
import { ValidatedElements } from "#behavior/cluster/ValidatedElements.js";
import { camelize, ImplementationError, ObserverGroup } from "#general";
import { FeatureSet, FieldValue, Schema } from "#model";
import { TlvNoResponse } from "#types";
import { BehaviorBacking } from "./BehaviorBacking.js";
const NoElements = /* @__PURE__ */ new Set();
class FeatureMismatchError extends ImplementationError {
}
class ServerBehaviorBacking extends BehaviorBacking {
  #elements;
  #suppressedChanges;
  #quietObservers;
  constructor(endpoint, type, store, options) {
    super(endpoint, type, store, options);
    this.#configureEventSuppression();
  }
  get elements() {
    return this.#elements;
  }
  invokeInitializer(behavior, options) {
    const finalizeState = () => {
      this.#applyTransitiveDefaults(behavior.state);
      if (behavior instanceof ClusterBehavior) {
        this.#configureElements(behavior);
      } else {
        this.#elements = {
          features: NoElements,
          attributes: NoElements,
          commands: NoElements,
          events: NoElements
        };
      }
      const context = behavior.context;
      this.datasource.validate(context, behavior.state);
    };
    const promise = super.invokeInitializer(behavior, options);
    if (promise) {
      return promise.then(finalizeState);
    }
    finalizeState();
  }
  /**
   * Schema may specify that state fields default to the value of another field.  We apply these defaults after
   * initialization when the other field should be defined.
   */
  #applyTransitiveDefaults(state) {
    const schema = this.type.schema;
    if (!schema) {
      return;
    }
    for (const member of this.type.supervisor.membersOf(schema)) {
      const name = camelize(member.name);
      if (state[name] === void 0) {
        const referenced = FieldValue.referenced(member.default);
        if (referenced) {
          const val = state[camelize(referenced)];
          if (val !== void 0) {
            state[name] = val;
          }
        }
      }
    }
  }
  #configureElements(behavior) {
    const validation = new ValidatedElements(behavior.constructor, behavior);
    validation.report();
    const globals = behavior.state;
    const attributeDefs = behavior.cluster.attributes;
    globals.attributeList = [...validation.attributes].map((name) => attributeDefs[name].id);
    const commandDefs = behavior.cluster.commands;
    const commands = [...validation.commands].map((name) => commandDefs[name]);
    globals.acceptedCommandList = commands.map((command) => command.requestId);
    globals.generatedCommandList = [
      ...new Set(
        commands.filter((command) => command.responseSchema !== TlvNoResponse).map((command) => command.responseId)
      )
    ];
    const schema = Schema(behavior.type);
    if (schema.tag === "cluster") {
      const { supportedFeatures, featureMap } = Schema(behavior.type);
      const { featuresSupported, featuresAvailable } = FeatureSet.normalize(
        featureMap,
        new FeatureSet(globals.featureMap)
      );
      for (const name of featuresAvailable) {
        if (supportedFeatures.has(name) !== featuresSupported.has(name)) {
          throw new FeatureMismatchError(
            `The featureMap for ${behavior} does not match the implementation; please use ${behavior.type.name}.with("FeatureName") to configure features`
          );
        }
      }
    }
    this.#elements = {
      features: behavior.type.schema.supportedFeatures ?? /* @__PURE__ */ new Set(),
      attributes: validation.attributes,
      commands: validation.commands,
      events: validation.events
    };
  }
  #onChange(props) {
    if (this.#suppressedChanges) {
      props = props.filter((name) => !this.#suppressedChanges.has(name));
    }
    this.broadcastChanges(props);
  }
  get datasourceOptions() {
    const options = super.datasourceOptions;
    options.onChange = this.#onChange.bind(this);
    return options;
  }
  close(agent) {
    this.#quietObservers?.close();
    return super.close(agent);
  }
  /**
   * We handle events in bulk via {@link Datasource.Options.onChange}, but "quieter" and "changesOmitted" events
   * require special handling.  Those we ignore in the change handler and instead report only when emitted by the
   * corresponding {@link OnlineEvent}.
   */
  #configureEventSuppression() {
    const { schema } = this.type;
    if (!schema) {
      return;
    }
    for (const property of schema.conformant.properties) {
      const { changesOmitted, quieter } = property.effectiveQuality;
      if (!changesOmitted && !quieter) {
        continue;
      }
      const name = camelize(property.name);
      if (!this.#suppressedChanges) {
        this.#suppressedChanges = /* @__PURE__ */ new Set();
      }
      this.#suppressedChanges.add(name);
      if (!quieter) {
        continue;
      }
      const event = this.events[`${name}$Changed`];
      if (event === void 0) {
        continue;
      }
      if (event.isQuieter) {
        if (!this.#quietObservers) {
          this.#quietObservers = new ObserverGroup();
        }
        this.#quietObservers.on(event.quiet, () => this.broadcastChanges([name]));
      }
    }
  }
}
export {
  FeatureMismatchError,
  ServerBehaviorBacking
};
//# sourceMappingURL=ServerBehaviorBacking.js.map

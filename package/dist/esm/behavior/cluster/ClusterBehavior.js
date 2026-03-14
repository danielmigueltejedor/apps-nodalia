/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Events } from "#behavior/Events.js";
import { ImplementationError } from "#general";
import { ClusterModifier } from "#model";
import { ClusterComposer, ClusterType, ClusterTypeModifier } from "#types";
import { Behavior } from "../Behavior.js";
import { NetworkBehavior } from "../system/network/NetworkBehavior.js";
import { isClientBehavior } from "./cluster-behavior-utils.js";
import { ClusterBehaviorType } from "./ClusterBehaviorType.js";
import { ClusterInterface } from "./ClusterInterface.js";
class ClusterBehavior extends Behavior {
  /**
   * The ID of ClusterBehavior implementations is the uncapitalized cluster name.
   */
  static id;
  /**
   * The cluster implemented by this behavior.
   */
  get cluster() {
    return this.constructor.cluster;
  }
  /**
   * Supported features as a flag object.
   */
  get features() {
    return this.cluster.supportedFeatures;
  }
  get type() {
    return this.constructor;
  }
  /**
   * Every cluster behavior has an associated ClusterType defined statically.
   */
  static cluster = ClusterType.Unknown;
  /**
   * Method definitions.
   */
  static Interface = ClusterInterface.Empty;
  /**
   * All ClusterBehavior initialization currently runs as part of {@link Endpoint} initialization.
   */
  static early = true;
  /**
   * Keep networking alive until I'm destroyed.
   */
  static dependencies = [NetworkBehavior];
  /**
   * Automatically lock state on command invoke.
   */
  static lockOnInvoke = true;
  constructor(agent, backing) {
    super(agent, backing);
    const cluster = this.constructor.cluster;
    if (!cluster) {
      throw new ImplementationError("ClusterBehavior class has no cluster defined");
    }
  }
  /**
   * Create a new behavior for a specific {@link ClusterType}.
   *
   * If you invoke directly on {@link ClusterBehavior} you will receive a new implementation that reports all commands
   * as unimplemented.
   *
   * If you invoke on an existing subclass, you will receive a new implementation with the cluster in the subclass
   * replaced.  You should generally only do this with a {@link ClusterType} with the same ID.
   */
  static for(cluster, schema, name) {
    return ClusterBehaviorType({
      cluster,
      base: this,
      schema,
      name
    });
  }
  /**
   * Create a new behavior with different cluster features.
   */
  static withFeatures(...features) {
    const newCluster = new ClusterComposer(this.cluster).compose(features);
    return this.for(newCluster);
  }
  /**
   * Alias for {@link withFeatures}.
   */
  static with(...features) {
    return this.withFeatures(...features);
  }
  /**
   * Create a new behavior with modified cluster elements.
   */
  static alter(alterations) {
    const cluster = new ClusterTypeModifier(this.cluster).alter(alterations);
    const schema = ClusterModifier.applyRequirements(this.schema, alterations);
    return this.for(cluster, schema);
  }
  /**
   * Create a new behavior with additional cluster features marked "mandatory".
   *
   * This informs matter.js that an application supports these elements.
   */
  static enable(flags) {
    const cluster = new ClusterTypeModifier(this.cluster).enable(flags);
    const schema = ClusterModifier.applyPresence(this.schema, flags);
    return this.for(cluster, schema);
  }
  /**
   * Create a ClusterBehavior like this one with different interface methods.
   *
   * The Interface "property" is type-only.  We define a method however to keep the API consistent.  At runtime the
   * method is a no-op.
   */
  static withInterface() {
    return this;
  }
  static supports(other) {
    const otherCluster = other.cluster;
    if (!otherCluster) {
      return false;
    }
    if (isClientBehavior(other) && otherCluster.id === this.cluster.id) {
      return true;
    }
    if (!Behavior.supports.call(this, other)) {
      return false;
    }
    const otherFeatures = otherCluster.supportedFeatures;
    const myFeatures = this.cluster.supportedFeatures;
    for (const name in otherFeatures) {
      if (otherFeatures[name] && !myFeatures[name]) {
        return false;
      }
    }
    return true;
  }
  requireAttributeEnabled(attributeName) {
    if (this.state[attributeName] === void 0) {
      throw new ImplementationError(
        `To use this feature, please enable attribute ${String(attributeName)} by setting the value during initialization`
      );
    }
    return this.state[attributeName];
  }
  assertAttributeEnabled(attributeName) {
    if (this.state[attributeName] === void 0) {
      throw new ImplementationError(
        `To use this feature, please enable attribute ${String(attributeName)} by setting the value during initialization`
      );
    }
  }
  static Events = Events;
}
((ClusterBehavior2) => {
  function is(type) {
    return "cluster" in type;
  }
  ClusterBehavior2.is = is;
})(ClusterBehavior || (ClusterBehavior = {}));
export {
  ClusterBehavior
};
//# sourceMappingURL=ClusterBehavior.js.map

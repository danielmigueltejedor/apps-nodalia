/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { camelize } from "#general";
import { BehaviorBacking } from "./BehaviorBacking.js";
class ClientBehaviorBacking extends BehaviorBacking {
  #elements;
  get elements() {
    if (this.#elements) {
      return this.#elements;
    }
    const { attributeList, acceptedCommandList } = this.endpoint.stateOf(this.type);
    const schema = this.type.schema;
    const attributes = /* @__PURE__ */ new Set();
    const attributeIds = new Set(attributeList);
    for (const attr of schema.attributes) {
      if (attributeIds.has(attr.id)) {
        attributes.add(camelize(attr.name));
      }
    }
    const commands = /* @__PURE__ */ new Set();
    const commandIds = new Set(acceptedCommandList);
    for (const cmd of schema.commands) {
      if (cmd.isRequest && commandIds.has(cmd.id)) {
        commands.add(camelize(cmd.name));
      }
    }
    return this.#elements = {
      features: schema.supportedFeatures,
      attributes,
      commands,
      events: /* @__PURE__ */ new Set()
      // Not published
    };
  }
  get datasourceOptions() {
    const options = super.datasourceOptions;
    options.primaryKey = "id";
    return options;
  }
  close() {
    this.store.reclaimValues?.();
    return super.close();
  }
}
export {
  ClientBehaviorBacking
};
//# sourceMappingURL=ClientBehaviorBacking.js.map

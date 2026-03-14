/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Construction } from "#general";
class NodeStore {
  #storageFactory;
  #construction;
  #bdxStore;
  get bdxStore() {
    this.construction.assert("BDX storage context");
    if (!this.#bdxStore) {
      this.#bdxStore = this.createStorageContext("bdx");
    }
    return this.#bdxStore;
  }
  get construction() {
    return this.#construction;
  }
  constructor(storageFactory) {
    this.#storageFactory = storageFactory;
    this.#construction = Construction(this);
  }
  toString() {
    return "node store";
  }
  [Construction.construct]() {
    return this.load();
  }
  createStorageContext(name) {
    return this.#storageFactory.createContext(name);
  }
  get storageFactory() {
    return this.#storageFactory;
  }
}
export {
  NodeStore
};
//# sourceMappingURL=NodeStore.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Datasource } from "#behavior/state/managed/Datasource.js";
import { InternalError } from "#general";
function DatasourceCache(store, behaviorId, initialValues) {
  let version = initialValues?.[DatasourceCache.VERSION_KEY];
  if (typeof version !== "number") {
    version = Datasource.UNKNOWN_VERSION;
  }
  return {
    initialValues,
    async set(transaction, values) {
      const participant = store.participantFor(transaction);
      participant.set(store.number, behaviorId, values);
    },
    async externalSet(values) {
      if (typeof values[DatasourceCache.VERSION_KEY] === "number") {
        version = values[DatasourceCache.VERSION_KEY];
      }
      await store.set({ [behaviorId]: values });
      if (this.externalChangeListener) {
        await this.externalChangeListener(values);
      } else {
        if (!this.initialValues) {
          this.initialValues = {};
        }
        Object.assign(this.initialValues, values);
      }
    },
    externalChangeListener: void 0,
    releaseValues: void 0,
    reclaimValues() {
      if (this.releaseValues) {
        this.initialValues = this.releaseValues();
        this.releaseValues = void 0;
      }
    },
    get version() {
      return version;
    },
    set version(_version) {
      throw new InternalError("Datasource version must be set via externalSet");
    },
    async erase() {
      await store.eraseStoreForBehavior(behaviorId);
    }
  };
}
((DatasourceCache2) => {
  DatasourceCache2.VERSION_KEY = "__version__";
})(DatasourceCache || (DatasourceCache = {}));
export {
  DatasourceCache
};
//# sourceMappingURL=DatasourceCache.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Environmental } from "#general";
import { MdnsClient, ScannerSet } from "#protocol";
class ActiveDiscoveries extends Set {
  #env;
  #mdnsTargetCriteria;
  constructor(env) {
    super();
    this.#env = env;
    this.#activateCommissionableScanning();
    env.get(ScannerSet).added.on(this.#activateCommissionableScanningFor.bind(this));
  }
  static [Environmental.create](env) {
    const instance = new ActiveDiscoveries(env);
    env.set(ActiveDiscoveries, instance);
    return instance;
  }
  async close() {
    this.#env.delete(ActiveDiscoveries, this);
    this.#deactivateCommissionableScanning();
  }
  #activateCommissionableScanning() {
    const scanners = this.#env.get(ScannerSet);
    for (const scanner of scanners) {
      this.#activateCommissionableScanningFor(scanner);
    }
  }
  #activateCommissionableScanningFor(scanner) {
    if (!(scanner instanceof MdnsClient)) {
      return;
    }
    if (this.#mdnsTargetCriteria === void 0) {
      this.#mdnsTargetCriteria = { commissionable: true, operationalTargets: [] };
    }
    scanner.targetCriteriaProviders.add(this.#mdnsTargetCriteria);
  }
  #deactivateCommissionableScanning() {
    if (!this.#mdnsTargetCriteria) {
      return;
    }
    const scanners = this.#env.get(ScannerSet);
    for (const scanner of scanners) {
      if (scanner instanceof MdnsClient) {
        scanner.targetCriteriaProviders.delete(this.#mdnsTargetCriteria);
      }
    }
  }
}
export {
  ActiveDiscoveries
};
//# sourceMappingURL=ActiveDiscoveries.js.map

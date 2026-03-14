/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EndpointStore } from "#storage/EndpointStore.js";
import { DatasourceStore } from "#storage/server/DatasourceStore.js";
import { DatasourceCache } from "./DatasourceCache.js";
import { RemoteWriteParticipant } from "./RemoteWriteParticipant.js";
class ClientEndpointStore extends EndpointStore {
  #owner;
  #number;
  constructor(owner, number, storage) {
    super(storage);
    this.#owner = owner;
    this.#number = number;
  }
  get number() {
    return this.#number;
  }
  /**
   * Shortcut to persisted peer address so we can use in logging prior to full initialization.
   */
  get peerAddress() {
    return this.initialValues.get("commissioning")?.["peerAddress"];
  }
  participantFor(transaction) {
    let participant = transaction.getParticipant(this.#owner);
    if (participant === void 0) {
      participant = new RemoteWriteParticipant(this.#owner);
      transaction.addParticipants(participant);
    }
    return participant;
  }
  /**
   * Create a {@link Datasource.ExternallyMutableStore} for a behavior.
   */
  createStoreForBehavior(behaviorId) {
    const initialValues = this.consumeInitialValues(behaviorId);
    return DatasourceCache(this, behaviorId, initialValues);
  }
  /**
   * Create a {@link Datasource.Store} for a behavior that does not track a remote cluster.
   */
  createStoreForLocalBehavior(behaviorId) {
    const initialValues = this.consumeInitialValues(behaviorId);
    return DatasourceStore(this, behaviorId, initialValues);
  }
}
export {
  ClientEndpointStore
};
//# sourceMappingURL=ClientEndpointStore.js.map

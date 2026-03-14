/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { limitNodeDataToAllowedFabrics } from "#behavior/cluster/FabricScopedDataHandler.js";
import { EndpointInitializer } from "#endpoint/properties/EndpointInitializer.js";
import { Crypto, Observable } from "#general";
import { NodePeerAddressStore } from "#node/client/NodePeerAddressStore.js";
import { ChangeNotificationService } from "#node/integration/ChangeNotificationService.js";
import { ServerEndpointInitializer } from "#node/server/ServerEndpointInitializer.js";
import { FabricManager, OccurrenceManager, PeerAddressStore, SessionManager } from "#protocol";
import { ServerNodeStore } from "#storage/server/ServerNodeStore.js";
import { IdentityService } from "./IdentityService.js";
var ServerEnvironment;
((ServerEnvironment2) => {
  ServerEnvironment2.fabricScopedDataSanitized = Observable();
  async function initialize(node) {
    const { env } = node;
    const store = await ServerNodeStore.create(env, node.id);
    env.set(ServerNodeStore, store);
    env.set(EndpointInitializer, new ServerEndpointInitializer(env));
    env.set(IdentityService, new IdentityService(node));
    env.set(PeerAddressStore, new NodePeerAddressStore(node));
    env.set(ChangeNotificationService, new ChangeNotificationService(node));
    const fabrics = await env.load(FabricManager);
    fabrics.events.deleting.on(async () => {
      const fabricIndices = fabrics.fabrics.map((fabric) => fabric.fabricIndex);
      if (fabricIndices.length > 0) {
        await limitNodeDataToAllowedFabrics(node, fabricIndices);
      }
      ServerEnvironment2.fabricScopedDataSanitized.emit();
    });
    await env.load(SessionManager);
    env.get(Crypto).reportUsage(node.id);
  }
  ServerEnvironment2.initialize = initialize;
  async function close(node) {
    const { env } = node;
    env.close(FabricManager);
    await env.close(ChangeNotificationService);
    await env.close(SessionManager);
    await env.close(OccurrenceManager);
    await env.close(ServerNodeStore);
  }
  ServerEnvironment2.close = close;
})(ServerEnvironment || (ServerEnvironment = {}));
export {
  ServerEnvironment
};
//# sourceMappingURL=ServerEnvironment.js.map

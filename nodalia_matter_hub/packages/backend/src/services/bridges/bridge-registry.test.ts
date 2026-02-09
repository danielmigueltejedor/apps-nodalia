import {
  type BridgeData,
  HomeAssistantMatcherType,
} from "@home-assistant-matter-hub/common";
import { describe, expect, it } from "vitest";
import type {
  HomeAssistantRegistry as BackendHomeAssistantRegistry,
} from "../home-assistant/home-assistant-registry.js";
import { BridgeDataProvider } from "./bridge-data-provider.js";
import { BridgeRegistry } from "./bridge-registry.js";

function createBridgeData(): BridgeData {
  return {
    id: "bridge-1",
    name: "Test Bridge",
    port: 5580,
    filter: {
      include: [],
      exclude: [],
    },
    basicInformation: {
      vendorId: 1,
      vendorName: "Test",
      productId: 1,
      productName: "Test",
      productLabel: "Test",
      hardwareVersion: 1,
      softwareVersion: 1,
    },
  };
}

describe("BridgeRegistry", () => {
  it("should include entities by area matcher using device area when entity has no area", () => {
    const registry = {
      devices: {
        "device-1": {
          id: "device-1",
          area_id: "kitchen",
        },
      },
      entities: {
        "light.kitchen_main": {
          entity_id: "light.kitchen_main",
          device_id: "device-1",
        },
      },
      states: {},
    } as unknown as BackendHomeAssistantRegistry;

    const dataProvider = new BridgeDataProvider(createBridgeData());
    dataProvider.update({
      id: "bridge-1",
      name: "Test Bridge",
      port: 5580,
      filter: {
        include: [
          {
            type: HomeAssistantMatcherType.Area,
            value: "kitchen",
          },
        ],
        exclude: [],
      },
    });

    const bridgeRegistry = new BridgeRegistry(registry, dataProvider);
    expect(bridgeRegistry.entityIds).toEqual(["light.kitchen_main"]);
  });
});

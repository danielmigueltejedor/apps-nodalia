import { HomeAssistantEntityBehavior } from "../../../../behaviors/home-assistant-entity-behavior.js";
import { parseVacuumServiceAreaData } from "../service-area-data.js";

import * as MatterBehaviors from "@matter/main/behaviors";

type ClusterBehaviorFactory = {
  set(config: object): object;
};

interface AgentLike {
  get(cluster: typeof HomeAssistantEntityBehavior): HomeAssistantEntityBehavior;
}

interface SelectAreasLike {
  selectedAreas?: unknown;
  newAreas?: unknown;
  areaIds?: unknown;
}

export function createVacuumServiceAreaServer(): object | undefined {
  const serviceAreaServer = (MatterBehaviors as Record<string, unknown>)
    .ServiceAreaServer as ClusterBehaviorFactory | undefined;

  if (serviceAreaServer?.set == null) {
    return undefined;
  }

  const configuration = {
    getSupportedMaps: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      return (data?.maps ?? []).map((map) =>
        ({
          mapId: map.mapId,
          mapName: map.name,
          name: map.name,
        }) as object,
      );
    },

    getSupportedAreas: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      return (data?.areas ?? []).map((area) =>
        ({
          areaId: area.matterAreaId,
          mapId: area.mapId,
          locationInfo: { locationName: area.name },
          areaInfo: { locationInfo: { locationName: area.name } },
        }) as object,
      );
    },

    getCurrentMap: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      if (data == null || data.maps.length === 0) {
        return undefined;
      }
      return data.maps[0].mapId;
    },

    getCurrentArea: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      if (data?.currentMatterAreaId == null) {
        return undefined;
      }
      const currentArea = data.areas.find(
        (area) => area.matterAreaId === data.currentMatterAreaId,
      );
      if (currentArea == null) {
        return undefined;
      }
      return {
        areaId: currentArea.matterAreaId,
        mapId: currentArea.mapId,
        locationInfo: { locationName: currentArea.name },
        areaInfo: { locationInfo: { locationName: currentArea.name } },
      } as object;
    },

    getProgress: (_: unknown, agent: unknown) => {
      const data = getData(agent);
      if (data == null || data.selectedMatterAreaIds.length === 0) {
        return [];
      }
      return data.selectedMatterAreaIds.map((areaId) => ({ areaId })) as object[];
    },

    selectAreas: (request: unknown, agent: unknown) => {
      const data = getData(agent);
      const entity = getEntity(agent);
      if (data == null || entity == null) {
        return;
      }

      const selectedMatterAreaIds = normalizeSelectedAreaIds(request);
      const selectedSegmentIds = selectedMatterAreaIds
        .map(
          (matterAreaId) =>
            data.areas.find((area) => area.matterAreaId === matterAreaId)
              ?.segmentId,
        )
        .filter((segmentId): segmentId is number => segmentId != null);

      if (selectedSegmentIds.length === 0) {
        return;
      }

      entity.callAction({
        action: "vacuum.send_command",
        data: {
          command: data.command,
          params: data.paramsNested ? [selectedSegmentIds] : selectedSegmentIds,
        },
      });
    },

    skipArea: (request: unknown, agent: unknown) => {
      const areaId = toNumber(request);
      if (areaId == null) {
        return;
      }
      configuration.selectAreas([areaId], agent);
    },
  };

  return serviceAreaServer.set({
    config: configuration,
    configuration,
  });
}

function getEntity(agent: unknown): HomeAssistantEntityBehavior | undefined {
  const typedAgent = agent as AgentLike | undefined;
  if (typedAgent?.get == null) {
    return undefined;
  }

  try {
    return typedAgent.get(HomeAssistantEntityBehavior);
  } catch {
    return undefined;
  }
}

function getData(agent: unknown) {
  const entity = getEntity(agent);
  const attributes = entity?.entity?.state?.attributes;
  if (attributes == null || typeof attributes !== "object") {
    return undefined;
  }
  return parseVacuumServiceAreaData(
    attributes as Parameters<typeof parseVacuumServiceAreaData>[0],
  );
}

function normalizeSelectedAreaIds(request: unknown): number[] {
  if (Array.isArray(request)) {
    return request
      .map((value) => toNumber(value))
      .filter((value): value is number => value != null);
  }

  if (request != null && typeof request === "object") {
    const payload = request as SelectAreasLike;
    const selected = payload.selectedAreas ?? payload.newAreas ?? payload.areaIds;
    if (Array.isArray(selected)) {
      return selected
        .map((value) => toNumber(value))
        .filter((value): value is number => value != null);
    }
  }

  return [];
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

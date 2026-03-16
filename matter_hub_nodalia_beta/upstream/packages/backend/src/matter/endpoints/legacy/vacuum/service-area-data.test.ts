import { describe, expect, it } from "vitest";
import { parseVacuumServiceAreaData } from "./service-area-data.js";

describe("parseVacuumServiceAreaData", () => {
  it("should parse area information from rooms array", () => {
    const data = parseVacuumServiceAreaData({
      rooms: [
        { id: 16, name: "Kitchen" },
        { segment_id: 17, name: "Living Room", map_id: 2 },
      ],
      selected_segments: [17],
      current_segment: 16,
    });

    expect(data).toEqual({
      maps: [
        { mapId: 1, name: "Map 1" },
        { mapId: 2, name: "Map 2" },
      ],
      areas: [
        {
          matterAreaId: 16,
          segmentId: 16,
          actionValue: 16,
          mapId: 1,
          name: "Kitchen",
        },
        {
          matterAreaId: 17,
          segmentId: 17,
          actionValue: 17,
          mapId: 2,
          name: "Living Room",
        },
      ],
      selectedMatterAreaIds: [17, 16],
      currentMatterAreaId: 16,
      action: "vacuum.send_command",
      command: "app_segment_clean",
      commandKey: "command",
      paramsKey: "params",
      paramsNested: false,
    });
  });

  it("should parse ids and names from separate segment attributes", () => {
    const data = parseVacuumServiceAreaData({
      segment_ids: [11, 12],
      segment_names: { "11": "Entry", "12": "Hall" },
      matter_service_area_command: "vacuum_clean_segment",
      matter_service_area_params_nested: true,
      map_id: 3,
    });

    expect(data).toEqual({
      maps: [{ mapId: 3, name: "Map" }],
      areas: [
        {
          matterAreaId: 11,
          segmentId: 11,
          actionValue: 11,
          mapId: 3,
          name: "Entry",
        },
        {
          matterAreaId: 12,
          segmentId: 12,
          actionValue: 12,
          mapId: 3,
          name: "Hall",
        },
      ],
      selectedMatterAreaIds: [],
      currentMatterAreaId: undefined,
      action: "vacuum.send_command",
      command: "vacuum_clean_segment",
      commandKey: "command",
      paramsKey: "params",
      paramsNested: true,
    });
  });

  it("should parse tuple-based mappings and custom action metadata", () => {
    const data = parseVacuumServiceAreaData({
      room_mapping: [
        [31, "Office"],
        ["32", "Bedroom", 2],
      ],
      selected_areas: [{ areaId: 32 }, { id: "31" }],
      current_area: "31",
      matter_service_area_action: "vacuum.clean_segment",
      matter_service_area_params_key: "segments",
      matter_service_area_params_nested: "true",
    });

    expect(data).toEqual({
      maps: [
        { mapId: 1, name: "Map 1" },
        { mapId: 2, name: "Map 2" },
      ],
      areas: [
        {
          matterAreaId: 31,
          segmentId: 31,
          actionValue: 31,
          mapId: 1,
          name: "Office",
        },
        {
          matterAreaId: 32,
          segmentId: 32,
          actionValue: 32,
          mapId: 2,
          name: "Bedroom",
        },
      ],
      selectedMatterAreaIds: [32, 31],
      currentMatterAreaId: 31,
      action: "vacuum.clean_segment",
      command: undefined,
      commandKey: "command",
      paramsKey: "segments",
      paramsNested: true,
    });
  });

  it("should parse object-based ids and mixed name formats", () => {
    const data = parseVacuumServiceAreaData({
      segment_ids: { "41": true, "42": "1", "43": false },
      segment_names: [
        [41, "Desk"],
        { id: 42, name: "Hall" },
      ],
      selected_segments: { "42": "on" },
    });

    expect(data).toEqual({
      maps: [{ mapId: 1, name: "Map" }],
      areas: [
        {
          matterAreaId: 41,
          segmentId: 41,
          actionValue: 41,
          mapId: 1,
          name: "Desk",
        },
        {
          matterAreaId: 42,
          segmentId: 42,
          actionValue: 42,
          mapId: 1,
          name: "Hall",
        },
      ],
      selectedMatterAreaIds: [42],
      currentMatterAreaId: undefined,
      action: "vacuum.send_command",
      command: "app_segment_clean",
      commandKey: "command",
      paramsKey: "params",
      paramsNested: false,
    });
  });

  it("should support string area ids for vacuum.clean_area", () => {
    const data = parseVacuumServiceAreaData({
      room_map: {
        bano_del_dormitorio: "Bano dormitorio",
        despensa: "Despensa",
      },
      selected_areas: ["despensa"],
      current_area: "bano_del_dormitorio",
      matter_service_area_action: "vacuum.clean_area",
      matter_service_area_params_key: "cleaning_area_id",
    });

    expect(data).toBeDefined();
    if (!data) {
      throw new Error("Expected parsed service area data");
    }

    expect(data.action).toBe("vacuum.clean_area");
    expect(data.paramsKey).toBe("cleaning_area_id");

    const areaByActionValue = new Map(
      data.areas.map((area) => [String(area.actionValue), area]),
    );

    const bathroom = areaByActionValue.get("bano_del_dormitorio");
    const pantry = areaByActionValue.get("despensa");

    expect(bathroom).toBeDefined();
    expect(pantry).toBeDefined();

    expect(data.selectedMatterAreaIds).toEqual([pantry?.matterAreaId]);
    expect(data.currentMatterAreaId).toBe(bathroom?.matterAreaId);
  });

  it("should resolve current area by room name labels", () => {
    const data = parseVacuumServiceAreaData({
      rooms: [
        { id: 17, name: "Salón" },
        { id: 18, name: "Cocina" },
      ],
      current_room: "salon",
    });

    expect(data).toBeDefined();
    if (!data) {
      throw new Error("Expected parsed service area data");
    }

    const livingRoom = data.areas.find((area) => area.name === "Salón");
    expect(livingRoom).toBeDefined();
    expect(data.currentMatterAreaId).toBe(livingRoom?.matterAreaId);
  });

  it("should return undefined when no area identifiers are available", () => {
    const data = parseVacuumServiceAreaData({
      supported_features: 1,
      battery_level: 80,
    });
    expect(data).toBeUndefined();
  });
});

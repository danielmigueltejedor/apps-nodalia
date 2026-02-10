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
        { matterAreaId: 16, segmentId: 16, mapId: 1, name: "Kitchen" },
        { matterAreaId: 17, segmentId: 17, mapId: 2, name: "Living Room" },
      ],
      selectedMatterAreaIds: [17, 16],
      currentMatterAreaId: 16,
      command: "app_segment_clean",
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
        { matterAreaId: 11, segmentId: 11, mapId: 3, name: "Entry" },
        { matterAreaId: 12, segmentId: 12, mapId: 3, name: "Hall" },
      ],
      selectedMatterAreaIds: [],
      currentMatterAreaId: undefined,
      command: "vacuum_clean_segment",
      paramsNested: true,
    });
  });

  it("should return undefined when no area identifiers are available", () => {
    const data = parseVacuumServiceAreaData({
      supported_features: 1,
      battery_level: 80,
    });
    expect(data).toBeUndefined();
  });
});

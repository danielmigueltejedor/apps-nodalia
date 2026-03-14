import { describe, expect, it } from "vitest";
import {
  normalizeSelectedAreaIds,
  normalizeSkippedAreaId,
} from "./vacuum-service-area-server.js";

describe("normalizeSelectedAreaIds", () => {
  it("should parse bigint area IDs", () => {
    const ids = normalizeSelectedAreaIds({
      newAreas: [{ areaId: 17n }, { id: 18n }],
    });

    expect(ids).toEqual([17, 18]);
  });

  it("should parse area IDs from iterable payloads", () => {
    const ids = normalizeSelectedAreaIds({
      newAreas: new Set([31, 32]),
    });

    expect(ids).toEqual([31, 32]);
  });

  it("should parse area IDs from typed array payloads", () => {
    const ids = normalizeSelectedAreaIds({
      newAreas: Uint16Array.from([41, 42]),
    });

    expect(ids).toEqual([41, 42]);
  });

  it("should parse area IDs from structured area arrays", () => {
    const ids = normalizeSelectedAreaIds({
      newAreas: [{ areaId: 10 }, { id: "11" }, { segment_id: 12 }],
    });

    expect(ids).toEqual([10, 11, 12]);
  });

  it("should parse area IDs from direct request arrays", () => {
    const ids = normalizeSelectedAreaIds([
      20,
      "21",
      { area: { areaId: 22 } },
      { targetArea: { id: 23 } },
    ]);

    expect(ids).toEqual([20, 21, 22, 23]);
  });

  it("should parse area ID from top-level struct fallback", () => {
    const ids = normalizeSelectedAreaIds({ areaId: "30" });
    expect(ids).toEqual([30]);
  });
});

describe("normalizeSkippedAreaId", () => {
  it("should parse nested skipped area payload", () => {
    const areaId = normalizeSkippedAreaId({
      skippedArea: { areaInfo: { areaId: 40 } },
    });

    expect(areaId).toBe(40);
  });

  it("should parse direct area id values", () => {
    expect(normalizeSkippedAreaId("41")).toBe(41);
  });
});

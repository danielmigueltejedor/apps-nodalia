import type { HomeAssistantEntityState } from "@home-assistant-matter-hub/common";
import { OnOffServer } from "../../../../behaviors/on-off-server.js";

const OFF_STATES = new Set(["off", "unavailable", "unknown"]);

export const CameraOnOffServer = OnOffServer({
  isOn: (entity: HomeAssistantEntityState) =>
    !OFF_STATES.has(String(entity.state).trim().toLowerCase()),
  turnOn: () => ({ action: "camera.turn_on" }),
  turnOff: () => ({ action: "camera.turn_off" }),
});

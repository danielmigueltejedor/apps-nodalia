import type { Agent } from "@matter/main";
import type { HomeAssistantAction } from "../../../../../services/home-assistant/home-assistant-actions.js";
import {
  VacuumServiceAreaServer,
  VacuumServiceAreaServerBase,
} from "./vacuum-service-area-server.js";

const DEFAULT_START_ACTION = { action: "vacuum.start" } as const;

export function resolveVacuumStartAction(agent: Agent): HomeAssistantAction {
  try {
    const serviceArea = agent.get(
      VacuumServiceAreaServer as never,
    ) as VacuumServiceAreaServerBase;
    return serviceArea.getSelectedAreasAction() ?? DEFAULT_START_ACTION;
  } catch {
    return DEFAULT_START_ACTION;
  }
}

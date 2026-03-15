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
    const debugSnapshot = serviceArea.getSelectionDebugSnapshot();
    const effectiveSelectedAreas =
      debugSnapshot.selectedAreasFromState.length > 0
        ? debugSnapshot.selectedAreasFromState
        : debugSnapshot.storedSelectedAreas;
    const selectedAreasAction = serviceArea.getSelectedAreasAction();
    if (selectedAreasAction == null) {
      console.debug(
        `VacuumStartAction using fallback vacuum.start (no selected service areas) snapshot=${JSON.stringify(debugSnapshot)}`,
      );
      return DEFAULT_START_ACTION;
    }

    console.debug(
      `VacuumStartAction using selected service areas ${JSON.stringify(effectiveSelectedAreas)}`,
    );
    return selectedAreasAction;
  } catch {
    console.debug(
      "VacuumStartAction using fallback vacuum.start (ServiceArea behavior unavailable)",
    );
    return DEFAULT_START_ACTION;
  }
}

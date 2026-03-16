import type { EndpointType } from "@matter/main";
import { OnOffPlugInUnitDevice } from "@matter/main/devices";
import { BasicInformationServer } from "../../../behaviors/basic-information-server.js";
import { HomeAssistantEntityBehavior } from "../../../behaviors/home-assistant-entity-behavior.js";
import { IdentifyServer } from "../../../behaviors/identify-server.js";
import { CameraOnOffServer } from "./behaviors/camera-on-off-server.js";

const CameraEndpointType = OnOffPlugInUnitDevice.with(
  BasicInformationServer,
  IdentifyServer,
  HomeAssistantEntityBehavior,
  CameraOnOffServer,
);

export function CameraDevice(
  homeAssistantEntity: HomeAssistantEntityBehavior.State,
): EndpointType {
  return CameraEndpointType.set({ homeAssistantEntity });
}

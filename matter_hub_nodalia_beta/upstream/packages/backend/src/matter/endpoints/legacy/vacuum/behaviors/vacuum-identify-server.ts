import {
  VacuumDeviceFeature,
  type VacuumDeviceAttributes,
} from "@home-assistant-matter-hub/common";
import { Identify } from "@matter/main/clusters";
import { testBit } from "../../../../../utils/test-bit.js";
import { HomeAssistantEntityBehavior } from "../../../../behaviors/home-assistant-entity-behavior.js";
import { IdentifyServer as Base } from "../../../../behaviors/identify-server.js";

export class VacuumIdentifyServer extends Base {
  override identify(request: Identify.IdentifyRequest) {
    const result = super.identify(request);
    if (request.identifyTime > 0) {
      this.playLocateSound("identify");
    }
    return result;
  }

  override triggerEffect(request: Identify.TriggerEffectRequest) {
    const result = super.triggerEffect(request);
    this.playLocateSound("triggerEffect");
    return result;
  }

  private playLocateSound(source: "identify" | "triggerEffect") {
    const entity = this.agent.get(HomeAssistantEntityBehavior);
    const attributes =
      entity.entity.state.attributes as VacuumDeviceAttributes & {
        supported_features?: number;
      };
    const supportedFeatures = attributes.supported_features ?? 0;

    if (!testBit(supportedFeatures, VacuumDeviceFeature.LOCATE)) {
      console.debug(
        `VacuumIdentifyServer skipped vacuum.locate (${source}: LOCATE unsupported)`,
      );
      return;
    }

    console.debug(`VacuumIdentifyServer calling vacuum.locate (${source})`);
    entity.callAction({ action: "vacuum.locate" });
  }
}

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { DoorLock } from "#clusters/door-lock";
import { ImplementationError } from "#general";
import { DoorLockBehavior } from "./DoorLockBehavior.js";
const LockState = DoorLock.LockState;
class DoorLockServer extends DoorLockBehavior {
  initialize() {
    if (!Object.values(this.state.supportedOperatingModes).some((v) => v)) {
      this.state.supportedOperatingModes = { vacation: true, privacy: true, passage: true, alwaysSet: 2047 };
    } else {
      if (this.state.supportedOperatingModes.alwaysSet !== 2047) {
        throw new ImplementationError(
          `DoorLockServer: The "alwaysSet" bit-range in supportedOperatingModes must be set. Please check the specification about the meaning of this field because bits are inverted here!`
        );
      }
    }
  }
  lockDoor() {
    this.state.lockState = LockState.Locked;
  }
  unlockDoor() {
    this.state.lockState = LockState.Unlocked;
  }
}
export {
  DoorLockServer
};
//# sourceMappingURL=DoorLockServer.js.map

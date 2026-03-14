/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { AudioOutput } from "#clusters/audio-output";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const AudioOutputClientConstructor = ClientBehavior(AudioOutput.Complete);
const AudioOutputClient = AudioOutputClientConstructor;
export {
  AudioOutputClient,
  AudioOutputClientConstructor
};
//# sourceMappingURL=AudioOutputClient.js.map

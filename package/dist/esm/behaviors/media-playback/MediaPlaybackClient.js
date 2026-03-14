/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MediaPlayback } from "#clusters/media-playback";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const MediaPlaybackClientConstructor = ClientBehavior(MediaPlayback.Complete);
const MediaPlaybackClient = MediaPlaybackClientConstructor;
export {
  MediaPlaybackClient,
  MediaPlaybackClientConstructor
};
//# sourceMappingURL=MediaPlaybackClient.js.map

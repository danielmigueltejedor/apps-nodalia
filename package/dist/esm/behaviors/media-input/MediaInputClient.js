/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { MediaInput } from "#clusters/media-input";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const MediaInputClientConstructor = ClientBehavior(MediaInput.Complete);
const MediaInputClient = MediaInputClientConstructor;
export {
  MediaInputClient,
  MediaInputClientConstructor
};
//# sourceMappingURL=MediaInputClient.js.map

/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Binding } from "#clusters/binding";
import { ClientBehavior } from "../../behavior/cluster/ClientBehavior.js";
const BindingClientConstructor = ClientBehavior(Binding.Complete);
const BindingClient = BindingClientConstructor;
export {
  BindingClient,
  BindingClientConstructor
};
//# sourceMappingURL=BindingClient.js.map

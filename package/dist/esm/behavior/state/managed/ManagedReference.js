/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ExpiredReferenceError, Val } from "#protocol";
function ManagedReference(parent, primaryKey, name, id, assertWriteOk, clone, session) {
  let expired = false;
  let location = {
    ...parent.location,
    path: parent.location.path.at(name)
  };
  const key = primaryKey === "id" ? id ?? name : name;
  const altKey = primaryKey === "id" ? key === name ? void 0 : name : id;
  let value;
  let dynamicContainer;
  if (parent.value[Val.properties]) {
    dynamicContainer = parent.value[Val.properties](parent.rootOwner, session);
    if (key in dynamicContainer) {
      value = dynamicContainer[key];
    } else if (altKey !== void 0 && altKey in dynamicContainer) {
      value = dynamicContainer[altKey];
    } else {
      dynamicContainer = void 0;
    }
  }
  if (dynamicContainer === void 0) {
    if (key in parent.value) {
      value = parent.value[key];
    } else if (altKey !== void 0) {
      value = parent.value[altKey];
    }
  }
  const reference = {
    primaryKey,
    parent,
    get rootOwner() {
      return parent.rootOwner;
    },
    get value() {
      return value;
    },
    get expired() {
      return expired;
    },
    get location() {
      return location;
    },
    set location(loc) {
      location = loc;
    },
    set value(newValue) {
      if (value === newValue) {
        return;
      }
      assertWriteOk(newValue);
      replaceValue(newValue);
      this.change(() => {
        if (dynamicContainer) {
          dynamicContainer[key] = newValue;
          if (altKey !== void 0 && altKey in dynamicContainer) {
            delete dynamicContainer[altKey];
          }
        } else {
          parent.value[key] = newValue;
          if (altKey !== void 0 && altKey in parent.value) {
            delete parent.value[altKey];
          }
        }
      });
    },
    get original() {
      if (!parent.original) {
        return void 0;
      }
      if (dynamicContainer !== void 0) {
        const origProperties = parent.original[Val.properties](parent.rootOwner, session);
        if (key in origProperties) {
          return origProperties[key];
        }
        if (altKey !== void 0) {
          return origProperties[altKey];
        }
      } else {
        if (key in parent.original) {
          return parent.original[key];
        }
        if (altKey !== void 0) {
          return parent.original[altKey];
        }
      }
    },
    change(mutator) {
      if (expired) {
        throw new ExpiredReferenceError(this.location);
      }
      parent.change(() => {
        if (clone && value === this.original) {
          const newValue = clone(value);
          if (dynamicContainer !== void 0) {
            dynamicContainer[key] = newValue;
            if (altKey !== void 0 && altKey in dynamicContainer) {
              delete dynamicContainer[altKey];
            }
          } else {
            parent.value[key] = newValue;
            if (altKey !== void 0 && altKey in parent.value) {
              delete parent.value[altKey];
            }
          }
          replaceValue(newValue);
        }
        mutator();
      });
    },
    refresh() {
      if (parent.expired) {
        expired = true;
        return;
      }
      if (parent.value === void 0 || parent.value === null) {
        expired = true;
        replaceValue(void 0);
        return;
      }
      let value2;
      if (dynamicContainer !== void 0) {
        if (key in dynamicContainer) {
          value2 = dynamicContainer[key];
        } else if (altKey !== void 0 && altKey in dynamicContainer) {
          value2 = dynamicContainer[altKey];
        }
      } else {
        if (key in parent.value) {
          value2 = parent.value[key];
        } else if (altKey !== void 0 && altKey in parent.value) {
          value2 = parent.value[altKey];
        }
      }
      replaceValue(value2);
    }
  };
  if (!parent.subrefs) {
    parent.subrefs = {};
  }
  parent.subrefs[key] = reference;
  return reference;
  function replaceValue(newValue) {
    value = newValue;
    const subrefs = reference.subrefs;
    if (subrefs) {
      for (const key2 in subrefs) {
        subrefs[key2].refresh();
      }
    }
  }
}
export {
  ManagedReference
};
//# sourceMappingURL=ManagedReference.js.map

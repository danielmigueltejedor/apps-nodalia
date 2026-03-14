/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { camelize } from "#general";
import { DataModelPath, Metatype, UnsupportedCastError } from "#model";
import { SchemaImplementationError } from "#protocol";
function ValueCaster(schema, owner) {
  const metatype = schema.effectiveMetatype ?? Metatype.any;
  let cast;
  switch (metatype) {
    case Metatype.object:
      cast = StructCaster(schema, owner);
      break;
    case Metatype.array:
      cast = ListCaster(schema, owner);
      break;
    default:
      cast = Metatype.cast[metatype];
      break;
  }
  if (schema.quality.nullable) {
    return (value) => {
      if (value === null) {
        return value;
      }
      return cast(value);
    };
  }
  return cast;
}
function StructCaster(schema, owner) {
  const memberConfigs = {};
  for (const member of owner.membersOf(schema)) {
    const config = { name: camelize(member.name), cast: owner.get(member).cast };
    memberConfigs[config.name] = config;
    const lowerName = member.name.toLowerCase();
    if (!memberConfigs[lowerName]) {
      memberConfigs[lowerName] = config;
    }
  }
  const castToObject = Metatype.cast.object;
  return (value) => {
    const input = castToObject(value);
    const output = {};
    for (const key in input) {
      let config = memberConfigs[key];
      if (config === void 0) {
        config = memberConfigs[key.toLowerCase()];
      }
      if (config === void 0) {
        throw new UnsupportedCastError(`Property "${key}" is unsupported`);
      }
      output[config.name] = config.cast(input[key]);
    }
    return output;
  };
}
function ListCaster(schema, owner) {
  const entry = schema.listEntry;
  if (entry === void 0) {
    throw new SchemaImplementationError(DataModelPath(schema.path), "List schema has no entry definition");
  }
  const castToArray = Metatype.cast.array;
  const castEntry = owner.get(entry).cast;
  return (value) => castToArray(value)?.map(castEntry);
}
export {
  ValueCaster
};
//# sourceMappingURL=ValueCaster.js.map

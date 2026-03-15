import type { JSONSchema7 } from "json-schema";
import { HomeAssistantMatcherType } from "../home-assistant-filter.js";

const homeAssistantMatcherSchema: JSONSchema7 = {
  type: "object",
  default: { type: "", value: "" },
  properties: {
    type: {
      title: "Tipo",
      type: "string",
      enum: Object.values(HomeAssistantMatcherType),
    },
    value: {
      title: "Valor",
      type: "string",
      minLength: 1,
    },
  },
  required: ["type", "value"],
  additionalProperties: false,
};

const homeAssistantFilterSchema: JSONSchema7 = {
  title: "Incluir o excluir entidades",
  type: "object",
  properties: {
    include: {
      title: "Incluir",
      type: "array",
      items: homeAssistantMatcherSchema,
    },
    exclude: {
      title: "Excluir",
      type: "array",
      items: homeAssistantMatcherSchema,
    },
  },
  required: ["include", "exclude"],
  additionalProperties: false,
};

const featureFlagSchema: JSONSchema7 = {
  title: "Funciones avanzadas",
  type: "object",
  properties: {
    coverDoNotInvertPercentage: {
      title: "No invertir porcentajes en persianas",
      description:
        "Mantiene el mismo porcentaje que Home Assistant para persianas/cortinas (no estándar Matter).",
      type: "boolean",
      default: false,
    },

    includeHiddenEntities: {
      title: "Incluir entidades ocultas",
      description:
        "Incluye entidades marcadas como ocultas en Home Assistant.",
      type: "boolean",
      default: false,
    },
  },
  additionalProperties: false,
};

const deviceIdentitySchema: JSONSchema7 = {
  title: "Identidad del dispositivo bridged",
  description:
    "Opcional: sobrescribe metadatos visibles en ecosistemas Matter (fabricante/modelo/serie/firmware) cuando Home Assistant no aporta valores correctos.",
  type: "object",
  properties: {
    vendorName: {
      title: "Fabricante",
      type: "string",
      minLength: 1,
      maxLength: 32,
    },
    productName: {
      title: "Modelo",
      type: "string",
      minLength: 1,
      maxLength: 32,
    },
    productLabel: {
      title: "Etiqueta de producto",
      type: "string",
      minLength: 1,
      maxLength: 64,
    },
    serialNumber: {
      title: "Número de serie",
      type: "string",
      minLength: 1,
      maxLength: 32,
    },
    softwareVersionString: {
      title: "Firmware (texto)",
      description:
        "Opcional. Déjalo vacío para usar automáticamente la versión detectada en Home Assistant (ej: 02.07.14).",
      type: "string",
      minLength: 1,
      maxLength: 64,
    },
  },
  additionalProperties: false,
};

export const bridgeConfigSchema: JSONSchema7 = {
  type: "object",
  title: "Configuración del puente",
  properties: {
    name: {
      title: "Nombre",
      type: "string",
      minLength: 1,
      maxLength: 32,
    },
    port: {
      title: "Puerto",
      type: "number",
      minimum: 1,
    },
    countryCode: {
      title: "Código de país",
      type: "string",
      description:
        "Código ISO 3166-1 alfa-2 del país donde se encuentra el nodo. Solo es necesario si el comisionado falla por falta de código de país.",
      minLength: 2,
      maxLength: 3,
    },
    filter: homeAssistantFilterSchema,
    featureFlags: featureFlagSchema,
    deviceIdentity: deviceIdentitySchema,
  },
  required: ["name", "port", "filter"],
  additionalProperties: false,
};

import {
  type BridgeConfig,
  bridgeConfigSchema,
} from "@home-assistant-matter-hub/common";
import { DataObject, Tune } from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { UiSchema } from "@rjsf/utils";
import { type MouseEvent, useCallback, useState } from "react";
import { navigation } from "../../routes.tsx";
import { FormEditor } from "../misc/editors/FormEditor";
import { JsonEditor } from "../misc/editors/JsonEditor";
import type { ValidationError } from "../misc/editors/validation-error.ts";

enum BridgeEditorMode {
  JSON_EDITOR = "JSON_EDITOR",
  FIELDS_EDITOR = "FIELDS_EDITOR",
}

const bridgeConfigUiSchema: UiSchema = {
  name: {
    "ui:placeholder": "Ej. Puente Principal",
  },
  port: {
    "ui:help": "Puerto TCP para el puente Matter (por defecto 5540).",
  },
  countryCode: {
    "ui:placeholder": "ES",
  },
  filter: {
    include: {
      "ui:options": {
        orderable: false,
      },
    },
    exclude: {
      "ui:options": {
        orderable: false,
      },
    },
  },
  deviceIdentity: {
    vendorName: {
      "ui:placeholder": "Ej. Roborock",
    },
    productName: {
      "ui:placeholder": "Ej. Qrevo S",
    },
    productLabel: {
      "ui:placeholder": "Ej. Aspirador principal",
    },
    serialNumber: {
      "ui:placeholder": "Ej. R77MBD44501217",
    },
    softwareVersionString: {
      "ui:placeholder": "Ej. 02.07.14",
    },
  },
  "ui:submitButtonOptions": {
    norender: true,
  },
};

export interface BridgeConfigEditorProps {
  bridgeId?: string;
  bridge: BridgeConfig;
  usedPorts: Record<number, string>;
  onSave: (config: BridgeConfig) => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

export const BridgeConfigEditor = (props: BridgeConfigEditorProps) => {
  const [editorMode, setEditorMode] = useState<BridgeEditorMode>(
    BridgeEditorMode.FIELDS_EDITOR,
  );
  const handleEditorModeChange = (
    _: MouseEvent<HTMLElement>,
    nextMode: BridgeEditorMode | null,
  ) => {
    if (nextMode != null) {
      setEditorMode(nextMode);
    }
  };

  const [config, setConfig] = useState<object | undefined>(props.bridge);
  const [isValid, setIsValid] = useState<boolean>(true);

  const validatePort = useCallback(
    (value: object | undefined): ValidationError[] => {
      const config = value as Partial<BridgeConfig> | undefined;
      if (!config?.port) {
        return [];
      }
      const usedBy = props.usedPorts[config.port];
      if (usedBy !== undefined && usedBy !== props.bridgeId) {
        return [
          {
            instancePath: "/port",
            message: `El puerto ya está en uso por el puente con id ${usedBy}`,
          },
        ];
      }
      return [];
    },
    [props.bridgeId, props.usedPorts],
  );

  const onChange = (data: object | undefined, isValid: boolean) => {
    setConfig(data);
    setIsValid(isValid);
  };

  const saveAction = async () => {
    if (!isValid) {
      return;
    }
    await props.onSave(config as BridgeConfig);
  };

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)"
            : "linear-gradient(180deg, rgba(8,114,138,0.06) 0%, rgba(8,114,138,0.015) 100%)",
      })}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h6">Opciones de configuración</Typography>
            <Typography variant="body2" color="text.secondary">
              Define cómo se expone este puente en Matter y qué entidades incluye.
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={editorMode}
            exclusive
            size="small"
            color="primary"
            onChange={handleEditorModeChange}
          >
            <ToggleButton value={BridgeEditorMode.FIELDS_EDITOR}>
              <Tune fontSize="small" sx={{ mr: 0.75 }} />
              Formulario
            </ToggleButton>
            <ToggleButton value={BridgeEditorMode.JSON_EDITOR}>
              <DataObject fontSize="small" sx={{ mr: 0.75 }} />
              JSON
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Alert severity="info" variant="outlined">
          Consulta{" "}
          <Link href={navigation.faq.bridgeConfig} target="_blank">
            la documentación
          </Link>{" "}
          para una configuración óptima del puente.{" "}
          <strong>
            Si usas etiquetas, revisa especialmente la sección &quot;Etiquetas&quot;.
          </strong>
        </Alert>

        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {editorMode === BridgeEditorMode.FIELDS_EDITOR && (
            <FormEditor
              value={config ?? {}}
              onChange={onChange}
              schema={bridgeConfigSchema}
              uiSchema={bridgeConfigUiSchema}
              customValidate={validatePort}
            />
          )}

          {editorMode === BridgeEditorMode.JSON_EDITOR && (
            <JsonEditor
              value={config ?? {}}
              onChange={onChange}
              schema={bridgeConfigSchema}
              customValidate={validatePort}
            />
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button fullWidth variant="outlined" color="inherit" onClick={props.onCancel}>
              Cancelar
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              fullWidth
              variant="contained"
              disabled={!isValid}
              onClick={saveAction}
            >
              Guardar cambios
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

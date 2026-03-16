import {
  ClusterId,
  type EndpointData,
} from "@home-assistant-matter-hub/common";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

export interface EndpointStateProps {
  endpoint: EndpointData;
}

const ignoredBehaviors = [ClusterId.homeAssistantEntity];

export const EndpointState = (props: EndpointStateProps) => {
  const allBehaviors = useMemo(
    () =>
      Object.keys(
        props.endpoint.state,
      ) as (keyof typeof props.endpoint.state)[],
    [props.endpoint],
  );
  const behaviors = useMemo(
    () => allBehaviors.filter((it) => !ignoredBehaviors.includes(it)).sort(),
    [allBehaviors],
  );
  const metadata = useMemo(
    () => ({
      "ID del endpoint": props.endpoint.id.local,
      "Tipo de endpoint": `${props.endpoint.type.name} (${props.endpoint.type.id})`,
      "Número de endpoint": props.endpoint.endpoint,
      "# de endpoints hijo": props.endpoint.parts.length,
    }),
    [props.endpoint],
  );
  const vacuumDiagnostics = useMemo(
    () => getVacuumDiagnostics(props.endpoint),
    [props.endpoint],
  );

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Stack spacing={2}>
          <Typography component="span">Información del endpoint</Typography>
          <ObjectTable value={metadata} hideHead></ObjectTable>
        </Stack>
      </Paper>

      {vacuumDiagnostics != null && (
        <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
          <Stack spacing={2}>
            <Typography component="span">
              Diagnóstico de aspiradora (beta)
            </Typography>
            <ObjectTable value={vacuumDiagnostics} hideHead />
          </Stack>
        </Paper>
      )}

      {behaviors.map((behavior) => (
        <Accordion key={behavior}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
          >
            <Typography component="span">
              Comportamiento: <strong>{behavior}</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ObjectTable value={props.endpoint.state[behavior]} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

function getVacuumDiagnostics(
  endpoint: EndpointData,
): Record<string, unknown> | undefined {
  const endpointState = asRecord(endpoint.state);
  const serviceArea = asRecord(endpointState[ClusterId.serviceArea]);
  const rvcOperationalState = asRecord(
    endpointState[ClusterId.rvcOperationalState],
  );
  const rvcRunMode = asRecord(endpointState[ClusterId.rvcRunMode]);

  const isVacuumEndpoint =
    endpoint.type.name.toLowerCase().includes("vacuum") ||
    Object.keys(serviceArea).length > 0 ||
    Object.keys(rvcOperationalState).length > 0;
  if (!isVacuumEndpoint) {
    return undefined;
  }

  const homeAssistantEntity = asRecord(endpointState[ClusterId.homeAssistantEntity]);
  const entity = asRecord(homeAssistantEntity.entity);
  const entityState = asRecord(entity.state);
  const attributes = asRecord(entityState.attributes);

  const currentAreaHa = firstDefined(
    attributes.current_area,
    attributes.current_segment,
    attributes.current_room,
    attributes.currentArea,
    attributes.currentSegment,
    attributes.currentRoom,
  );
  const selectedAreasHa = firstDefined(
    attributes.selected_areas,
    attributes.selected_segments,
    attributes.current_rooms,
    attributes.current_segments,
    attributes.cleaning_area_id,
  );
  const detailedStatusHa = firstDefined(
    attributes.status,
    attributes.task_status,
    attributes.cleaning_state,
    attributes.dock_state,
    attributes.working_state,
    attributes.status_text,
    attributes.state_text,
  );

  return {
    "Entidad HA": entity.entity_id ?? "-",
    "Estado HA": entityState.state ?? "-",
    "Estado detallado HA": detailedStatusHa ?? "-",
    "Área actual HA": currentAreaHa ?? "-",
    "Áreas seleccionadas HA": selectedAreasHa ?? "-",
    "Acción ServiceArea HA": attributes.matter_service_area_action ?? "-",
    "Comando ServiceArea HA":
      attributes.matter_service_area_command ??
      attributes.room_clean_command ??
      attributes.segment_clean_command ??
      "-",
    "ParamsKey ServiceArea HA": attributes.matter_service_area_params_key ?? "-",
    "currentArea Matter": serviceArea.currentArea ?? null,
    "selectedAreas Matter": serviceArea.selectedAreas ?? [],
    "progress Matter": serviceArea.progress ?? [],
    "Estado operacional Matter":
      rvcOperationalState.operationalState ??
      rvcOperationalState.currentOperationalState ??
      "-",
    "Modo ejecución Matter":
      rvcRunMode.currentMode ?? rvcRunMode.currentModeLabel ?? "-",
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value == null || typeof value !== "object") {
    return {};
  }
  return value as Record<string, unknown>;
}

function firstDefined(...values: unknown[]): unknown {
  for (const value of values) {
    if (value != null) {
      return value;
    }
  }
  return undefined;
}

const ObjectTable = <T extends object>(props: {
  value: T;
  hideHead?: boolean;
}) => {
  const properties = useMemo(
    () => Object.keys(props.value) as (keyof T & string)[],
    [props.value],
  );
  return (
    <TableContainer>
      <Table size="small">
        {!props.hideHead && (
          <TableHead>
            <TableRow>
              <TableCell>Propiedad</TableCell>
              <TableCell>Valor</TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property}>
              <TableCell>{property}</TableCell>
              <TableCell>
                <RenderProperty property={props.value[property]} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RenderProperty = (props: { property: unknown }) => {
  const value = useMemo(() => {
    if (typeof props.property === "string") {
      return props.property.toString();
    } else if (typeof props.property === "number") {
      return props.property.toString();
    } else if (typeof props.property === "boolean") {
      return String(props.property);
    } else {
      return JSON.stringify(props.property);
    }
  }, [props.property]);
  return (
    <Typography fontFamily="monospace" fontSize="0.9em">
      {value}
    </Typography>
  );
};

import type { BridgeConfig } from "@home-assistant-matter-hub/common";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Breadcrumbs } from "../../components/breadcrumbs/Breadcrumbs.tsx";
import { BridgeConfigEditor } from "../../components/bridge/BridgeConfigEditor.tsx";
import { useNotifications } from "../../components/notifications/use-notifications.ts";
import {
  useBridge,
  useUpdateBridge,
  useUsedPorts,
} from "../../hooks/data/bridges.ts";
import { navigation } from "../../routes.tsx";

export const EditBridgePage = () => {
  const notifications = useNotifications();
  const navigate = useNavigate();

  const { bridgeId } = useParams() as { bridgeId: string };
  const { content: bridge, isLoading } = useBridge(bridgeId);
  const usedPorts = useUsedPorts();
  const updateBridge = useUpdateBridge();

  const bridgeConfig = useMemo<BridgeConfig | undefined>(() => {
    if (isLoading || !bridge) {
      return undefined;
    }
    return {
      name: bridge.name,
      port: bridge.port,
      countryCode: bridge.countryCode,
      filter: bridge.filter,
      featureFlags: bridge.featureFlags,
      deviceIdentity: bridge.deviceIdentity,
    };
  }, [isLoading, bridge]);

  const cancelAction = () => {
    navigate(-1);
  };

  const saveAction = async (config: BridgeConfig) => {
    await updateBridge({ ...config, id: bridgeId })
      .then(() =>
        notifications.show({
          message: "Cambios guardados correctamente",
          severity: "success",
        }),
      )
      .then(() => cancelAction())
      .catch((err: Error) =>
        notifications.show({ message: err.message, severity: "error" }),
      );
  };

  if (isLoading || !usedPorts) {
    return "Cargando...";
  }
  if (!bridge || !bridgeConfig) {
    return "No encontrado";
  }

  return (
    <Stack spacing={4}>
      <Breadcrumbs
        items={[
          { name: "Puentes", to: navigation.bridges },
          { name: bridge.name, to: navigation.bridge(bridgeId) },
          { name: "Editar", to: navigation.editBridge(bridgeId) },
        ]}
      />

      <BridgeConfigEditor
        bridgeId={bridgeId}
        bridge={bridgeConfig}
        usedPorts={usedPorts}
        onSave={saveAction}
        onCancel={cancelAction}
      />
    </Stack>
  );
};

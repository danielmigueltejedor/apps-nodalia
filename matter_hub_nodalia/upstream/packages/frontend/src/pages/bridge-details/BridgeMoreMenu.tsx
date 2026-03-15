import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";
import ResetIcon from "@mui/icons-material/RotateLeft";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import { useNotifications } from "../../components/notifications/use-notifications.ts";
import { useDeleteBridge, useResetBridge } from "../../hooks/data/bridges.ts";
import { navigation } from "../../routes.tsx";

export interface BridgeMoreMenuProps {
  bridge: string;
}

export const BridgeMoreMenu = ({ bridge }: BridgeMoreMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const notification = useNotifications();

  const factoryReset = useResetBridge();
  const deleteBridge = useDeleteBridge();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleFactoryReset = async () => {
    handleClose();
    await factoryReset(bridge)
      .then(() =>
        notification.show({
          message: "Puente restablecido correctamente",
          severity: "success",
        }),
      )
      .catch((reason) =>
        notification.show({
          message: `No se pudo restablecer el puente: ${reason.toString()}`,
          severity: "error",
        }),
      );
  };
  const handleDelete = async () => {
    handleClose();
    await deleteBridge(bridge)
      .then(() =>
        notification.show({
          message: "Puente eliminado correctamente",
          severity: "success",
        }),
      )
      .then(() => navigate(navigation.bridges))
      .catch((reason) =>
        notification.show({
          message: `No se pudo eliminar el puente: ${reason.toString()}`,
          severity: "error",
        }),
      );
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVert />
      </IconButton>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        <MenuItem component={RouterLink} to={navigation.editBridge(bridge)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleFactoryReset}>
          <ListItemIcon>
            <ResetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Restablecer de fábrica</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

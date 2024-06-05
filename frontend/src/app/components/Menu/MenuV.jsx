import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Menu from "@mui/material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import PeopleIcon from "@mui/icons-material/People";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuItem from "@mui/material/MenuItem";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Tooltip from '@mui/material/Tooltip';
import { ConnectedCreateProvider } from "../Proveedores/CreateProvider";
import { history } from "../../store/history";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
/* import { LoadFileV } from "../UploadFile/LoadFileV"; */
import { connect } from "react-redux";
import { ConnectedCreateUser } from "../Usuarios/createUser";
import { ConnectedChangePassword } from "../Usuarios/changePassword";
import { ListUser } from "../Usuarios/listUser";
import { ListProvider } from "../Proveedores/ListProvider";
import { useLocation } from "react-router-dom";

/* S2 */
import { CreateEditForm } from "../CapturarEditarS2/CreateEditForm";

/* S2 Schemas */
import schemaFaltasAdministrativasGraves from "../CapturarEditarS2/jsonschemas-rjsf/servidores-publicos-intervienen-contrataciones";

/* S2 UI */
import uiFaltasAdministrativasGraves from "../CapturarEditarS2/uiSchemas/servidores-publicos-intervienen-contrataciones";

/* S2 - Consultar */
import { ListForm1 } from "../ConsultarS2/servidores-publicos-intervienen-contrataciones";

//import { useLocation } from "react-router-dom";
import { userActions } from "../../_actions/user.action";

import { Inicio } from "../Inicio";

import { useSelector } from "react-redux";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import logoS2 from "../../../assets/img/ico_s2_light.svg";

const MenuV = ({ vistaRender, match, closeSession }) => {
  const { vigencia, permisos } = useSelector((state) => ({
    vigencia: state.vigencia,
    permisos: state.permisos,
  }));

  //MSubmenus
  const [checkedUser, setCheckedUser] = useState(false);
  const [checkedProveedor, setCheckedProveedor] = useState(false);

  const rol = localStorage.getItem("rol");

  const redirectToRoute = (path) => {
    const cambiarcontrasena = localStorage.getItem("cambiarcontrasena");
    if (vigencia === true || cambiarcontrasena === true) {
      history.push("/usuario/cambiarcontrasena");
    } else {
      history.push(path);
    }
  };

  //Cerrar sesión
  const [anchorEl, setAnchorEl] = useState(null);

  //Mostrar opciones de cerrar sesión
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Cerrar opciones de cerrar sesión
  const handleClose = () => {
    setAnchorEl(null);
  };

  const cerrarSesion = () => {
    closeSession();
  };
  const drawerWidth = 260;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      background: "primary",
    },
  }));

  const classes = useStyles();

  const location = useLocation(); // Usamos useLocation para obtener la ruta actual

  // Función para determinar si un elemento está activo
  const isItemActive = (route) => {
    return location.pathname.includes(route);
    //return location.pathname === route;
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button disabled>
            <img src={logoS2} alt="logo-s3" height={35} />
          </Button>

          <Typography component="div" variant="h6" color="#fff" noWrap>
          Herramienta de captura de información del Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas
          </Typography>

          <div>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}>
              <ManageAccountsIcon style={{ color: "#fff" }} fontSize="large" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem
                onClick={() => redirectToRoute("/usuario/cambiarcontrasena")}>
                Cambiar contraseña
              </MenuItem>
              <MenuItem onClick={() => cerrarSesion()}>Cerrar sesión</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={"permanent"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          {rol == 2 && (
            <>
              {/* Servidores públicos que intervengan en procedimientos de contrataciones públicas */}
              {(permisos.includes("servidores-publicos-intervienen-contrataciones"))&& (
                <>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={isItemActive(
                          "/s2/servidores-publicos-intervienen-contrataciones",
                        )}
                        onClick={() =>
                          redirectToRoute(
                            "/consultar/s2/servidores-publicos-intervienen-contrataciones",
                          )
                        }>
                        <ChevronRightIcon/>
                        <ListItemText primary="Servidores Públicos que Intervienen en Contrataciones" />
                      </ListItemButton>
                    </ListItem>
                  <Divider/>
                </>
              )}
            </>
          )}

          {/* ADMINiSTRACIÓN */}
          {rol == 1 && (
            <>
              <ListItem
                onClick={() => setCheckedUser((prev) => !prev)}
                key={"mu"}
                disablePadding>
                <ListItemButton sx={{ p: 2 }}>
                  <ListItemIcon>
                    <PeopleIcon style={{ color: "primary" }} />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                  {checkedUser ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={!checkedUser}>
                <ListItem
                  onClick={() => redirectToRoute("/usuario/crear")}
                  key={"mu1"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <ControlPointIcon />
                    </ListItemIcon>
                    <ListItemText primary="Crear" />
                  </ListItemButton>
                </ListItem>
                <ListItem
                  onClick={() => redirectToRoute("/usuarios")}
                  key={"mu2"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Listar" />
                  </ListItemButton>
                </ListItem>
              </Collapse>
              <ListItem
                onClick={() => setCheckedProveedor((prev) => !prev)}
                key={"mp"}
                disablePadding>
                <ListItemButton sx={{ p: 2 }}>
                  <ListItemIcon>
                    <AssignmentIcon style={{ color: "primary" }} />
                  </ListItemIcon>
                  <ListItemText primary="Proveedores" />
                  {checkedProveedor ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={!checkedProveedor}>
                <ListItem
                  onClick={() => redirectToRoute("/proveedor/crear")}
                  key={"mp1"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <ControlPointIcon />
                    </ListItemIcon>
                    <ListItemText primary="Crear" />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  onClick={() => redirectToRoute("/proveedores")}
                  key={"mp2"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Listar" />
                  </ListItemButton>
                </ListItem>
              </Collapse>
            </>
          )}
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#EEF2F6",
          minHeight: "100vh",
          padding: "15px",
        }}>
        <Toolbar />
        <Grid
          container
          spacing={0}
          direction="row"
          justifyContent="center"
          alignItems="center">
          {/* {vistaRender === "cargamasiva" && <LoadFileV />} */}
          {vistaRender === "createuser" && <ConnectedCreateUser />}
          {vistaRender === "edituser" && <ConnectedCreateUser match={match} />}
          {vistaRender === "users" && <ListUser />}
          {vistaRender === "cambiarcontrasena" && <ConnectedChangePassword />}
          {vistaRender === "createprovider" && <ConnectedCreateProvider />}
          {vistaRender === "editprovider" && (
            <ConnectedCreateProvider match={match} />
          )}
          {vistaRender === "providers" && <ListProvider />}
          {vistaRender === "inicio" && <Inicio />}

          {/* ----------- S2v2 - INICIO ----------- */}

          {/* Faltas Administrativas de Servidores Públicos */}
          {vistaRender === "capturar.servidores-publicos-intervienen-contrataciones" && (
            <CreateEditForm
              tipoForm={vistaRender}
              schema={schemaFaltasAdministrativasGraves}
              uiSchema={uiFaltasAdministrativasGraves}
            />
          )}
          {vistaRender === "consultar.servidores-publicos-intervienen-contrataciones" && (
            <ListForm1 />
          )}
          {vistaRender === "editar.servidores-publicos-intervienen-contrataciones" && (
            <CreateEditForm
              match={match}
              tipoForm={vistaRender}
              schema={schemaFaltasAdministrativasGraves}
              uiSchema={uiFaltasAdministrativasGraves}
            />
          )}
          {/* ----------- S2V2 - FIN ----------- */}
        </Grid>
      </Box>
    </div>
  );
};

function mapStateToProps(_, ownProps) {
  let vistaRender = ownProps.propiedades.renderView;
  let match = ownProps.match;
  return { vistaRender, match };
}

const mapDispatchToProps = (dispatch) => ({
  closeSession() {
    dispatch(userActions.removeSessionLogIn());
  },
});

export const ConnectedMenuV = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuV);

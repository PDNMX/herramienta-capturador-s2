import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  CardActions,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert } from "@mui/material";
import { alertActions } from "../../_actions/alert.actions";
import { history } from "../../store/history";
import { S2Actions } from "../../_actions/s2.action";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import CloseIcon from "@mui/icons-material/Close";
import TablePaginationActions from "../Common/TablePaginationActionsProps";

import ReactJson from "react-json-view";

const tipoFormulario = "consultar.servidores-publicos-intervienen-contrataciones";

export const ListForm1 = () => {
  const { S2List, alerta, paginationSuper } = useSelector((state) => ({
    S2List: state.S2,
    alerta: state.alert,
    paginationSuper: state.pagination,
  }));
  const dispatch = useDispatch();
  const [query, setQuery] = React.useState({});
  const [openModalInfo, setOpenModalInfo] = React.useState(false);
  const [selectedRegistro, setSelectedRegistro] = React.useState({});

  const handleOpenModalInfo = (user) => {
    //setSelectedRegistro(user);
    setSelectedRegistro(() => {
      setOpenModalInfo(true);
      return user;
    });
  };

  const handleCloseModal = () => {
    setOpenModalInfo(false);
  };

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  const handleChangePage = (_, newPage) => {
    dispatch(
      S2Actions.requestListS2(
        {
          query: query,
          page: newPage + 1,
          pageSize: paginationSuper.pageSize,
        },
        tipoFormulario,
      ),
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if (paginationSuper.page * newSize > paginationSuper.totalRows) {
      dispatch(
        S2Actions.requestListS2(
          {
            query: query,
            page: 1,
            pageSize: parseInt(event.target.value, 10),
          },
          tipoFormulario,
        ),
      );
    } else {
      dispatch(
        S2Actions.requestListS2(
          {
            query: query,
            page: 1,
            pageSize: parseInt(event.target.value, 10),
          },
          tipoFormulario,
        ),
      );
    }
  };

  const redirectToRoute = (path) => {
    history.push(path);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alerta.status}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
          {alerta.message}
        </Alert>
      </Snackbar>

      {/* Modal para ver registro */}
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={openModalInfo}>
        <DialogTitle>
          <b>Detalle del registro</b>
        </DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseModal}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 20,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <Grid container>
            <Grid item xs={12}>
              <ReactJson
                style={{ padding: "0.8rem" }}
                name={false}
                src={selectedRegistro}
                theme="harmonic"
                iconStyle="triangle"
                enableEdit={false}
                enableAdd={false}
                enableDelete={false}
                enableClipboard={false}
                displayDataTypes={false}
                displayObjectSize={false}
                indentWidth={6}
                collapsed={false}
                collapseStringsAfterLength={false}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ m: 1 }}
              variant="contained"
            color="primary"
            onClick={() =>
              redirectToRoute(
                `/editar/s2/servidores-publicos-intervienen-contrataciones/${selectedRegistro._id}`,
              )
            }>
            Editar
          </Button>
          <Button
            onClick={handleCloseModal}
            sx={{ m: 1 }}
              variant="contained"
            color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              "Servidores públicos que intervengan en procedimientos de contrataciones públicas"
            }
            subheader="Información Registrada"
          />
          <Divider />
          <CardContent sx={{ m: 1 }}>
            {S2List.length === 0 ? ( // Check if S2List is empty
              <>
                <Typography variant="h4" align="center">
                  No hay registros aún. Captura un registro para comenzar.
                </Typography>
              </>
            ) : (
              <TableContainer component={Paper}>
                <Table aria-label="custom pagination table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <b>Identificador</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>Servidor público</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>Institución</b>
                      </TableCell>
                      <TableCell align="center">
                        <b>Acciones</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {S2List.map((registro) => (
                      <TableRow key={registro._id}>
                        <TableCell style={{ width: "15%" }} align="left">
                          {registro._id}
                        </TableCell>
                        <TableCell style={{ width: "25%" }} align="left">
                          {registro.grave.nombres &&
                            registro.grave.nombres + " "}
                          {registro.grave.primerApellido &&
                            registro.grave.primerApellido + " "}
                          {registro.grave.segundoApellido &&
                          registro.grave.segundoApellido.sinSegundoApellido ==
                            true
                            ? ""
                            : registro.grave.segundoApellido.valor}
                        </TableCell>
                        {registro.grave.entePublico && (
                          <TableCell style={{ width: "25%" }} align="left">
                            {registro.grave.entePublico.siglas &&
                              registro.grave.entePublico.siglas}
                          </TableCell>
                        )}
                        <TableCell style={{ width: "15%" }} align="center">
                          <Tooltip title="Más información" placement="top">
                            <IconButton
                              onClick={() => handleOpenModalInfo(registro)}
                              style={{ color: "#34b3eb" }}
                              aria-label="expand row"
                              size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar registro" placement="top">
                            <IconButton
                              onClick={() =>
                                redirectToRoute(
                                  `/editar/s2/servidores-publicos-intervienen-contrataciones/${registro._id}`,
                                )
                              }
                              style={{ color: "#ffe01b" }}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                  <TableFooter>
                    <TableRow>
                      {paginationSuper.pageSize != undefined &&
                        paginationSuper.page != undefined && (
                          <TablePagination
                            rowsPerPageOptions={[
                              3,
                              5,
                              10,
                              25,
                              {
                                label: "Todos",
                                value: paginationSuper.totalRows,
                              },
                            ]}
                            colSpan={6}
                            count={paginationSuper.totalRows}
                            rowsPerPage={paginationSuper.pageSize}
                            page={paginationSuper.page - 1}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                          />
                        )}
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            )}
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              sx={{ m: 1 }}
              variant="contained"
              color="primary"
              onClick={() =>
                redirectToRoute("/capturar/s2/servidores-publicos-intervienen-contrataciones")
              }>
              Capturar Información
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};
import { storeValidate } from "../store";
import { Provider } from "react-redux";
import { Router, Route, Redirect } from "react-router-dom";
import { history } from "../store/history";
import { userActions } from "../_actions/user.action";
import { catalogActions } from "../_actions/catalog.action";
import { alertActions } from "../_actions/alert.actions";
import { ConnectedMenuV } from "./Menu/MenuV";
import { providerActions } from "../_actions/provider.action";
import { LoginV } from "./Login/Login";
import { S2Actions } from "../_actions/s2.action";

import { ResetPasswordV } from "./Login/ResetPassword";

const labelSesionExpirada =
  "La sesión ha expirado, favor de iniciar sesión de nuevo";
const labelNoSeHaIniciado = "No se ha iniciado sesión";

const PrivateRoute = ({ renderView, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (localStorage.token) {
        if (
          JSON.parse(window.atob(localStorage.token.split(".")[1])) <
          (new Date().getTime() + 1) / 1000
        ) {
          storeValidate.dispatch(alertActions.error(labelSesionExpirada));
          localStorage.clear();
          return <Redirect to="/ingresar" />;
        } else {
          if (
            localStorage.token &&
            localStorage.rol == "2" /* && localStorage.S2=="true" */
          ) {
            storeValidate.dispatch(userActions.requestPermisosSistema());

            // valida si es del tipo consulta, y hace el request para listar
            const tipoView = renderView.split(".");
            if (tipoView[0] === "consultar") {
              //console.log(tipoView[0]);
              storeValidate.dispatch(S2Actions.requestListS2({}, renderView));
              storeValidate.dispatch(S2Actions.setclearS2());
            }

            storeValidate.dispatch(alertActions.clear());
            return (
              <ConnectedMenuV
                {...props}
                propiedades={{
                  renderView,
                  match: tipoView[0] === "editar" ? props.match : undefined,
                }}
              />
            );
          } else {
            return <Redirect to="/ingresar" />;
          }
        }
      } else {
        storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
        return <Redirect to="/ingresar" />;
      }
    }}
  />
);

export const App = () => (
  <Router history={history}>
    <Provider store={storeValidate}>
      <Route
        exact
        path="/"
        render={() => {
          return <Redirect to="/ingresar" />;
        }}
      />
      <Route exact path="/ingresar" render={() => <LoginV />} />
      <Route
        exact
        path="/restaurar-contraseña"
        render={() => <ResetPasswordV />}
      />
      {/* ----------- NUEVAS VERSIONES - INICIO ----------- */}
      {/* ----------- NUEVAS VERSIONES - s3: 11 Formatos ----------- */}
      <PrivateRoute
        exact
        path="/inicio"
        renderView="inicio"
      />
      {/* ----------- RUTAS DE CAPTURA - INICIO ----------- */}
      <PrivateRoute
        exact
        path="/capturar/s2/servidores-publicos-intervienen-contrataciones"
        renderView="capturar.servidores-publicos-intervienen-contrataciones"
      />
      {/* ----------- RUTAS DE CAPTURA - FIN ----------- */}

      {/* ----------- RUTAS DE CONSULTA - INICIO ----------- */}
      <PrivateRoute
        exact
        path="/consultar/s2/servidores-publicos-intervienen-contrataciones"
        renderView="consultar.servidores-publicos-intervienen-contrataciones"
      />
      
      <PrivateRoute
        exact
        path="/editar/s2/servidores-publicos-intervienen-contrataciones/:id"
        renderView="editar.servidores-publicos-intervienen-contrataciones"
      />

      {/* ----------- NUEVAS VERSIONES - FIN ----------- */}

      {/* Administración de usuarios */}
      <Route
        exact
        path="/usuario/crear"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  providerActions.requestAllProvidersEnabled(),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV propiedades={{ renderView: "createuser" }} />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
      <Route
        exact
        path="/usuario/editar/:id"
        render={({ match }) => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  userActions.fillUserUpdate(match.params.id),
                );
                storeValidate.dispatch(
                  providerActions.requestAllProvidersEnabled(),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "edituser" }}
                    match={match}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
      <Route
        exact
        path="/usuarios"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              storeValidate.dispatch(
                userActions.requesUserInSession(localStorage.token),
              );
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(providerActions.requestAllProviders());
                storeValidate.dispatch(
                  userActions.requestPerPage({ page: 1, pageSize: 10 }),
                );
                return <ConnectedMenuV propiedades={{ renderView: "users" }} />;
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/proveedor/crear"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createprovider" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/proveedor/editar/:id"
        render={({ match }) => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  providerActions.fillProviderUpdate(match.params.id),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "editprovider" }}
                    match={match}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/proveedores"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  providerActions.requestPerPage({ page: 1, pageSize: 10 }),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV propiedades={{ renderView: "providers" }} />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
      <Route
        exact
        path="/usuario/cambiarcontrasena"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(providerActions.requestAllProviders());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "cambiarcontrasena" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
    </Provider>
  </Router>
);

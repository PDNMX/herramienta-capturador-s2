const {spic} = require("../models/S2");
const _ = require('lodash');
const moment = require('moment-timezone');
require('dotenv').config();
const {proveedorRegistros} = require("../../proveedor/models/proveedorRegistros");
const {User} = require("../../usuario/models/User");

module.exports = {
  insertS2v2: async (req, res) => {
    console.log("insertS2v2");
    let usuario = req.body.usuario;
    delete req.body.usuario;
    let newdocument = req.body;
    // let newdocument = convertLevels(req.body);
    // console.log(newdocument['fechaCaptura']);
    let fecha = moment().tz("America/Mexico_City").format();
    newdocument['fechaCaptura'] = fecha;
    newdocument['fechaActualizacion'] = fecha;
    // Guardar en la base de datos de SPIC
    let Spic = new spic(newdocument);   
    let result = await Spic.save();
    let id_result = result._id;
    //console.log("variable id_result insertado en spic");
    //console.log(id_result);

    let objResponse = {};
    objResponse['results'] = result; 
    // Buscamos la informacion del usuario que registra en SPIC 
    let datausuario = await User.findById(usuario); 
    console.log("datos del usuario encontrados");
    console.log(datausuario);

    const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S2', fechaCaptura:fecha, fechaActualizacion:fecha });
    let resp = proveedorRegistros1.save();
    console.log("resp");
    console.log(resp);
    
    res.status(200).json({
      status: true,
      message: "Otro endpoint del s2 está para insertar está funcionando correctamente!",
      response: objResponse,
      usuario: datausuario
    }); 
  },
  
  /* createS2: (req, res) => {
    const { body } = req;

    S2Model.createS2(body)
      .then((s2) => {
        return res.status(200).json({
          status: true,
          data: s2.toJSON(),
          message : "S2 creado correctamente desde proyecto con nombre api desde insomnia"
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },
  insertS2: (req, res) => {
    const { body } = req;

    S2Model.insertS2(body)
      .then((s2) => {
        return res.status(200).json({
          status: true,
          data: s2.toJSON(),
          message : "S2 insertado desde proyecto con nombre api!"
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  }, */
};

///////////////////////////////////////////////////////////////////////////// Inicia S2 //////////////////////////////////////////////////////////////////////////////

/*  Endpoint para insertar S2 spic */


//////////////////////////////////////////////////////////////////////////// Termina S2 ///////////////////////////////////////////////////////////////////////////////
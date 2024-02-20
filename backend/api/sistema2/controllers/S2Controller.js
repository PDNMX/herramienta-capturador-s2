const {spic} = require("../models/S2");
const _ = require('lodash');
const moment = require('moment-timezone');
require('dotenv').config();
const {proveedorRegistros} = require("../../proveedor/models/proveedorRegistros");
const {User} = require("../../usuario/models/User");
//const { error } = require("../../../backend/src/server/schemas/S2V2/model.joynew.s2");

module.exports = {
  insertS2v2: async (req, res) => {
    try{
        //console.log("insertS2v2");
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
        if (newdocument.segundoApellido == null || newdocument.segundoApellido == '' || newdocument.segundoApellido == 'undefined') {
          newdocument['segundoApellido'] = false;
        } 
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
        //// Reestructurar el registro recien insertado en SPIC, reestructurar y actualizar
        //_v = result.__v; 
        //delete result.__v;
        //restructureDocument = result;
        

        res.status(200).json({
          status: true,
          message: "Otro endpoint del s2 está para insertar está funcionando correctamente!",
          response: objResponse,
          usuario: datausuario
        }); 
      } 
      catch (error) {
        //console.error('Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error al crear usuario.', error: error.message });
      }
  },
  getAllS2v2: async (req,res) => {
    try{
      /* const registros = await spic.find().exec();
      res.status(200).json(registros); */
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      console.log({ page: page, limit: pageSize, sort: sortObj });
      const paginationResult = await spic.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

    res.status(200).json(objResponse);
    }
      catch (error) {
        //console.error('Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error al crear usuario.', error: error.message });
      }
  },
  listS2v2: async (req, res) =>{
    try{
        let idUser = req.body.idUser;
        //let usuario = await User.findById(req.body.usuario);
        let usuario = await User.findById(idUser);
        let proveedorDatos = usuario.proveedorDatos;
        let sistema = 'S2';
        const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
        let arrs2 = [];
        _.map(result, row => {
          arrs2.push(row.registroSistemaId);
        });
        //console.log("arrs2");
        //console.log(arrs2);
        //// Paginacion del listado de registros
        let sortObj = req.body.sort === undefined ? {} : req.body.sort;
        let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
        let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
        let query = req.body.query === undefined ? {} : req.body.query;
  
        if (!query._id) {
          if (arrs2.length > 0) {
            query = { ...query, _id: { $in: arrs2 } };
          } else {
            query = { _id: { $in: arrs2 } };
          }
        }
  
        const paginationResult = await spic.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
        let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
        let objresults = paginationResult.docs;
        
        let objResponse = {};
        objResponse['pagination'] = objpagination;
        objResponse['results'] = objresults;
  
        res.status(200).json(objResponse);
    }
    catch (error) {
      //console.error('Error al crear usuario:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  updateS2v2: async (req, res) =>{
    try{
        // Se obtiene el id del usuario que esta realizando la peticion
      const id = req.body._id;
      //console.log(id);
      // Se eliminan los campos innecesarios de la solicitud
      delete req.body._id;
      // Se obtiene el nuevo documento a actualizar
      let newdocument = req.body;  
      // Se establece la fecha de actualización
      newdocument['fechaActualizacion'] = moment().tz("America/Mexico_City").format()
      // Se instancia el modelo de la colección de spic
      //let Spic = S2.model('Spic', nuevoS2Schema, 'spic');
      // Se actualiza el documento
      const response = await spic.findByIdAndUpdate(id, newdocument, { upsert: false, new: true }).exec();
        
      // Se devuelve la respuesta
      //res.status(200).json({ code: '200', message: 'Actualizando desde s2v2', id, newdocument });
      res.status(200).json(response);
      //res.status(200).json({message:"todo bien", code:200})

    }
    catch (error) {
      //console.error('Error al crear usuario:', error);
      return res.status(500).json({ error: error.message });
    }
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

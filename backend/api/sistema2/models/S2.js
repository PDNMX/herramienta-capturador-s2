const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require("mongoose");

const S2Schema = new mongoose.Schema({
  id: { type: String },
  fechaCaptura: { type: Date },
  fechaActualizacion: { type: Date },
  ejercicio: { type: String },
  nombres: { type: String },
  primerApellido: { type: String },
  segundoApellido: { 
    valor: { type: String },
    sinSegundoApellido: { type: Boolean },
   },
  curp: { type: String },
  rfc: { type: String },
  sexo: { type: String, enum: ["FEMENINO", "MASCULINO"] },
  responsabilidad: {type: mongoose.Schema.Types.Mixed},
  entePublico: 
  {
    type: mongoose.Schema.Types.Mixed
 /*    entidadFederativa: { type: String },
    ambitoGobierno: { clave: { type: String }, valor: { type: String } },
    poderOrganoGobierno: { type: String, },
    nombre: { type: String },
    siglas: { type: String }, */
  },
  empleoCargoComision: 
  {
    areaAdscripcion: { type: String },
    nivel: { type: String },
    nombre: { type: String },
  },
  procedimientos: 
  {
    tipoArea: {
      type: mongoose.Schema.Types.Object,
      properties: {
        tipo: { type: String },
        areas: { type: [String] }
      }
    },
    nivelesResponsabilidad: {
      type: mongoose.Schema.Types.Object,
      properties: {
        idObj: { type: String },
        acciones: { type: [String] }
      }
    },
    tipo: { type: String }
  },
  observaciones: { type: String }
  
});

S2Schema.plugin(mongoosePaginate);
//const s2Connection = mongoose.connection.useDb("administracionUsuarios");
// Crear el modelo de producto utilizando el esquema
const s2Connection = mongoose.connection.useDb("administracionUsuarios");
const spic = mongoose.connection.useDb("S2").model("spic", S2Schema, "spic");

/*  Creamos el modelo para almacenar los metadatos para s2 */
const S2SchemaMeta = new mongoose.Schema({
  metadatos: {type: mongoose.Schema.Types.Mixed},
  data: {type: mongoose.Schema.Types.Mixed}
},{});

S2SchemaMeta.plugin(mongoosePaginate);
const spicMeta = mongoose.connection.useDb("S2").model("spic",S2SchemaMeta, "spic");

module.exports = {
  s2Connection,
  spic,
  spicMeta
}

// Exportar las funciones del modelo de producto
/* module.exports = {
  createS2: (data) => {
    const s2 = new S2(data);
    return s2.save();
  },
//   insertS2: (data) => {
//    const s2 = new s2(data);
//    return s2.create();    
//}, 
}; */

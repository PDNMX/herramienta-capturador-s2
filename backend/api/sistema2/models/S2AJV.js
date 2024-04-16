const schemaS2 = 
    {
        "type": "object",
        "properties": {
          //"id": { "type": "string" },
          //"fechaCaptura": { "type": "string", "format": "datetime" },
          //"fechaActualizacion": { "type": "string", "format": "datetime" },
          "ejercicio": { "type": "string" },
          "nombres": { "type": "string" },
          "primerApellido": { "type": "string" },
          "segundoApellido": {
            "type": "object",
            "properties": {
              "valor": { "type": "string" },
              "sinSegundoApellido": { "type": "boolean" }
            },
            "required": ["valor", "sinSegundoApellido"]
          },
          "curp": { "type": "string" },
          "rfc": { "type": "string" },
          "sexo": {
            "type": "string",
            "enum": ["FEMENINO", "MASCULINO"]
          },
          "responsabilidad": {"type":"object"},
          "entePublico": {"type":"object"}, 
          "empleoCargoComision": {
            "type": "object",
            "properties": {
              "areaAdscripcion": { "type": "string" },
              "nivel": { "type": "string" },
              "nombre": { "type": "string" }
            },
            "required": ["areaAdscripcion", "nivel", "nombre"]
          },
          "procedimientos": {
            "type": "array",
            "properties": {
              "tipoArea": {
                "type": "object",
                "properties": {
                  "tipo": { "type": "string" },
                  "areas": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["tipo", "areas"]
              },
              "nivelesResponsabilidad": {
                "type": "object",
                "properties": {
                  "idObj": { "type": "string" },
                  "acciones": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["idObj", "acciones"]
              },
              "tipo": { "type": "string" }
            },
            "required": ["tipoArea", "nivelesResponsabilidad", "tipo"]
          },
          "observaciones": { "type": "string" }
        },
        "required": [
          //"id",
          //"fechaCaptura",
          //"fechaActualizacion",
          "ejercicio",
          "nombres",
          "primerApellido",
          "segundoApellido",
          "curp",
          "rfc",
          "sexo",
          "empleoCargoComision",
          "procedimientos",
          "observaciones"
        ]
      }
      
  module.exports = {schemaS2};
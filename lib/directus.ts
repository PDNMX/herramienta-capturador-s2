//@ts-nocheck
import {
  createDirectus,
  rest,
  authentication,
  createItem,
  readItems,
} from "@directus/sdk";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8060";

// Instancia autenticada (para usuarios del sistema)
const directus = createDirectus(BACKEND_URL)
  .with(authentication("cookie", { credentials: "include", autoRefresh: true }))
  .with(rest());

// Instancia pública (para el formulario de denuncias)
export const publicDirectus = createDirectus(BACKEND_URL).with(rest());

// Servicio para manejar catálogos de faltas
export const catalogosService = {
  // Obtener todas las faltas
  async getFaltas() {
    try {
      const faltas = await publicDirectus.request(
        readItems("faltas", {
          limit: -1,
          fields: [
            'id', 
            'entidad', 
            'clasificacion', 
            'ley', 
            'articulo', 
            'fraccion', 
            'incisio', 
            'letra', 
            'nombre', 
            'descripcion', 
            'servidorPublico', 
            'particular'
          ]
        })
      );
      return faltas;
    } catch (error) {
      console.error("Error al obtener catálogo de faltas:", error);
      throw error;
    }
  },

  // Filtrar faltas por tipo, entidad y clasificación
  async getFaltasFiltradas(tipoPersona, entidad, clasificacion) {
    try {
      const filter = {
        _and: []
      };

      // Filtrar por tipo de persona
      if (tipoPersona === "SERVIDOR_PUBLICO") {
        filter._and.push({ servidorPublico: { _eq: true } });
      } else if (tipoPersona === "PARTICULAR") {
        filter._and.push({ particular: { _eq: true } });
      }

      // Filtrar por entidad (considerando que 0 o 33 son federales y aplican a todas)
      if (entidad) {
        filter._and.push({
          _or: [
            { entidad: { _eq: entidad } },
            { entidad: { _eq: 0 } },
            { entidad: { _eq: 33 } },
            { entidad: { _null: true } }
          ]
        });
      }

      // Filtrar por clasificación
      if (clasificacion) {
        filter._and.push({ clasificacion: { _eq: clasificacion } });
      }

      // Si no hay condiciones, quitar _and
      if (filter._and.length === 0) {
        delete filter._and;
      }

      const faltas = await publicDirectus.request(
        readItems("faltas", {
          limit: -1,
          filter,
          fields: [
            'id', 
            'entidad', 
            'clasificacion', 
            'nombre', 
            'descripcion', 
            'servidorPublico', 
            'particular'
          ]
        })
      );
      return faltas;
    } catch (error) {
      console.error("Error al obtener faltas filtradas:", error);
      throw error;
    }
  }
};

// Servicio para manejar las denuncias públicas
export const denunciasPublicService = {
  async createDenuncia(formData: any) {
    try {
      console.log("------------------- INICIANDO CREACIÓN DE DENUNCIA -------------------");
      console.log("Datos recibidos:", JSON.stringify(formData, null, 2));

      // 1. Crear denunciante (siempre, ya sea anónimo o no)
      let denuncianteId = null;

      try {
        // Verificar que denunciante existe en el objeto
        if (!formData.denunciante) {
          formData.denunciante = { anonimo: false };
        }

        // Preparar datos del denunciante
        const denuncianteData: any = {
          anonimo: Boolean(formData.denunciante.anonimo),
        };
        
        console.log("Preparando datos del denunciante:", denuncianteData);

        // Solo agregamos datos adicionales si no es anónimo
        if (!formData.denunciante.anonimo && formData.denunciante.datosDenunciante) {
          console.log("El denunciante no es anónimo, procesando datos adicionales");
          
          // 1.1 Crear domicilio del denunciante
          let domicilioDenuncianteId = null;
          try {
            // Intentamos crear el domicilio solo si existe el objeto
            if (formData.denunciante.datosDenunciante.domicilioDenunciante) {
              // Extraer datos de domicilio
              const domicilioData = formData.denunciante.datosDenunciante.domicilioDenunciante;
              
              // Crear objeto para la inserción, asegurando que ningún campo sea undefined
              const domicilioObj = {
                codigoPostal: domicilioData.codigoPostal || null,
                calle: domicilioData.calle || null,
                numeroExterior: domicilioData.numeroExterior || null,
                numeroInterior: domicilioData.numeroInterior || null,
                municipioAlcaldia: domicilioData.municipioAlcaldia || null,
              };
              
              console.log("Creando domicilio con datos:", JSON.stringify(domicilioObj, null, 2));
              
              // Crear el domicilio en Directus
              const domicilioDenunciante = await publicDirectus.request(
                createItem("domicilios_denunciantes", domicilioObj)
              );
              
              domicilioDenuncianteId = domicilioDenunciante.id;
              console.log("Domicilio creado con ID:", domicilioDenuncianteId);
            } else {
              console.log("No hay datos de domicilio para procesar");
            }
          } catch (domicilioError) {
            console.error("Error al crear domicilio:", domicilioError);
            if (domicilioError.response) {
              console.error("Respuesta del servidor:", domicilioError.response.data);
            }
            // Continuamos sin domicilio
          }

          // 1.2 Crear datos del denunciante
          try {
            // Preparar objeto con los datos básicos
            const datosDenuncianteObj = {
              nombre: formData.denunciante.datosDenunciante.nombre || null,
              telefono: formData.denunciante.datosDenunciante.telefono || null,
              email: formData.denunciante.datosDenunciante.email || null,
              proteccion: Boolean(formData.denunciante.datosDenunciante.proteccion),
              razonesProteccion: formData.denunciante.datosDenunciante.razonesProteccion || null,
            };
            
            // Agregar domicilio solo si se creó correctamente
            if (domicilioDenuncianteId) {
              datosDenuncianteObj.domicilioDenunciante = domicilioDenuncianteId;
            }
            
            console.log("Creando datos del denunciante:", JSON.stringify(datosDenuncianteObj, null, 2));
            
            // Crear datos del denunciante en Directus
            const datosDenunciante = await publicDirectus.request(
              createItem("datos_denunciantes", datosDenuncianteObj)
            );
            
            // Guardar referencia en el objeto denunciante
            denuncianteData.datosDenunciante = datosDenunciante.id;
            console.log("Datos del denunciante creados con ID:", datosDenunciante.id);
          } catch (datosError) {
            console.error("Error al crear datos del denunciante:", datosError);
            if (datosError.response) {
              console.error("Respuesta del servidor:", datosError.response.data);
            }
            // Continuamos sin datos adicionales
          }
        }

        // Crear el registro de denunciante
        console.log("Creando registro de denunciante con:", JSON.stringify(denuncianteData, null, 2));
        const denunciante = await publicDirectus.request(
          createItem("denunciantes", denuncianteData)
        );
        denuncianteId = denunciante.id;
        console.log("Denunciante creado con ID:", denuncianteId);
      } catch (denuncianteError) {
        console.error("Error al crear denunciante:", denuncianteError);
        if (denuncianteError.response) {
          console.error("Respuesta del servidor:", denuncianteError.response.data);
        }
        // Si no se puede crear el denunciante, no podemos continuar
        throw new Error("No se pudo crear el denunciante");
      }

      // 2. Crear ubicación del hecho
      let ubicacionHechoId = null;
      try {
        // Crear ubicación solo si hay datos
        if (formData.ubicacionHecho) {
          // Asegurarnos de que todos los campos estén definidos o sean null
          const ubicacionHechoData = {
            codigoPostal: formData.ubicacionHecho.codigoPostal || null,
            calle: formData.ubicacionHecho.calle || null,
            numero: formData.ubicacionHecho.numero || null,
            ciudad: formData.ubicacionHecho.ciudad || null,
            estado: formData.ubicacionHecho.estado || null,
            pais: formData.ubicacionHecho.pais || null,
            otrasReferencias: formData.ubicacionHecho.otrasReferencias || null,
            fechaHecho: formData.ubicacionHecho.fechaHecho || null,
            horaHecho: formData.ubicacionHecho.horaHecho || null,
          };

          // Log específico para verificar que el campo otrasReferencias se incluye correctamente
          console.log("Creando ubicación del hecho con:", JSON.stringify(ubicacionHechoData, null, 2));
          
          const ubicacionHecho = await publicDirectus.request(
            createItem("ubicaciones_hechos", ubicacionHechoData)
          );

          ubicacionHechoId = ubicacionHecho.id;
          console.log("Ubicación del hecho creada con ID:", ubicacionHechoId);
          
          // Verificamos los datos retornados para confirmar que otrasReferencias se guardó
          console.log("Datos retornados de la ubicación creada:", JSON.stringify(ubicacionHecho, null, 2));
        } else {
          console.log("No hay datos de ubicación para procesar");
        }
      } catch (ubicacionError) {
        console.error("Error al crear ubicación del hecho:", ubicacionError);
        if (ubicacionError.response) {
          console.error("Respuesta del servidor:", ubicacionError.response.data);
        }
        // Continuamos sin ubicación
      }

      // 3. Crear persona denunciada
      let personaDenunciadaId = null;
      try {
        if (formData.personaDenunciada) {
          // Asegurarnos de que todos los campos estén definidos o sean null
          const personaDenunciadaData = {
            entidad: formData.personaDenunciada.entidad || null,
            entePublico: formData.personaDenunciada.entePublico || null,
            tipoPersona: formData.personaDenunciada.tipoPersona || "SERVIDOR_PUBLICO",
            nombre: formData.personaDenunciada.nombre || null,
            apellidos: formData.personaDenunciada.apellidos || null,
            genero: formData.personaDenunciada.genero || null,
            descripcion: formData.personaDenunciada.descripcion || null,
          };

          console.log("Creando persona denunciada con:", JSON.stringify(personaDenunciadaData, null, 2));
          
          const personaDenunciada = await publicDirectus.request(
            createItem("personas_denunciadas", personaDenunciadaData)
          );

          personaDenunciadaId = personaDenunciada.id;
          console.log("Persona denunciada creada con ID:", personaDenunciadaId);
        } else {
          console.log("No hay datos de persona denunciada para procesar");
        }
      } catch (personaError) {
        console.error("Error al crear persona denunciada:", personaError);
        if (personaError.response) {
          console.error("Respuesta del servidor:", personaError.response.data);
        }
        // Continuamos sin persona denunciada
      }

      // 4. Crear falta cometida
      let faltaCometidaId = null;
      try {
        if (formData.faltaCometida) {
          // Asegurarnos de que los arrays siempre existan o sean vacíos
          const faltaCometidaData = {
            faltaGrave: formData.faltaCometida.faltaGrave || [],
            faltaNoGrave: formData.faltaCometida.faltaNoGrave || [],
            hechosCorrupcion: formData.faltaCometida.hechosCorrupcion || [],
          };

          console.log("Creando falta cometida con:", JSON.stringify(faltaCometidaData, null, 2));
          
          const faltaCometida = await publicDirectus.request(
            createItem("falta_cometida", faltaCometidaData)
          );
          
          faltaCometidaId = faltaCometida.id;
          console.log("Falta cometida creada con ID:", faltaCometidaId);
        } else {
          console.log("No hay datos de falta cometida para procesar");
        }
      } catch (faltaError) {
        console.error("Error al crear falta cometida:", faltaError);
        if (faltaError.response) {
          console.error("Respuesta del servidor:", faltaError.response.data);
        }
        // Continuamos sin falta cometida
      }

      // 6. Crear la denuncia principal
      try {
        // Crear objeto base de la denuncia
        const denunciaData = {
          status: "PENDIENTE",
          narracionHechos: formData.narracionHechos || "",
          testigo: Boolean(formData.testigo), // Cambiado a singular
          datosTestigos: formData.datosTestigos || null, // Directamente en denuncia
        };
        
        // Añadir relaciones solo si existen los IDs
        if (denuncianteId) denunciaData.denunciante = denuncianteId;
        if (ubicacionHechoId) denunciaData.ubicacionHecho = ubicacionHechoId;
        if (personaDenunciadaId) denunciaData.personaDenunciada = personaDenunciadaId;
        if (faltaCometidaId) denunciaData.faltaCometida = faltaCometidaId;

        console.log("Creando denuncia principal con:", JSON.stringify(denunciaData, null, 2));
        
        // Crear la denuncia en Directus
        const denuncia = await publicDirectus.request(
          createItem("denuncias", denunciaData)
        );
        
        console.log("Denuncia creada con ID:", denuncia.id);

        // 7. Crear relaciones con archivos de evidencia
        if (formData.archivosEvidencia?.length > 0) {
          try {
            console.log(`Procesando ${formData.archivosEvidencia.length} archivos de evidencia`);
            
            // Verificar que cada elemento sea un ID válido
            for (const fileId of formData.archivosEvidencia) {
              if (!fileId) {
                console.warn("ID de archivo no válido:", fileId);
                continue;
              }
              
              console.log(`Creando relación para archivo ${fileId} con denuncia ${denuncia.id}`);
              
              // Crear la relación many-to-many en la tabla de relaciones
              await publicDirectus.request(
                createItem("denuncias_files", {
                  denuncias_id: denuncia.id,
                  directus_files_id: fileId,
                })
              );
            }
            console.log("Relaciones de archivos creadas correctamente");
          } catch (archivosError) {
            console.error("Error al crear relaciones de archivos:", archivosError);
            if (archivosError.response) {
              console.error("Respuesta del servidor:", archivosError.response.data);
            }
            // Continuamos incluso si fallan los archivos
          }
        }

        console.log("------------------- DENUNCIA CREADA EXITOSAMENTE -------------------");
        console.log("Resultado:", JSON.stringify(denuncia, null, 2));
        
        return denuncia;
      } catch (denunciaError) {
        console.error("Error al crear la denuncia principal:", denunciaError);
        if (denunciaError.response) {
          console.error("Respuesta del servidor:", denunciaError.response.data);
        }
        throw denunciaError;
      }
    } catch (error) {
      console.error("Error general al crear la denuncia:", error);
      throw error;
    }
  },

  // Método para subir un archivo directamente al sistema de archivos de Directus
  async uploadEvidencia(file: File) {
    try {
      // Verificamos si tenemos un objeto File válido
      if (!(file instanceof File)) {
        throw new Error("El parámetro proporcionado no es un objeto File válido");
      }
      
      console.log(`Preparando subida de archivo: ${file.name} (${file.size} bytes, tipo: ${file.type})`);
      
      // Creamos un FormData para subir el archivo
      const formData = new FormData();
      formData.append("file", file);
      
      // Hacemos la petición directamente al endpoint /files de Directus
      console.log(`Enviando archivo a ${BACKEND_URL}/files`);
      const response = await fetch(`${BACKEND_URL}/files`, {
        method: "POST",
        body: formData,
        // No incluimos credenciales ya que es un endpoint público
      });
      
      // Si la respuesta no es exitosa, lanzamos un error
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
        console.error(`Cuerpo del error: ${errorBody}`);
        throw new Error(`Error al subir archivo: ${response.status} ${response.statusText}`);
      }
      
      // Parseamos la respuesta JSON
      const data = await response.json();
      console.log(`Archivo subido exitosamente. ID asignado por Directus: ${data.id}`);
      return data; // Esto incluirá el ID del archivo y otros metadatos
      
    } catch (error) {
      console.error("Error al subir evidencia:", error);
      throw error;
    }
  }
};

// Servicio para consultar denuncias
export const seguimientoService = {
  async consultarDenuncia(folio: string) {
    try {
      const denuncia = await publicDirectus.request(
        readItems("denuncias", {
          filter: { id: folio },
          fields: ["id", "status", "date_created"],
        })
      );

      if (!denuncia || denuncia.length === 0) {
        throw new Error("Denuncia no encontrada");
      }

      return denuncia[0];
    } catch (error) {
      console.error("Error al consultar la denuncia:", error);
      throw error;
    }
  },
};

export default directus;
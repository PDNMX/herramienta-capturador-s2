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

// Instancia pública (para el  de denuncias)
export const publicDirectus = createDirectus(BACKEND_URL).with(rest());

// Servicio para manejar las denuncias públicas
export const denunciasPublicService = {
  async createDenuncia(formData: any) {
    try {
      // 1. Crear denunciante (siempre, ya sea anónimo o no)
      let denuncianteId = null;

      try {
        // Siempre creamos un registro de denunciante
        const denuncianteData: any = {
          anonimo: Boolean(formData.denunciante?.anonimo), // Aseguramos que sea un booleano
        };

        // Solo agregamos datos adicionales si no es anónimo
        if (
          !formData.denunciante?.anonimo &&
          formData.denunciante?.datosDenunciante
        ) {
          // 1.1 Crear domicilio del denunciante si hay datos
          let domicilioDenuncianteId = null;
          const domicilioData =
            formData.denunciante.datosDenunciante.domicilioDenunciante || {};

          if (
            Object.values(domicilioData).some(
              (value) => value && String(value).trim() !== ""
            )
          ) {
            const domicilioDenunciante = await publicDirectus.request(
              createItem("domicilios_denunciantes", {
                codigoPostal: domicilioData.codigoPostal?.trim() || null,
                calle: domicilioData.calle?.trim() || null,
                numeroExterior: domicilioData.numeroExterior?.trim() || null,
                numeroInterior: domicilioData.numeroInterior?.trim() || null,
                municipioAlcaldia:
                  domicilioData.municipioAlcaldia?.trim() || null,
              })
            );
            domicilioDenuncianteId = domicilioDenunciante.id;
          }

          // 1.2 Crear datos del denunciante
          const datosDenuncianteData = {
            nombre:
              formData.denunciante.datosDenunciante.nombre?.trim() || null,
            telefono:
              formData.denunciante.datosDenunciante.telefono?.trim() || null,
            email: formData.denunciante.datosDenunciante.email?.trim() || null,
            proteccion: Boolean(
              formData.denunciante.datosDenunciante.proteccion
            ),
            razonesProteccion:
              formData.denunciante.datosDenunciante.razonesProteccion?.trim() ||
              null,
            ...(domicilioDenuncianteId && {
              domicilioDenunciante: domicilioDenuncianteId,
            }),
          };

          const datosDenunciante = await publicDirectus.request(
            createItem("datos_denunciantes", datosDenuncianteData)
          );

          // Agregar ID de datos del denunciante al objeto denunciante
          denuncianteData.datosDenunciante = datosDenunciante.id;
        }

        // Crear registro de denunciante (siempre)
        const denunciante = await publicDirectus.request(
          createItem("denunciantes", denuncianteData)
        );
        denuncianteId = denunciante.id;
      } catch (error) {
        console.error("Error al crear denunciante:", error);
      }

      // 2. Crear ubicación del hecho
      let ubicacionHechoId = null;

      try {
        // Crear ubicación del hecho si hay datos
        if (formData.ubicacionHecho) {
          const ubicacionHechoData = {
            codigoPostal: formData.ubicacionHecho.codigoPostal?.trim() || null,
            calle: formData.ubicacionHecho.calle?.trim() || null,
            numero: formData.ubicacionHecho.numero?.trim() || null,
            ciudad: formData.ubicacionHecho.ciudad?.trim() || null,
            estado: formData.ubicacionHecho.estado?.trim() || null,
            pais: formData.ubicacionHecho.pais?.trim() || null,
            otrasReferencias:
              formData.ubicacionHecho.otrasReferencias?.trim() || null,
            fechaHecho: formData.ubicacionHecho.fechaHecho || null,
            horaHecho: formData.ubicacionHecho.horaHecho || null,
          };

          console.log("Datos de ubicacionHecho a crear:", ubicacionHechoData);

          const ubicacionHecho = await publicDirectus.request(
            createItem("ubicaciones_hechos", ubicacionHechoData)
          );

          ubicacionHechoId = ubicacionHecho.id;
          console.log("ubicacionHechoId creado:", ubicacionHechoId);
        }
      } catch (error) {
        console.error("Error al crear ubicación del hecho:", error);
      }

      // 3. Crear persona denunciada
      let personaDenunciadaId = null;
      try {
        if (formData.personaDenunciada) {
          const personaDenunciadaData = {
            entidad: formData.personaDenunciada.entidad || null,
            entePublico: formData.personaDenunciada.entePublico || null,
            tipoPersona:
              formData.personaDenunciada.tipoPersona || "SERVIDOR_PUBLICO",
            nombre: formData.personaDenunciada.nombre?.trim() || null,
            apellidos: formData.personaDenunciada.apellidos?.trim() || null,
            genero: formData.personaDenunciada.genero || null,
            descripcion: formData.personaDenunciada.descripcion?.trim() || null,
          };

          console.log(
            "Datos de personaDenunciada a crear:",
            personaDenunciadaData
          );

          const personaDenunciada = await publicDirectus.request(
            createItem("personas_denunciadas", personaDenunciadaData)
          );

          personaDenunciadaId = personaDenunciada.id;
          console.log("personaDenunciadaId creado:", personaDenunciadaId);
        }
      } catch (error) {
        console.error("Error al crear persona denunciada:", error);
      }

      // 4. Crear falta cometida
      let faltaCometidaId = null;
      try {
        if (formData.faltaCometida) {
          const faltaCometida = await publicDirectus.request(
            createItem("falta_cometida", {
              faltaGrave: formData.faltaCometida.faltaGrave || [],
              faltaNoGrave: formData.faltaCometida.faltaNoGrave || [],
              hechosCorrupcion: formData.faltaCometida.hechosCorrupcion || [],
            })
          );
          faltaCometidaId = faltaCometida.id;
        }
      } catch (error) {
        console.error("Error al crear falta cometida:", error);
      }

      // 5. Procesar testigos
      let testigosId = null;
      try {
        // Verificar si el usuario indicó que hay testigos
        const hayTestigos = Boolean(formData.testigos);

        // Preparar los datos de testigos (filtrados)
        let datosTestigos = [];
        if (
          hayTestigos &&
          formData.datosTestigos &&
          formData.datosTestigos.length > 0
        ) {
          datosTestigos = formData.datosTestigos
            .filter(
              (testigo) =>
                (testigo.nombre && testigo.nombre.trim() !== "") ||
                (testigo.contacto && testigo.contacto.trim() !== "")
            )
            .map((testigo) => ({
              nombre: testigo.nombre?.trim() || null,
              contacto: testigo.contacto?.trim() || null,
            }));
        }

        // Estructura final para Directus
        const testigosData = {
          hayTestigos: hayTestigos,
          datos: datosTestigos,
        };

        // Crear el registro de testigos (siempre)
        const testigos = await publicDirectus.request(
          createItem("testigos", testigosData)
        );

        testigosId = testigos.id;
        console.log("testigosId creado:", testigosId);
      } catch (error) {
        console.error("Error al crear testigos:", error);
      }

      // 6. Crear la denuncia principal
      const denunciaData = {
        status: "PENDIENTE",
        narracionHechos: formData.narracionHechos?.trim() || "",
        ...(denuncianteId && { denunciante: denuncianteId }),
        ...(ubicacionHechoId && { ubicacionHecho: ubicacionHechoId }),
        ...(personaDenunciadaId && { personaDenunciada: personaDenunciadaId }),
        ...(faltaCometidaId && { faltaCometida: faltaCometidaId }),
        ...(testigosId && { testigos: testigosId }),
      };

      const denuncia = await publicDirectus.request(
        createItem("denuncias", denunciaData)
      );

      // 7. Crear relaciones con archivos de evidencia
      if (formData.archivosEvidencia?.length > 0) {
        try {
          for (const fileId of formData.archivosEvidencia) {
            await publicDirectus.request(
              createItem("denuncias_files", {
                denuncias_id: denuncia.id,
                directus_files_id: fileId,
              })
            );
          }
        } catch (error) {
          console.error("Error al crear relaciones de archivos:", error);
        }
      }

      return denuncia;
    } catch (error) {
      console.error("Error al crear la denuncia:", error);
      throw error;
    }
  },

  async uploadEvidencia(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BACKEND_URL}/files`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al subir evidencia:", error);
      throw error;
    }
  },
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

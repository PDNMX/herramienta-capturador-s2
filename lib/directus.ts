//@ts-nocheck
import { createDirectus, rest, authentication, createItem, readItems } from "@directus/sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8060';

// Instancia autenticada (para usuarios del sistema)
const directus = createDirectus(BACKEND_URL)
  .with(authentication("cookie", { credentials: "include", autoRefresh: true }))
  .with(rest());

// Instancia pública (para el formulario de denuncias)
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
        if (!formData.denunciante?.anonimo && formData.denunciante?.datosDenunciante) {
          // 1.1 Crear domicilio del denunciante si hay datos
          let domicilioDenuncianteId = null;
          const domicilioData = formData.denunciante.datosDenunciante.domicilioDenunciante || {};
          
          if (Object.values(domicilioData).some(value => value && String(value).trim() !== '')) {
            const domicilioDenunciante = await publicDirectus.request(
              createItem('domicilios_denunciantes', {
                codigoPostal: domicilioData.codigoPostal?.trim() || null,
                calle: domicilioData.calle?.trim() || null,
                numeroExterior: domicilioData.numeroExterior?.trim() || null,
                numeroInterior: domicilioData.numeroInterior?.trim() || null,
                municipioAlcaldia: domicilioData.municipioAlcaldia?.trim() || null,
              })
            );
            domicilioDenuncianteId = domicilioDenunciante.id;
          }

          // 1.2 Crear datos del denunciante
          const datosDenuncianteData = {
            nombre: formData.denunciante.datosDenunciante.nombre?.trim() || null,
            telefono: formData.denunciante.datosDenunciante.telefono?.trim() || null,
            email: formData.denunciante.datosDenunciante.email?.trim() || null,
            proteccion: Boolean(formData.denunciante.datosDenunciante.proteccion),
            ...(domicilioDenuncianteId && { domicilioDenunciante: domicilioDenuncianteId })
          };

          const datosDenunciante = await publicDirectus.request(
            createItem('datos_denunciantes', datosDenuncianteData)
          );

          // Agregar ID de datos del denunciante al objeto denunciante
          denuncianteData.datosDenunciante = datosDenunciante.id;
        }

        // Crear registro de denunciante (siempre)
        const denunciante = await publicDirectus.request(
          createItem('denunciantes', denuncianteData)
        );
        denuncianteId = denunciante.id;
      } catch (error) {
        console.error('Error al crear denunciante:', error);
      }

      // 2. Crear lugar del hecho
      let ubicacionHechoId = null;
      try {
        if (formData.ubicacionHecho?.lugarHecho) {
          const lugarHecho = await publicDirectus.request(
            createItem('lugares_hechos', {
              entidad: formData.ubicacionHecho.lugarHecho.entidad?.trim() || null,
              entePublico: formData.ubicacionHecho.lugarHecho.entePublico?.trim() || null,
              calle: formData.ubicacionHecho.lugarHecho.calle?.trim() || null,
              numeroExterior: formData.ubicacionHecho.lugarHecho.numeroExterior?.trim() || null,
              numeroInterior: formData.ubicacionHecho.lugarHecho.numeroInterior?.trim() || null,
              codigoPostal: formData.ubicacionHecho.lugarHecho.codigoPostal?.trim() || null,
              fechaHecho: formData.ubicacionHecho.lugarHecho.fechaHecho || null,
              horaHecho: formData.ubicacionHecho.lugarHecho.horaHecho || null,
            })
          );

          // 3. Crear persona denunciada
          if (formData.personaDenunciada) {
            const personaDenunciada = await publicDirectus.request(
              createItem('personas_denunciadas', {
                tipoPersona: formData.personaDenunciada.tipoPersona || 'SERVIDOR_PUBLICO',
                nombre: formData.personaDenunciada.nombre?.trim() || null,
                apellidoPaterno: formData.personaDenunciada.apellidoPaterno?.trim() || null,
                apellidoMaterno: formData.personaDenunciada.apellidoMaterno?.trim() || null,
                descripcion: formData.personaDenunciada.descripcion?.trim() || null,
              })
            );

            // 4. Crear ubicación del hecho
            const ubicacionHecho = await publicDirectus.request(
              createItem('ubicaciones_hechos', {
                lugarHecho: lugarHecho.id,
                personaDenunciada: personaDenunciada.id,
              })
            );
            ubicacionHechoId = ubicacionHecho.id;
          }
        }
      } catch (error) {
        console.error('Error al crear ubicación del hecho:', error);
      }

      // 5. Crear falta cometida
      let faltaCometidaId = null;
      try {
        if (formData.faltaCometida) {
          const faltaCometida = await publicDirectus.request(
            createItem('falta_cometida', {
              faltaGrave: formData.faltaCometida.faltaGrave || [],
              faltaNoGrave: formData.faltaCometida.faltaNoGrave || [],
              hechosCorrupcion: formData.faltaCometida.hechosCorrupcion || [],
            })
          );
          faltaCometidaId = faltaCometida.id;
        }
      } catch (error) {
        console.error('Error al crear falta cometida:', error);
      }

      // 6. Crear la denuncia principal
      const denunciaData = {
        status: 'PENDIENTE',
        narracionHechos: formData.narracionHechos?.trim() || '',
        ...(denuncianteId && { denunciante: denuncianteId }),
        ...(ubicacionHechoId && { ubicacionHecho: ubicacionHechoId }),
        ...(faltaCometidaId && { faltaCometida: faltaCometidaId }),
      };

      const denuncia = await publicDirectus.request(
        createItem('denuncias', denunciaData)
      );

      // 7. Crear relaciones con archivos de evidencia
      if (formData.archivosEvidencia?.length > 0) {
        try {
          for (const fileId of formData.archivosEvidencia) {
            await publicDirectus.request(
              createItem('denuncias_files', {
                denuncias_id: denuncia.id,
                directus_files_id: fileId
              })
            );
          }
        } catch (error) {
          console.error('Error al crear relaciones de archivos:', error);
        }
      }

      return denuncia;
    } catch (error) {
      console.error('Error al crear la denuncia:', error);
      throw error;
    }
  },

  async uploadEvidencia(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al subir evidencia:', error);
      throw error;
    }
  }
};

// Servicio para consultar denuncias
export const seguimientoService = {
  async consultarDenuncia(folio: string) {
    try {
      const denuncia = await publicDirectus.request(
        readItems('denuncias', {
          filter: { id: folio },
          fields: [
            'id',
            'status',
            'date_created'
          ]
        })
      );

      if (!denuncia || denuncia.length === 0) {
        throw new Error('Denuncia no encontrada');
      }

      return denuncia[0];
    } catch (error) {
      console.error('Error al consultar la denuncia:', error);
      throw error;
    }
  }
};

export default directus;
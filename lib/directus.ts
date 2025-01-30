//@ts-nocheck
import { createDirectus, rest, authentication, createItem, readItems } from "@directus/sdk";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BACKEND_URL: string;
      NEXT_PUBLIC_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
    }
  }
}

// Instancia autenticada (para usuarios del sistema)
const directus = createDirectus(process.env.NEXT_PUBLIC_BACKEND_URL)
  .with(authentication("cookie", { credentials: "include", autoRefresh: true }))
  .with(rest());

// Instancia pública (para el formulario de denuncias)
export const publicDirectus = createDirectus(process.env.NEXT_PUBLIC_BACKEND_URL)
  .with(rest());

// Servicio para manejar las denuncias públicas
export const denunciasPublicService = {
  async createDenuncia(formData: any) {
    try {
      // 1. Crear domicilio del denunciante si no es anónimo
      let domicilioDenuncianteId = null;
      let datosDenuncianteId = null;
      let denuncianteId = null;
      
      if (!formData.denunciante.anonimo && formData.denunciante.datosDenunciante) {
        // Crear domicilio del denunciante
        const domicilioDenunciante = await publicDirectus.request(
          createItem('domicilios_denunciantes', {
            codigoPostal: formData.denunciante.datosDenunciante.domicilioDenunciante.codigoPostal,
            calle: formData.denunciante.datosDenunciante.domicilioDenunciante.calle,
            numeroExterior: formData.denunciante.datosDenunciante.domicilioDenunciante.numeroExterior,
            numeroInterior: formData.denunciante.datosDenunciante.domicilioDenunciante.numeroInterior,
            municipioAlcaldia: formData.denunciante.datosDenunciante.domicilioDenunciante.municipioAlcaldia,
          })
        );
        domicilioDenuncianteId = domicilioDenunciante.id;

        // Crear datos del denunciante
        const datosDenunciante = await publicDirectus.request(
          createItem('datos_denunciantes', {
            nombre: formData.denunciante.datosDenunciante.nombre,
            telefono: formData.denunciante.datosDenunciante.telefono,
            email: formData.denunciante.datosDenunciante.email,
            proteccion: formData.denunciante.datosDenunciante.proteccion,
            domicilioDenunciante: domicilioDenuncianteId,
          })
        );
        datosDenuncianteId = datosDenunciante.id;

        // Crear registro de denunciante
        const denunciante = await publicDirectus.request(
          createItem('denunciantes', {
            anonimo: formData.denunciante.anonimo,
            datosDenunciante: datosDenuncianteId,
          })
        );
        denuncianteId = denunciante.id;
      }

      // 2. Crear lugar del hecho
      const lugarHecho = await publicDirectus.request(
        createItem('lugares_hechos', {
          entidad: formData.ubicacionHecho.lugarHecho.entidad,
          entePublico: formData.ubicacionHecho.lugarHecho.entePublico,
          calle: formData.ubicacionHecho.lugarHecho.calle,
          numeroExterior: formData.ubicacionHecho.lugarHecho.numeroExterior,
          numeroInterior: formData.ubicacionHecho.lugarHecho.numeroInterior,
          codigoPostal: formData.ubicacionHecho.lugarHecho.codigoPostal,
          fechaHecho: formData.ubicacionHecho.lugarHecho.fechaHecho,
          horaHecho: formData.ubicacionHecho.lugarHecho.horaHecho,
        })
      );

      // 3. Crear persona denunciada
      const personaDenunciada = await publicDirectus.request(
        createItem('personas_denunciadas', {
          tipoPersona: formData.personaDenunciada.tipoPersona,
          nombre: formData.personaDenunciada.nombre,
          apellidoPaterno: formData.personaDenunciada.apellidoPaterno,
          apellidoMaterno: formData.personaDenunciada.apellidoMaterno,
          descripcion: formData.personaDenunciada.descripcion,
        })
      );

      // 4. Crear ubicación del hecho
      const ubicacionHecho = await publicDirectus.request(
        createItem('ubicaciones_hechos', {
          lugarHecho: lugarHecho.id,
          personaDenunciada: personaDenunciada.id,
        })
      );

      // 5. Crear falta cometida
      const faltaCometida = await publicDirectus.request(
        createItem('falta_cometida', {
          faltaGrave: formData.faltaCometida.faltaGrave,
          faltaNoGrave: formData.faltaCometida.faltaNoGrave,
          hechosCorrupcion: formData.faltaCometida.hechosCorrupcion,
        })
      );

      // 6. Crear la denuncia principal
      const denuncia = await publicDirectus.request(
        createItem('denuncias', {
          status: 'PENDIENTE',
          narracionHechos: formData.narracionHechos,
          denunciante: denuncianteId,
          ubicacionHecho: ubicacionHecho.id,
          faltaCometida: faltaCometida.id,
        })
      );

      // 7. Si hay archivos de evidencia, crear las relaciones
      if (formData.archivosEvidencia && formData.archivosEvidencia.length > 0) {
        for (const fileId of formData.archivosEvidencia) {
          await publicDirectus.request(
            createItem('denuncias_files', {
              denuncias_id: denuncia.id,
              directus_files_id: fileId
            })
          );
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files`, {
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
            'id',          // El folio de la denuncia
            'status',      // El estado actual
            'date_created' // Campo automático de Directus
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
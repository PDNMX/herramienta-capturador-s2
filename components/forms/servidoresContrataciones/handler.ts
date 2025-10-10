import directus from "@/lib/directus";
import { createItem, updateItem, withToken } from "@directus/sdk";
import { ServidoresContratacionesFormValues } from "./schema";

export async function saveServidorContratacion(
  data: ServidoresContratacionesFormValues,
  initialData: any | null,
  accessToken: string
) {
  // Preparar los datos del registro principal
  const mainData = {
    entePublico: data.entePublico,
    fecha: data.fecha,
    ejercicio: data.ejercicio,
    datosGenerales: data.datosGenerales,
    empleoCargoComision: data.empleoCargoComision,
    tipoProcedimiento: data.tipoProcedimiento,
    tipoContratacion: data.tipoContratacion,
    contratacionAdquisiciones: data.contratacionAdquisiciones,
    obrasPublicas: data.obrasPublicas,
    otorgamientoConcesiones: data.otorgamientoConcesiones,
    enajenacionBienes: data.enajenacionBienes,
    dictaminacionAvaluos: data.dictaminacionAvaluos,
    observaciones: data.observaciones,
  };

  if (initialData) {
    // Actualizar registro existente
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "servidores_intervengan_procedimientos_contrataciones",
          initialData.id,
          mainData
        )
      )
    );
  } else {
    // Crear nuevo registro
    await directus.request(
      withToken(
        accessToken,
        createItem(
          "servidores_intervengan_procedimientos_contrataciones",
          mainData
        )
      )
    );
  }
}

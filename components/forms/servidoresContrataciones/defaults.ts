import { ServidoresContratacionesFormValues } from "./schema";

export function getServidoresContratacionesDefaults(
  initialData: any | null,
  userEntePublico?: string
): Partial<ServidoresContratacionesFormValues> {
  return {
    entePublico: initialData?.entePublico ?? userEntePublico ?? "",
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    ejercicio: initialData?.ejercicio ?? new Date().getFullYear().toString(),
    datosGenerales: initialData?.datosGenerales ?? "",
    empleoCargoComision: initialData?.empleoCargoComision ?? "",
    tipoProcedimiento: initialData?.tipoProcedimiento ?? undefined,
    procedimientosContratacion: initialData?.procedimientosContratacion ?? "",
    contratacionAdquisiciones: initialData?.contratacionAdquisiciones ?? "",
    obrasPublicas: initialData?.obrasPublicas ?? "",
    otorgamientoConcesion: initialData?.otorgamientoConcesion ?? "",
    enajenacionBien: initialData?.enajenacionBien ?? "",
    dictaminacionAvaluos: initialData?.dictaminacionAvaluos ?? "",
    observaciones: initialData?.observaciones ?? "",
  };
}

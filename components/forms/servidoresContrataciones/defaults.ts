import { ServidoresContratacionesFormValues } from "./schema";

export function getServidoresContratacionesDefaults(
  initialData: any | null,
  userEntePublico?: number
): Partial<ServidoresContratacionesFormValues> {
  return {
    entePublico: initialData?.entePublico ?? userEntePublico ?? 0,
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    ejercicio: initialData?.ejercicio ?? new Date().getFullYear().toString(),

    // Datos Generales (objeto)
    datosGenerales: initialData?.datosGenerales ?? undefined,

    // Empleo Cargo Comisión (objeto)
    empleoCargoComision: initialData?.empleoCargoComision ?? undefined,

    // Tipo de Procedimiento
    tipoProcedimiento: initialData?.tipoProcedimiento ?? undefined,

    // Tipo de Contratación (5.1)
    tipoContratacion: initialData?.tipoContratacion ?? undefined,

    // Contratación de Adquisiciones (5.1.1) - Array
    contratacionAdquisiciones: initialData?.contratacionAdquisiciones ?? [],

    // Obras Públicas (5.1.2) - Array
    obrasPublicas: initialData?.obrasPublicas ?? [],

    // Otorgamiento de Concesiones (5.2) - Array
    otorgamientoConcesiones: initialData?.otorgamientoConcesiones ?? [],

    // Enajenación de Bienes (5.3) - Array
    enajenacionBienes: initialData?.enajenacionBienes ?? [],

    // Dictaminación de Avalúos (5.4) - Array
    dictaminacionAvaluos: initialData?.dictaminacionAvaluos ?? [],

    // Observaciones
    observaciones: initialData?.observaciones ?? "",
  };
}

import * as z from "zod";

export const servidoresContratacionesSchema = z.object({
  // Campos generales
  entePublico: z.string().min(1, {
    message: "Ente público es requerido.",
  }),

  // Campo 1: Fecha
  fecha: z.string().min(1, {
    message: "La fecha es requerida.",
  }),

  // Campo 2: Ejercicio
  ejercicio: z.string().min(4, {
    message: "El ejercicio es requerido (4 dígitos).",
  }),

  // Campo 3: Datos generales de la persona servidora pública (relación)
  datosGenerales: z.string().optional(),

  // Campo 4: Empleo, cargo o comisión (relación)
  empleoCargoComision: z.string().optional(),

  // Campo 5: Tipo de procedimiento
  tipoProcedimiento: z
    .enum(
      [
        "CONTRATACION_PUBLICA",
        "OTORGAMIENTO_CONCECIONES",
        "ENAJENACION_BIENES",
        "DICTAMEN_VALUATORIO",
      ],
      {
        required_error: "Debe seleccionar un tipo de procedimiento",
      }
    )
    .optional(),

  // 5.1 Procedimientos de contratación (relación)
  procedimientosContratacion: z.string().optional(),

  // 5.1.1 Contratación de adquisiciones (relación)
  contratacionAdquisiciones: z.string().optional(),

  // 5.1.2 Obras públicas (relación)
  obrasPublicas: z.string().optional(),

  // 5.2 Otorgamiento de concesiones (relación)
  otorgamientoConcesion: z.string().optional(),

  // 5.3 Enajenación de bienes (relación)
  enajenacionBien: z.string().optional(),

  // 5.4 Dictaminación de avalúos (relación)
  dictaminacionAvaluos: z.string().optional(),

  // Campo 6: Observaciones
  observaciones: z.string().nullable().optional(),
});

export type ServidoresContratacionesFormValues = z.infer<
  typeof servidoresContratacionesSchema
>;

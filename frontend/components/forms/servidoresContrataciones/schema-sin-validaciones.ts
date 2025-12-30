import * as z from "zod";

/**
 * SCHEMA SIMPLIFICADO SIN VALIDACIONES ESTRICTAS
 *
 * Este schema se usa SOLO para probar la comunicación entre frontend y Directus
 * sin preocuparse por validaciones de formato (CURP, RFC, nombres sin números, etc.)
 *
 * Para usar este schema en lugar del original:
 * 1. Renombra schema.ts a schema-original.ts
 * 2. Renombra schema-sin-validaciones.ts a schema.ts
 * 3. Ejecuta tus pruebas
 * 4. Revierte los cambios cuando termines
 */

export const servidoresContratacionesSchema = z.object({
  // Campos generales (solo ejercicio requiere validación mínima)
  entePublico: z.number().optional(),
  fecha: z.string().optional(),
  ejercicio: z.string().optional(),

  // Datos generales - TODOS OPCIONALES, SIN VALIDACIONES DE FORMATO
  datosGenerales: z.object({
    nombre: z.string().optional(),
    primerApellido: z.string().optional(),
    segundoApellido: z.string().optional().or(z.literal("")),
    curp: z.string().optional(),  // Sin validación de formato
    rfc: z.string().optional(),   // Sin validación de formato
    sexo: z.enum(["HOMBRE", "MUJER"]).optional(),
  }).optional(),

  // Empleo, cargo o comisión - TODOS OPCIONALES
  empleoCargoComision: z.object({
    entidadFederativa: z.string().optional(),
    nivelOrdenGobierno: z.enum(["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"]).optional(),
    ambitoPublico: z.enum(["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"]).optional(),
    nombreEntePublico: z.string().optional(),
    siglasEntePublico: z.string().optional().or(z.literal("")),
    nivelJerarquico: z.enum([
      "OPERATIVO",
      "ENLACE",
      "JEFATURA_DEPARTAMENTO",
      "SUBDIRECCION_AREA",
      "DIRECCION_AREA",
      "DIRECCION_GENERAL",
      "JEFATURA_UNIDAD",
      "SUBSECRETARIA",
      "SECRETARIA",
      "OTRO"
    ]).optional(),
    nivelJerarquicoOtro: z.string().optional(),
    denominacion: z.string().optional(),
    areaAdscripcion: z.string().optional(),
  }).optional(),

  // Tipo de procedimiento
  tipoProcedimiento: z.enum([
    "CONTRATACION_PUBLICA",
    "OTORGAMIENTO_CONCECIONES",
    "ENAJENACION_BIENES",
    "DICTAMEN_VALUATORIO",
  ]).optional(),

  tipoContratacion: z.enum([
    "CONTRATACION_ADQUISICIONES",
    "CONTRATACION_OBRA"
  ]).optional(),

  // Contrataciones de adquisiciones
  contratacionAdquisiciones: z.array(z.object({
    tipoArea: z.array(z.string()).optional(),
    tipoAreaOtro: z.string().optional(),
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),
    numeroExpediente: z.string().optional(),
    tipoProcedimiento: z.string().optional(),
    tipoProcedimientoOtro: z.string().optional(),
    materia: z.string().optional(),
    materiaOtro: z.string().optional(),
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),
    razonSocial: z.string().optional(),
    nombreBeneficiario: z.string().optional(),
    primerApellidoBeneficiario: z.string().optional(),
    segundoApellidoBeneficiario: z.string().optional(),
    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // Obras públicas
  obrasPublicas: z.array(z.object({
    tipoArea: z.array(z.string()).optional(),
    tipoAreaOtro: z.string().optional(),
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),
    numeroExpediente: z.string().optional(),
    tipoProcedimiento: z.string().optional(),
    tipoProcedimientoOtro: z.string().optional(),
    materia: z.string().optional(),
    materiaOtro: z.string().optional(),
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),
    razonSocial: z.string().optional(),
    nombreBeneficiario: z.string().optional(),
    primerApellidoBeneficiario: z.string().optional(),
    segundoApellidoBeneficiario: z.string().optional(),
    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // Otorgamiento de concesiones
  otorgamientoConcesiones: z.array(z.object({
    tipoActoJuridico: z.array(z.string()).optional(),
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string().optional(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),
    numeroExpediente: z.string().optional(),
    denominacion: z.string().optional(),
    objeto: z.string().optional(),
    motivosFundamentos: z.string().optional(),
    nombrePersonaFisica: z.string().optional(),
    razonSocialPersonaMoral: z.string().optional(),
    sector: z.enum(["PUBLICO", "PRIVADO"]).optional(),
    fechaInicioVigencia: z.string().optional(),
    fechaConclusionVigencia: z.string().optional(),
    monto: z.string().optional(),
    hipervinculo: z.string().optional(),  // Sin validación de URL
    razonSocial: z.string().optional(),
    nombreBeneficiario: z.string().optional(),
    primerApellidoBeneficiario: z.string().optional(),
    segundoApellidoBeneficiario: z.string().optional(),
    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // Enajenación de bienes
  enajenacionBienes: z.array(z.object({
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string().optional(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),
    numeroExpediente: z.string().optional(),
    descripcion: z.string().optional(),  // Ya no es requerido
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),
    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // Dictaminación de avalúos
  dictaminacionAvaluos: z.array(z.object({
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string().optional(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),
    numeroExpediente: z.string().optional(),
    descripcion: z.string().optional(),  // Ya no es requerido
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),
    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // Observaciones
  observaciones: z.string().nullable().optional(),
});

export type ServidoresContratacionesFormValues = z.infer<
  typeof servidoresContratacionesSchema
>;

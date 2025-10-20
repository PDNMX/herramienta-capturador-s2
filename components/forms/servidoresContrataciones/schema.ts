import * as z from "zod";

// Regex para validación de CURP y RFC
const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
const RFC_REGEX = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;

export const servidoresContratacionesSchema = z.object({
  // Campos generales
  entePublico: z.number({
    required_error: "Ente público es requerido.",
  }),

  // Campo 1: Fecha*
  fecha: z.string().min(1, {
    message: "La fecha es requerida.",
  }),

  // Campo 2: Ejercicio*
  ejercicio: z.string().min(4, {
    message: "El ejercicio es requerido (4 dígitos).",
  }).max(4, {
    message: "El ejercicio debe tener exactamente 4 dígitos.",
  }),

  // Campo 3: Datos generales de la persona servidora pública*
  datosGenerales: z.object({
    nombre: z.string().min(1, { message: "El nombre es obligatorio." }),
    primerApellido: z.string().min(1, { message: "El primer apellido es obligatorio." }),
    segundoApellido: z.string().optional(),
    curp: z.string()
      .min(1, { message: "La CURP es obligatoria." })
      .regex(CURP_REGEX, { message: "Formato de CURP inválido." }),
    rfc: z.string()
      .min(1, { message: "El RFC con homoclave es obligatorio." })
      .regex(RFC_REGEX, { message: "Formato de RFC inválido." }),
    sexo: z.enum(["HOMBRE", "MUJER"], {
      required_error: "El sexo es obligatorio.",
    }),
  }).optional(),

  // Campo 4: Empleo, cargo o comisión*
  empleoCargoComision: z.object({
    entidadFederativa: z.string().min(1, { message: "La entidad federativa es obligatoria." }),
    nivelOrdenGobierno: z.enum(["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"], {
      required_error: "El nivel/orden de gobierno es obligatorio.",
    }),
    ambitoPublico: z.enum(["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"], {
      required_error: "El ámbito público es obligatorio.",
    }),
    nombreEntePublico: z.string().min(1, { message: "El nombre del ente público es obligatorio." }),
    siglasEntePublico: z.string().optional(),
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
    ], {
      required_error: "El nivel jerárquico es obligatorio.",
    }),
    nivelJerarquicoOtro: z.string().optional(),
    denominacion: z.string().min(1, { message: "La denominación del empleo es obligatoria." }),
    areaAdscripcion: z.string().min(1, { message: "El área de adscripción es obligatoria." }),
  }).optional(),

  // Campo 5: Tipo de procedimiento*
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

  // 5.1 Tipo de contratación pública* (solo si tipoProcedimiento === CONTRATACION_PUBLICA)
  tipoContratacion: z.enum([
    "CONTRATACION_ADQUISICIONES",
    "CONTRATACION_OBRA"
  ]).optional(),

  // 5.1.1 Contratación de adquisiciones*
  contratacionAdquisiciones: z.array(z.object({
    tipoArea: z.array(z.enum([
      "AREA_REQUIRENTE",
      "AREA_SUPERVISORA",
      "AREA_CONTRATANTE",
      "AREA_TECNICA",
      "INTEGRANTE_COMITE",
      "ORGANO_REVISION",
      "PARTICIPANTE_JUNTA",
      "OTRO"
    ])).optional(),
    tipoAreaOtro: z.string().optional(),

    // Niveles de responsabilidad para cada objeto
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),

    // Datos generales del procedimiento
    numeroExpediente: z.string().optional(),
    tipoProcedimiento: z.enum([
      "LICITACION_PUBLICA_NACIONAL",
      "LICITACION_PUBLICA_INTERNACIONAL",
      "INVITACION_TRES_PERSONAS",
      "ADJUDICACION_DIRECTA",
      "OTRO"
    ]).optional(),
    tipoProcedimientoOtro: z.string().optional(),
    materia: z.enum([
      "ARRENDAMIENTO",
      "ADQUISICION",
      "SERVICIOS",
      "OTRO"
    ]).optional(),
    materiaOtro: z.string().optional(),
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),

    // Datos persona beneficiaria (solo para persona moral)
    razonSocial: z.string().optional(),
    nombreBeneficiario: z.string().optional(),
    primerApellidoBeneficiario: z.string().optional(),
    segundoApellidoBeneficiario: z.string().optional(),

    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // 5.1.2 Obras públicas*
  obrasPublicas: z.array(z.object({
    tipoArea: z.array(z.enum([
      "AREA_RESPONSABLE_EJECUCION",
      "AREA_RESPONSABLE_CONTRATACION",
      "AREA_TECNICA",
      "AREA_REQUIRENTE",
      "INTEGRANTE_COMITE",
      "ORGANO_REVISION",
      "PARTICIPANTE_JUNTA",
      "OTRO"
    ])).optional(),
    tipoAreaOtro: z.string().optional(),

    // Niveles de responsabilidad
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),

    // Datos generales del procedimiento
    numeroExpediente: z.string().optional(),
    tipoProcedimiento: z.enum([
      "LICITACION_PUBLICA_NACIONAL",
      "LICITACION_PUBLICA_INTERNACIONAL",
      "INVITACION_TRES_PERSONAS",
      "ADJUDICACION_DIRECTA",
      "OTRO"
    ]).optional(),
    tipoProcedimientoOtro: z.string().optional(),
    materia: z.enum([
      "OBRA_PUBLICA",
      "SERVICIOS_RELACIONADOS",
      "OTRO"
    ]).optional(),
    materiaOtro: z.string().optional(),
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),

    // Datos persona beneficiaria
    razonSocial: z.string().optional(),
    nombreBeneficiario: z.string().optional(),
    primerApellidoBeneficiario: z.string().optional(),
    segundoApellidoBeneficiario: z.string().optional(),

    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // 5.2 Otorgamiento de concesiones*
  otorgamientoConcesiones: z.array(z.object({
    tipoActoJuridico: z.array(z.enum([
      "CONCESIONES",
      "LICENCIAS",
      "PERMISOS",
      "AUTORIZACIONES"
    ])).optional(),

    // Niveles de responsabilidad
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),

    // Datos generales del procedimiento
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
    hipervinculo: z.string().optional(),

    // Datos persona beneficiaria
    razonSocial: z.string().optional(),
    nombreBeneficiario: z.string().optional(),
    primerApellidoBeneficiario: z.string().optional(),
    segundoApellidoBeneficiario: z.string().optional(),

    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // 5.3 Enajenación de bienes*
  enajenacionBienes: z.array(z.object({
    // Niveles de responsabilidad
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),

    // Datos generales del procedimiento
    numeroExpediente: z.string().optional(),
    descripcion: z.string().optional(),
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),

    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // 5.4 Dictaminación de avalúos*
  dictaminacionAvaluos: z.array(z.object({
    // Niveles de responsabilidad
    responsabilidades: z.array(z.object({
      identificador: z.number(),
      objetoResponsabilidad: z.string(),
      elaborar: z.boolean().optional(),
      revisar: z.boolean().optional(),
      firmarAutorizar: z.boolean().optional(),
      supervisar: z.boolean().optional(),
      emitirSuscribir: z.boolean().optional(),
    })).optional(),

    // Datos generales del procedimiento
    numeroExpediente: z.string().optional(),
    descripcion: z.string().optional(),
    fechaInicio: z.string().optional(),
    fechaConclusion: z.string().optional(),

    continuaParticipando: z.boolean().optional(),
  })).optional(),

  // Campo 6: Observaciones
  observaciones: z.string().nullable().optional(),
});

export type ServidoresContratacionesFormValues = z.infer<
  typeof servidoresContratacionesSchema
>;

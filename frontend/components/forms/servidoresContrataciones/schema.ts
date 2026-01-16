import * as z from "zod";

// Regex para validación de CURP y RFC
const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
const RFC_REGEX = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;

// Regex para validación de campos sin números
// Permite: letras (con tildes, ñ), espacios y signos de puntuación comunes
const NO_NUMEROS_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,;:\-()\/]+$/;

// Regex para validación de solo números enteros positivos
const SOLO_NUMEROS_REGEX = /^\d+$/;

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
  ejercicio: z
    .string()
    .min(1, { message: "El ejercicio es requerido." })
    .regex(SOLO_NUMEROS_REGEX, {
      message: "El ejercicio solo debe contener números.",
    })
    .refine((val) => val.length === 4, {
      message: "El ejercicio debe tener exactamente 4 dígitos.",
    })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0;
      },
      {
        message: "El ejercicio debe ser un número entero positivo válido.",
      }
    ),

  // Campo 3: Datos generales de la persona servidora pública*
  datosGenerales: z.object({
    nombre: z
      .string()
      .min(1, { message: "El nombre es obligatorio." })
      .regex(NO_NUMEROS_REGEX, {
        message: "El nombre no debe contener números.",
      }),
    primerApellido: z
      .string()
      .min(1, { message: "El primer apellido es obligatorio." })
      .regex(NO_NUMEROS_REGEX, {
        message: "El primer apellido no debe contener números.",
      }),
    segundoApellido: z
      .string()
      .regex(NO_NUMEROS_REGEX, {
        message: "El segundo apellido no debe contener números.",
      })
      .optional()
      .or(z.literal("")),
    curp: z
      .string()
      .min(1, { message: "La CURP es obligatoria." })
      .regex(CURP_REGEX, { message: "Formato de CURP inválido." }),
    rfc: z
      .string()
      .min(1, { message: "El RFC con homoclave es obligatorio." })
      .regex(RFC_REGEX, { message: "Formato de RFC inválido." }),
    sexo: z.enum(["HOMBRE", "MUJER"], {
      required_error: "El sexo es obligatorio.",
    }),
  }, {
    required_error: "Los datos generales de la persona servidora pública son obligatorios.",
  }),

  // Campo 4: Empleo, cargo o comisión*
  empleoCargoComision: z.object({
    entidadFederativa: z
      .string()
      .min(1, { message: "La entidad federativa es obligatoria." }),
    nivelOrdenGobierno: z.enum(["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"], {
      required_error: "El nivel/orden de gobierno es obligatorio.",
    }),
    ambitoPublico: z.enum(
      ["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"],
      {
        required_error: "El ámbito público es obligatorio.",
      }
    ),
    nombreEntePublico: z
      .string()
      .min(1, { message: "El nombre del ente público es obligatorio." })
      .regex(NO_NUMEROS_REGEX, {
        message:
          "El nombre del ente público no debe contener números ni caracteres especiales.",
      }),
    siglasEntePublico: z
      .string()
      .regex(NO_NUMEROS_REGEX, {
        message:
          "Las siglas del ente público no deben contener números ni caracteres especiales.",
      })
      .optional()
      .or(z.literal("")),
    nivelJerarquico: z.enum(
      [
        "OPERATIVO",
        "ENLACE",
        "JEFATURA_DEPARTAMENTO",
        "SUBDIRECCION_AREA",
        "DIRECCION_AREA",
        "DIRECCION_GENERAL",
        "JEFATURA_UNIDAD",
        "SUBSECRETARIA",
        "SECRETARIA",
        "OTRO",
      ],
      {
        required_error: "El nivel jerárquico es obligatorio.",
      }
    ),
    nivelJerarquicoOtro: z.string().optional(),
    denominacion: z
      .string()
      .min(1, { message: "La denominación del empleo es obligatoria." })
      .regex(NO_NUMEROS_REGEX, {
        message: "La denominación del empleo no debe contener números.",
      }),
    areaAdscripcion: z
      .string()
      .min(1, { message: "El área de adscripción es obligatoria." })
      .regex(NO_NUMEROS_REGEX, {
        message: "El área de adscripción no debe contener números.",
      }),
  }, {
    required_error: "Los datos del empleo, cargo o comisión son obligatorios.",
  }),

  // Campo 5: Tipo de procedimiento*
  tipoProcedimiento: z.enum(
    [
      "CONTRATACION_PUBLICA",
      "OTORGAMIENTO_CONCECIONES",
      "ENAJENACION_BIENES",
      "DICTAMEN_VALUATORIO",
    ],
    {
      required_error: "Este campo es obligatorio",
    }
  ),

  // 5.1 Tipo de contratación pública* (solo si tipoProcedimiento === CONTRATACION_PUBLICA)
  tipoContratacion: z
    .enum(["CONTRATACION_ADQUISICIONES", "CONTRATACION_OBRA"])
    .optional(),

  // 5.1.1 Contratación de adquisiciones*
  contratacionAdquisiciones: z
    .array(
      z.object({
        tipoArea: z
          .array(
            z.enum([
              "AREA_REQUIRENTE",
              "AREA_SUPERVISORA",
              "AREA_CONTRATANTE",
              "AREA_TECNICA",
              "INTEGRANTE_COMITE",
              "ORGANO_REVISION",
              "PARTICIPANTE_JUNTA",
              "OTRO",
            ])
          )
          .optional(),
        tipoAreaOtro: z.string().optional().or(z.literal("")),

        // Niveles de responsabilidad para cada objeto
        responsabilidades: z
          .array(
            z.object({
              identificador: z.number(),
              objetoResponsabilidad: z.string(),
              elaborar: z.boolean().optional(),
              revisar: z.boolean().optional(),
              firmarAutorizar: z.boolean().optional(),
              supervisar: z.boolean().optional(),
              emitirSuscribir: z.boolean().optional(),
            })
          )
          .optional(),

        // Datos generales del procedimiento
        numeroExpediente: z.string().optional(),
        tipoProcedimiento: z
          .enum([
            "LICITACION_PUBLICA_NACIONAL",
            "LICITACION_PUBLICA_INTERNACIONAL",
            "INVITACION_TRES_PERSONAS",
            "ADJUDICACION_DIRECTA",
            "OTRO",
          ])
          .optional()
          .or(z.literal("")),
        tipoProcedimientoOtro: z.string().optional().or(z.literal("")),
        materia: z
          .enum(["ARRENDAMIENTO", "ADQUISICION", "SERVICIOS", "OTRO"])
          .optional()
          .or(z.literal("")),
        materiaOtro: z.string().optional().or(z.literal("")),
        fechaInicio: z.string().optional(),
        fechaConclusion: z.string().optional(),

        // Datos persona beneficiaria (solo para persona moral)
        razonSocial: z.string().optional(),
        nombreBeneficiario: z.string().optional(),
        primerApellidoBeneficiario: z.string().optional(),
        segundoApellidoBeneficiario: z.string().optional(),

        continuaParticipando: z.boolean().optional().or(z.literal(false)),
      })
    )
    .optional(),

  // 5.1.2 Obras públicas*
  obrasPublicas: z
    .array(
      z.object({
        tipoArea: z
          .array(
            z.enum([
              "AREA_RESPONSABLE_EJECUCION",
              "AREA_RESPONSABLE_CONTRATACION",
              "AREA_TECNICA",
              "AREA_REQUIRENTE",
              "INTEGRANTE_COMITE",
              "ORGANO_REVISION",
              "PARTICIPANTE_JUNTA",
              "OTRO",
            ])
          )
          .optional(),
        tipoAreaOtro: z.string().optional().or(z.literal("")),

        // Niveles de responsabilidad
        responsabilidades: z
          .array(
            z.object({
              identificador: z.number(),
              objetoResponsabilidad: z.string(),
              elaborar: z.boolean().optional(),
              revisar: z.boolean().optional(),
              firmarAutorizar: z.boolean().optional(),
              supervisar: z.boolean().optional(),
              emitirSuscribir: z.boolean().optional(),
            })
          )
          .optional(),

        // Datos generales del procedimiento
        numeroExpediente: z.string().optional(),
        tipoProcedimiento: z
          .enum([
            "LICITACION_PUBLICA_NACIONAL",
            "LICITACION_PUBLICA_INTERNACIONAL",
            "INVITACION_TRES_PERSONAS",
            "ADJUDICACION_DIRECTA",
            "OTRO",
          ])
          .optional()
          .or(z.literal("")),
        tipoProcedimientoOtro: z.string().optional().or(z.literal("")),
        materia: z
          .enum(["OBRA_PUBLICA", "SERVICIOS_RELACIONADOS", "OTRO"])
          .optional()
          .or(z.literal("")),
        materiaOtro: z.string().optional().or(z.literal("")),
        fechaInicio: z.string().optional(),
        fechaConclusion: z.string().optional(),

        // Datos persona beneficiaria
        razonSocial: z.string().optional(),
        nombreBeneficiario: z.string().optional(),
        primerApellidoBeneficiario: z.string().optional(),
        segundoApellidoBeneficiario: z.string().optional(),

        continuaParticipando: z.boolean().optional().or(z.literal(false)),
      })
    )
    .optional(),

  // 5.2 Otorgamiento de concesiones*
  otorgamientoConcesiones: z
    .array(
      z.object({
        tipoActoJuridico: z
          .array(
            z.enum(["CONCESIONES", "LICENCIAS", "PERMISOS", "AUTORIZACIONES"])
          )
          .optional(),

        // Niveles de responsabilidad
        responsabilidades: z
          .array(
            z.object({
              identificador: z.number(),
              objetoResponsabilidad: z.string().optional(),
              elaborar: z.boolean().optional(),
              revisar: z.boolean().optional(),
              firmarAutorizar: z.boolean().optional(),
              supervisar: z.boolean().optional(),
              emitirSuscribir: z.boolean().optional(),
            })
          )
          .optional(),

        // Datos generales del procedimiento
        numeroExpediente: z.string().optional(),
        denominacion: z.string().optional(),
        objeto: z.string().optional(),
        motivosFundamentos: z.string().optional(),
        nombrePersonaFisica: z.string().optional(),
        razonSocialPersonaMoral: z.string().optional(),
        sector: z.enum(["PUBLICO", "PRIVADO"]).optional().or(z.literal("")),
        fechaInicioVigencia: z.string().optional(),
        fechaConclusionVigencia: z.string().optional(),
        monto: z.string().optional(),
        hipervinculo: z
          .string()
          .url({
            message: "Debe ingresar una URL válida (ej: https://ejemplo.com)",
          })
          .optional()
          .or(z.literal("")),

        // Datos persona beneficiaria
        razonSocial: z.string().optional(),
        nombreBeneficiario: z.string().optional(),
        primerApellidoBeneficiario: z.string().optional(),
        segundoApellidoBeneficiario: z.string().optional(),

        continuaParticipando: z.boolean().optional().or(z.literal(false)),
      })
    )
    .optional(),

  // 5.3 Enajenación de bienes*
  enajenacionBienes: z
    .array(
      z.object({
        // Niveles de responsabilidad
        responsabilidades: z
          .array(
            z.object({
              identificador: z.number(),
              objetoResponsabilidad: z.string().optional(),
              elaborar: z.boolean().optional(),
              revisar: z.boolean().optional(),
              firmarAutorizar: z.boolean().optional(),
              supervisar: z.boolean().optional(),
              emitirSuscribir: z.boolean().optional(),
            })
          )
          .optional(),

        // Datos generales del procedimiento
        numeroExpediente: z.string().optional(),
        descripcion: z.string().optional(),
        fechaInicio: z.string().optional(),
        fechaConclusion: z.string().optional(),

        continuaParticipando: z.boolean().optional().or(z.literal(false)),
      })
    )
    .optional(),

  // 5.4 Dictaminación de avalúos*
  dictaminacionAvaluos: z
    .array(
      z.object({
        // Niveles de responsabilidad
        responsabilidades: z
          .array(
            z.object({
              identificador: z.number(),
              objetoResponsabilidad: z.string().optional(),
              elaborar: z.boolean().optional(),
              revisar: z.boolean().optional(),
              firmarAutorizar: z.boolean().optional(),
              supervisar: z.boolean().optional(),
              emitirSuscribir: z.boolean().optional(),
            })
          )
          .optional(),

        // Datos generales del procedimiento
        numeroExpediente: z.string().optional(),
        descripcion: z.string().optional(),
        fechaInicio: z.string().optional(),
        fechaConclusion: z.string().optional(),

        continuaParticipando: z.boolean().optional().or(z.literal(false)),
      })
    )
    .optional(),

  // Campo 6: Observaciones
  observaciones: z.string().nullable().optional(),
}).refine(
  (data) => {
    // Validar que según el tipo de procedimiento, al menos la subsección correspondiente tenga datos

    // Si no hay tipo de procedimiento, no validar (ya se marcó como requerido arriba)
    if (!data.tipoProcedimiento) {
      return true;
    }

    // Validar CONTRATACION_PUBLICA
    if (data.tipoProcedimiento === "CONTRATACION_PUBLICA") {
      // Debe tener tipo de contratación
      if (!data.tipoContratacion) {
        return false;
      }

      // Validar que la subsección correspondiente tenga al menos un registro con datos
      if (data.tipoContratacion === "CONTRATACION_ADQUISICIONES") {
        const tieneAdquisiciones = data.contratacionAdquisiciones &&
                                   data.contratacionAdquisiciones.length > 0 &&
                                   data.contratacionAdquisiciones.some(item =>
                                     item.numeroExpediente ||
                                     (item.tipoArea && item.tipoArea.length > 0) ||
                                     item.responsabilidades?.some(r => r.elaborar || r.revisar || r.firmarAutorizar || r.supervisar || r.emitirSuscribir)
                                   );
        return tieneAdquisiciones;
      }

      if (data.tipoContratacion === "CONTRATACION_OBRA") {
        const tieneObras = data.obrasPublicas &&
                          data.obrasPublicas.length > 0 &&
                          data.obrasPublicas.some(item =>
                            item.numeroExpediente ||
                            (item.tipoArea && item.tipoArea.length > 0) ||
                            item.responsabilidades?.some(r => r.elaborar || r.revisar || r.firmarAutorizar || r.supervisar || r.emitirSuscribir)
                          );
        return tieneObras;
      }
    }

    // Validar OTORGAMIENTO_CONCECIONES
    if (data.tipoProcedimiento === "OTORGAMIENTO_CONCECIONES") {
      const tieneConcesiones = data.otorgamientoConcesiones &&
                               data.otorgamientoConcesiones.length > 0 &&
                               data.otorgamientoConcesiones.some(item =>
                                 item.numeroExpediente ||
                                 item.denominacion ||
                                 (item.tipoActoJuridico && item.tipoActoJuridico.length > 0) ||
                                 item.responsabilidades?.some(r => r.elaborar || r.revisar || r.firmarAutorizar || r.supervisar || r.emitirSuscribir)
                               );
      return tieneConcesiones;
    }

    // Validar ENAJENACION_BIENES
    if (data.tipoProcedimiento === "ENAJENACION_BIENES") {
      const tieneEnajenacion = data.enajenacionBienes &&
                               data.enajenacionBienes.length > 0 &&
                               data.enajenacionBienes.some(item =>
                                 item.numeroExpediente ||
                                 item.descripcion ||
                                 item.responsabilidades?.some(r => r.elaborar || r.revisar || r.firmarAutorizar || r.supervisar || r.emitirSuscribir)
                               );
      return tieneEnajenacion;
    }

    // Validar DICTAMEN_VALUATORIO
    if (data.tipoProcedimiento === "DICTAMEN_VALUATORIO") {
      const tieneAvaluos = data.dictaminacionAvaluos &&
                          data.dictaminacionAvaluos.length > 0 &&
                          data.dictaminacionAvaluos.some(item =>
                            item.numeroExpediente ||
                            item.descripcion ||
                            item.responsabilidades?.some(r => r.elaborar || r.revisar || r.firmarAutorizar || r.supervisar || r.emitirSuscribir)
                          );
      return tieneAvaluos;
    }

    return true;
  },
  {
    message: "Debe completar al menos la subsección correspondiente al tipo de procedimiento seleccionado (5.1, 5.2, 5.3 o 5.4) con al menos un registro válido.",
  }
);

export type ServidoresContratacionesFormValues = z.infer<
  typeof servidoresContratacionesSchema
>;

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
    contratacionAdquisiciones: initialData?.contratacionAdquisiciones ?? [
      {
        tipoArea: [],
        tipoAreaOtro: "",
        responsabilidades: [
          {
            identificador: 1,
            objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de contratación",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 2,
            objetoResponsabilidad: "Justificación para excepción a la licitación pública",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 3,
            objetoResponsabilidad: "Convocatoria, invitación o solicitud de cotización y, en su caso, bases del concurso y modificaciones",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 4,
            objetoResponsabilidad: "Evaluación de proposiciones",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 5,
            objetoResponsabilidad: "Adjudicación del contrato",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 6,
            objetoResponsabilidad: "Formalización del contrato",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 7,
            objetoResponsabilidad: "",  // "Otro (Especifique)" - se llena dinámicamente
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
        ],
        numeroExpediente: "",
        tipoProcedimiento: "",
        tipoProcedimientoOtro: "",
        materia: "",
        materiaOtro: "",
        fechaInicio: "",
        fechaConclusion: "",
        monto: "",
        razonSocial: "",
        nombreBeneficiario: "",
        primerApellidoBeneficiario: "",
        segundoApellidoBeneficiario: "",
        continuaParticipando: false,
      }
    ],

    // Obras Públicas (5.1.2) - Array
    obrasPublicas: initialData?.obrasPublicas ?? [
      {
        tipoArea: [],
        tipoAreaOtro: "",
        responsabilidades: [
          {
            identificador: 1,
            objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de contratación",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 2,
            objetoResponsabilidad: "Justificación para excepción a la licitación pública",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 3,
            objetoResponsabilidad: "Convocatoria, invitación o solicitud de cotización y, en su caso, bases del concurso y modificaciones",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 4,
            objetoResponsabilidad: "Evaluación de proposiciones",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 5,
            objetoResponsabilidad: "Adjudicación del contrato",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 6,
            objetoResponsabilidad: "Formalización del contrato",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 7,
            objetoResponsabilidad: "",  // "Otro (Especifique)" - se llena dinámicamente
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
        ],
        numeroExpediente: "",
        tipoProcedimiento: "",
        tipoProcedimientoOtro: "",
        materia: "",
        materiaOtro: "",
        fechaInicio: "",
        fechaConclusion: "",
        monto: "",
        razonSocial: "",
        nombreBeneficiario: "",
        primerApellidoBeneficiario: "",
        segundoApellidoBeneficiario: "",
        continuaParticipando: false,
      }
    ],

    // Otorgamiento de Concesiones (5.2) - Array
    otorgamientoConcesiones: initialData?.otorgamientoConcesiones ?? [
      {
        tipoActoJuridico: [],
        responsabilidades: [
          {
            identificador: 1,
            objetoResponsabilidad: "Convocatoria a concurso, licitación o excitativa a presentar la solicitud de autorización.",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 2,
            objetoResponsabilidad: "Dictámenes u opiniones previos.",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 3,
            objetoResponsabilidad: "Visitas de verificación.",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 4,
            objetoResponsabilidad: "Evaluación del cumplimiento de los requisitos para el otorgamiento de la concesión, licencia, autorización, permiso, o sus prórrogas.",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 5,
            objetoResponsabilidad: "Determinación sobre el otorgamiento de la concesión, licencia, autorización, permiso o sus prórrogas.",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 6,
            objetoResponsabilidad: "",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
        ],
        numeroExpediente: "",
        denominacion: "",
        objeto: "",
        motivosFundamentos: "",
        nombrePersonaFisica: "",
        razonSocialPersonaMoral: "",
        sector: "",
        fechaInicioVigencia: "",
        fechaConclusionVigencia: "",
        monto: "",
        hipervinculo: "",
        razonSocial: "",
        nombreBeneficiario: "",
        primerApellidoBeneficiario: "",
        segundoApellidoBeneficiario: "",
        continuaParticipando: false,
      }
    ],

    // Enajenación de Bienes (5.3) - Array
    // NOTA: Según EnajenacionBienesSection.tsx hay 8 responsabilidades
    enajenacionBienes: initialData?.enajenacionBienes ?? [
      {
        responsabilidades: [
          {
            identificador: 1,
            objetoResponsabilidad: "Elaboración del avalúo para determinar el valor de los bienes muebles",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 2,
            objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de enajenación de bienes muebles",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 3,
            objetoResponsabilidad: "Justificación para excepción a la licitación pública",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 4,
            objetoResponsabilidad: "Convocatoria, invitación o solicitud de cotización y, en su caso, bases del concurso y modificaciones",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 5,
            objetoResponsabilidad: "Evaluación de proposiciones",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 6,
            objetoResponsabilidad: "Adjudicación",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 7,
            objetoResponsabilidad: "Formalización",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 8,
            objetoResponsabilidad: "",  // "Otro (Especifique)" - se llena dinámicamente
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
        ],
        numeroExpediente: "",
        descripcion: "",
        fechaInicio: "",
        fechaConclusion: "",
        continuaParticipando: false,
      }
    ],

    // Dictaminación de Avalúos (5.4) - Array
    dictaminacionAvaluos: initialData?.dictaminacionAvaluos ?? [
      {
        responsabilidades: [
          {
            identificador: 1,
            objetoResponsabilidad: "Elaboración del avalúo",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 2,
            objetoResponsabilidad: "Validación del avalúo",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 3,
            objetoResponsabilidad: "Dictaminación del avalúo",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 4,
            objetoResponsabilidad: "",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
        ],
        numeroExpediente: "",
        descripcion: "",
        fechaInicio: "",
        fechaConclusion: "",
        continuaParticipando: false,
      }
    ],

    // Observaciones
    observaciones: initialData?.observaciones ?? "",
  };
}

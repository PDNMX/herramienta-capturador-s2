import { ServidoresContratacionesFormValues } from "./schema";

// Mapeo inverso: de valores de BD a valores del formulario
function mapNivelJerarquicoFromDB(claveBD: string): string | undefined {
  const mapInverso: Record<string, string> = {
    "OPERATIVO_HOMOLOGO": "OPERATIVO",
    "ENLACE_HOMOLOGO": "ENLACE",
    "JEFATURA_DEPTO_HOMOLOGO": "JEFATURA_DEPARTAMENTO",
    "SUBDIRECCION_HOMOLOGO": "SUBDIRECCION_AREA",
    "DIRECCION_HOMOLOGO": "DIRECCION_AREA",
    "DG_HOMOLOGO": "DIRECCION_GENERAL",
    "JEFATURA_UNIDAD_HOMOLOGO": "JEFATURA_UNIDAD",
    "SUBSECRETARIA_HOMOLOGO": "SUBSECRETARIA",
    "SECRETARIA_HOMOLOGO": "SECRETARIA",
    "OTRO": "OTRO"
  };
  return mapInverso[claveBD] || "OTRO";
}

// Mapear responsabilidades de avalúos desde BD al formato del formulario
function mapAvaluosResponsabilidades(nivelesResp: any): any[] {
  console.log("=== mapAvaluosResponsabilidades ===");
  console.log("Datos recibidos:", nivelesResp);

  if (!nivelesResp || typeof nivelesResp !== 'object') {
    console.log("No hay datos de responsabilidades, usando defaults");
    return [
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
    ];
  }

  // El handler guarda en campos con las claves correctas:
  // "elaboración_del_avalúo", "validación_del_avalúo", "dictaminación_del_avalúo", "otro"

  const getValoresFromJSON = (campo: any) => {
    if (!campo || typeof campo !== 'object') {
      return {
        elaborar: false,
        revisar: false,
        firmarAutorizar: false,
        supervisar: false,
        emitirSuscribir: false
      };
    }
    // Si es un objeto JSON, asegurar que tenga todas las propiedades
    return {
      elaborar: campo.elaborar || false,
      revisar: campo.revisar || false,
      firmarAutorizar: campo.firmarAutorizar || false,
      supervisar: campo.supervisar || false,
      emitirSuscribir: campo.emitirSuscribir || false
    };
  };

  console.log("Campos disponibles en nivelesResp:", Object.keys(nivelesResp));

  const result = [
    {
      identificador: 1,
      objetoResponsabilidad: "Elaboración del avalúo",
      ...getValoresFromJSON(nivelesResp.elaboración_del_avalúo),
    },
    {
      identificador: 2,
      objetoResponsabilidad: "Validación del avalúo",
      ...getValoresFromJSON(nivelesResp.validación_del_avalúo),
    },
    {
      identificador: 3,
      objetoResponsabilidad: "Dictaminación del avalúo",
      ...getValoresFromJSON(nivelesResp.dictaminación_del_avalúo),
    },
    {
      identificador: 4,
      objetoResponsabilidad: "",
      ...getValoresFromJSON(nivelesResp.otro),
    },
  ];

  console.log("Responsabilidades mapeadas:", result);
  return result;
}

// Mapear responsabilidades de contrataciones desde BD (array de letras) al formato del formulario (booleanos)
function mapContratacionesResponsabilidades(nivelesResp: any): any[] {
  console.log("=== mapContratacionesResponsabilidades ===");
  console.log("Datos recibidos:", nivelesResp);

  if (!nivelesResp || typeof nivelesResp !== 'object') {
    console.log("No hay datos de responsabilidades, usando defaults");
    return [
      { identificador: 1, objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de contratación", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 2, objetoResponsabilidad: "Justificación para excepción a la licitación pública", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 3, objetoResponsabilidad: "Convocatoria, invitación o solicitud de cotización y, en su caso, bases del concurso y modificaciones", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 4, objetoResponsabilidad: "Evaluación de proposiciones", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 5, objetoResponsabilidad: "Adjudicación del contrato", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 6, objetoResponsabilidad: "Formalización del contrato", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 7, objetoResponsabilidad: "", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
    ];
  }

  // Convertir array de letras ["A", "B", "C"] a booleanos
  const arrayToBoolean = (arr: string[] | null): any => {
    if (!arr || !Array.isArray(arr)) {
      return { elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false };
    }
    return {
      elaborar: arr.includes("A"),
      revisar: arr.includes("B"),
      firmarAutorizar: arr.includes("C"),
      supervisar: arr.includes("D"),
      emitirSuscribir: arr.includes("E"),
    };
  };

  const result = [
    { identificador: 1, objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de contratación", ...arrayToBoolean(nivelesResp.autorizacion) },
    { identificador: 2, objetoResponsabilidad: "Justificación para excepción a la licitación pública", ...arrayToBoolean(nivelesResp.justificacion) },
    { identificador: 3, objetoResponsabilidad: "Convocatoria, invitación o solicitud de cotización y, en su caso, bases del concurso y modificaciones", ...arrayToBoolean(nivelesResp.convocatoria) },
    { identificador: 4, objetoResponsabilidad: "Evaluación de proposiciones", ...arrayToBoolean(nivelesResp.evaluacion) },
    { identificador: 5, objetoResponsabilidad: "Adjudicación del contrato", ...arrayToBoolean(nivelesResp.adjudicacion) },
    { identificador: 6, objetoResponsabilidad: "Formalización del contrato", ...arrayToBoolean(nivelesResp.formalizacion) },
    { identificador: 7, objetoResponsabilidad: "", ...arrayToBoolean(null) },
  ];

  console.log("Responsabilidades mapeadas:", result);
  return result;
}

// Mapear responsabilidades de concesiones desde BD (array de letras) al formato del formulario (booleanos)
function mapConcesionesResponsabilidades(nivelesResp: any): any[] {
  console.log("=== mapConcesionesResponsabilidades ===");
  console.log("Datos recibidos:", nivelesResp);

  if (!nivelesResp || typeof nivelesResp !== 'object') {
    console.log("No hay datos de responsabilidades, usando defaults");
    return [
      { identificador: 1, objetoResponsabilidad: "Convocatoria a concurso, licitación o excitativa a presentar la solicitud de autorización.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 2, objetoResponsabilidad: "Dictámenes u opiniones previos.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 3, objetoResponsabilidad: "Visitas de verificación.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 4, objetoResponsabilidad: "Evaluación del cumplimiento de los requisitos legales para su otorgamiento.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 5, objetoResponsabilidad: "Determinación sobre el otorgamiento, modificación, prórroga, suspensión, extinción, revocación y caducidad del acto jurídico.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 6, objetoResponsabilidad: "", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
    ];
  }

  // Convertir array de letras ["A", "B", "C"] a booleanos
  const arrayToBoolean = (arr: string[] | null): any => {
    if (!arr || !Array.isArray(arr)) {
      return { elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false };
    }
    return {
      elaborar: arr.includes("A"),
      revisar: arr.includes("B"),
      firmarAutorizar: arr.includes("C"),
      supervisar: arr.includes("D"),
      emitirSuscribir: arr.includes("E"),
    };
  };

  const result = [
    { identificador: 1, objetoResponsabilidad: "Convocatoria a concurso, licitación o excitativa a presentar la solicitud de autorización.", ...arrayToBoolean(nivelesResp.convocatoria) },
    { identificador: 2, objetoResponsabilidad: "Dictámenes u opiniones previos.", ...arrayToBoolean(nivelesResp.dictamenes) },
    { identificador: 3, objetoResponsabilidad: "Visitas de verificación.", ...arrayToBoolean(nivelesResp.visitas) },
    { identificador: 4, objetoResponsabilidad: "Evaluación del cumplimiento de los requisitos legales para su otorgamiento.", ...arrayToBoolean(nivelesResp.evaluacion) },
    { identificador: 5, objetoResponsabilidad: "Determinación sobre el otorgamiento, modificación, prórroga, suspensión, extinción, revocación y caducidad del acto jurídico.", ...arrayToBoolean(nivelesResp.determinacion) },
    { identificador: 6, objetoResponsabilidad: "", ...arrayToBoolean(nivelesResp.otro) },
  ];

  console.log("Responsabilidades mapeadas:", result);
  return result;
}

// Mapear responsabilidades de enajenación desde BD (array de letras) al formato del formulario (booleanos)
function mapEnajenacionResponsabilidades(nivelesResp: any): any[] {
  console.log("=== mapEnajenacionResponsabilidades ===");
  console.log("Datos recibidos:", nivelesResp);

  if (!nivelesResp || typeof nivelesResp !== 'object') {
    console.log("No hay datos de responsabilidades, usando defaults");
    return [
      { identificador: 1, objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de enajenación de bienes muebles", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 2, objetoResponsabilidad: "Análisis o autorización para llevar a cabo la donación, permuta o dación en pago", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 3, objetoResponsabilidad: "Modificaciones a las bases", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 4, objetoResponsabilidad: "Presentación y apertura de ofertas", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 5, objetoResponsabilidad: "Evaluación de ofertas", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 6, objetoResponsabilidad: "Adjudicación de los bienes muebles", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 7, objetoResponsabilidad: "Formalización del contrato", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
      { identificador: 8, objetoResponsabilidad: "", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
    ];
  }

  // Convertir array de letras ["A", "B", "C"] a booleanos
  const arrayToBoolean = (arr: string[] | null): any => {
    if (!arr || !Array.isArray(arr)) {
      return { elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false };
    }
    return {
      elaborar: arr.includes("A"),
      revisar: arr.includes("B"),
      firmarAutorizar: arr.includes("C"),
      supervisar: arr.includes("D"),
      emitirSuscribir: arr.includes("E"),
    };
  };

  const result = [
    { identificador: 1, objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de enajenación de bienes muebles", ...arrayToBoolean(nivelesResp.autorizaciones) },
    { identificador: 2, objetoResponsabilidad: "Análisis o autorización para llevar a cabo la donación, permuta o dación en pago", ...arrayToBoolean(nivelesResp.analisis) },
    { identificador: 3, objetoResponsabilidad: "Modificaciones a las bases", ...arrayToBoolean(nivelesResp.modificaciones) },
    { identificador: 4, objetoResponsabilidad: "Presentación y apertura de ofertas", ...arrayToBoolean(nivelesResp.presentacion) },
    { identificador: 5, objetoResponsabilidad: "Evaluación de ofertas", ...arrayToBoolean(nivelesResp.evaluacion) },
    { identificador: 6, objetoResponsabilidad: "Adjudicación de los bienes muebles", ...arrayToBoolean(nivelesResp.adjudicacion) },
    { identificador: 7, objetoResponsabilidad: "Formalización del contrato", ...arrayToBoolean(nivelesResp.formalizacoin) }, // Typo en BD
    { identificador: 8, objetoResponsabilidad: "", ...arrayToBoolean(null) },
  ];

  console.log("Responsabilidades mapeadas:", result);
  return result;
}

export function getServidoresContratacionesDefaults(
  initialData: any | null,
  userEntePublico?: number
): Partial<ServidoresContratacionesFormValues> {
  return {
    entePublico: initialData?.entePublico ?? userEntePublico ?? 0,
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    ejercicio: initialData?.ejercicio?.toString() ?? new Date().getFullYear().toString(),

    // Datos Generales (objeto)
    datosGenerales: initialData?.datosGenerales ?? undefined,

    // Empleo Cargo Comisión (objeto)
    // Si initialData.empleoCargoComision es un número (ID), lo dejamos como undefined
    // Si es un objeto (expandido), necesitamos mapear el nivel jerárquico
    empleoCargoComision: (initialData?.empleoCargoComision && typeof initialData.empleoCargoComision === 'object')
      ? {
          ...initialData.empleoCargoComision,
          // Mapear el nivel jerárquico de BD a formulario
          nivelJerarquico: initialData.empleoCargoComision.nivelJerarquico?.clave
            ? mapNivelJerarquicoFromDB(initialData.empleoCargoComision.nivelJerarquico.clave)
            : undefined,
          nivelJerarquicoOtro: initialData.empleoCargoComision.nivelJerarquico?.valor || undefined
        }
      : undefined,

    // Tipo de Procedimiento
    // IMPORTANTE: Puede venir como array desde la BD, necesitamos convertirlo a string
    tipoProcedimiento: (() => {
      const tipoProcedimiento = initialData?.tipoProcedimiento;
      if (!tipoProcedimiento) return undefined;
      // Si es un array, tomar el primer elemento
      if (Array.isArray(tipoProcedimiento)) {
        return tipoProcedimiento[0] || undefined;
      }
      // Si ya es un string, devolverlo directamente
      return tipoProcedimiento;
    })(),

    // Tipo de Contratación (5.1)
    // IMPORTANTE: Puede venir como array desde la BD, necesitamos convertirlo a string
    tipoContratacion: (() => {
      const tipoContratacion = initialData?.tipoContratacion;
      if (!tipoContratacion) return undefined;
      // Si es un array, tomar el primer elemento
      if (Array.isArray(tipoContratacion)) {
        return tipoContratacion[0] || undefined;
      }
      // Si ya es un string, devolverlo directamente
      return tipoContratacion;
    })(),

    // Contratación de Adquisiciones (5.1.1) - Array
    contratacionAdquisiciones: (() => {
      if (initialData?.contratacionesAdquisiciones && Array.isArray(initialData.contratacionesAdquisiciones) && initialData.contratacionesAdquisiciones.length > 0) {
        console.log("=== CARGANDO CONTRATACIONES ===", initialData.contratacionesAdquisiciones);
        return initialData.contratacionesAdquisiciones.map((contratacion: any) => ({
          tipoArea: contratacion.tipoArea ? (typeof contratacion.tipoArea === 'string' ? JSON.parse(contratacion.tipoArea) : contratacion.tipoArea) : [],
          tipoAreaOtro: "",
          responsabilidades: mapContratacionesResponsabilidades(contratacion.nivelResponsabilidadContratacion),
          numeroExpediente: contratacion.datosContratacionPublica?.numeroExpedienteFolio || "",
          tipoProcedimiento: contratacion.datosContratacionPublica?.tipoProcedimiento || "",
          tipoProcedimientoOtro: "",
          materia: contratacion.datosContratacionPublica?.materia || "",
          materiaOtro: contratacion.datosContratacionPublica?.otroMateria || "",
          fechaInicio: contratacion.datosContratacionPublica?.fechaInicioProcedimiento || "",
          fechaConclusion: contratacion.datosContratacionPublica?.fechaConclusionProcedimiento || "",
          monto: "",
          razonSocial: contratacion.informacionPersonasBeneficiarias?.razonSocial || "",
          nombreBeneficiario: contratacion.informacionPersonasBeneficiarias?.nombre || "",
          primerApellidoBeneficiario: contratacion.informacionPersonasBeneficiarias?.primerApellido || "",
          segundoApellidoBeneficiario: contratacion.informacionPersonasBeneficiarias?.segundoApellido || "",
          continuaParticipando: contratacion.continuaParticipando === "SI",
        }));
      }
      return [
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
    ];
    })(),

    // Obras Públicas (5.1.2) - Array
    obrasPublicas: (() => {
      if (initialData?.obrasPublicas && Array.isArray(initialData.obrasPublicas) && initialData.obrasPublicas.length > 0) {
        console.log("=== CARGANDO OBRAS ===", initialData.obrasPublicas);
        return initialData.obrasPublicas.map((obra: any) => ({
          tipoArea: obra.tipoArea ? (typeof obra.tipoArea === 'string' ? JSON.parse(obra.tipoArea) : obra.tipoArea) : [],
          tipoAreaOtro: "",
          responsabilidades: mapContratacionesResponsabilidades(obra.nivelResponsabilidadObra),
          numeroExpediente: obra.datosGeneralesObra?.numeroExpedienteFolio || "",
          tipoProcedimiento: obra.datosGeneralesObra?.tipoProcedimiento || "",
          tipoProcedimientoOtro: "",
          materia: obra.datosGeneralesObra?.materia || "",
          materiaOtro: "",
          fechaInicio: obra.datosGeneralesObra?.inicioProcedimiento || "",
          fechaConclusion: obra.datosGeneralesObra?.conclusionProcedimiento || "",
          monto: "",
          razonSocial: obra.informacionPersonasBeneficiarias?.razonSocial || "",
          nombreBeneficiario: obra.informacionPersonasBeneficiarias?.nombre || "",
          primerApellidoBeneficiario: obra.informacionPersonasBeneficiarias?.primerApellido || "",
          segundoApellidoBeneficiario: obra.informacionPersonasBeneficiarias?.segundoApellido || "",
          continuaParticipando: obra.continuaParticipando === "SI",
        }));
      }
      return [
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
    ];
    })(),

    // Otorgamiento de Concesiones (5.2) - Array
    otorgamientoConcesiones: (() => {
      if (initialData?.otorgamientoConcesion && typeof initialData.otorgamientoConcesion === 'object') {
        console.log("=== CARGANDO CONCESIONES ===");
        console.log("Datos completos:", initialData.otorgamientoConcesion);
        console.log("datosGeneralesConcesiones:", initialData.otorgamientoConcesion.datosGeneralesConcesiones);
        console.log("sectorActoJuridico:", initialData.otorgamientoConcesion.datosGeneralesConcesiones?.sectorActoJuridico);
        console.log("fundamento:", initialData.otorgamientoConcesion.datosGeneralesConcesiones?.fundamento);

        const tipoActoJuridicoValue = initialData.otorgamientoConcesion.datosGeneralesConcesiones?.sectorActoJuridico
          ? (typeof initialData.otorgamientoConcesion.datosGeneralesConcesiones.sectorActoJuridico === 'string'
              ? JSON.parse(initialData.otorgamientoConcesion.datosGeneralesConcesiones.sectorActoJuridico)
              : initialData.otorgamientoConcesion.datosGeneralesConcesiones.sectorActoJuridico)
          : [];

        console.log("tipoActoJuridico parseado:", tipoActoJuridicoValue);

        const result = [{
          tipoActoJuridico: tipoActoJuridicoValue,
          responsabilidades: mapConcesionesResponsabilidades(initialData.otorgamientoConcesion.nivelResponsabilidadConcesiones),
          numeroExpediente: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.numeroExpedienteFolio || "",
          denominacion: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.denominacion || "",
          objeto: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.objeto || "",
          motivosFundamentos: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.fundamento || "",
          nombrePersonaFisica: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.nombrePersonaFisica || "",
          razonSocialPersonaMoral: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.denominacionPersonaMoral || "",
          sector: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.sector || "",
          fechaInicioVigencia: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.fechaInicioVigencia || "",
          fechaConclusionVigencia: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.fechaConclusionVigencia || "",
          monto: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.monto?.toString() || "",
          hipervinculo: initialData.otorgamientoConcesion.datosGeneralesConcesiones?.urlActoJuridico || "",
          razonSocial: initialData.otorgamientoConcesion.informacionPersonasBeneficiarias?.razonSocial || "",
          nombreBeneficiario: initialData.otorgamientoConcesion.informacionPersonasBeneficiarias?.nombre || "",
          primerApellidoBeneficiario: initialData.otorgamientoConcesion.informacionPersonasBeneficiarias?.primerApellido || "",
          segundoApellidoBeneficiario: initialData.otorgamientoConcesion.informacionPersonasBeneficiarias?.segundoApellido || "",
          continuaParticipando: initialData.otorgamientoConcesion.continuaParticipando === "SI",
        }];

        console.log("Resultado final de concesiones:", result);
        return result;
      }
      return [
        {
          tipoActoJuridico: [],
          responsabilidades: [
            { identificador: 1, objetoResponsabilidad: "Convocatoria a concurso, licitación o excitativa a presentar la solicitud de autorización.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
            { identificador: 2, objetoResponsabilidad: "Dictámenes u opiniones previos.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
            { identificador: 3, objetoResponsabilidad: "Visitas de verificación.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
            { identificador: 4, objetoResponsabilidad: "Evaluación del cumplimiento de los requisitos para el otorgamiento de la concesión, licencia, autorización, permiso, o sus prórrogas.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
            { identificador: 5, objetoResponsabilidad: "Determinación sobre el otorgamiento de la concesión, licencia, autorización, permiso o sus prórrogas.", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
            { identificador: 6, objetoResponsabilidad: "", elaborar: false, revisar: false, firmarAutorizar: false, supervisar: false, emitirSuscribir: false },
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
      ];
    })(),

    // Enajenación de Bienes (5.3) - Array
    enajenacionBienes: (() => {
      if (initialData?.enajenacionBien && typeof initialData.enajenacionBien === 'object') {
        console.log("=== CARGANDO ENAJENACIÓN DE BIENES ===", initialData.enajenacionBien);
        return [{
          responsabilidades: mapEnajenacionResponsabilidades(initialData.enajenacionBien.nivelesResponsabilidadesEnajenaciones),
          numeroExpediente: initialData.enajenacionBien.datosEnajenacionesBienes?.numeroExpedienteFolio || "",
          descripcion: initialData.enajenacionBien.datosEnajenacionesBienes?.descripcion || "",
          fechaInicio: initialData.enajenacionBien.datosEnajenacionesBienes?.fechaInicioProcedimiento || "",
          fechaConclusion: initialData.enajenacionBien.datosEnajenacionesBienes?.fechaConclusionProcedimiento || "",
          continuaParticipando: initialData.enajenacionBien.continuaParticipando === "SI",
        }];
      }
      return [
      {
        responsabilidades: [
          {
            identificador: 1,
            objetoResponsabilidad: "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de enajenación de bienes muebles",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 2,
            objetoResponsabilidad: "Análisis o autorización para llevar a cabo la donación, permuta o dación en pago",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 3,
            objetoResponsabilidad: "Modificaciones a las bases",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 4,
            objetoResponsabilidad: "Presentación y apertura de ofertas",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 5,
            objetoResponsabilidad: "Evaluación de ofertas",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 6,
            objetoResponsabilidad: "Adjudicación de los bienes muebles",
            elaborar: false,
            revisar: false,
            firmarAutorizar: false,
            supervisar: false,
            emitirSuscribir: false,
          },
          {
            identificador: 7,
            objetoResponsabilidad: "Formalización del contrato",
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
    ];
    })(),

    // Dictaminación de Avalúos (5.4) - Array
    dictaminacionAvaluos: initialData?.avaluosJustipreciacion && typeof initialData.avaluosJustipreciacion === 'object'
      ? [{
          responsabilidades: mapAvaluosResponsabilidades(
            initialData.avaluosJustipreciacion.nivelesResponsabilidadesAvaluos
          ),
          numeroExpediente: initialData.avaluosJustipreciacion.datosDictaminacionesAvaluos?.numeroExpedienteFolio || "",
          descripcion: initialData.avaluosJustipreciacion.datosDictaminacionesAvaluos?.descripcion || "",
          fechaInicio: initialData.avaluosJustipreciacion.datosDictaminacionesAvaluos?.fechaInicioProcedimiento || "",
          fechaConclusion: initialData.avaluosJustipreciacion.datosDictaminacionesAvaluos?.fechaConclusionProcedimiento || "",
          continuaParticipando: initialData.avaluosJustipreciacion.continuaParticipando === "SI",
        }]
      : [
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

    // Observaciones (el backend guarda como "Observaciones" con mayúscula)
    observaciones: initialData?.Observaciones || initialData?.observaciones || "",
  };
}

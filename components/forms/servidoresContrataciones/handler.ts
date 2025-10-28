import directus from "@/lib/directus";
import { createItem, updateItem, withToken } from "@directus/sdk";
import { ServidoresContratacionesFormValues } from "./schema";

// Helper function para verificar si una sección de contratación tiene datos significativos
function tieneContenidoSignificativo(item: any): boolean {
  if (!item) return false;

  // Verificar si tiene datos en campos clave (además de los defaults vacíos)
  const tieneTipoArea = item.tipoArea && item.tipoArea.length > 0;
  const tieneNumeroExpediente = item.numeroExpediente && item.numeroExpediente.trim() !== "";
  const tieneTipoProcedimiento = item.tipoProcedimiento && item.tipoProcedimiento !== "";
  const tieneMateria = item.materia && item.materia !== "";
  const tieneMonto = item.monto && item.monto.trim() !== "";
  const tieneFechas = (item.fechaInicio && item.fechaInicio !== "") || (item.fechaConclusion && item.fechaConclusion !== "");
  const tieneBeneficiario = (item.nombreBeneficiario && item.nombreBeneficiario.trim() !== "") || (item.razonSocial && item.razonSocial.trim() !== "");

  // Verificar si tiene al menos una responsabilidad marcada
  let tieneResponsabilidades = false;
  if (item.responsabilidades && item.responsabilidades.length > 0) {
    tieneResponsabilidades = item.responsabilidades.some((resp: any) =>
      resp.elaborar || resp.revisar || resp.firmarAutorizar || resp.supervisar || resp.emitirSuscribir
    );
  }

  // Considera que tiene contenido significativo si tiene al menos uno de estos
  return tieneTipoArea || tieneNumeroExpediente || tieneTipoProcedimiento ||
         tieneMateria || tieneMonto || tieneFechas || tieneBeneficiario ||
         tieneResponsabilidades;
}

export async function saveServidorContratacion(
  data: ServidoresContratacionesFormValues,
  initialData: any | null,
  accessToken: string
) {
  console.log("=== HANDLER: saveServidorContratacion ===");
  console.log("1. Access Token recibido:", accessToken ? "SÍ (longitud: " + accessToken.length + ")" : "NO");
  console.log("2. Initial Data:", initialData ? "Editando registro ID: " + initialData.id : "Nuevo registro");
  console.log("3. Datos recibidos:", {
    entePublico: data.entePublico,
    fecha: data.fecha,
    ejercicio: data.ejercicio,
    tipoProcedimiento: data.tipoProcedimiento,
    tieneDatosGenerales: !!data.datosGenerales,
    tieneEmpleo: !!data.empleoCargoComision,
  });

  if (!accessToken) {
    throw new Error("No se proporcionó token de acceso. Verifica que la sesión esté activa.");
  }

  const api = directus;

  // 1. Crear registro de datos_generales si existe
  let datosGeneralesId: number | null = null;
  if (data.datosGenerales) {
    console.log("4. Creando datos_generales...");
    const datosGeneralesData = {
      nombre: data.datosGenerales.nombre,
      primerApellido: data.datosGenerales.primerApellido,
      segundoApellido: data.datosGenerales.segundoApellido || null,
      curp: data.datosGenerales.curp,
      rfc: data.datosGenerales.rfc,
      sexo: data.datosGenerales.sexo,
      entePublico: data.entePublico,
    };

    try {
      const datosGeneralesResult = await api.request(
        withToken(accessToken, createItem("datos_generales", datosGeneralesData))
      );
      datosGeneralesId = (datosGeneralesResult as any).id;
      console.log("   ✓ datos_generales creado con ID:", datosGeneralesId);
    } catch (error: any) {
      console.error("   ✗ Error al crear datos_generales:", error);
      throw new Error(`Error al crear datos generales: ${error.message || error}`);
    }
  }

  // 2. Crear registro de empleos_cargos_comisiones si existe
  let empleoCargoComisionId: number | null = null;
  if (data.empleoCargoComision) {
    console.log("5. Creando empleos_cargos_comisiones...");

    // 2.1 Primero, crear registro de nivel jerárquico
    let nivelJerarquicoId: number | null = null;

    // Mapear valores del formulario a los valores de la BD
    const nivelJerarquicoMap: Record<string, string> = {
      "OPERATIVO": "OPERATIVO_HOMOLOGO",
      "ENLACE": "ENLACE_HOMOLOGO",
      "JEFATURA_DEPARTAMENTO": "JEFATURA_DEPTO_HOMOLOGO",
      "SUBDIRECCION_AREA": "SUBDIRECCION_HOMOLOGO",
      "DIRECCION_AREA": "DIRECCION_HOMOLOGO",
      "DIRECCION_GENERAL": "DG_HOMOLOGO",
      "JEFATURA_UNIDAD": "JEFATURA_UNIDAD_HOMOLOGO",
      "SUBSECRETARIA": "SUBSECRETARIA_HOMOLOGO",
      "SECRETARIA": "SECRETARIA_HOMOLOGO",
      "OTRO": "OTRO"
    };

    const nivelJerarquicoClave = nivelJerarquicoMap[data.empleoCargoComision.nivelJerarquico] || "OTRO";

    const nivelJerarquicoData = {
      clave: nivelJerarquicoClave,
      valor: data.empleoCargoComision.nivelJerarquicoOtro || null,
      entePublico: data.entePublico,
    };

    console.log("   5.1 Creando nivel_jerarquico:", nivelJerarquicoData);

    try {
      const nivelJerarquicoResult = await api.request(
        withToken(accessToken, createItem("niveles_jerarquicos", nivelJerarquicoData))
      );
      nivelJerarquicoId = (nivelJerarquicoResult as any).id;
      console.log("   ✓ nivel_jerarquico creado con ID:", nivelJerarquicoId);
    } catch (error: any) {
      console.error("   ✗ Error al crear nivel_jerarquico:", error);
      throw new Error(`Error al crear nivel jerárquico: ${error.message || error}`);
    }

    // 2.2 Ahora crear el empleo con el ID del nivel jerárquico
    const empleoData = {
      entidadFederativa: data.empleoCargoComision.entidadFederativa,
      nivelOrdenGobierno: data.empleoCargoComision.nivelOrdenGobierno,
      ambitoPublico: data.empleoCargoComision.ambitoPublico,
      nombreEntePublico: data.empleoCargoComision.nombreEntePublico,
      siglasEntePublico: data.empleoCargoComision.siglasEntePublico || null,
      nivelJerarquico: nivelJerarquicoId, // Ahora es un ID numérico
      denominacion: data.empleoCargoComision.denominacion,
      areaAdscripcion: data.empleoCargoComision.areaAdscripcion,
      entePublico: data.entePublico,
    };
    console.log("   5.2 Datos de empleo a enviar:", JSON.stringify(empleoData, null, 2));

    try {
      const empleoResult = await api.request(
        withToken(accessToken, createItem("empleos_cargos_comisiones", empleoData))
      );
      empleoCargoComisionId = (empleoResult as any).id;
      console.log("   ✓ empleos_cargos_comisiones creado con ID:", empleoCargoComisionId);
    } catch (error: any) {
      console.error("   ✗ Error al crear empleos_cargos_comisiones:", error);
      throw new Error(`Error al crear empleo: ${error.message || error}`);
    }
  }

  // 3. Procesar contrataciones de adquisiciones
  const contratacionesAdquisicionesIds: number[] = [];
  if (data.contratacionAdquisiciones && data.contratacionAdquisiciones.length > 0) {
    // Filtrar solo las contrataciones que tienen contenido significativo
    const contratacionesConDatos = data.contratacionAdquisiciones.filter(tieneContenidoSignificativo);

    for (const contratacion of contratacionesConDatos) {
      // 3.1 Crear datos_personas_beneficiarias si existe
      let personaBeneficiariaId: number | null = null;
      if (contratacion.nombreBeneficiario || contratacion.razonSocial) {
        const beneficiarioData = {
          razonSocial: contratacion.razonSocial || null,
          nombre: contratacion.nombreBeneficiario || null,
          primerApellido: contratacion.primerApellidoBeneficiario || null,
          segundoApellido: contratacion.segundoApellidoBeneficiario || null,
          entePublico: data.entePublico,
        };

        const beneficiarioResult = await api.request(
          withToken(accessToken, createItem("datos_personas_beneficiarias", beneficiarioData))
        );
        personaBeneficiariaId = (beneficiarioResult as any).id;
      }

      // 3.2 Crear niveles_responsabilidades_contrataciones_adquisiciones si hay responsabilidades
      let nivelesRespId: number | null = null;
      if (contratacion.responsabilidades && contratacion.responsabilidades.length > 0) {
        // Helper para convertir booleanos a array de letras
        const convertToArray = (resp: any): string[] => {
          const result: string[] = [];
          if (resp.elaborar) result.push("A");
          if (resp.revisar) result.push("B");
          if (resp.firmarAutorizar) result.push("C");
          if (resp.supervisar) result.push("D");
          if (resp.emitirSuscribir) result.push("E");
          return result;
        };

        // Mapear responsabilidades según identificador
        // Según ContratacionAdquisicionesSection.tsx líneas 44-122:
        // 1: Autorizaciones o dictámenes previos
        // 2: Justificación para excepción
        // 3: Convocatoria, invitación o solicitud
        // 4: Evaluación de proposiciones
        // 5: Adjudicación del contrato
        // 6: Formalización del contrato
        // 7: Otro (Especifique)
        const responsabilidadesMap: Record<number, string[]> = {};
        contratacion.responsabilidades.forEach((resp: any) => {
          if (resp.identificador) {
            responsabilidadesMap[resp.identificador] = convertToArray(resp);
          }
        });

        const nivelesRespData = {
          entePublico: data.entePublico,
          autorizacion: responsabilidadesMap[1] || null,    // ID 1: Autorizaciones
          justificacion: responsabilidadesMap[2] || null,   // ID 2: Justificación
          convocatoria: responsabilidadesMap[3] || null,    // ID 3: Convocatoria
          evaluacion: responsabilidadesMap[4] || null,      // ID 4: Evaluación
          adjudicacion: responsabilidadesMap[5] || null,    // ID 5: Adjudicación
          formalizacion: responsabilidadesMap[6] || null,   // ID 6: Formalización
        };

        console.log("   3.2 Datos de niveles_responsabilidades_contrataciones_adquisiciones:", nivelesRespData);

        const nivelesRespResult = await api.request(
          withToken(accessToken, createItem("niveles_responsabilidades_contrataciones_adquisiciones", nivelesRespData))
        );
        nivelesRespId = (nivelesRespResult as any).id;
      }

      // 3.3 Crear contrataciones_adquisiciones
      const contratacionAdqData = {
        entePublico: data.entePublico,
        tipoArea: contratacion.tipoArea ? JSON.stringify(contratacion.tipoArea) : JSON.stringify([]),
        nivelResponsabilidadContratacion: nivelesRespId,
        informacionPersonasBeneficiarias: personaBeneficiariaId,
        continuaParticipando: contratacion.continuaParticipando ? "SI" : "NO",
      };

      const contratacionResult = await api.request(
        withToken(accessToken, createItem("contrataciones_adquisiciones", contratacionAdqData))
      );
      contratacionesAdquisicionesIds.push((contratacionResult as any).id);

      // 3.4 Crear datos_contrataciones_publicas
      if (contratacion.numeroExpediente || contratacion.fechaInicio) {
        const datosContratacionData = {
          entePublico: data.entePublico,
          numeroExpedienteFolio: contratacion.numeroExpediente || null,
          tipoProcedimiento: contratacion.tipoProcedimiento || null,
          materia: contratacion.materia || null,
          otroMateria: contratacion.materiaOtro || null,
          fechaInicioProcedimiento: contratacion.fechaInicio || null,
          fechaConclusionProcedimiento: contratacion.fechaConclusion || null,
          fk_datos_procedimientos_adquisiciones: (contratacionResult as any).id,
        };

        await api.request(
          withToken(accessToken, createItem("datos_contrataciones_publicas", datosContratacionData))
        );
      }
    }
  }

  // 4. Procesar obras públicas
  const obrasPublicasIds: number[] = [];
  if (data.obrasPublicas && data.obrasPublicas.length > 0) {
    // Filtrar solo las obras que tienen contenido significativo
    const obrasConDatos = data.obrasPublicas.filter(tieneContenidoSignificativo);

    for (const obra of obrasConDatos) {
      // 4.1 Crear datos_personas_beneficiarias si existe
      let personaBeneficiariaId: number | null = null;
      if (obra.nombreBeneficiario || obra.razonSocial) {
        const beneficiarioData = {
          razonSocial: obra.razonSocial || null,
          nombre: obra.nombreBeneficiario || null,
          primerApellido: obra.primerApellidoBeneficiario || null,
          segundoApellido: obra.segundoApellidoBeneficiario || null,
          entePublico: data.entePublico,
        };

        const beneficiarioResult = await api.request(
          withToken(accessToken, createItem("datos_personas_beneficiarias", beneficiarioData))
        );
        personaBeneficiariaId = (beneficiarioResult as any).id;
      }

      // 4.2 Crear niveles_responsabilidades_contrataciones_adquisiciones (se reutiliza para obras)
      let nivelesRespId: number | null = null;
      if (obra.responsabilidades && obra.responsabilidades.length > 0) {
        // Helper para convertir booleanos a array de letras
        const convertToArray = (resp: any): string[] => {
          const result: string[] = [];
          if (resp.elaborar) result.push("A");
          if (resp.revisar) result.push("B");
          if (resp.firmarAutorizar) result.push("C");
          if (resp.supervisar) result.push("D");
          if (resp.emitirSuscribir) result.push("E");
          return result;
        };

        // Mapear responsabilidades según identificador (igual que contrataciones)
        const responsabilidadesMap: Record<number, string[]> = {};
        obra.responsabilidades.forEach((resp: any) => {
          if (resp.identificador) {
            responsabilidadesMap[resp.identificador] = convertToArray(resp);
          }
        });

        const nivelesRespData = {
          entePublico: data.entePublico,
          autorizacion: responsabilidadesMap[1] || null,
          justificacion: responsabilidadesMap[2] || null,
          convocatoria: responsabilidadesMap[3] || null,
          evaluacion: responsabilidadesMap[4] || null,
          adjudicacion: responsabilidadesMap[5] || null,
          formalizacion: responsabilidadesMap[6] || null,
        };

        console.log("   4.2 Datos de niveles_responsabilidades_contrataciones_adquisiciones (obras):", nivelesRespData);

        const nivelesRespResult = await api.request(
          withToken(accessToken, createItem("niveles_responsabilidades_contrataciones_adquisiciones", nivelesRespData))
        );
        nivelesRespId = (nivelesRespResult as any).id;
      }

      // 4.3 Crear contrataciones_obras
      const obraData = {
        entePublico: data.entePublico,
        tipoArea: obra.tipoArea ? JSON.stringify(obra.tipoArea) : JSON.stringify([]),
        nivelResponsabilidadObra: nivelesRespId,
        informacionPersonasBeneficiarias: personaBeneficiariaId,
        continuaParticipando: obra.continuaParticipando ? "SI" : "NO",
      };

      const obraResult = await api.request(
        withToken(accessToken, createItem("contrataciones_obras", obraData))
      );
      obrasPublicasIds.push((obraResult as any).id);

      // 4.4 Crear datos_generales_obras
      if (obra.numeroExpediente || obra.fechaInicio) {
        const datosObraData = {
          entePublico: data.entePublico,
          numeroExpedienteFolio: obra.numeroExpediente || null,
          tipoProcedimiento: obra.tipoProcedimiento || null,
          materia: obra.materia || null,
          inicioProcedimiento: obra.fechaInicio || null,
          conclusionProcedimiento: obra.fechaConclusion || null,
          fk_fatos_procedimientos_obras: (obraResult as any).id,
        };

        await api.request(
          withToken(accessToken, createItem("datos_generales_obras", datosObraData))
        );
      }
    }
  }

  // 5. Procesar dictaminación de avalúos
  let avaluosJustipreciacionId: number | null = null;
  if (data.dictaminacionAvaluos && data.dictaminacionAvaluos.length > 0) {
    // Filtrar solo los avalúos que tienen contenido significativo
    const avaluosConDatos = data.dictaminacionAvaluos.filter(tieneContenidoSignificativo);

    if (avaluosConDatos.length > 0) {
      const avaluo = avaluosConDatos[0];

    // 3.1 Crear datos_dictaminaciones_avaluos
    const datosAvaluosData = {
      numeroExpedienteFolio: avaluo.numeroExpediente || null,
      fechaInicioProcedimiento: avaluo.fechaInicio || null,
      fechaConclusionProcedimiento: avaluo.fechaConclusion || null,
      descripcion: avaluo.descripcion,
      entePublico: data.entePublico,
    };

    const datosAvaluosResult = await api.request(
      withToken(accessToken, createItem("datos_dictaminaciones_avaluos", datosAvaluosData))
    );
    const datosAvaluosId = (datosAvaluosResult as any).id;

    // 3.2 Crear niveles_responsabilidades_avaluos si hay responsabilidades
    let nivelesRespAvaluosId: number | null = null;
    if (avaluo.responsabilidades && avaluo.responsabilidades.length > 0) {
      // Transformar responsabilidades a formato JSON esperado por la BD
      const responsabilidadesMap: any = {};
      avaluo.responsabilidades.forEach((resp: any) => {
        const key = resp.objetoResponsabilidad?.toLowerCase().replace(/ /g, "_") || `item_${resp.identificador}`;
        responsabilidadesMap[key] = {
          elaborar: resp.elaborar || false,
          revisar: resp.revisar || false,
          firmarAutorizar: resp.firmarAutorizar || false,
          supervisar: resp.supervisar || false,
          emitirSuscribir: resp.emitirSuscribir || false,
        };
      });

      const nivelesRespData = {
        entePublico: data.entePublico,
        autorizaciones: responsabilidadesMap.autorizaciones || null,
        analisis: responsabilidadesMap.analisis || null,
        modificaciones: responsabilidadesMap.modificaciones || null,
        presentacion: responsabilidadesMap.presentacion || null,
      };

      const nivelesRespResult = await api.request(
        withToken(accessToken, createItem("niveles_responsabilidades_avaluos", nivelesRespData))
      );
      nivelesRespAvaluosId = (nivelesRespResult as any).id;
    }

    // 3.3 Crear dictaminaciones_avaluos
    const dictaminacionData = {
      entePublico: data.entePublico,
      nivelesResponsabilidadesAvaluos: nivelesRespAvaluosId,
      datosDictaminacionesAvaluos: datosAvaluosId,
      continuaParticipando: avaluo.continuaParticipando ? "SI" : "NO",
    };

    const dictaminacionResult = await api.request(
      withToken(accessToken, createItem("dictaminaciones_avaluos", dictaminacionData))
    );
    avaluosJustipreciacionId = (dictaminacionResult as any).id;
    }
  }

  // 6. Procesar enajenación de bienes
  let enajenacionBienId: number | null = null;
  if (data.enajenacionBienes && data.enajenacionBienes.length > 0) {
    // Filtrar solo las enajenaciones que tienen contenido significativo
    const enajenacionesConDatos = data.enajenacionBienes.filter(tieneContenidoSignificativo);

    if (enajenacionesConDatos.length > 0) {
      const enajenacion = enajenacionesConDatos[0];

    // 4.1 Crear datos_enajenaciones_bienes
    const datosEnajenacionData = {
      numeroExpedienteFolio: enajenacion.numeroExpediente || null,
      fechaInicioProcedimiento: enajenacion.fechaInicio || null,
      fechaConclusionProcedimiento: enajenacion.fechaConclusion || null,
      descripcion: enajenacion.descripcion,
      entePublico: data.entePublico,
    };

    const datosEnajenacionResult = await api.request(
      withToken(accessToken, createItem("datos_enajenaciones_bienes", datosEnajenacionData))
    );
    const datosEnajenacionId = (datosEnajenacionResult as any).id;

    // 4.2 Crear niveles_responsabilidades_enajenaciones si hay responsabilidades
    let nivelesRespEnajenacionId: number | null = null;
    if (enajenacion.responsabilidades && enajenacion.responsabilidades.length > 0) {
      // Helper para convertir booleanos a array de letras
      const convertToArray = (resp: any): string[] => {
        const result: string[] = [];
        if (resp.elaborar) result.push("A");
        if (resp.revisar) result.push("B");
        if (resp.firmarAutorizar) result.push("C");
        if (resp.supervisar) result.push("D");
        if (resp.emitirSuscribir) result.push("E");
        return result;
      };

      // Mapear responsabilidades según identificador
      const responsabilidadesMap: Record<number, string[]> = {};
      enajenacion.responsabilidades.forEach((resp: any) => {
        if (resp.identificador) {
          responsabilidadesMap[resp.identificador] = convertToArray(resp);
        }
      });

      // Mapeo según EnajenacionBienesSection.tsx líneas 32-121
      // 1: Elaboración del avalúo
      // 2: Autorizaciones o dictámenes previos
      // 3: Justificación para excepción
      // 4: Convocatoria, invitación
      // 5: Evaluación de proposiciones
      // 6: Adjudicación
      // 7: Formalización
      // 8: Otro (Especifique)

      const nivelesRespData = {
        entePublico: data.entePublico,
        autorizaciones: responsabilidadesMap[2] || null,   // 2: Autorizaciones o dictámenes previos
        analisis: responsabilidadesMap[1] || null,         // 1: Elaboración del avalúo (análisis)
        modificaciones: responsabilidadesMap[4] || null,   // 4: Convocatoria (modificaciones a bases)
        presentacion: responsabilidadesMap[4] || null,     // 4: Convocatoria (presentación)
        evaluacion: responsabilidadesMap[5] || null,       // 5: Evaluación de proposiciones
        adjudicacion: responsabilidadesMap[6] || null,     // 6: Adjudicación
        formalizacoin: responsabilidadesMap[7] || null,    // 7: Formalización (NOTA: typo en BD)
      };

      console.log("   6.2 Datos de niveles_responsabilidades_enajenaciones:", nivelesRespData);

      const nivelesRespResult = await api.request(
        withToken(accessToken, createItem("niveles_responsabilidades_enajenaciones", nivelesRespData))
      );
      nivelesRespEnajenacionId = (nivelesRespResult as any).id;
    }

    // 4.3 Crear enajenaciones_bienes
    const enajenacionData = {
      entePublico: data.entePublico,
      nivelesResponsabilidadesEnajenaciones: nivelesRespEnajenacionId,
      datosEnajenacionesBienes: datosEnajenacionId,
      continuaParticipando: enajenacion.continuaParticipando ? "SI" : "NO",
    };

    const enajenacionResult = await api.request(
      withToken(accessToken, createItem("enajenaciones_bienes", enajenacionData))
    );
    enajenacionBienId = (enajenacionResult as any).id;
    }
  }

  // 7. Procesar otorgamiento de concesiones
  let otorgamientoConcesionId: number | null = null;
  if (data.otorgamientoConcesiones && data.otorgamientoConcesiones.length > 0) {
    // Filtrar solo las concesiones que tienen contenido significativo
    const concesionesConDatos = data.otorgamientoConcesiones.filter(tieneContenidoSignificativo);

    if (concesionesConDatos.length > 0) {
      const concesion = concesionesConDatos[0];

    // 5.1 Crear datos_generales_concesiones (antes datos_otorgamientos_concesiones)
    const datosConcesionData = {
      numeroExpedienteFolio: concesion.numeroExpediente || null,
      denominacion: concesion.denominacion || null,
      objeto: concesion.objeto || null,
      fundamento: concesion.motivosFundamentos || null,
      nombrePersonaFisica: concesion.nombrePersonaFisica || null,
      denominacionPersonaMoral: concesion.razonSocialPersonaMoral || null,
      sectorActoJuridico: concesion.sector ? JSON.stringify([concesion.sector]) : null,
      fechaInicioVigencia: concesion.fechaInicioVigencia || null,
      fechaConclusionVigencia: concesion.fechaConclusionVigencia || null,
      urlActoJuridico: concesion.hipervinculo || null,
      monto: concesion.monto ? parseFloat(concesion.monto) : null,
      entePublico: data.entePublico,
    };

    const datosConcesionResult = await api.request(
      withToken(accessToken, createItem("datos_generales_concesiones", datosConcesionData))
    );
    const datosConcesionId = (datosConcesionResult as any).id;

    // 5.2 Crear datos_personas_beneficiarias si existe
    let personaBeneficiariaId: number | null = null;
    if (concesion.nombreBeneficiario || concesion.razonSocial) {
      const beneficiarioData = {
        razonSocial: concesion.razonSocial || null,
        nombre: concesion.nombreBeneficiario || null,
        primerApellido: concesion.primerApellidoBeneficiario || null,
        segundoApellido: concesion.segundoApellidoBeneficiario || null,
        entePublico: data.entePublico,
      };

      const beneficiarioResult = await api.request(
        withToken(accessToken, createItem("datos_personas_beneficiarias", beneficiarioData))
      );
      personaBeneficiariaId = (beneficiarioResult as any).id;
    }

    // 5.3 Crear niveles_responsabilidades_concesiones si hay responsabilidades
    let nivelesRespConcesionId: number | null = null;
    if (concesion.responsabilidades && concesion.responsabilidades.length > 0) {
      // Helper para convertir booleanos a array de letras (igual que enajenación)
      const convertToArray = (resp: any): string[] => {
        const result: string[] = [];
        if (resp.elaborar) result.push("A");
        if (resp.revisar) result.push("B");
        if (resp.firmarAutorizar) result.push("C");
        if (resp.supervisar) result.push("D");
        if (resp.emitirSuscribir) result.push("E");
        return result;
      };

      // Mapear responsabilidades según identificador
      // Según OtorgamientoConcesionesSection.tsx líneas 40-110:
      // 1: Convocatoria a concurso
      // 2: Dictámenes u opiniones previos
      // 3: Visitas de verificación
      // 4: Evaluación del cumplimiento
      // 5: Determinación sobre el otorgamiento
      // 6: Otro (Especifique)
      const responsabilidadesMap: Record<number, string[]> = {};
      concesion.responsabilidades.forEach((resp: any) => {
        if (resp.identificador) {
          responsabilidadesMap[resp.identificador] = convertToArray(resp);
        }
      });

      const nivelesRespData = {
        entePublico: data.entePublico,
        convocatoria: responsabilidadesMap[1] || null,     // ID 1: Convocatoria
        dictamenes: responsabilidadesMap[2] || null,       // ID 2: Dictámenes
        visitas: responsabilidadesMap[3] || null,          // ID 3: Visitas
        evaluacion: responsabilidadesMap[4] || null,       // ID 4: Evaluación
        determinacion: responsabilidadesMap[5] || null,    // ID 5: Determinación
      };

      console.log("   7.3 Datos de niveles_responsabilidades_concesiones:", nivelesRespData);

      const nivelesRespResult = await api.request(
        withToken(accessToken, createItem("niveles_responsabilidades_concesiones", nivelesRespData))
      );
      nivelesRespConcesionId = (nivelesRespResult as any).id;
    }

    // 5.4 Crear otorgamientos_concesiones
    const otorgamientoData = {
      entePublico: data.entePublico,
      tipoActo: concesion.tipoActoJuridico ? JSON.stringify(concesion.tipoActoJuridico) : null,
      nivelResponsabilidadConcesiones: nivelesRespConcesionId,
      datosGeneralesConcesiones: datosConcesionId,
      informacionPersonasBeneficiarias: personaBeneficiariaId,
      continuaParticipando: concesion.continuaParticipando ? "SI" : "NO",
    };

    const otorgamientoResult = await api.request(
      withToken(accessToken, createItem("otorgamientos_concesiones", otorgamientoData))
    );
    otorgamientoConcesionId = (otorgamientoResult as any).id;
    }
  }

  // 8. Preparar los datos del registro principal
  const mainData: any = {
    entePublico: data.entePublico,
    fecha: data.fecha,
    ejercicio: parseInt(data.ejercicio),
    tipoProcedimiento: data.tipoProcedimiento,
    Observaciones: data.observaciones || null,
    datosGenerales: datosGeneralesId,
    empleoCargoComision: empleoCargoComisionId,
    avaluosJustipreciacion: avaluosJustipreciacionId,
    enajenacionBien: enajenacionBienId,
    otorgamientoConcesion: otorgamientoConcesionId,
  };

  // Nota: Los IDs de contrataciones y obras se guardan en la tabla tipos_adquisiciones_obras
  // que vincula con el registro principal mediante fk_id

  console.log("6. Creando registro principal con datos:", mainData);

  let servidorId: any;

  try {
    if (initialData) {
      // Actualizar registro existente
      console.log("   Actualizando registro existente ID:", initialData.id);
      servidorId = initialData.id;
      await api.request(
        withToken(
          accessToken,
          updateItem(
            "servidores_intervengan_procedimientos_contrataciones",
            initialData.id,
            mainData
          )
        )
      );
      console.log("   ✓ Registro actualizado");
    } else {
      // Crear nuevo registro
      console.log("   Creando nuevo registro en servidores_intervengan_procedimientos_contrataciones...");
      const servidorResult = await api.request(
        withToken(
          accessToken,
          createItem(
            "servidores_intervengan_procedimientos_contrataciones",
            mainData
          )
        )
      );
      servidorId = (servidorResult as any).id;
      console.log("   ✓ Registro principal creado con ID:", servidorId);
    }
  } catch (error: any) {
    console.error("   ✗ Error al crear/actualizar registro principal:", error);
    console.error("   Detalles del error:", error.errors || error.message);
    throw new Error(`Error al guardar registro principal: ${error.message || JSON.stringify(error.errors || error)}`);
  }

  // 9. Crear registros en tipos_adquisiciones_obras para vincular contrataciones y obras
  // con el registro principal
  if (contratacionesAdquisicionesIds.length > 0 || obrasPublicasIds.length > 0) {
    console.log("7. Creando vínculos en tipos_adquisiciones_obras...");
  }

  for (const contratacionId of contratacionesAdquisicionesIds) {
    try {
      await api.request(
        withToken(
          accessToken,
          createItem("tipos_adquisiciones_obras", {
            contratacionAdquisicion: contratacionId,
            entePublico: data.entePublico,
            clave: "CONTRATACION_ADQUISICION",
            fk_id: servidorId,
          })
        )
      );
      console.log("   ✓ Vínculo de contratación creado:", contratacionId);
    } catch (error: any) {
      console.error("   ✗ Error al crear vínculo de contratación:", error);
      // No lanzar error aquí, solo loguearlo
    }
  }

  for (const obraId of obrasPublicasIds) {
    try {
      await api.request(
        withToken(
          accessToken,
          createItem("tipos_adquisiciones_obras", {
            contratacionObra: obraId,
            entePublico: data.entePublico,
            clave: "CONTRATACION_OBRA",
            fk_id: servidorId,
          })
        )
      );
      console.log("   ✓ Vínculo de obra creado:", obraId);
    } catch (error: any) {
      console.error("   ✗ Error al crear vínculo de obra:", error);
      // No lanzar error aquí, solo loguearlo
    }
  }

  console.log("=== ✓ GUARDADO COMPLETADO EXITOSAMENTE ===");
  console.log("ID del registro creado:", servidorId);
  console.log("=========================================");
}

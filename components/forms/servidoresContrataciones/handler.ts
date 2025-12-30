import { directus } from "@/services/directus";
import { createItem, updateItem, deleteItem, readItems } from "@directus/sdk";
import { ServidoresContratacionesFormValues } from "./schema";

// Helper function para extraer mensajes de error del SDK de Directus
function extractErrorMessage(error: any): string {
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    // Error del SDK de Directus con array de errores
    const firstError = error.errors[0];
    return firstError.message || JSON.stringify(firstError);
  }

  if (error.response) {
    // Error HTTP - verificar el código de estado
    const status = error.response.status;
    switch (status) {
      case 401:
        return "No autorizado. Por favor, verifica tu sesión o que todos los campos obligatorios estén completos.";
      case 400:
        return "Datos inválidos. Verifica que todos los campos requeridos estén completos y sean válidos.";
      case 403:
        return "No tienes permisos para realizar esta acción.";
      case 404:
        return "El recurso solicitado no fue encontrado.";
      case 500:
        return "Error interno del servidor. Contacta al administrador.";
      default:
        return `Error del servidor (${status}). Contacta al administrador.`;
    }
  }

  if (error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Error desconocido al procesar la solicitud.";
}

// Helper function para verificar si una sección de contratación tiene datos significativos
function tieneContenidoSignificativo(item: any): boolean {
  if (!item) return false;

  // Campos de contrataciones/obras
  const tieneTipoArea = item.tipoArea && item.tipoArea.length > 0;
  const tieneNumeroExpediente =
    item.numeroExpediente && item.numeroExpediente.trim() !== "";
  const tieneTipoProcedimiento =
    item.tipoProcedimiento && item.tipoProcedimiento !== "";
  const tieneMateria = item.materia && item.materia !== "";
  const tieneMonto = item.monto && item.monto.trim() !== "";
  const tieneFechas =
    (item.fechaInicio && item.fechaInicio !== "") ||
    (item.fechaConclusion && item.fechaConclusion !== "") ||
    (item.fechaInicioVigencia && item.fechaInicioVigencia !== "") ||
    (item.fechaConclusionVigencia && item.fechaConclusionVigencia !== "");
  const tieneBeneficiario =
    (item.nombreBeneficiario && item.nombreBeneficiario.trim() !== "") ||
    (item.razonSocial && item.razonSocial.trim() !== "") ||
    (item.nombrePersonaFisica && item.nombrePersonaFisica.trim() !== "") ||
    (item.razonSocialPersonaMoral &&
      item.razonSocialPersonaMoral.trim() !== "");

  // Campos específicos de concesiones
  const tieneTipoActoJuridico =
    item.tipoActoJuridico && item.tipoActoJuridico.length > 0;
  const tieneDenominacion =
    item.denominacion && item.denominacion.trim() !== "";
  const tieneObjeto = item.objeto && item.objeto.trim() !== "";
  const tieneMotivos =
    item.motivosFundamentos && item.motivosFundamentos.trim() !== "";
  const tieneSector = item.sector && item.sector !== "";
  const tieneHipervinculo =
    item.hipervinculo && item.hipervinculo.trim() !== "";

  // Campos de enajenación/avalúos
  const tieneDescripcion = item.descripcion && item.descripcion.trim() !== "";

  // Verificar si tiene al menos una responsabilidad marcada
  let tieneResponsabilidades = false;
  if (item.responsabilidades && item.responsabilidades.length > 0) {
    tieneResponsabilidades = item.responsabilidades.some(
      (resp: any) =>
        resp.elaborar ||
        resp.revisar ||
        resp.firmarAutorizar ||
        resp.supervisar ||
        resp.emitirSuscribir
    );
  }

  // Considera que tiene contenido significativo si tiene al menos uno de estos
  return (
    tieneTipoArea ||
    tieneNumeroExpediente ||
    tieneTipoProcedimiento ||
    tieneMateria ||
    tieneMonto ||
    tieneFechas ||
    tieneBeneficiario ||
    tieneResponsabilidades ||
    tieneTipoActoJuridico ||
    tieneDenominacion ||
    tieneObjeto ||
    tieneMotivos ||
    tieneSector ||
    tieneHipervinculo ||
    tieneDescripcion
  );
}

// Helper function para eliminar registros relacionados cuando se actualiza
async function eliminarRegistrosViejos(
  api: any,
  initialData: any,
  tipo: "contrataciones" | "obras" | "concesiones" | "enajenaciones" | "avaluos"
) {
  try {
    if (
      tipo === "contrataciones" &&
      initialData?.contratacionesAdquisiciones &&
      Array.isArray(initialData.contratacionesAdquisiciones)
    ) {
      console.log(
        `   Eliminando ${initialData.contratacionesAdquisiciones.length} contrataciones viejas...`
      );
      for (const contratacion of initialData.contratacionesAdquisiciones) {
        if (contratacion.id) {
          // Eliminar vínculos en tipos_adquisiciones_obras
          const vinculos = await api.request(
            readItems("tipos_adquisiciones_obras", {
              filter: { contratacionAdquisicion: { _eq: contratacion.id } },
            })
          );
          for (const vinculo of vinculos) {
            await api.request(
              deleteItem("tipos_adquisiciones_obras", vinculo.id)
            );
          }

          // Eliminar datos relacionados
          if (contratacion.datosContratacionPublica?.id) {
            await api.request(
              deleteItem(
                "datos_contrataciones_publicas",
                contratacion.datosContratacionPublica.id
              )
            );
          }
          if (contratacion.nivelResponsabilidadContratacion?.id) {
            await api.request(
              deleteItem(
                "niveles_responsabilidades_adquisiciones",
                contratacion.nivelResponsabilidadContratacion.id
              )
            );
          }
          if (contratacion.informacionPersonasBeneficiarias?.id) {
            await api.request(
              deleteItem(
                "datos_personas_beneficiarias",
                contratacion.informacionPersonasBeneficiarias.id
              )
            );
          }

          // Eliminar la contratación principal
          await api.request(
            deleteItem("datos_procedimientos_adquisiciones", contratacion.id)
          );
        }
      }
    }

    if (
      tipo === "obras" &&
      initialData?.obrasPublicas &&
      Array.isArray(initialData.obrasPublicas)
    ) {
      console.log(
        `   Eliminando ${initialData.obrasPublicas.length} obras viejas...`
      );
      for (const obra of initialData.obrasPublicas) {
        if (obra.id) {
          // Eliminar vínculos en tipos_adquisiciones_obras
          const vinculos = await api.request(
            readItems("tipos_adquisiciones_obras", {
              filter: { contratacionObra: { _eq: obra.id } },
            })
          );
          for (const vinculo of vinculos) {
            await api.request(
              deleteItem("tipos_adquisiciones_obras", vinculo.id)
            );
          }

          // Eliminar datos relacionados
          if (obra.datosGeneralesObra?.id) {
            await api.request(
              deleteItem("datos_generales_obras", obra.datosGeneralesObra.id)
            );
          }
          if (obra.nivelResponsabilidadObra?.id) {
            await api.request(
              deleteItem(
                "niveles_responsabilidades_obras",
                obra.nivelResponsabilidadObra.id
              )
            );
          }
          if (obra.informacionPersonasBeneficiarias?.id) {
            await api.request(
              deleteItem(
                "datos_personas_beneficiarias",
                obra.informacionPersonasBeneficiarias.id
              )
            );
          }

          // Eliminar la obra principal
          await api.request(deleteItem("datos_procedimientos_obras", obra.id));
        }
      }
    }

    if (
      tipo === "concesiones" &&
      initialData?.otorgamientoConcesion &&
      typeof initialData.otorgamientoConcesion === "object" &&
      initialData.otorgamientoConcesion.id
    ) {
      console.log(
        `   Eliminando concesión vieja ID: ${initialData.otorgamientoConcesion.id}...`
      );
      if (initialData.otorgamientoConcesion.datosGeneralesConcesiones?.id) {
        await api.request(
          deleteItem(
            "datos_generales_concesiones",
            initialData.otorgamientoConcesion.datosGeneralesConcesiones.id
          )
        );
      }
      if (
        initialData.otorgamientoConcesion.nivelResponsabilidadConcesiones?.id
      ) {
        await api.request(
          deleteItem(
            "niveles_responsabilidades_concesiones",
            initialData.otorgamientoConcesion.nivelResponsabilidadConcesiones.id
          )
        );
      }
      if (
        initialData.otorgamientoConcesion.informacionPersonasBeneficiarias?.id
      ) {
        await api.request(
          deleteItem(
            "datos_personas_beneficiarias",
            initialData.otorgamientoConcesion.informacionPersonasBeneficiarias
              .id
          )
        );
      }
      await api.request(
        deleteItem(
          "otorgamiento_concesiones",
          initialData.otorgamientoConcesion.id
        )
      );
    }

    if (
      tipo === "enajenaciones" &&
      initialData?.enajenacionBien &&
      typeof initialData.enajenacionBien === "object" &&
      initialData.enajenacionBien.id
    ) {
      console.log(
        `   Eliminando enajenación vieja ID: ${initialData.enajenacionBien.id}...`
      );
      if (initialData.enajenacionBien.datosEnajenacionesBienes?.id) {
        await api.request(
          deleteItem(
            "datos_enajenaciones_bienes",
            initialData.enajenacionBien.datosEnajenacionesBienes.id
          )
        );
      }
      if (
        initialData.enajenacionBien.nivelesResponsabilidadesEnajenaciones?.id
      ) {
        await api.request(
          deleteItem(
            "niveles_responsabilidades_enajenaciones",
            initialData.enajenacionBien.nivelesResponsabilidadesEnajenaciones.id
          )
        );
      }
      await api.request(
        deleteItem("enajenaciones_bienes", initialData.enajenacionBien.id)
      );
    }

    if (
      tipo === "avaluos" &&
      initialData?.avaluosJustipreciacion &&
      typeof initialData.avaluosJustipreciacion === "object" &&
      initialData.avaluosJustipreciacion.id
    ) {
      console.log(
        `   Eliminando avalúo viejo ID: ${initialData.avaluosJustipreciacion.id}...`
      );
      if (initialData.avaluosJustipreciacion.datosDictaminacionesAvaluos?.id) {
        await api.request(
          deleteItem(
            "datos_dictaminaciones_avaluos",
            initialData.avaluosJustipreciacion.datosDictaminacionesAvaluos.id
          )
        );
      }
      if (
        initialData.avaluosJustipreciacion.nivelesResponsabilidadesAvaluos?.id
      ) {
        await api.request(
          deleteItem(
            "niveles_responsabilidades_avaluos",
            initialData.avaluosJustipreciacion.nivelesResponsabilidadesAvaluos
              .id
          )
        );
      }
      await api.request(
        deleteItem(
          "dictaminaciones_avaluos",
          initialData.avaluosJustipreciacion.id
        )
      );
    }

    console.log(`   ✓ Registros viejos eliminados`);
  } catch (error: any) {
    console.warn(
      `   ⚠ Advertencia al eliminar registros viejos:`,
      error.message
    );
    // No lanzar error, solo advertencia - algunos registros pueden no existir
  }
}

export async function saveServidorContratacion(
  data: ServidoresContratacionesFormValues,
  initialData: any | null,
  accessToken: string
) {
  console.log("=== HANDLER: saveServidorContratacion ===");
  console.log(
    "1. Access Token recibido:",
    accessToken ? "SÍ (longitud: " + accessToken.length + ")" : "NO"
  );
  console.log(
    "2. Initial Data:",
    initialData ? "Editando registro ID: " + initialData.id : "Nuevo registro"
  );
  console.log("3. Datos recibidos:", {
    entePublico: data.entePublico,
    fecha: data.fecha,
    ejercicio: data.ejercicio,
    tipoProcedimiento: data.tipoProcedimiento,
    tieneDatosGenerales: !!data.datosGenerales,
    tieneEmpleo: !!data.empleoCargoComision,
  });

  if (!accessToken) {
    throw new Error(
      "No se proporcionó token de acceso. Verifica que la sesión esté activa."
    );
  }

  const api = directus(accessToken);

  // 1. Crear o actualizar registro de datos_generales si existe
  let datosGeneralesId: number | null = null;
  if (data.datosGenerales) {
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
      if (
        initialData?.datosGenerales &&
        typeof initialData.datosGenerales === "object" &&
        initialData.datosGenerales.id
      ) {
        // Actualizar registro existente
        console.log(
          "4. Actualizando datos_generales existente, ID:",
          initialData.datosGenerales.id
        );
        await api.request(
          updateItem(
            "datos_generales",
            initialData.datosGenerales.id,
            datosGeneralesData
          )
        );
        datosGeneralesId = initialData.datosGenerales.id;
        console.log("   ✓ datos_generales actualizado");
      } else {
        // Crear nuevo registro
        console.log("4. Creando nuevo datos_generales...");
        const datosGeneralesResult = await api.request(
          createItem("datos_generales", datosGeneralesData)
        );
        datosGeneralesId = (datosGeneralesResult as any).id;
        console.log("   ✓ datos_generales creado con ID:", datosGeneralesId);
      }
    } catch (error: any) {
      console.error("   ✗ Error al crear/actualizar datos_generales:", error);
      const errorMessage = extractErrorMessage(error);
      throw new Error(`Error al guardar datos generales: ${errorMessage}`);
    }
  }

  // 2. Crear o actualizar registro de empleos_cargos_comisiones si existe
  let empleoCargoComisionId: number | null = null;
  if (data.empleoCargoComision) {
    console.log("5. Procesando empleos_cargos_comisiones...");

    // 2.1 Primero, crear o actualizar registro de nivel jerárquico
    let nivelJerarquicoId: number | null = null;

    // Mapear valores del formulario a los valores de la BD
    const nivelJerarquicoMap: Record<string, string> = {
      OPERATIVO: "OPERATIVO_HOMOLOGO",
      ENLACE: "ENLACE_HOMOLOGO",
      JEFATURA_DEPARTAMENTO: "JEFATURA_DEPTO_HOMOLOGO",
      SUBDIRECCION_AREA: "SUBDIRECCION_HOMOLOGO",
      DIRECCION_AREA: "DIRECCION_HOMOLOGO",
      DIRECCION_GENERAL: "DG_HOMOLOGO",
      JEFATURA_UNIDAD: "JEFATURA_UNIDAD_HOMOLOGO",
      SUBSECRETARIA: "SUBSECRETARIA_HOMOLOGO",
      SECRETARIA: "SECRETARIA_HOMOLOGO",
      OTRO: "OTRO",
    };

    const nivelJerarquicoClave =
      nivelJerarquicoMap[data.empleoCargoComision.nivelJerarquico] || "OTRO";

    const nivelJerarquicoData = {
      clave: nivelJerarquicoClave,
      valor: data.empleoCargoComision.nivelJerarquicoOtro || null,
      entePublico: data.entePublico,
    };

    try {
      if (
        initialData?.empleoCargoComision &&
        typeof initialData.empleoCargoComision === "object" &&
        initialData.empleoCargoComision.nivelJerarquico &&
        typeof initialData.empleoCargoComision.nivelJerarquico === "object" &&
        initialData.empleoCargoComision.nivelJerarquico.id
      ) {
        // Actualizar nivel jerárquico existente
        console.log(
          "   5.1 Actualizando nivel_jerarquico existente, ID:",
          initialData.empleoCargoComision.nivelJerarquico.id
        );
        await api.request(
          updateItem(
            "niveles_jerarquicos",
            initialData.empleoCargoComision.nivelJerarquico.id,
            nivelJerarquicoData
          )
        );
        nivelJerarquicoId = initialData.empleoCargoComision.nivelJerarquico.id;
        console.log("   ✓ nivel_jerarquico actualizado");
      } else {
        // Crear nuevo nivel jerárquico
        console.log(
          "   5.1 Creando nuevo nivel_jerarquico:",
          nivelJerarquicoData
        );
        const nivelJerarquicoResult = await api.request(
          createItem("niveles_jerarquicos", nivelJerarquicoData)
        );
        nivelJerarquicoId = (nivelJerarquicoResult as any).id;
        console.log("   ✓ nivel_jerarquico creado con ID:", nivelJerarquicoId);
      }
    } catch (error: any) {
      console.error("   ✗ Error al crear/actualizar nivel_jerarquico:", error);
      const errorMessage = extractErrorMessage(error);
      throw new Error(`Error al guardar nivel jerárquico: ${errorMessage}`);
    }

    // 2.2 Ahora crear o actualizar el empleo con el ID del nivel jerárquico
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
    console.log(
      "   5.2 Datos de empleo a procesar:",
      JSON.stringify(empleoData, null, 2)
    );

    try {
      if (
        initialData?.empleoCargoComision &&
        typeof initialData.empleoCargoComision === "object" &&
        initialData.empleoCargoComision.id
      ) {
        // Actualizar empleo existente
        console.log(
          "   5.2 Actualizando empleos_cargos_comisiones existente, ID:",
          initialData.empleoCargoComision.id
        );
        await api.request(
          updateItem(
            "empleos_cargos_comisiones",
            initialData.empleoCargoComision.id,
            empleoData
          )
        );
        empleoCargoComisionId = initialData.empleoCargoComision.id;
        console.log("   ✓ empleos_cargos_comisiones actualizado");
      } else {
        // Crear nuevo empleo
        console.log("   5.2 Creando nuevo empleos_cargos_comisiones...");
        const empleoResult = await api.request(
          createItem("empleos_cargos_comisiones", empleoData)
        );
        empleoCargoComisionId = (empleoResult as any).id;
        console.log(
          "   ✓ empleos_cargos_comisiones creado con ID:",
          empleoCargoComisionId
        );
      }
    } catch (error: any) {
      console.error(
        "   ✗ Error al crear/actualizar empleos_cargos_comisiones:",
        error
      );
      const errorMessage = extractErrorMessage(error);
      throw new Error(`Error al guardar empleo: ${errorMessage}`);
    }
  }

  // 3. Procesar contrataciones de adquisiciones
  const contratacionesAdquisicionesIds: number[] = [];
  if (
    data.contratacionAdquisiciones &&
    data.contratacionAdquisiciones.length > 0
  ) {
    // Si estamos actualizando, primero eliminar las contrataciones viejas
    if (initialData) {
      await eliminarRegistrosViejos(api, initialData, "contrataciones");
    }

    // Filtrar solo las contrataciones que tienen contenido significativo
    const contratacionesConDatos = data.contratacionAdquisiciones.filter(
      tieneContenidoSignificativo
    );

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
          createItem("datos_personas_beneficiarias", beneficiarioData)
        );
        personaBeneficiariaId = (beneficiarioResult as any).id;
      }

      // 3.2 Crear niveles_responsabilidades_contrataciones_adquisiciones si hay responsabilidades
      let nivelesRespId: number | null = null;
      if (
        contratacion.responsabilidades &&
        contratacion.responsabilidades.length > 0
      ) {
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
          autorizacion: responsabilidadesMap[1] || null, // ID 1: Autorizaciones
          justificacion: responsabilidadesMap[2] || null, // ID 2: Justificación
          convocatoria: responsabilidadesMap[3] || null, // ID 3: Convocatoria
          evaluacion: responsabilidadesMap[4] || null, // ID 4: Evaluación
          adjudicacion: responsabilidadesMap[5] || null, // ID 5: Adjudicación
          formalizacion: responsabilidadesMap[6] || null, // ID 6: Formalización
        };

        console.log(
          "   3.2 Datos de niveles_responsabilidades_contrataciones_adquisiciones:",
          nivelesRespData
        );

        const nivelesRespResult = await api.request(
          createItem(
            "niveles_responsabilidades_contrataciones_adquisiciones",
            nivelesRespData
          )
        );
        nivelesRespId = (nivelesRespResult as any).id;
      }

      // 3.3 Crear contrataciones_adquisiciones
      const contratacionAdqData = {
        entePublico: data.entePublico,
        tipoArea: contratacion.tipoArea
          ? JSON.stringify(contratacion.tipoArea)
          : JSON.stringify([]),
        nivelResponsabilidadContratacion: nivelesRespId,
        informacionPersonasBeneficiarias: personaBeneficiariaId,
        continuaParticipando: contratacion.continuaParticipando ? "SI" : "NO",
      };

      const contratacionResult = await api.request(
        createItem("contrataciones_adquisiciones", contratacionAdqData)
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
          createItem("datos_contrataciones_publicas", datosContratacionData)
        );
      }
    }
  }

  // 4. Procesar obras públicas
  const obrasPublicasIds: number[] = [];
  if (data.obrasPublicas && data.obrasPublicas.length > 0) {
    // Si estamos actualizando, primero eliminar las obras viejas
    if (initialData) {
      await eliminarRegistrosViejos(api, initialData, "obras");
    }

    // Filtrar solo las obras que tienen contenido significativo
    const obrasConDatos = data.obrasPublicas.filter(
      tieneContenidoSignificativo
    );

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
          createItem("datos_personas_beneficiarias", beneficiarioData)
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

        console.log(
          "   4.2 Datos de niveles_responsabilidades_contrataciones_adquisiciones (obras):",
          nivelesRespData
        );

        const nivelesRespResult = await api.request(
          createItem(
            "niveles_responsabilidades_contrataciones_adquisiciones",
            nivelesRespData
          )
        );
        nivelesRespId = (nivelesRespResult as any).id;
      }

      // 4.3 Crear contrataciones_obras
      const obraData = {
        entePublico: data.entePublico,
        tipoArea: obra.tipoArea
          ? JSON.stringify(obra.tipoArea)
          : JSON.stringify([]),
        nivelResponsabilidadObra: nivelesRespId,
        informacionPersonasBeneficiarias: personaBeneficiariaId,
        continuaParticipando: obra.continuaParticipando ? "SI" : "NO",
      };

      const obraResult = await api.request(
        createItem("contrataciones_obras", obraData)
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

        await api.request(createItem("datos_generales_obras", datosObraData));
      }
    }
  }

  // 5. Procesar dictaminación de avalúos
  let avaluosJustipreciacionId: number | null = null;
  if (data.dictaminacionAvaluos && data.dictaminacionAvaluos.length > 0) {
    // Si estamos actualizando, primero eliminar los avalúos viejos
    if (initialData) {
      await eliminarRegistrosViejos(api, initialData, "avaluos");
    }

    // Filtrar solo los avalúos que tienen contenido significativo
    const avaluosConDatos = data.dictaminacionAvaluos.filter(
      tieneContenidoSignificativo
    );

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
        createItem("datos_dictaminaciones_avaluos", datosAvaluosData)
      );
      const datosAvaluosId = (datosAvaluosResult as any).id;

      // 3.2 Crear niveles_responsabilidades_avaluos si hay responsabilidades
      let nivelesRespAvaluosId: number | null = null;
      if (avaluo.responsabilidades && avaluo.responsabilidades.length > 0) {
        console.log("=== GUARDANDO AVALÚOS RESPONSABILIDADES ===");
        console.log(
          "Responsabilidades recibidas:",
          JSON.stringify(avaluo.responsabilidades, null, 2)
        );

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
        // BD tiene campos: propuestas, asignacion, emision
        // El formulario envía: id 1, 2, 3 y 4 (otro)
        const responsabilidadesMap: Record<number, string[]> = {};
        let otroTexto: string | null = null;

        avaluo.responsabilidades.forEach((resp: any) => {
          if (resp.identificador) {
            responsabilidadesMap[resp.identificador] = convertToArray(resp);

            // Si es la responsabilidad 4 (Otro) y tiene texto, guardarlo
            if (
              resp.identificador === 4 &&
              resp.objetoResponsabilidad &&
              resp.objetoResponsabilidad.trim() !== ""
            ) {
              otroTexto = resp.objetoResponsabilidad;
            }
          }
        });

        console.log("Responsabilidades mapeadas:", responsabilidadesMap);
        console.log("Texto del 'Otro':", otroTexto);

        // CORREGIDO: Usar los nombres correctos de los campos de la BD
        // Según colecciones.yaml:
        // - propuestas (campo 1)
        // - asignacion (campo 2)
        // - emision (campo 3)
        const nivelesRespData: any = {
          entePublico: data.entePublico,
          propuestas:
            responsabilidadesMap[1] && responsabilidadesMap[1].length > 0
              ? responsabilidadesMap[1]
              : null,
          asignacion:
            responsabilidadesMap[2] && responsabilidadesMap[2].length > 0
              ? responsabilidadesMap[2]
              : null,
          emision:
            responsabilidadesMap[3] && responsabilidadesMap[3].length > 0
              ? responsabilidadesMap[3]
              : null,
        };

        console.log(
          "Objeto nivelesRespData a guardar:",
          JSON.stringify(nivelesRespData, null, 2)
        );

        const nivelesRespResult = await api.request(
          createItem("niveles_responsabilidades_avaluos", nivelesRespData)
        );
        nivelesRespAvaluosId = (nivelesRespResult as any).id;
        console.log(
          "✓ niveles_responsabilidades_avaluos creado con ID:",
          nivelesRespAvaluosId
        );

        // Si hay texto para "Otro", crear registro en tabla separada niveles_responsabilidades_otro_avaluos
        if (
          otroTexto &&
          responsabilidadesMap[4] &&
          responsabilidadesMap[4].length > 0
        ) {
          console.log("Guardando 'Otro' en tabla separada...");
          const otroData = {
            fk_otro_niveles_responsabilidades_avaluos: nivelesRespAvaluosId,
            entePublico: data.entePublico,
            otroEspecifique: otroTexto,
            // Los checkboxes se guardan como array
            responsabilidad: responsabilidadesMap[4],
          };

          console.log(
            "Datos de 'Otro' a guardar:",
            JSON.stringify(otroData, null, 2)
          );

          await api.request(
            createItem("niveles_responsabilidades_otro_avaluos", otroData)
          );
          console.log("✓ niveles_responsabilidades_otro_avaluos creado");
        }
      }

      // 3.3 Crear dictaminaciones_avaluos
      const dictaminacionData = {
        entePublico: data.entePublico,
        nivelesResponsabilidadesAvaluos: nivelesRespAvaluosId,
        datosDictaminacionesAvaluos: datosAvaluosId,
        continuaParticipando: avaluo.continuaParticipando ? "SI" : "NO",
      };

      const dictaminacionResult = await api.request(
        createItem("dictaminaciones_avaluos", dictaminacionData)
      );
      avaluosJustipreciacionId = (dictaminacionResult as any).id;
    }
  }

  // 6. Procesar enajenación de bienes
  let enajenacionBienId: number | null = null;
  if (data.enajenacionBienes && data.enajenacionBienes.length > 0) {
    // Si estamos actualizando, primero eliminar las enajenaciones viejas
    if (initialData) {
      await eliminarRegistrosViejos(api, initialData, "enajenaciones");
    }

    // Filtrar solo las enajenaciones que tienen contenido significativo
    const enajenacionesConDatos = data.enajenacionBienes.filter(
      tieneContenidoSignificativo
    );

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
        createItem("datos_enajenaciones_bienes", datosEnajenacionData)
      );
      const datosEnajenacionId = (datosEnajenacionResult as any).id;

      // 4.2 Crear niveles_responsabilidades_enajenaciones si hay responsabilidades
      let nivelesRespEnajenacionId: number | null = null;
      if (
        enajenacion.responsabilidades &&
        enajenacion.responsabilidades.length > 0
      ) {
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

        // Mapeo según EnajenacionBienesSection.tsx (actualizado)
        // 1: Autorizaciones o dictámenes previos
        // 2: Análisis o autorización para donación, permuta o dación en pago
        // 3: Modificaciones a las bases
        // 4: Presentación y apertura de ofertas
        // 5: Evaluación de ofertas
        // 6: Adjudicación de los bienes muebles
        // 7: Formalización del contrato
        // 8: Otro (Especifique)

        const nivelesRespData = {
          entePublico: data.entePublico,
          autorizaciones: responsabilidadesMap[1] || null, // 1: Autorizaciones o dictámenes previos
          analisis: responsabilidadesMap[2] || null, // 2: Análisis o autorización para donación
          modificaciones: responsabilidadesMap[3] || null, // 3: Modificaciones a las bases
          presentacion: responsabilidadesMap[4] || null, // 4: Presentación y apertura de ofertas
          evaluacion: responsabilidadesMap[5] || null, // 5: Evaluación de ofertas
          adjudicacion: responsabilidadesMap[6] || null, // 6: Adjudicación
          formalizacoin: responsabilidadesMap[7] || null, // 7: Formalización (NOTA: typo en BD)
        };

        console.log(
          "   6.2 Datos de niveles_responsabilidades_enajenaciones:",
          nivelesRespData
        );

        const nivelesRespResult = await api.request(
          createItem("niveles_responsabilidades_enajenaciones", nivelesRespData)
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
        createItem("enajenaciones_bienes", enajenacionData)
      );
      enajenacionBienId = (enajenacionResult as any).id;
    }
  }

  // 7. Procesar otorgamiento de concesiones
  let otorgamientoConcesionId: number | null = null;
  if (data.otorgamientoConcesiones && data.otorgamientoConcesiones.length > 0) {
    console.log("=== GUARDANDO CONCESIONES ===");
    console.log(
      "Datos completos de otorgamientoConcesiones:",
      JSON.stringify(data.otorgamientoConcesiones, null, 2)
    );

    // Si estamos actualizando, primero eliminar las concesiones viejas
    if (initialData) {
      await eliminarRegistrosViejos(api, initialData, "concesiones");
    }

    // Filtrar solo las concesiones que tienen contenido significativo
    const concesionesConDatos = data.otorgamientoConcesiones.filter(
      tieneContenidoSignificativo
    );
    console.log(
      "Concesiones con datos después del filtro:",
      concesionesConDatos.length
    );

    if (concesionesConDatos.length > 0) {
      const concesion = concesionesConDatos[0];
      console.log(
        "Datos de la concesión a guardar:",
        JSON.stringify(concesion, null, 2)
      );

      // 5.1 Crear datos_generales_concesiones (antes datos_otorgamientos_concesiones)
      const datosConcesionData = {
        numeroExpedienteFolio: concesion.numeroExpediente || null,
        denominacion: concesion.denominacion || null,
        objeto: concesion.objeto || null,
        fundamento: concesion.motivosFundamentos || null,
        nombrePersonaFisica: concesion.nombrePersonaFisica || null,
        denominacionPersonaMoral: concesion.razonSocialPersonaMoral || null,
        sectorActoJuridico:
          concesion.tipoActoJuridico && concesion.tipoActoJuridico.length > 0
            ? JSON.stringify(concesion.tipoActoJuridico)
            : null,
        sector: concesion.sector || null, // Sector (Público/Privado)
        fechaInicioVigencia: concesion.fechaInicioVigencia || null,
        fechaConclusionVigencia: concesion.fechaConclusionVigencia || null,
        urlActoJuridico: concesion.hipervinculo || null,
        monto: concesion.monto ? parseFloat(concesion.monto) : null,
        entePublico: data.entePublico,
      };

      console.log(
        "Objeto datosConcesionData a guardar en BD:",
        JSON.stringify(datosConcesionData, null, 2)
      );

      const datosConcesionResult = await api.request(
        createItem("datos_generales_concesiones", datosConcesionData)
      );
      const datosConcesionId = (datosConcesionResult as any).id;
      console.log(
        "✓ datos_generales_concesiones creado con ID:",
        datosConcesionId
      );
      console.log(
        "Resultado completo:",
        JSON.stringify(datosConcesionResult, null, 2)
      );

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
          createItem("datos_personas_beneficiarias", beneficiarioData)
        );
        personaBeneficiariaId = (beneficiarioResult as any).id;
      }

      // 5.3 Crear niveles_responsabilidades_concesiones si hay responsabilidades
      let nivelesRespConcesionId: number | null = null;
      if (
        concesion.responsabilidades &&
        concesion.responsabilidades.length > 0
      ) {
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
          convocatoria: responsabilidadesMap[1] || null, // ID 1: Convocatoria
          dictamenes: responsabilidadesMap[2] || null, // ID 2: Dictámenes
          visitas: responsabilidadesMap[3] || null, // ID 3: Visitas
          evaluacion: responsabilidadesMap[4] || null, // ID 4: Evaluación
          determinacion: responsabilidadesMap[5] || null, // ID 5: Determinación
          otro: responsabilidadesMap[6] || null, // ID 6: Otro (Especifique)
        };

        console.log(
          "   7.3 Datos de niveles_responsabilidades_concesiones:",
          nivelesRespData
        );

        const nivelesRespResult = await api.request(
          createItem("niveles_responsabilidades_concesiones", nivelesRespData)
        );
        nivelesRespConcesionId = (nivelesRespResult as any).id;
      }

      // 5.4 Crear otorgamientos_concesiones
      const otorgamientoData = {
        entePublico: data.entePublico,
        tipoActo: concesion.tipoActoJuridico
          ? JSON.stringify(concesion.tipoActoJuridico)
          : null,
        nivelResponsabilidadConcesiones: nivelesRespConcesionId,
        datosGeneralesConcesiones: datosConcesionId,
        informacionPersonasBeneficiarias: personaBeneficiariaId,
        continuaParticipando: concesion.continuaParticipando ? "SI" : "NO",
      };

      const otorgamientoResult = await api.request(
        createItem("otorgamientos_concesiones", otorgamientoData)
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

      // Actualizar date_updated al editar con la fecha actual
      mainData.date_updated = new Date().toISOString();

      await api.request(
        updateItem(
          "servidores_intervengan_procedimientos_contrataciones",
          initialData.id,
          mainData
        )
      );
      console.log("   ✓ Registro actualizado");
    } else {
      // Crear nuevo registro
      console.log(
        "   Creando nuevo registro en servidores_intervengan_procedimientos_contrataciones..."
      );

      // Establecer date_updated al crear nuevo registro (misma fecha que date_created)
      mainData.date_updated = new Date().toISOString();

      const servidorResult = await api.request(
        createItem(
          "servidores_intervengan_procedimientos_contrataciones",
          mainData
        )
      );
      servidorId = (servidorResult as any).id;
      console.log("   ✓ Registro principal creado con ID:", servidorId);
    }
  } catch (error: any) {
    console.error("   ✗ Error al crear/actualizar registro principal:", error);
    console.error("   Detalles del error:", error.errors || error.message);
    const errorMessage = extractErrorMessage(error);
    throw new Error(`Error al guardar registro principal: ${errorMessage}`);
  }

  // 9. Crear registros en tipos_adquisiciones_obras para vincular contrataciones y obras
  // con el registro principal
  if (
    contratacionesAdquisicionesIds.length > 0 ||
    obrasPublicasIds.length > 0
  ) {
    console.log("7. Creando vínculos en tipos_adquisiciones_obras...");
  }

  for (const contratacionId of contratacionesAdquisicionesIds) {
    try {
      await api.request(
        createItem("tipos_adquisiciones_obras", {
          contratacionAdquisicion: contratacionId,
          entePublico: data.entePublico,
          clave: "CONTRATACION_ADQUISICION",
          fk_id: servidorId,
        })
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
        createItem("tipos_adquisiciones_obras", {
          contratacionObra: obraId,
          entePublico: data.entePublico,
          clave: "CONTRATACION_OBRA",
          fk_id: servidorId,
        })
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

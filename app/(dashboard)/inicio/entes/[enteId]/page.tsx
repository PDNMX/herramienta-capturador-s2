// @ts-nocheck
"use client"

import BreadCrumb from "@/components/breadcrumb";
import { ServidoresContratacionesForm } from "@/components/forms/servidoresContrataciones/servidores-contrataciones-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState } from "react";
import { directus } from "@/services/directus";
import { readItems } from "@directus/sdk";

export default function Page({ params }) {
  const { enteId } = params;
  const { session, status } = useCurrentSession();

  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    {
      title: "Registros",
      link: "/inicio/entes"
    },
    {
      title: "Editar",
      link: `/inicio/entes/${enteId}`
    },
  ];

  useEffect(() => {
    if (status === "authenticated" && session?.access_token) {
      async function fetchData() {
        try {
          setLoading(true);
          const api = directus(session.access_token);
          const result = await api.request(
            readItems("servidores_intervengan_procedimientos_contrataciones", {
              limit: 1,
              fields: [
                "*",
                "datosGenerales.*",
                "empleoCargoComision.*",
                "empleoCargoComision.nivelJerarquico.*",
                "avaluosJustipreciacion.*",
                "avaluosJustipreciacion.nivelesResponsabilidadesAvaluos.*",
                "avaluosJustipreciacion.datosDictaminacionesAvaluos.*",
                "enajenacionBien.*",
                "enajenacionBien.nivelesResponsabilidadesEnajenaciones.*",
                "enajenacionBien.datosEnajenacionesBienes.*",
                "otorgamientoConcesion.*",
                "otorgamientoConcesion.nivelResponsabilidadConcesiones.*",
                "otorgamientoConcesion.datosGeneralesConcesiones.*",
                "otorgamientoConcesion.informacionPersonasBeneficiarias.*"
              ],
              filter: {
                id: {
                  _eq: enteId,
                },
              },
              deep: {
                datosGenerales: {
                  _filter: {}
                },
                empleoCargoComision: {
                  _filter: {},
                  nivelJerarquico: {
                    _filter: {}
                  }
                },
                avaluosJustipreciacion: {
                  _filter: {},
                  nivelesResponsabilidadesAvaluos: {
                    _filter: {}
                  },
                  datosDictaminacionesAvaluos: {
                    _filter: {}
                  }
                },
                enajenacionBien: {
                  _filter: {},
                  nivelesResponsabilidadesEnajenaciones: {
                    _filter: {}
                  },
                  datosEnajenacionesBienes: {
                    _filter: {}
                  }
                },
                otorgamientoConcesion: {
                  _filter: {},
                  nivelResponsabilidadConcesiones: {
                    _filter: {}
                  },
                  datosGeneralesConcesiones: {
                    _filter: {}
                  },
                  informacionPersonasBeneficiarias: {
                    _filter: {}
                  }
                }
              }
            })
          );

          if (result && result.length > 0) {
            const registro = result[0];

            // Cargar contrataciones y obras relacionadas vía tipos_adquisiciones_obras
            try {
              const tiposResult = await api.request(
                readItems("tipos_adquisiciones_obras", {
                  filter: {
                    fk_id: {
                      _eq: enteId,
                    },
                  },
                  fields: [
                    "*",
                    "contratacionAdquisicion.*",
                    "contratacionAdquisicion.nivelResponsabilidadContratacion.*",
                    "contratacionAdquisicion.informacionPersonasBeneficiarias.*",
                    "contratacionObra.*",
                    "contratacionObra.nivelResponsabilidadObra.*",
                    "contratacionObra.informacionPersonasBeneficiarias.*"
                  ],
                  deep: {
                    contratacionAdquisicion: {
                      _filter: {},
                      nivelResponsabilidadContratacion: {
                        _filter: {}
                      },
                      informacionPersonasBeneficiarias: {
                        _filter: {}
                      }
                    },
                    contratacionObra: {
                      _filter: {},
                      nivelResponsabilidadObra: {
                        _filter: {}
                      },
                      informacionPersonasBeneficiarias: {
                        _filter: {}
                      }
                    }
                  }
                })
              );

              // Separar contrataciones y obras
              const contrataciones = tiposResult
                .filter((t: any) => t.contratacionAdquisicion && typeof t.contratacionAdquisicion === 'object')
                .map((t: any) => t.contratacionAdquisicion);

              const obras = tiposResult
                .filter((t: any) => t.contratacionObra && typeof t.contratacionObra === 'object')
                .map((t: any) => t.contratacionObra);

              // Cargar datos_contrataciones_publicas para cada contratación
              if (contrataciones.length > 0) {
                for (let i = 0; i < contrataciones.length; i++) {
                  try {
                    const datosContratacionResult = await api.request(
                      readItems("datos_contrataciones_publicas", {
                        filter: {
                          fk_datos_procedimientos_adquisiciones: {
                            _eq: contrataciones[i].id
                          }
                        },
                        limit: 1
                      })
                    );
                    if (datosContratacionResult && datosContratacionResult.length > 0) {
                      contrataciones[i].datosContratacionPublica = datosContratacionResult[0];
                    }
                  } catch (err) {
                    console.warn("No se encontraron datos de contratación para:", contrataciones[i].id);
                  }
                }
              }

              // Cargar datos_generales_obras para cada obra
              if (obras.length > 0) {
                for (let i = 0; i < obras.length; i++) {
                  try {
                    const datosObraResult = await api.request(
                      readItems("datos_generales_obras", {
                        filter: {
                          fk_fatos_procedimientos_obras: {
                            _eq: obras[i].id
                          }
                        },
                        limit: 1
                      })
                    );
                    if (datosObraResult && datosObraResult.length > 0) {
                      obras[i].datosGeneralesObra = datosObraResult[0];
                    }
                  } catch (err) {
                    console.warn("No se encontraron datos de obra para:", obras[i].id);
                  }
                }
              }

              // Agregar contrataciones y obras al registro
              registro.contratacionesAdquisiciones = contrataciones;
              registro.obrasPublicas = obras;

              console.log("Contrataciones cargadas:", contrataciones);
              console.log("Obras cargadas:", obras);
            } catch (error) {
              console.warn("No se pudieron cargar contrataciones/obras:", error);
            }

            setRegistro(registro);
            console.log("Registro completo cargado:", registro);
          }
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [session, status, enteId]);

  // Mostrar loader mientras carga
  if (status === "loading" || loading) {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-5">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando...</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <ServidoresContratacionesForm
          initialData={registro}
          key={enteId}
        />
      </div>
    </ScrollArea>
  );
}

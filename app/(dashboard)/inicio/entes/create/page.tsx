// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { ServidoresContratacionesForm } from "@/components/forms/servidoresContrataciones/servidores-contrataciones-form";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState } from "react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";

export default function Page({ params }) {
  const { faltaId } = params;
  const { session, status } = useCurrentSession();

  const [falta, setFalta] = useState(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    {
      title:
        "Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas",
      link: "/inicio/entes",
    },
    {
      title: faltaId ? "Editar" : "Nueva",
      link: faltaId ? `/inicio/entes/${faltaId}` : "/inicio/entes/create",
    },
  ];

  useEffect(() => {
    if (status === "authenticated" && faltaId) {
      async function fetchData() {
        try {
          setLoading(true);
          const result = await directus.request(
            withToken(
              session?.access_token,
              readItems(
                "servidores_intervengan_en_procedimientos_de_contrataciones",
                {
                  limit: 1,
                  fields: ["*", "datosGenerales.*"],
                  filter: {
                    id: {
                      _eq: j,
                    },
                  },
                }
              )
            )
          );

          if (result && result.length > 0) {
            setFalta(result[0]);
            console.log("Falta cargada:", result[0]);
          }
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    } else if (status === "authenticated" && !faltaId) {
      // Si no hay faltaId, es un registro nuevo
      setLoading(false);
    }
  }, [session, status, faltaId]);

  // Mostrar loader mientras carga
  if (status === "loading" || (loading && faltaId)) {
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
          initialData={falta}
          key={faltaId || "new"}
        />
      </div>
    </ScrollArea>
  );
}

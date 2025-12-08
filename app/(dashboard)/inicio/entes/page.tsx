// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { EntesTable } from "@/components/tables/entes-table/table";
import { directus } from "@/services/directus";
import { readItems } from "@directus/sdk";
import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";

const breadcrumbItems = [{ title: "Registros", link: "/inicio/entes" }];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [registros, setRegistros] = useState([]);
  console.log(session)

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated" && session?.access_token) {
      async function fetchData() {
        try {
          const api = directus(session.access_token);
          const result = await api.request(
            readItems("servidores_intervengan_procedimientos_contrataciones", {
              sort: ["-fecha"],
              limit: -1,
              fields: [
                "id",
                "fecha",
                "ejercicio",
                "datosGenerales.*",
                "empleoCargoComision.*",
              ],
              filter: {
                entePublico: {
                  _eq: session?.user?.entePublico,
                },
                esta_activo: {
                  _eq: true,
                },
              },
              deep: {
                datosGenerales: {
                  _filter: {}
                },
                empleoCargoComision: {
                  _filter: {}
                }
              }
            })
          );

          setRegistros(result);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }

      fetchData();
    }
  }, [session, status]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <EntesTable data={registros} />
    </div>
  );
}

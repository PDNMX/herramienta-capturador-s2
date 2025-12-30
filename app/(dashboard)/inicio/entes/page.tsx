// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { EntesTable } from "@/components/tables/entes-table/table";
import { directus } from "@/services/directus";
import { readItems } from "@directus/sdk";
import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const breadcrumbItems = [{ title: "Registros", link: "/inicio/entes" }];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [registros, setRegistros] = useState([]);
  const [showExpiredAlert, setShowExpiredAlert] = useState(false);
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
                "date_updated",
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

          // Verificar si hay registros expirados (15 días o más sin actualizar)
          const hasExpiredRecords = result.some((registro: any) => {
            if (!registro.date_updated) return true;

            const today = new Date();
            const updatedDate = new Date(registro.date_updated);
            const diffTime = Math.abs(today.getTime() - updatedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return diffDays >= 15;
          });

          // Mostrar alerta solo si hay registros expirados y no se ha mostrado antes
          const alertShown = sessionStorage.getItem("expiredAlertShown");
          if (hasExpiredRecords && !alertShown) {
            setShowExpiredAlert(true);
            sessionStorage.setItem("expiredAlertShown", "true");
          }
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }

      fetchData();
    }
  }, [session, status]);

  return (
    <>
      <AlertDialog open={showExpiredAlert} onOpenChange={setShowExpiredAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registros requieren actualización</AlertDialogTitle>
            <AlertDialogDescription>
              Hay registros que deben actualizar si la persona servidora pública sigue participando en los procesos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowExpiredAlert(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <EntesTable data={registros} />
      </div>
    </>
  );
}

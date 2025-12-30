// @ts-nocheck
"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { directus } from "@/services/directus";
import { useToast } from "@/components/ui/use-toast";
import { updateItem } from "@directus/sdk";
import Link from "next/link";

export const CellAction = ({ data, session }: any) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("deactivated") === "true") {
      toast({
        variant: "default",
        title: "Registro desactivado exitosamente",
      });
      localStorage.removeItem("deactivated");
    }
  }, []);

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (data && session?.access_token) {
        const api = directus(session.access_token);
        await api.request(
          updateItem("servidores_intervengan_procedimientos_contrataciones", data.id, {
            esta_activo: false
          })
        );
        localStorage.setItem("deactivated", "true");
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al desactivar",
        description: "Hubo un problema al desactivar el registro.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="¿Desactivar registro?"
        description="El registro será desactivado y dejará de aparecer en las consultas activas."
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <Link href={`/inicio/entes/${data.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer">
            <Ban className="mr-2 h-4 w-4" /> Desactivar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

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
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { directus } from "@/services/directus";
import { useToast } from "@/components/ui/use-toast";
import { deleteItem } from "@directus/sdk";
import Link from "next/link";

export const CellAction = ({ data, session }: any) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("deleted") === "true") {
      toast({
        variant: "default",
        title: "Registro eliminado exitosamente",
      });
      localStorage.removeItem("deleted");
    }
  }, []);

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (data && session?.access_token) {
        const api = directus(session.access_token);
        await api.request(
          deleteItem("servidores_intervengan_procedimientos_contrataciones", data.id)
        );
        localStorage.setItem("deleted", "true");
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "Hubo un problema al eliminar el registro.",
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
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

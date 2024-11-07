// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns"; // Asegúrate de importar createColumns
import { useCurrentSession } from "@/hooks/useCurrentSession"; // Asegúrate de importar useCurrentSession

export const EntesTable = ({ data }: any) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Entes Públicos"
          description="Administrar Entes Públicos"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/inicio/entes/create`)}>
          <Plus className="mr-2 h-4 w-4" /> Agregar nuevo
        </Button>
      </div>
      <Separator />

      <DataTable
        searchKey="nombre"
        columns={columns}
        data={data}
      />
    </>
  );
};

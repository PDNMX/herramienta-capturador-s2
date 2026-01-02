// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const EntesTable = ({ data }: any) => {
  const router = useRouter();
  const { session } = useCurrentSession();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Registros de Servidores Públicos"
          description="Gestionar servidores que intervengan en procedimientos de contrataciones"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/inicio/entes/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar nuevo
        </Button>
      </div>
      <Separator />

      <Tabs defaultValue="registros" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registros">
            Registros ({data.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registros" className="space-y-4">
          <DataTable
            searchKey="nombre"
            columns={createColumns(session)}
            data={data}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
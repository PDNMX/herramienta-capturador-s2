"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ServidoresContratacionesForm } from "@/components/forms/servidores-contrataciones/servidores-contrataciones-form";

export default function ServidoresContratacionesPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Servidores que intervengan en Procedimientos de Contrataciones
          </h2>
        </div>

        <ServidoresContratacionesForm />
      </div>
    </ScrollArea>
  );
}

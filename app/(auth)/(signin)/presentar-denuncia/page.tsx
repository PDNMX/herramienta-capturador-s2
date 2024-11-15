// @ts-nocheck
"use client";

import { DenunciaForm } from "@/components/forms/denuncia-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <DenunciaForm initialData={null} key={null} />
      </div>
    </ScrollArea>
  );
}
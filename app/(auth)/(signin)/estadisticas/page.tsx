"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Estadisticas } from "@/components/tables/estadistica-table/estadisticas"
import React from "react"

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Panel de Estadísticas</h2>
        </div>
        <Estadisticas />
      </div>
    </ScrollArea>
  )
}


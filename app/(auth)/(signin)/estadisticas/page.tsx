"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Estadisticas } from "@/components/tables/estadistica-table/estadisticas"
import React from "react"

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Estadisticas />
      </div>
    </ScrollArea>
  )
}


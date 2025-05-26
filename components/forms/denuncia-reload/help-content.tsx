// @ts-nocheck
"use client"

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AsistenteLegalChat } from "@/components/ia/asistente-legal-chat"

interface HelpContentProps {
  step: number
}

export function HelpContent({ step }: HelpContentProps) {
  const helpContent = [
    {
      title: "Datos del Denunciante",
      description:
        "En esta sección, proporcione la información del denunciante. Puede optar por hacer una denuncia anónima o proporcionar sus datos personales.",
    },
    {
      title: "Datos de los Hechos",
      description:
        "Indique dónde y cuándo ocurrió el incidente que está denunciando. Sea lo más específico posible con la dirección y la fecha.",
    },
    {
      title: "Datos de la Persona Denunciada",
      description:
        "Proporcione información sobre la persona que está denunciando. Puede ser un servidor público o un particular.",
    },
    {
      title: "Hechos y Faltas Cometidas",
      description:
        "Seleccione las faltas que considera que se han cometido. Puede elegir entre faltas graves, no graves y hechos de corrupción.",
    },
    {
      title: "Pruebas y Testigos",
      description:
        "Adjunte documentos o archivos que respalden su denuncia y proporcione información sobre testigos que puedan corroborar los hechos.",
    },
  ]

  return (
    <SheetContent className="overflow-y-auto max-h-screen">
      <SheetHeader>
        <SheetTitle>{helpContent[step].title}</SheetTitle>
        <SheetDescription>{helpContent[step].description}</SheetDescription>
            {/* Chat insertado aquí */}
            <AsistenteLegalChat />
      </SheetHeader>
    </SheetContent>
  )
}

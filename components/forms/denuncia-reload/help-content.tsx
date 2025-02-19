//@ts-nocheck
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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
      title: "Ubicación del Hecho",
      description:
        "Indique dónde y cuándo ocurrió el incidente que está denunciando. Sea lo más específico posible con la dirección y la fecha.",
    },
    {
      title: "Persona Denunciada",
      description:
        "Proporcione información sobre la persona que está denunciando. Puede ser un servidor público o un particular.",
    },
    {
      title: "Faltas Cometidas",
      description:
        "Seleccione las faltas que considera que se han cometido. Puede elegir entre faltas graves, no graves y hechos de corrupción.",
    },
    {
      title: "Narración y Evidencia",
      description:
        "Describa en detalle lo sucedido y adjunte cualquier evidencia que pueda tener para respaldar su denuncia.",
    },
  ]

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{helpContent[step].title}</SheetTitle>
        <SheetDescription>{helpContent[step].description}</SheetDescription>
      </SheetHeader>
    </SheetContent>
  )
}


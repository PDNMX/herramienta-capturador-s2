// @ts-nocheck
"use client"

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AsistenteLegalChat } from "@/components/ia/asistente-legal-chat"
import { User, MapPin, UserCheck, MessageCircle, FileText, AlertCircle, CheckCircle, Info } from "lucide-react"

interface HelpContentProps {
  step: number
}

export function HelpContent({ step }: HelpContentProps) {
  const helpContent = [
    {
      title: "Datos del Denunciante",
      description:
        "En esta sección, proporcione la información del denunciante. Puede optar por hacer una denuncia anónima o proporcionar sus datos personales.",
      icon: User,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      tips: [
        "Puede elegir mantener su identidad anónima",
        "Si proporciona datos, asegúrese de que sean correctos",
        "La información personal está protegida por ley",
      ],
    },
    {
      title: "Datos de los Hechos",
      description:
        "Indique dónde y cuándo ocurrió el incidente que está denunciando. Sea lo más específico posible con la dirección y la fecha.",
      icon: MapPin,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      tips: [
        "Proporcione la dirección más exacta posible",
        "Incluya fecha y hora si las recuerda",
        "Agregue referencias adicionales del lugar",
      ],
    },
    {
      title: "Datos de la Persona Denunciada",
      description:
        "Proporcione información sobre la persona que está denunciando. Puede ser un servidor público o un particular.",
      icon: UserCheck,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      tips: [
        "Especifique si es servidor público o particular",
        "Proporcione el nombre si lo conoce",
        "Incluya el cargo o función si aplica",
      ],
    },
    {
      title: "Asistente de IA",
      description:
        "Este asistente está diseñado para ayudarte a presentar una denuncia relacionada con faltas administrativas graves, no graves o hechos de corrupción. A través de preguntas guiadas, te apoyará para construir una descripción clara y estructurada de los hechos según lo que vayas narrando.",
      icon: MessageCircle,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      tips: [
        "Describa los hechos de manera clara y cronológica",
        "Use el asistente para estructurar mejor su narración",
        "Sea específico con fechas, lugares y personas involucradas",
      ],
    },
    {
      title: "Pruebas y Testigos",
      description:
        "Adjunte documentos o archivos que respalden su denuncia y proporcione información sobre testigos que puedan corroborar los hechos.",
      icon: FileText,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      tips: [
        "Adjunte documentos, fotos o videos relevantes",
        "Proporcione datos de contacto de testigos",
        "Asegúrese de que los archivos sean legibles",
      ],
    },
  ]

  const currentContent = helpContent[step]
  const Icon = currentContent.icon

  return (
    <SheetContent className="overflow-y-auto max-h-screen w-full sm:max-w-lg">
      <div className="space-y-6 pb-6">
        {/* Header mejorado */}
        <SheetHeader className="space-y-4 pb-4 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${currentContent.bgColor} ${currentContent.borderColor} border`}>
              <Icon className={`h-6 w-6 ${currentContent.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <SheetTitle className="text-xl font-bold text-foreground">{currentContent.title}</SheetTitle>
                {step === 3 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 shadow-sm">
                    BETA
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Sección del chat mejorada */}
        <div className="space-y-3">
          {/* Aviso importante para el paso 4 (Asistente IA) */}
          {step === 3 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/60">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">¡Usa el Asistente de IA!</h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    Este es el momento perfecto para usar el asistente. Te ayudará a estructurar tu narración de manera
                    clara y completa, asegurándote de incluir todos los detalles importantes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chat component */}
          <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
            <AsistenteLegalChat />
          </div>
        </div>
      </div>
    </SheetContent>
  )
}

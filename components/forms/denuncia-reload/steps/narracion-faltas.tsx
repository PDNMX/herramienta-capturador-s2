//@ts-nocheck
"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mic, Square, ClipboardList } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UseFormReturn } from "react-hook-form"

declare var webkitSpeechRecognition: any
declare var SpeechRecognition: any

const faltasGraves = [
  {
    id: 1,
    label: "Cohecho",
    description: "Aceptar sobornos o dádivas para realizar acciones relacionadas con su función",
  },
  { id: 2, label: "Peculado", description: "Apropiación o uso indebido de bienes públicos" },
  {
    id: 3,
    label: "Desvío de recursos públicos",
    description: "Utilizar recursos públicos para fines distintos a los autorizados",
  },
  {
    id: 4,
    label: "Abuso de funciones",
    description: "Ejercer atribuciones que no tiene conferidas o usar las que tiene para obtener beneficios",
  },
  {
    id: 5,
    label: "Actuación bajo conflicto de interés",
    description: "Intervenir en asuntos donde tiene interés personal o familiar",
  },
]

const faltasNoGraves = [
  {
    id: 6,
    label: "Negligencia administrativa",
    description: "Descuido en el cumplimiento de obligaciones sin intención de causar daño",
  },
  {
    id: 7,
    label: "Incumplimiento de funciones",
    description: "No realizar las tareas encomendadas conforme a normativa",
  },
  {
    id: 8,
    label: "Descuido en la conservación de recursos",
    description: "No cuidar adecuadamente los bienes asignados",
  },
  {
    id: 9,
    label: "Omisión en la declaración patrimonial",
    description: "No presentar o presentar de manera incompleta la declaración patrimonial",
  },
  {
    id: 10,
    label: "Violación de procedimientos de contratación",
    description: "Incumplir los procedimientos establecidos en materia de contrataciones",
  },
]

const hechosCorrupcion = [
  { id: 11, label: "Soborno", description: "Ofrecer, entregar o recibir beneficios indebidos a cambio de favores" },
  {
    id: 12,
    label: "Malversación de fondos",
    description: "Uso indebido de fondos públicos para beneficio propio o de terceros",
  },
  {
    id: 13,
    label: "Tráfico de influencias",
    description: "Utilizar relaciones o posición para obtener beneficios indebidos",
  },
  {
    id: 14,
    label: "Enriquecimiento ilícito",
    description: "Incremento patrimonial injustificado por parte de un servidor público",
  },
  {
    id: 15,
    label: "Obstrucción de la justicia",
    description: "Impedir la investigación o sanción de actos de corrupción",
  },
]

interface CheckboxGroupProps {
  title: string
  description: string
  name: string
  items: Array<{ id: number; label: string; description: string }>
  form: UseFormReturn<any>
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, description, name, items, form }) => (
  <div className="rounded-lg border border-primary/20 p-3 sm:p-4 shadow-sm bg-card/95 backdrop-blur">
    <div className="space-y-2">
      <FormLabel className="text-base block">{title}</FormLabel>
      <FormDescription className="text-xs sm:text-sm">{description}</FormDescription>
      <FormField
        control={form.control}
        name={name}
        render={() => (
          <FormItem>
            <ScrollArea className="h-[200px] rounded-md border mt-3">
              <div className="space-y-2 p-4 pt-2">
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(field.value?.filter((value: number) => value !== item.id))
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">{item.label}</FormLabel>
                          <FormDescription className="text-xs">{item.description}</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
          </FormItem>
        )}
      />
    </div>
  </div>
)

interface NarracionYFaltaStepProps {
  form: UseFormReturn<any> | null
}

export function NarracionYFaltaStep({ form }: NarracionYFaltaStepProps) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Verificar si el navegador soporta la Web Speech API
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError(
        "Tu navegador no soporta el reconocimiento de voz. Por favor, usa Chrome o Edge en caso de que quieras usar esta función.",
      )
      setIsSpeechSupported(false)
      return
    }

    // Inicializar el reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "es-MX"

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === "not-allowed") {
        setError("Por favor, permite el acceso al micrófono para usar esta función.")
      } else {
        setError("Ocurrió un error con el reconocimiento de voz. Por favor, intenta nuevamente.")
      }
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("")

      form?.setValue("narracionHechos", transcript)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [form])

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        setError("No se pudo iniciar el reconocimiento de voz. Por favor, intenta nuevamente.")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  if (!form) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Campo de narración de hechos */}
      <FormField
        control={form.control}
        name="narracionHechos"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Descripción Detallada de los Hechos</FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  placeholder="Ejemplo: El día 12 de abril de 2023, aproximadamente a las 14:30 horas, en las oficinas ubicadas en Av. Reforma 101, piso 3, observé que el Lic. Juan Pérez Gómez, Director de Adquisiciones, recibió un sobre de parte del representante de la empresa Construcciones XYZ. Al abrir el sobre, pude ver que contenía dinero en efectivo. Posteriormente, el día 15 de abril, se publicó la licitación LIC-2023-001 donde la empresa Construcciones XYZ resultó ganadora sin cumplir con todos los requisitos establecidos en la convocatoria..."
                  className="h-80 resize-none text-sm pr-24"
                />
                <div className="absolute bottom-2 right-2">
                  <Button
                    type="button"
                    variant={isListening ? "destructive" : "outline"}
                    size="sm"
                    onClick={isListening ? stopListening : startListening}
                    className="flex items-center gap-2 shadow-sm"
                    disabled={!isSpeechSupported}
                    title={!isSpeechSupported ? "El reconocimiento de voz no está disponible en tu navegador" : ""}
                  >
                    {isListening ? (
                      <>
                        <Square className="h-4 w-4" />
                        Detener dictado
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        Iniciar dictado
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormDescription className="text-xs sm:text-sm">
              Describa detalladamente los hechos que desea denunciar. Sea lo más específico posible.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sección de clasificación de faltas */}
      <div className="space-y-4 mt-6">
        <h3 className="text-base font-medium flex items-center">
          <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
          Clasificación de Faltas
        </h3>
        <FormDescription className="text-xs sm:text-sm">
          Seleccione las faltas administrativas que mejor describan los hechos denunciados. Su selección nos ayudará a
          canalizar adecuadamente su denuncia. Puede seleccionar más de una opción en cada categoría.
        </FormDescription>

        <div className="space-y-4">
          <CheckboxGroup
            title="Faltas Administrativas Graves"
            description="Acciones que implican abuso de autoridad, uso indebido de recursos públicos o enriquecimiento ilícito."
            name="faltaCometida.faltaGrave"
            items={faltasGraves}
            form={form}
          />

          <CheckboxGroup
            title="Faltas Administrativas No Graves"
            description="Conductas que representan incumplimientos menores a la normatividad sin intención de obtener beneficios indebidos."
            name="faltaCometida.faltaNoGrave"
            items={faltasNoGraves}
            form={form}
          />

          <CheckboxGroup
            title="Hechos de Corrupción"
            description="Conductas que implican el abuso del poder para obtener beneficios privados o ventajas indebidas."
            name="faltaCometida.hechosCorrupcion"
            items={hechosCorrupcion}
            form={form}
          />
        </div>
      </div>
    </div>
  )
}
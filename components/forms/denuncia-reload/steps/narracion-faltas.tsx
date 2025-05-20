//@ts-nocheck
"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mic, Square, ClipboardList, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UseFormReturn } from "react-hook-form"
import { publicDirectus } from "@/lib/directus"
import { readItems } from "@directus/sdk"

declare var webkitSpeechRecognition: any
declare var SpeechRecognition: any

interface Falta {
  id: number
  entidad: number
  clasificacion: string
  nombre: string
  descripcion: string
  servidorPublico: boolean
  particular: boolean
}

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
  
  // Estados para las faltas cargadas desde Directus
  const [faltas, setFaltas] = useState<Falta[]>([])
  const [loadingFaltas, setLoadingFaltas] = useState(false)
  
  // Estados para las faltas filtradas por tipo
  const [faltasGraves, setFaltasGraves] = useState<Array<{ id: number; label: string; description: string }>>([])
  const [faltasNoGraves, setFaltasNoGraves] = useState<Array<{ id: number; label: string; description: string }>>([])
  const [hechosCorrupcion, setHechosCorrupcion] = useState<Array<{ id: number; label: string; description: string }>>([])
  
  // Obtener el tipo de persona seleccionada
  const tipoPersona = form?.watch("personaDenunciada.tipoPersona") || "SERVIDOR_PUBLICO"
  const entidadSeleccionada = form?.watch("personaDenunciada.entidad")

  // Cargar las faltas desde Directus
  useEffect(() => {
    const fetchFaltas = async () => {
      setLoadingFaltas(true)
      try {
        // Consultar todas las faltas de la colección
        const response = await publicDirectus.request(
          readItems("faltas", {
            limit: -1,
            fields: ['id', 'entidad', 'clasificacion', 'nombre', 'descripcion', 'servidorPublico', 'particular']
          })
        )
        
        if (response && Array.isArray(response)) {
          setFaltas(response)
          console.log("Faltas cargadas:", response)
        }
      } catch (err) {
        console.error("Error al cargar las faltas:", err)
        setError("No se pudieron cargar las categorías de faltas. Por favor, intente nuevamente.")
      } finally {
        setLoadingFaltas(false)
      }
    }

    fetchFaltas()
  }, [])

  // Filtrar las faltas según el tipo de persona y la entidad seleccionada
  useEffect(() => {
    if (faltas.length > 0) {
      // Filtrar por tipo de persona (servidorPublico o particular)
      const esTipoPersonaValido = (falta: Falta) => {
        if (tipoPersona === "SERVIDOR_PUBLICO") return falta.servidorPublico
        if (tipoPersona === "PARTICULAR") return falta.particular
        return false
      }
      
      // Filtrar por entidad si está seleccionada
      const esEntidadValida = (falta: Falta) => {
        // Si no hay entidad seleccionada, mostrar todas las faltas
        if (!entidadSeleccionada) return true
        // Si la falta tiene entidad 0 o 33, es federal y aplica para todas las entidades
        if (falta.entidad === 0 || falta.entidad === 33) return true
        // Si coincide la entidad específica
        return falta.entidad === entidadSeleccionada
      }

      // Aplicar filtros y mapear a formato para checkboxes
      const faltasFiltradas = faltas.filter(falta => esTipoPersonaValido(falta) && esEntidadValida(falta))
      
      // Separar por clasificación
      const mapearFalta = (falta: Falta) => ({
        id: falta.id,
        label: falta.nombre,
        description: falta.descripcion
      })
      
      setFaltasGraves(faltasFiltradas.filter(f => f.clasificacion === "faltaGrave").map(mapearFalta))
      setFaltasNoGraves(faltasFiltradas.filter(f => f.clasificacion === "noGrave").map(mapearFalta))
      setHechosCorrupcion(faltasFiltradas.filter(f => f.clasificacion === "hechoCorrupcion").map(mapearFalta))
      
      console.log("Faltas filtradas:", {
        graves: faltasGraves.length,
        noGraves: faltasNoGraves.length,
        corrupcion: hechosCorrupcion.length
      })
    }
  }, [faltas, tipoPersona, entidadSeleccionada])

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
                {error && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
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

        {loadingFaltas ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-sm text-muted-foreground">Cargando categorías de faltas...</span>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
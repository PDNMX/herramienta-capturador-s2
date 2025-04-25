// @ts-nocheck
"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Upload, Mic, Square } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UseFormReturn } from "react-hook-form"

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
  <div className="space-y-2">
    <div>
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      <FormDescription>{description}</FormDescription>
    </div>
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <ScrollArea className="h-[200px] rounded-md border">
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
)

interface NarracionYFaltaStepProps {
  form: UseFormReturn<any> | null
}

export function NarracionYFaltaStep({ form }: NarracionYFaltaStepProps) {
  const [dragActive, setDragActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent, field: any) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      const validFiles = files.filter((file) => {
        const validTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
        const extension = "." + file.name.split(".").pop()?.toLowerCase()
        return validTypes.includes(extension) && file.size <= 10 * 1024 * 1024
      })

      field.onChange([...(field.value || []), ...validFiles])
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          {/* <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary">Tu voz es importante</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cuéntanos detalladamente lo sucedido. Una descripción clara y completa nos ayudará a dar seguimiento efectivo a tu denuncia.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-2">¿Qué debes incluir?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Fechas y horarios exactos
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Nombres completos de los involucrados
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lugares específicos
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-2">Recomendaciones</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sé objetivo y conciso
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Incluye testigos si los hay
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Menciona documentos o evidencias
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div> */}

          <FormField
            control={form.control}
            name="narracionHechos"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Descripción Detallada de los Hechos</FormLabel>
                <FormDescription>
                  Describe claramente los hechos indicando fechas, lugares, personas involucradas y las acciones
                  específicas.
                </FormDescription>
                <div className="space-y-2">
                  {error && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
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
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Ejemplo: El 12 de abril, en Av. Reforma 101, observé que..."
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
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="archivosEvidencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Evidencia Documental</FormLabel>
                <FormDescription>
                  Adjunte documentos, fotografías u otros archivos que respalden su denuncia. Los documentos ayudarán a
                  sustentar los hechos descritos.
                </FormDescription>
                <FormControl>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"}`}
                    onDragEnter={(e) => handleDrag(e)}
                    onDragOver={(e) => handleDrag(e)}
                    onDragLeave={(e) => handleDrag(e)}
                    onDrop={(e) => handleDrop(e, field)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Arrastre archivos aquí o haga clic para seleccionar</p>
                        <p className="text-xs text-muted-foreground">
                          Formatos: PDF, DOC, DOCX, JPG, JPEG, PNG. Máx. 10 MB por archivo.
                        </p>
                      </div>
                      <Input
                        type="file"
                        multiple
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          field.onChange([...(field.value || []), ...files])
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload">
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                          Seleccionar archivos
                        </Button>
                      </label>
                    </div>
                  </div>
                </FormControl>

                {field.value?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Archivos adjuntos ({field.value.length})</p>
                      {field.value.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => field.onChange([])}
                        >
                          Eliminar todos
                        </Button>
                      )}
                    </div>
                    <div className="max-h-40 overflow-y-auto pr-2">
                      {field.value.map((file: File, index: number) => {
                        const extension = file.name.split(".").pop()?.toLowerCase()
                        const isImage = ["jpg", "jpeg", "png"].includes(extension || "")
                        const isPdf = extension === "pdf"
                        const isDoc = ["doc", "docx"].includes(extension || "")

                        return (
                          <div key={index} className="flex items-center gap-2 rounded-md border p-2 text-sm mb-2">
                            <div className="bg-muted h-8 w-8 rounded flex items-center justify-center">
                              {isImage && (
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt="preview"
                                  className="h-8 w-8 object-cover rounded"
                                />
                              )}
                              {isPdf && <span className="text-xs font-medium">PDF</span>}
                              {isDoc && <span className="text-xs font-medium">DOC</span>}
                            </div>
                            <div className="flex-1 truncate">
                              <p className="truncate font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                const newFiles = [...field.value]
                                newFiles.splice(index, 1)
                                field.onChange(newFiles)
                              }}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Eliminar archivo</span>
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Clasificación de Faltas</h3>
          <FormDescription>
            Seleccione las faltas administrativas que mejor describan los hechos denunciados. Puede seleccionar más de
            una opción.
          </FormDescription>

          <CheckboxGroup
            title="Faltas Administrativas Graves"
            description="Acciones que implican abuso de autoridad, uso indebido de recursos públicos o enriquecimiento ilícito."
            name="faltasCometidas.faltasGraves"
            items={faltasGraves}
            form={form}
          />

          <CheckboxGroup
            title="Faltas Administrativas No Graves"
            description="Conductas que representan incumplimientos menores a la normatividad sin intención de obtener beneficios indebidos."
            name="faltasCometidas.faltasNoGraves"
            items={faltasNoGraves}
            form={form}
          />

          <CheckboxGroup
            title="Hechos de Corrupción"
            description="Conductas que implican el abuso del poder para obtener beneficios privados o ventajas indebidas."
            name="faltasCometidas.hechosCorrupcion"
            items={hechosCorrupcion}
            form={form}
          />
        </div>
      </div>
    </div>
  )
}

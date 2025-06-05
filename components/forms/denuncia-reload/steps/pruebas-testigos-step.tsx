//@ts-nocheck
"use client"
import { useState, useEffect } from "react"
import React from "react"

import type { ReactElement } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Upload, Plus, User, Phone, Trash2, FileText, ImageIcon, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { UseFormReturn } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"

interface PruebasYTestigosStepProps {
  form: UseFormReturn<any>
}

const CompactChoiceBox = React.forwardRef<
  HTMLDivElement,
  { checked: boolean; onChange: () => void; children: ReactElement }
>(({ checked, onChange, children }, ref) => (
  <div
    ref={ref}
    onClick={onChange}
    className={`relative w-full p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
      checked
        ? "border-primary bg-primary/10 text-primary shadow-lg transform scale-[1.02]"
        : "border-input bg-card text-muted-foreground hover:border-primary/50 hover:bg-accent hover:shadow-md hover:transform hover:scale-[1.01] opacity-70 hover:opacity-90"
    }`}
  >
    <div className={checked ? "opacity-100" : "opacity-60"}>{children}</div>
    {checked && (
      <div className="absolute top-4 right-4 h-7 w-7 bg-primary rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
      </div>
    )}
    <div
      className={`absolute bottom-0 left-0 right-0 h-2 bg-primary transition-transform duration-300 ${
        checked ? "transform translate-y-0" : "transform translate-y-full"
      }`}
    ></div>
  </div>
))
CompactChoiceBox.displayName = "CompactChoiceBox"

export function PruebasYTestigosStep({ form }: PruebasYTestigosStepProps) {
  const [dragActive, setDragActive] = useState(false)

  // Usar useFieldArray para manejar correctamente los arrays de testigos
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "datosTestigos",
  })

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

        // Verificar formato y tamaño del archivo
        const isValidFormat = validTypes.some((type) => extension.endsWith(type))
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10 MB máximo

        if (!isValidFormat) {
          toast({
            title: "Formato no válido",
            description: `El archivo ${file.name} no es un formato permitido. Use: PDF, DOC, DOCX, JPG, JPEG, PNG`,
            variant: "destructive",
          })
        } else if (!isValidSize) {
          toast({
            title: "Archivo demasiado grande",
            description: `El archivo ${file.name} excede el tamaño máximo permitido de 10 MB`,
            variant: "destructive",
          })
        }

        return isValidFormat && isValidSize
      })

      if (validFiles.length > 0) {
        console.log(
          "Archivos válidos a agregar:",
          validFiles.map((f) => f.name),
        )

        const currentFiles = Array.isArray(field.value) ? field.value : []
        const cleanedCurrentFiles = currentFiles.filter(
          (f) => f instanceof File || (f && typeof f === "object" && f.id),
        )

        field.onChange([...cleanedCurrentFiles, ...validFiles])

        if (validFiles.length === 1) {
          toast({
            title: "Archivo añadido",
            description: "El archivo se ha añadido a la lista de evidencias",
            variant: "default",
          })
        } else {
          toast({
            title: "Archivos añadidos",
            description: `${validFiles.length} archivos se han añadido a la lista de evidencias`,
            variant: "default",
          })
        }
      }
    }
  }

  // Función para añadir un nuevo testigo
  const addTestigo = () => {
    append({ nombre: "", contacto: "" })
  }

  // Observar el valor de testigo (singular) para sincronizar el estado
  const hayTestigos = form.watch("testigo")

  // Cuando cambia el valor de hayTestigos, manejar la lista de testigos de forma segura
  useEffect(() => {
    if (hayTestigos === false) {
      // Usar replace en lugar de remove múltiple para evitar problemas de estado
      replace([])
    } else if (hayTestigos === true && fields.length === 0) {
      // Añadir al menos un testigo si se marca "Sí hay testigos" y no hay ninguno
      replace([{ nombre: "", contacto: "" }])
    }
  }, [hayTestigos, replace, fields.length])

  // Función para validar archivos al seleccionarlos mediante el input - ARREGLADA
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const validFiles = files.filter((file) => {
        const validTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
        const extension = "." + file.name.split(".").pop()?.toLowerCase()

        const isValidFormat = validTypes.some((type) => extension.endsWith(type))
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10 MB máximo

        if (!isValidFormat) {
          toast({
            title: "Formato no válido",
            description: `El archivo ${file.name} no es un formato permitido. Use: PDF, DOC, DOCX, JPG, JPEG, PNG`,
            variant: "destructive",
          })
        } else if (!isValidSize) {
          toast({
            title: "Archivo demasiado grande",
            description: `El archivo ${file.name} excede el tamaño máximo permitido de 10 MB`,
            variant: "destructive",
          })
        }

        return isValidFormat && isValidSize
      })

      if (validFiles.length > 0) {
        const currentFiles = Array.isArray(field.value) ? field.value : []
        const cleanedCurrentFiles = currentFiles.filter(
          (f) => f instanceof File || (f && typeof f === "object" && f.id),
        )

        field.onChange([...cleanedCurrentFiles, ...validFiles])

        if (validFiles.length === 1) {
          toast({
            title: "Archivo añadido",
            description: "El archivo se ha añadido a la lista de evidencias",
            variant: "default",
          })
        } else {
          toast({
            title: "Archivos añadidos",
            description: `${validFiles.length} archivos se han añadido a la lista de evidencias`,
            variant: "default",
          })
        }
      }

      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-8 overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-4 sm:p-6 flex items-center justify-center sm:w-20">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <div className="p-5 sm:p-6 space-y-4 flex-1">
            <div>
              <h4 className="text-lg font-semibold text-primary">Recomendaciones para aportar pruebas</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Siga estas pautas para proporcionar evidencias que respalden su denuncia:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Adjunte <span className="font-semibold">fotografías, videos o grabaciones</span> que documenten los
                    hechos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Incluya <span className="font-semibold">documentos oficiales</span> relacionados con la denuncia
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Proporcione datos de <span className="font-semibold">testigos</span> que puedan corroborar los
                    hechos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Asegúrese de que los archivos estén en <span className="font-semibold">formatos compatibles</span> y
                    no excedan el tamaño máximo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Evidencia Documental */}
      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">Pruebas</h3>
        </div>
        <FormDescription className="text-sm text-muted-foreground mb-6">
          Si cuentas con evidencia, agrega las pruebas que respalden tu dicho, pueden ser fotografías, videos,
          grabaciones de voz, documentos, entre otros.
        </FormDescription>

        <FormField
          control={form.control}
          name="archivosEvidencia"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onDragEnter={(e) => handleDrag(e)}
                  onDragOver={(e) => handleDrag(e)}
                  onDragLeave={(e) => handleDrag(e)}
                  onDrop={(e) => handleDrop(e, field)}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-semibold">Arrastre archivos aquí o haga clic para seleccionar</p>
                      <p className="text-sm text-muted-foreground">
                        Formatos: PDF, DOC, DOCX, JPG, JPEG, PNG. Máx. 10 MB por archivo.
                      </p>
                    </div>
                    {/* INPUT ARREGLADO - Removido el hidden y mejorado el manejo */}
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileInputChange(e, field)}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <Button type="button" variant="outline" size="lg" className="pointer-events-none">
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar archivos
                      </Button>
                    </div>
                  </div>
                </div>
              </FormControl>

              {field.value?.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold">Archivos adjuntos ({field.value.length})</p>
                    {field.value.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 text-sm"
                        onClick={() => {
                          field.onChange([])
                          toast({
                            title: "Archivos eliminados",
                            description: "Se han eliminado todos los archivos de la lista",
                            variant: "default",
                          })
                        }}
                      >
                        Eliminar todos
                      </Button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    <div className="space-y-3">
                      {field.value.map((file: File, index: number) => {
                        const extension = file.name.split(".").pop()?.toLowerCase()
                        const isImage = ["jpg", "jpeg", "png"].includes(extension || "")
                        const isPdf = extension === "pdf"
                        const isDoc = ["doc", "docx"].includes(extension || "")

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-lg border border-primary/20 p-4 bg-card/50 hover:bg-card/80 transition-colors"
                          >
                            <div className="bg-muted h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0">
                              {isImage && <ImageIcon className="h-6 w-6 text-primary" />}
                              {isPdf && <FileText className="h-6 w-6 text-red-600" />}
                              {isDoc && <FileText className="h-6 w-6 text-blue-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => {
                                const newFiles = [...field.value]
                                newFiles.splice(index, 1)
                                field.onChange(newFiles)
                                toast({
                                  title: "Archivo eliminado",
                                  description: `Se eliminó ${file.name} de la lista`,
                                  variant: "default",
                                })
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
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sección de Testigos */}
      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">Testigos</h3>
        </div>
        <FormDescription className="text-sm text-muted-foreground mb-6">
          En caso de contar con testigos, indica sus datos.
        </FormDescription>

        <FormField
          control={form.control}
          name="testigo"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-5">
                <div>
                  <FormLabel className="text-lg font-semibold block text-primary">
                    ¿Existen testigos de los hechos denunciados?
                  </FormLabel>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <CompactChoiceBox
                    checked={field.value === true}
                    onChange={() => {
                      field.onChange(true)
                      // Solo agregar un testigo si no hay ninguno
                      if (fields.length === 0) {
                        append({ nombre: "", contacto: "" })
                      }
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <User className="h-7 w-7 text-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-2">
                          Sí, hay testigos que pueden corroborar los hechos
                        </h4>
                        <p className="text-sm opacity-80">
                          Proporcionar información de contacto de las personas que presenciaron los hechos
                        </p>
                      </div>
                    </div>
                  </CompactChoiceBox>

                  <CompactChoiceBox
                    checked={field.value === false}
                    onChange={() => {
                      field.onChange(false)
                      // Limpiar todos los testigos de forma segura
                      replace([])
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <X className="h-7 w-7 text-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-2">No hay testigos o prefiero no proporcionarlos</h4>
                        <p className="text-sm opacity-80">
                          No existen personas que hayan presenciado los hechos o prefiero mantener su anonimato
                        </p>
                      </div>
                    </div>
                  </CompactChoiceBox>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <FormDescription className="text-sm text-muted-foreground">
                    Los testigos pueden proporcionar información valiosa para corroborar los hechos denunciados. Su
                    información será tratada de manera confidencial.
                  </FormDescription>
                </div>
              </div>

              {/* RadioGroup oculto para mantener la funcionalidad */}
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "si")}
                  value={field.value ? "si" : "no"}
                  className="hidden"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí, hay testigos que pueden corroborar los hechos.</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No, no hay testigos o prefiero no proporcionarlos.</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Lista de testigos */}
        {form.watch("testigo") && (
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-primary">Información de testigos</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTestigo}
                className="flex items-center gap-2 h-10"
              >
                <Plus className="h-4 w-4" />
                Añadir testigo
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5">
                <User className="h-12 w-12 mx-auto text-primary/50 mb-4" />
                <p className="text-muted-foreground mb-4">No ha añadido ningún testigo</p>
                <Button type="button" variant="outline" size="sm" onClick={addTestigo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir testigo
                </Button>
              </div>
            ) : (
              <ScrollArea className="max-h-[600px]">
                <div className="space-y-6">
                  {fields.map((item, index) => (
                    <Card key={item.id} className="relative border-2 border-primary/20 shadow-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardContent className="p-6 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name={`datosTestigos.${index}.nombre`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold">Nombre del testigo</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                                    <Input
                                      {...field}
                                      placeholder="Ej. María López García"
                                      className="text-sm h-12 pl-10"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription className="text-xs text-muted-foreground">
                                  Escriba el nombre (s), apellido (s) y/o alias de la persona que presenció los hechos
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`datosTestigos.${index}.contacto`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold">Datos de contacto</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                                    <Input
                                      {...field}
                                      placeholder="Ej. 55 1234 5678 o correo@ejemplo.com"
                                      className="text-sm h-12 pl-10"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription className="text-xs text-muted-foreground">
                                  Proporciona los datos para contactar al testigo, puede ser número telefónico, correo
                                  electrónico o dirección
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

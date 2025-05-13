//@ts-nocheck
"use client"
import { useState } from "react"
import type React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Upload, Plus, User, Phone, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import type { UseFormReturn } from "react-hook-form"

interface PruebasYTestigosStepProps {
  form: UseFormReturn<any>
}

export function PruebasYTestigosStep({ form }: PruebasYTestigosStepProps) {
  const [dragActive, setDragActive] = useState(false)

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

  // Cambiar la función para añadir un nuevo testigo
  const addTestigo = () => {
    const currentTestigos = form.getValues("datosTestigos") || []
    form.setValue("datosTestigos", [...currentTestigos, { nombre: "", contacto: "" }])
  }

  // Cambiar la función para eliminar un testigo
  const removeTestigo = (index: number) => {
    const currentTestigos = form.getValues("datosTestigos") || []
    const updatedTestigos = [...currentTestigos]
    updatedTestigos.splice(index, 1)
    form.setValue("datosTestigos", updatedTestigos)
  }

  // Cambiar la línea donde se obtienen los testigos del formulario
  const datosTestigos = form.watch("datosTestigos") || []

  return (
    <div className="space-y-6 p-3 sm:p-6">
      {/* Sección de Evidencia Documental */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Pruebas</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Si cuentas con evidencia, agrega las pruebas que respalden tu dicho, pueden ser fotografías, videos,
            grabaciones de voz, documentos, entre otros.
          </p>
        </div>

        <FormField
          control={form.control}
          name="archivosEvidencia"
          render={({ field }) => (
            <FormItem>
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

      <Separator className="my-6" />

      {/* Sección de Testigos */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Testigos</h3>
          <p className="text-sm text-muted-foreground mt-1">En caso de contar con testigos, indica sus datos.</p>
        </div>

        <FormField
          control={form.control}
          name="testigos"
          render={({ field }) => (
            <FormItem>
              <div className="rounded-lg border border-primary/20 p-3 sm:p-4 shadow-sm bg-card/95 backdrop-blur">
                <div className="space-y-2">
                  <FormLabel className="text-base block">¿Existen testigos de los hechos denunciados?</FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    Indique si hay personas que presenciaron los hechos y pueden aportar información adicional.
                  </FormDescription>

                  {/* Botones estilizados */}
                  <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-0 md:flex-row md:space-x-3 mt-3 sm:mt-4 py-2 sm:py-4">
                    <Button
                      type="button"
                      variant={field.value === true  ? "default" : "outline"}
                      onClick={() => field.onChange(true)}
                      className={cn(
                        "w-full flex-1 h-auto min-h-[40px] sm:min-h-[48px] py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-normal text-left justify-start",
                        field.value === true
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground"
                          : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                      )}
                    >
                      Sí, hay testigos que pueden corroborar los hechos.
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === false ? "default" : "outline"}
                      onClick={() => field.onChange(false)}
                      className={cn(
                        "w-full flex-1 h-auto min-h-[40px] sm:min-h-[48px] py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-normal text-left justify-start",
                        field.value === false
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground"
                          : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                      )}
                    >
                      No, no hay testigos o prefiero no proporcionarlos.
                    </Button>
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
              </div>
            </FormItem>
          )}
        />

        {/* Lista de testigos */}
        {form.watch("testigos") && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium">Información de testigos</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTestigo}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Añadir testigo
              </Button>
            </div>

            {datosTestigos.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No ha añadido ningún testigo</p>
                <Button type="button" variant="outline" size="sm" onClick={addTestigo} className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir testigo
                </Button>
              </div>
            ) : (
              <ScrollArea className="max-h-[500px]">
                <div className="space-y-4">
                  {datosTestigos.map((_, index) => (
                    <Card key={index} className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => removeTestigo(index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <CardContent className="p-4 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`datosTestigos.${index}.nombre`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium">Nombre del testigo</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      placeholder="Ej. María López García"
                                      className="text-sm h-9 sm:h-10 pl-8"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription className="text-xs mt-1">
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
                                <FormLabel className="text-xs font-medium">Datos de contacto</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      placeholder="Ej. 55 1234 5678 o correo@ejemplo.com"
                                      className="text-sm h-9 sm:h-10 pl-8"
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription className="text-xs mt-1">
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

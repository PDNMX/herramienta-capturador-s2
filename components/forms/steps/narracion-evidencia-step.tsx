//@ts-nocheck
"use client"
import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

export function NarracionYEvidenciaStep({ form }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Narración de Hechos y Evidencia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Descripción Detallada</h3>
          <FormField
            control={form.control}
            name="narracionHechos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción de los Hechos</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describa los hechos de manera clara y detallada"
                    className="h-48 resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Proporcione una descripción detallada de los hechos, incluyendo fechas, lugares y personas
                  involucradas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Evidencia Documental</h3>
          <FormField
            control={form.control}
            name="archivosEvidencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adjuntar Documentos</FormLabel>
                <FormControl>
                  <div className="grid w-full gap-4">
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        field.onChange([...(field.value || []), ...files])
                      }}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <FormDescription>
                      Formatos permitidos: PDF, DOC, DOCX, JPG, JPEG, PNG. Tamaño máximo por archivo: 10 MB.
                    </FormDescription>
                    {field.value?.length > 0 && (
                      <div className="grid gap-2">
                        {field.value.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                            <div className="flex-1 truncate">{file.name}</div>
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
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}


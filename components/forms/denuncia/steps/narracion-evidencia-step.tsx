//@ts-nocheck
"use client"
import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

interface NarracionYEvidenciaStepProps {
  form: UseFormReturn<any> | null
}

export function NarracionYEvidenciaStep({ form }: NarracionYEvidenciaStepProps) {
  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Descripción Detallada</h3>
            <FormField
              control={form.control}
              name="narracionHechos"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describa los hechos de manera clara y detallada, incluyendo fechas, lugares y personas involucradas."
                      className="h-36 resize-none text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Evidencia Documental</h3>
            <FormField
              control={form.control}
              name="archivosEvidencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Adjuntar Documentos</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          field.onChange([...(field.value || []), ...files])
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <p className="text-xs text-muted-foreground">
                        Formatos: PDF, DOC, DOCX, JPG, JPEG, PNG. Máx. 10 MB por archivo.
                      </p>
                      {field.value?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {field.value.map((file: File, index: number) => (
                            <div key={index} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                              <div className="flex-1 truncate">{file.name}</div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  const newFiles = [...field.value]
                                  newFiles.splice(index, 1)
                                  field.onChange(newFiles)
                                }}
                              >
                                <X className="h-3 w-3" />
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
        </div>
      </CardContent>
    </Card>
  )
}
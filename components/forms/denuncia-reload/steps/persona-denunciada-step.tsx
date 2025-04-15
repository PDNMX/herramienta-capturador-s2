"use client"
import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CircleUser, Check, Scale } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

interface PersonaDenunciadaStepProps {
  form: UseFormReturn<any> | null
}

const CustomCheckbox = React.forwardRef<
  HTMLDivElement,
  { checked: boolean; onChange: () => void; children: React.ReactNode }
>(({ checked, onChange, children }, ref) => (
  <div
    ref={ref}
    onClick={onChange}
    className={`bg-card relative w-full p-5 rounded-lg border-2 transition-all cursor-pointer ${
      checked ? "border-primary shadow-md" : "border-input hover:border-primary/50 hover:shadow-sm"
    }`}
  >
    {children}
    {checked && (
      <div className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
        <Check className="h-4 w-4 text-primary-foreground" />
      </div>
    )}
  </div>
))
CustomCheckbox.displayName = "CustomCheckbox"

export function PersonaDenunciadaStep({ form }: PersonaDenunciadaStepProps) {
  if (!form) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-primary">Tipo de Persona</h2>
          <FormDescription>
            Selecciona si la persona denunciada pertenece al servicio público o es un particular.
          </FormDescription>
          <FormField
            control={form.control}
            name="personaDenunciada.tipoPersona"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomCheckbox
                      checked={field.value === "SERVIDOR_PUBLICO"}
                      onChange={() => field.onChange("SERVIDOR_PUBLICO")}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4 flex items-center justify-center">
                          <div className="relative">
                            <Scale className="h-16 w-16 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-semibold mb-2">Persona servidora pública</h3>
                        <p className="text-sm text-muted-foreground">
                          Desempeña un empleo, cargo o comisión en una institución pública
                        </p>
                      </div>
                    </CustomCheckbox>
                    <CustomCheckbox
                      checked={field.value === "PARTICULAR"}
                      onChange={() => field.onChange("PARTICULAR")}
                    >
                      <div className="flex flex-col items-center text-center">
                        <CircleUser className="h-16 w-16 mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">Particular</h3>
                        <p className="text-sm text-muted-foreground">
                          Persona física o empresa del sector privado vinculada con actividades en la administración
                          pública
                        </p>
                      </div>
                    </CustomCheckbox>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-primary">Datos de la Persona Denunciada</h2>
          <FormDescription>
            Proporciona los datos de identificación de la persona denunciada o involucrada en los hechos.
          </FormDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="personaDenunciada.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Nombre(s) o alias</FormLabel>
                  <FormDescription>Escribe el nombre, nombres o alías de la persona denunciada</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Juan" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personaDenunciada.apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Apellidos</FormLabel>
                  <FormDescription>Escribe el o los apellidos de la persona denunciada</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Pérez García" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="personaDenunciada.genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Género</FormLabel>
                <FormDescription>Selecciona el género de la persona denunciada</FormDescription>
                <FormControl>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <CustomCheckbox checked={field.value === "FEMENINO"} onChange={() => field.onChange("FEMENINO")}>
                      <div className="text-center py-2">
                        <h3 className="font-medium">Femenino</h3>
                      </div>
                    </CustomCheckbox>
                    <CustomCheckbox checked={field.value === "MASCULINO"} onChange={() => field.onChange("MASCULINO")}>
                      <div className="text-center py-2">
                        <h3 className="font-medium">Masculino</h3>
                      </div>
                    </CustomCheckbox>
                    <CustomCheckbox
                      checked={field.value === "NO_BINARIO"}
                      onChange={() => field.onChange("NO_BINARIO")}
                    >
                      <div className="text-center py-2">
                        <h3 className="font-medium">No binario</h3>
                      </div>
                    </CustomCheckbox>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-primary">Descripción Detallada</h2>
          <FormField
            control={form.control}
            name="personaDenunciada.descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Descripción de la Persona</FormLabel>
                <FormDescription>
                  Proporciona los datos que pueden ayudar a identificar a la persona denunciada. Puedes mencionar: el
                  cargo o área donde trabaja, características como altura, complexión, color de piel, color de ojos,
                  cabello, barba, lunares, cicatrices, tatuajes, perforaciones, vestimenta o cualquier otra información
                  que consideres relevante.
                </FormDescription>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ejemplo: Es una persona del área de finanzas, alto, delgado, de piel morena, ojos cafés, con bigote, un lunar en la mejilla izquierda, tenía una quemadura en la mano y vestía pantalón café con camisa azul"
                    className="h-48 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

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
    className={`bg-card relative w-full p-5 rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden
      ${
        checked
          ? "border-primary shadow-lg transform scale-[1.02] bg-primary/5"
          : "border-input hover:border-primary/50 hover:shadow-md hover:transform hover:scale-[1.01]"
      }`}
  >
    {children}
    {checked && (
      <div className="absolute top-3 right-3 h-7 w-7 bg-primary rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <Check className="h-4 w-4 text-primary-foreground" />
      </div>
    )}
    <div
      className={`absolute bottom-0 left-0 right-0 h-1.5 bg-primary transition-transform duration-300 ${
        checked ? "transform translate-y-0" : "transform translate-y-full"
      }`}
    ></div>
  </div>
))
CustomCheckbox.displayName = "CustomCheckbox"

const GenderCheckbox = React.forwardRef<
  HTMLDivElement,
  { checked: boolean; onChange: () => void; children: React.ReactNode }
>(({ checked, onChange, children }, ref) => (
  <div
    ref={ref}
    onClick={onChange}
    className={`relative w-full py-3 px-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
      ${
        checked
          ? "border-primary bg-primary text-primary-foreground font-medium shadow-md"
          : "border-input bg-card text-foreground hover:border-primary/50 hover:bg-accent"
      }`}
  >
    {children}
  </div>
))
GenderCheckbox.displayName = "GenderCheckbox"

export function PersonaDenunciadaStep({ form }: PersonaDenunciadaStepProps) {
  if (!form) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-primary text-lg">Tipo de Persona</h2>
          <FormDescription className="text-xs sm:text-sm">
            Selecciona si la persona denunciada pertenece al servicio público o es un particular.
          </FormDescription>
          <FormField
            control={form.control}
            name="personaDenunciada.tipoPersona"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomCheckbox
                      checked={field.value === "SERVIDOR_PUBLICO"}
                      onChange={() => field.onChange("SERVIDOR_PUBLICO")}
                    >
                      <div className="flex flex-col items-center text-center pt-2 pb-4">
                        <div
                          className={`relative mb-5 flex items-center justify-center transition-transform duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "scale-110" : ""}`}
                        >
                          <div className="relative">
                            <Scale
                              className={`h-16 w-16 transition-colors duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "text-primary" : "text-primary/80"}`}
                            />
                          </div>
                        </div>
                        <h3
                          className={`font-semibold mb-2 text-lg transition-colors duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "text-primary" : ""}`}
                        >
                          Persona servidora pública
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Desempeña un empleo, cargo o comisión en una institución pública
                        </p>
                      </div>
                    </CustomCheckbox>
                    <CustomCheckbox
                      checked={field.value === "PARTICULAR"}
                      onChange={() => field.onChange("PARTICULAR")}
                    >
                      <div className="flex flex-col items-center text-center pt-2 pb-4">
                        <div
                          className={`relative mb-5 flex items-center justify-center transition-transform duration-300 ${field.value === "PARTICULAR" ? "scale-110" : ""}`}
                        >
                          <CircleUser
                            className={`h-16 w-16 transition-colors duration-300 ${field.value === "PARTICULAR" ? "text-primary" : "text-primary/80"}`}
                          />
                        </div>
                        <h3
                          className={`font-semibold mb-2 text-lg transition-colors duration-300 ${field.value === "PARTICULAR" ? "text-primary" : ""}`}
                        >
                          Particular
                        </h3>
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
          <h2 className="font-semibold text-primary text-lg">Datos de la Persona Denunciada</h2>
          <FormDescription className="text-xs sm:text-sm">
            Proporciona los datos de identificación de la persona denunciada o involucrada en los hechos.
          </FormDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="personaDenunciada.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Nombre(s) o alias</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej. Juan"
                      className="text-sm focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Escribe el nombre, nombres o alías de la persona denunciada
                  </FormDescription>
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
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej. Pérez García"
                      className="text-sm focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Escribe el o los apellidos de la persona denunciada
                  </FormDescription>
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
                <FormControl>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GenderCheckbox checked={field.value === "FEMENINO"} onChange={() => field.onChange("FEMENINO")}>
                      <div className="text-center">
                        <h3 className="font-medium">Femenino</h3>
                      </div>
                    </GenderCheckbox>
                    <GenderCheckbox checked={field.value === "MASCULINO"} onChange={() => field.onChange("MASCULINO")}>
                      <div className="text-center">
                        <h3 className="font-medium">Masculino</h3>
                      </div>
                    </GenderCheckbox>
                    <GenderCheckbox
                      checked={field.value === "NO_BINARIO"}
                      onChange={() => field.onChange("NO_BINARIO")}
                    >
                      <div className="text-center">
                        <h3 className="font-medium">No binario</h3>
                      </div>
                    </GenderCheckbox>
                  </div>
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
                  Selecciona el género de la persona denunciada
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-primary text-lg">Descripción Detallada</h2>
          <FormField
            control={form.control}
            name="personaDenunciada.descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Descripción de la Persona</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ejemplo: Es una persona del área de finanzas, alto, delgado, de piel morena, ojos cafés, con bigote, un lunar en la mejilla izquierda, tenía una quemadura en la mano y vestía pantalón café con camisa azul"
                    className="h-48 text-sm focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
                  Proporciona los datos que pueden ayudar a identificar a la persona denunciada. Puedes mencionar: el
                  cargo o área donde trabaja, características como altura, complexión, color de piel, color de ojos,
                  cabello, barba, lunares, cicatrices, tatuajes, perforaciones, vestimenta o cualquier otra información
                  que consideres relevante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

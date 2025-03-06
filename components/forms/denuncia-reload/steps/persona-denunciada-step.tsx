"use client"
import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Users, Check } from "lucide-react"
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
    className={`bg-card relative w-full p-4 rounded-lg border-2 transition-all cursor-pointer ${
      checked ? " border-primary " : "border-input hover:border-primary/50"
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
            Selecciona si la persona denunciada es un servidor público o un particular involucrado en faltas
            administrativas o hechos de corrupción.
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
                        <Users className="h-12 w-12 mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">Servidor Público</h3>
                        <p className="text-sm text-muted-foreground">
                          Persona que desempeña un empleo, cargo o comisión en alguna institución pública
                        </p>
                      </div>
                    </CustomCheckbox>
                    <CustomCheckbox
                      checked={field.value === "PARTICULAR"}
                      onChange={() => field.onChange("PARTICULAR")}
                    >
                      <div className="flex flex-col items-center text-center">
                        <User className="h-12 w-12 mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">Particular</h3>
                        <p className="text-sm text-muted-foreground">
                          Persona física o moral del sector privado vinculada a faltas administrativas graves
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
            Proporciona los datos de identificación de la persona involucrada en los hechos denunciados. Esta
            información es fundamental para la investigación.
          </FormDescription>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="personaDenunciada.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Nombre(s)</FormLabel>
                  <FormDescription>Ingresa el nombre o nombres de la persona denunciada.</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Juan" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personaDenunciada.apellidoPaterno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Apellido Paterno</FormLabel>
                  <FormDescription>Ingresa el apellido paterno de la persona denunciada.</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Pérez" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personaDenunciada.apellidoMaterno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Apellido Materno</FormLabel>
                  <FormDescription>Ingresa el apellido materno de la persona denunciada.</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. García" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  Proporciona detalles que ayuden a identificar a la persona denunciada, como: cargo que ocupa, área o
                  dependencia donde labora, características físicas distintivas, o cualquier otra información relevante
                  para la investigación.
                </FormDescription>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describa el cargo, área, características físicas u otros detalles relevantes de la persona denunciada..."
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

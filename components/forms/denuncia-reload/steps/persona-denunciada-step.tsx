//@ts-nocheck
"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { UseFormReturn } from "react-hook-form"

interface PersonaDenunciadaStepProps {
  form: UseFormReturn<any> | null
}

export function PersonaDenunciadaStep({ form }: PersonaDenunciadaStepProps) {
  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 gradient-background p-6 rounded-lg shadow-sm">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Tipo de Persona</h3>
          <FormField
            control={form.control}
            name="personaDenunciada.tipoPersona"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="SERVIDOR_PUBLICO" id="servidor_publico" />
                      </FormControl>
                      <FormLabel className="text-sm font-medium" htmlFor="servidor_publico">
                        Servidor Público
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="PARTICULAR" id="particular" />
                      </FormControl>
                      <FormLabel className="text-sm font-medium" htmlFor="particular">
                        Particular
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Datos de la Persona Denunciada</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="personaDenunciada.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Nombre(s)</FormLabel>
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
          <h3 className="text-lg font-semibold text-primary">Descripción Detallada</h3>
          <FormField
            control={form.control}
            name="personaDenunciada.descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Descripción de la Persona</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Proporcione una descripción detallada de la persona denunciada (características físicas, vestimenta, etc.)"
                    className="h-32 text-sm"
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


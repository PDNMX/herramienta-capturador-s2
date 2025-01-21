//@ts-nocheck
"use client"
import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function PersonaDenunciadaStep({ form }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Información de la Persona Denunciada</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tipo de Persona</h3>
          <FormField
            control={form.control}
            name="personaDenunciada.tipoPersona"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="SERVIDOR_PUBLICO" id="servidor_publico" />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor="servidor_publico">
                        Servidor Público
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="PARTICULAR" id="particular" />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor="particular">
                        Particular
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Seleccione si la persona denunciada es un servidor público o un particular
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos de la Persona Denunciada</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="personaDenunciada.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre(s)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Juan" />
                  </FormControl>
                  <FormDescription>Ingrese el nombre o nombres de la persona denunciada</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personaDenunciada.apellidoPaterno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido Paterno</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Pérez" />
                  </FormControl>
                  <FormDescription>Ingrese el apellido paterno de la persona denunciada</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personaDenunciada.apellidoMaterno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido Materno</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. García" />
                  </FormControl>
                  <FormDescription>Ingrese el apellido materno de la persona denunciada</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Descripción Detallada</h3>
          <FormField
            control={form.control}
            name="personaDenunciada.descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción de la Persona</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Proporcione una descripción detallada de la persona denunciada (características físicas, vestimenta, etc.)"
                    className="h-32"
                  />
                </FormControl>
                <FormDescription>
                  Incluya detalles relevantes que ayuden a identificar a la persona denunciada, como características
                  físicas distintivas, vestimenta habitual, o cualquier otra información que considere importante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
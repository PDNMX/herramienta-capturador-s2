//@ts-nocheck
"use client"
import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function DenuncianteStep({ form }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Información del Denunciante</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-semibold">Presentar denuncia de manera anónima</FormLabel>
                <FormDescription>Seleccione "Sí" si desea mantener su identidad en privado</FormDescription>
              </div>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <span>{field.value ? "Sí" : "No"}</span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {!form.watch("denunciante.anonimo") && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombre completo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="Número telefónico" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="correo@ejemplo.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Domicilio del Denunciante</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.codigoPostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Código Postal" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.calle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calle</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombre de la calle" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.numeroExterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número Exterior</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número exterior" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.numeroInterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número Interior</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número interior (opcional)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.municipioAlcaldia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Municipio o Alcaldía</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Municipio o Alcaldía" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="denunciante.datosDenunciante.proteccion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">Solicitar protección</FormLabel>
                    <FormDescription>Seleccione "Sí" si desea solicitar medidas de protección</FormDescription>
                  </div>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span>{field.value ? "Sí" : "No"}</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}


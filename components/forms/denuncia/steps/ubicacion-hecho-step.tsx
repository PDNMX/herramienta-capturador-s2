//@ts-nocheck
"use client"
import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function UbicacionHechoStep({ form }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ubicación y Fecha del Hecho</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.entidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entidad Federativa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Ciudad de México" />
                  </FormControl>
                  <FormDescription>Indique la entidad federativa donde ocurrió el hecho</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.entePublico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ente Público</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Secretaría de Educación" />
                  </FormControl>
                  <FormDescription>Especifique la institución pública involucrada</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dirección Específica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. 03100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.calle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Av. Insurgentes Sur" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.numeroExterior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número Exterior</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. 1735" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.numeroInterior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número Interior</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Piso 10, Oficina 3 (opcional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fecha y Hora del Hecho</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.fechaHecho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del Hecho</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormDescription>Seleccione la fecha en que ocurrió el hecho</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.horaHecho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora del Hecho</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormDescription>Indique la hora aproximada del hecho</FormDescription>
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

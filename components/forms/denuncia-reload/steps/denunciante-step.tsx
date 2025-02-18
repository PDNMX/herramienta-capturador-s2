//@ts-nocheck
"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { UseFormReturn } from "react-hook-form"

interface DenuncianteStepProps {
  form: UseFormReturn<any> | null
}

export function DenuncianteStep({ form }: DenuncianteStepProps) {
  if (!form) {
    return <div>Loading...</div>
  }

  const isAnonymous = form.watch("denunciante.anonimo")

  return (
    <div className="space-y-6 gradient-background p-6 rounded-lg shadow-sm">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Denuncia anónima</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value ? "Su identidad se mantendrá privada" : "Su identidad será visible"}
                  </p>
                </div>
                <FormControl>
                  <Button
                    type="button"
                    variant={field.value ? "default" : "outline"}
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      "w-[100px] transition-colors",
                      field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {field.value ? "Anónimo" : "Identificado"}
                  </Button>
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {!isAnonymous && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Nombre completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre completo" className="text-sm" />
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
                    <FormLabel className="text-xs font-medium">Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="Número telefónico" className="text-sm" />
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
                    <FormLabel className="text-xs font-medium">Correo electrónico</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="correo@ejemplo.com" className="text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.domicilioDenunciante.codigoPostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Código Postal</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Código Postal" className="text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.domicilioDenunciante.calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Calle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre de la calle" className="text-sm" />
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
                    <FormLabel className="text-xs font-medium">Número Exterior</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Número exterior" className="text-sm" />
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
                    <FormLabel className="text-xs font-medium">Número Interior</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Número interior (opcional)" className="text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="denunciante.datosDenunciante.domicilioDenunciante.municipioAlcaldia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Municipio o Alcaldía</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Municipio o Alcaldía" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="denunciante.datosDenunciante.proteccion"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Solicitar protección</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {field.value
                          ? "Se solicitarán medidas de protección"
                          : "No se solicitarán medidas de protección"}
                      </p>
                    </div>
                    <FormControl>
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        onClick={() => field.onChange(!field.value)}
                        className={cn(
                          "w-[100px] transition-colors",
                          field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {field.value ? "Solicitada" : "No solicitada"}
                      </Button>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}


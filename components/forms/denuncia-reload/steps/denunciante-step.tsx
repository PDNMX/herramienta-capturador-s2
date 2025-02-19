"use client"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">¿Desea hacer una denuncia anónima?</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value ? "Su identidad se mantendrá privada" : "Su identidad será visible"}
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Denuncia anónima" />
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="denunciante.datosDenunciante.proteccion"
              render={({ field }) => (
                <FormItem>
                  <div className="rounded-lg border p-4 shadow-sm">
                    <FormLabel className="text-base mb-2 block">¿Desea solicitar medidas de protección?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value ? "si" : "no"}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="si" />
                          </FormControl>
                          <FormLabel className="font-normal">Sí, deseo solicitar medidas de protección</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No, no deseo solicitar medidas de protección</FormLabel>
                        </FormItem>
                      </RadioGroup>
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


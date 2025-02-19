"use client"
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center border border-primary/20 justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">¿Desea hacer una denuncia anónima?</FormLabel>
                  <FormDescription>
                    Elija 'Sí' si prefiere no revelar su identidad. Esto puede afectar cómo se procesa su denuncia.
                  </FormDescription>
                </div>
                <FormControl>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      onClick={() => field.onChange(true)}
                      className={cn(
                        "w-[80px] h-[40px] text-sm",
                        field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      Sí
                    </Button>
                    <Button
                      type="button"
                      variant={!field.value ? "default" : "outline"}
                      onClick={() => field.onChange(false)}
                      className={cn(
                        "w-[80px] h-[40px] text-sm",
                        !field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      No
                    </Button>
                  </div>
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
                    <FormDescription>
                      Ingrese su nombre y apellidos tal como aparecen en su identificación oficial.
                    </FormDescription>
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
                    <FormDescription>
                      Proporcione un número de teléfono donde podamos contactarle si es necesario.
                    </FormDescription>
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
                    <FormDescription>
                      Ingrese una dirección de correo electrónico válida para recibir actualizaciones sobre su denuncia.
                    </FormDescription>
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
                    <FormDescription>El código postal nos ayuda a identificar su ubicación general.</FormDescription>
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
                    <FormDescription>Indique el nombre completo de la calle de su domicilio.</FormDescription>
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
                    <FormDescription>El número visible desde la calle.</FormDescription>
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
                    <FormDescription>Si aplica, indique el número de apartamento o interior.</FormDescription>
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
                  <FormDescription>
                    Especifique el municipio o alcaldía donde se encuentra su domicilio.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="denunciante.datosDenunciante.proteccion"
              render={({ field }) => (
                <FormItem>
                  <div className="rounded-lg border border-primary/20 p-4 shadow-sm">
                    <FormLabel className="text-base mb-2 block">¿Desea solicitar medidas de protección?</FormLabel>
                    <FormDescription className="mb-2">
                      Las medidas de protección son acciones para garantizar su seguridad durante el proceso de
                      denuncia.
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "si")}
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
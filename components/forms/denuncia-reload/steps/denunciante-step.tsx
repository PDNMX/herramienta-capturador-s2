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
              <div className="flex items-center border border-primary/20 justify-between rounded-lg border p-4 shadow-sm bg-card/95 backdrop-blur">
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
                        "w-[80px] h-[40px] text-base font-medium transition-all duration-300",
                        field.value 
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground" 
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      )}
                    >
                      Sí
                    </Button>
                    <Button
                      type="button"
                      variant={!field.value ? "default" : "outline"}
                      onClick={() => field.onChange(false)}
                      className={cn(
                        "w-[80px] h-[40px] text-base font-medium transition-all duration-300",
                        !field.value 
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground" 
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
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
                  <div className="rounded-lg border border-primary/20 p-4 shadow-sm bg-card/95 backdrop-blur">
                    <div className="space-y-2">
                      <FormLabel className="text-base block">¿Desea solicitar medidas de protección?</FormLabel>
                      <FormDescription>
                        Las medidas de protección son acciones para garantizar su seguridad durante el proceso de
                        denuncia.
                      </FormDescription>
                      
                      {/* Botones estilizados debajo del texto, uno al lado del otro */}
                      <div className="flex space-x-2 mt-4 py-4">
                        <Button
                          type="button"
                          variant={field.value ? "default" : "outline"}
                          onClick={() => field.onChange(true)}
                          className={cn(
                            "flex-1 h-[40px] text-base font-medium transition-all duration-300",
                            field.value 
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground" 
                              : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                          )}
                        >
                          Sí, deseo solicitar medidas de protección
                        </Button>
                        <Button
                          type="button"
                          variant={!field.value ? "default" : "outline"}
                          onClick={() => field.onChange(false)}
                          className={cn(
                            "flex-1 h-[40px] text-base font-medium transition-all duration-300",
                            !field.value 
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground" 
                              : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                          )}
                        >
                          No, no deseo solicitar medidas de protección
                        </Button>
                      </div>
                    </div>
                    
                    {/* RadioGroup oculto para mantener la funcionalidad */}
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "si")}
                        value={field.value ? "si" : "no"}
                        className="hidden"
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
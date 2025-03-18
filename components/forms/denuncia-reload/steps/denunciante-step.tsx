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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem>
              <div className="rounded-lg border border-primary/20 p-3 sm:p-4 shadow-sm bg-card/95 backdrop-blur">
                <div className="space-y-2">
                  <FormLabel className="text-base block">¿Deseas presentar una denuncia anónima?</FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    En cualquier caso, tu identidad será de carácter confidencial.
                  </FormDescription>

                  {/* Botones estilizados debajo del texto, uno al lado del otro en desktop, apilados en móvil */}
                  <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-0 md:flex-row md:space-x-3 mt-3 sm:mt-4 py-2 sm:py-4">
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      onClick={() => field.onChange(true)}
                      className={cn(
                        "w-full flex-1 h-auto min-h-[40px] sm:min-h-[48px] py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-normal text-left justify-start",
                        field.value
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground"
                          : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                      )}
                    >
                      Sí, deseo presentar la denuncia sin dar mis datos.
                    </Button>
                    <Button
                      type="button"
                      variant={!field.value ? "default" : "outline"}
                      onClick={() => field.onChange(false)}
                      className={cn(
                        "w-full flex-1 h-auto min-h-[40px] sm:min-h-[48px] py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-normal text-left justify-start",
                        !field.value
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground"
                          : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                      )}
                    >
                      No, deseo proporcionar mis datos de contacto.
                    </Button>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        {!isAnonymous && (
          <div className="space-y-4 sm:space-y-6">
            {/* Nombre completo en una sola fila */}
            <FormField
              control={form.control}
              name="denunciante.datosDenunciante.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Nombre completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Juan Pérez García" className="text-sm h-9 sm:h-10" />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">Ingresa nombre(s) y apellidos</FormDescription>
                </FormItem>
              )}
            />

            {/* Texto introductorio para los medios de contacto */}
            <div className="text-sm font-medium text-muted-foreground mt-2 mb-4">
              Podrás proporcionar cualquiera de los siguientes medios de contacto:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="Ej. 55 1234 5678" className="text-sm h-9 sm:h-10" />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      Proporciona un número telefónico de contacto
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
                      <Input
                        {...field}
                        type="email"
                        placeholder="Ej. usuario@correo.com"
                        className="text-sm h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      Ingresa una dirección de correo electrónico para recibir notificaciones relacionadas con tu
                      denuncia
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Título para la sección de domicilio */}
            <div className="text-sm font-medium mt-2">Domicilio para recibir notificaciones</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.domicilioDenunciante.calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Calle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej. Av. Insurgentes" className="text-sm h-9 sm:h-10" />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      Ingresa el nombre completo de la calle
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.numeroExterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Número Exterior</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. 123" className="text-sm h-9 sm:h-10" />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">No. exterior</FormDescription>
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
                        <Input {...field} placeholder="Ej. 4B" className="text-sm h-9 sm:h-10" />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">No. interior (opcional)</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.domicilioDenunciante.codigoPostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Código Postal</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej. 06700" className="text-sm h-9 sm:h-10" />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">Código Postal de tu domicilio</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.domicilioDenunciante.municipioAlcaldia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Municipio o Alcaldía</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej. Cuauhtémoc" className="text-sm h-9 sm:h-10" />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      Municipio o Alcaldía donde se encuentra tu domicilio
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="denunciante.datosDenunciante.proteccion"
              render={({ field }) => (
                <FormItem>
                  <div className="rounded-lg border border-primary/20 p-3 sm:p-4 shadow-sm bg-card/95 backdrop-blur">
                    <div className="space-y-2">
                      <FormLabel className="text-base block">¿Desea solicitar medidas de protección?</FormLabel>
                      <FormDescription className="text-xs sm:text-sm">
                        Las medidas de protección son acciones para garantizar su seguridad durante el proceso de
                        denuncia.
                      </FormDescription>

                      {/* Botones estilizados debajo del texto, uno al lado del otro en desktop, apilados en móvil */}
                      <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-0 md:flex-row md:space-x-3 mt-3 sm:mt-4 py-2 sm:py-4">
                        <Button
                          type="button"
                          variant={field.value ? "default" : "outline"}
                          onClick={() => field.onChange(true)}
                          className={cn(
                            "w-full flex-1 h-auto min-h-[40px] sm:min-h-[48px] py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-normal text-left justify-start",
                            field.value
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground"
                              : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          Sí, deseo solicitar medidas de protección
                        </Button>
                        <Button
                          type="button"
                          variant={!field.value ? "default" : "outline"}
                          onClick={() => field.onChange(false)}
                          className={cn(
                            "w-full flex-1 h-auto min-h-[40px] sm:min-h-[48px] py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-normal text-left justify-start",
                            !field.value
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground"
                              : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
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
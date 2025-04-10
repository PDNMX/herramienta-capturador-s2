"use client"
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { User, Phone, Mail, MapPin, Building, Hash, Shield } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { UseFormReturn } from "react-hook-form"

interface DenuncianteStepProps {
  form: UseFormReturn<any> | null
}

export function DenuncianteStep({ form }: DenuncianteStepProps) {
  if (!form) {
    return <div>Loading...</div>
  }

  const isAnonymous = form.watch("denunciante.anonimo")
  const requestsProtection = form.watch("denunciante.datosDenunciante.proteccion")

  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        {/* Sección de denuncia anónima - Mejorada */}
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem>
              <div className="rounded-lg border-2 border-primary/30 p-4 sm:p-6 shadow-md bg-card/95 backdrop-blur">
                <div className="space-y-3">
                  <FormLabel className="text-lg block font-semibold text-primary">
                    ¿Deseas presentar una denuncia anónima?
                  </FormLabel>
                  <FormDescription className="text-sm sm:text-base">
                    En cualquier caso, tu identidad será de carácter confidencial.
                  </FormDescription>

                  {/* Botones mejorados */}
                  <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-0 md:flex-row md:space-x-4 mt-4 sm:mt-6 py-2 sm:py-4">
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      onClick={() => field.onChange(true)}
                      className={cn(
                        "w-full flex-1 h-auto min-h-[48px] sm:min-h-[56px] py-3 px-4 text-sm sm:text-base font-medium transition-all duration-300 whitespace-normal text-left justify-start relative overflow-hidden",
                        field.value
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground border-2 border-primary/50"
                          : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground border-2",
                        field.value && "glow-effect"
                      )}
                    >
                      <span className="font-bold">Sí</span> – Deseo presentar la denuncia sin dar mis datos.
                    </Button>
                    <Button
                      type="button"
                      variant={!field.value ? "default" : "outline"}
                      onClick={() => field.onChange(false)}
                      className={cn(
                        "w-full flex-1 h-auto min-h-[48px] sm:min-h-[56px] py-3 px-4 text-sm sm:text-base font-medium transition-all duration-300 whitespace-normal text-left justify-start relative overflow-hidden",
                        !field.value
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground border-2 border-primary/50"
                          : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground border-2",
                        !field.value && "glow-effect"
                      )}
                    >
                      <span className="font-bold">No</span> – Deseo proporcionar mis datos de contacto.
                    </Button>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        {!isAnonymous && (
          <div className="space-y-6 sm:space-y-8">
            {/* Sección de datos personales - Mejorada */}
            <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
              <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
                <User className="h-5 w-5 mr-3 text-primary" />
                Datos personales
              </h3>
              
              <div className="space-y-4">
                {/* Nombre completo en una sola fila */}
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nombre completo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. Juan Pérez García" className="text-sm h-10 sm:h-12" />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">Ingresa nombre(s) y apellidos</FormDescription>
                    </FormItem>
                  )}
                />

                {/* Texto introductorio para los medios de contacto */}
                <div className="text-sm font-medium text-primary mt-3 mb-2">
                  Podrás proporcionar cualquiera de los siguientes medios de contacto:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="denunciante.datosDenunciante.telefono"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-sm font-medium">Teléfono</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              {...field}
                              type="tel"
                              placeholder="Ej. 55 1234 5678"
                              className="text-sm h-10 sm:h-12 pl-10"
                            />
                          </div>
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
                        <FormLabel className="text-sm font-medium">Correo electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="Ej. usuario@correo.com"
                              className="text-sm h-10 sm:h-12 pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs sm:text-sm">
                          Ingresa una dirección de correo electrónico para recibir notificaciones
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Sección de domicilio - Mejorada */}
            <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
              <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                Domicilio para recibir notificaciones
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.calle"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium">Calle</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. Av. Insurgentes" className="text-sm h-10 sm:h-12" />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Ingresa el nombre completo de la calle
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.numeroExterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Número Exterior</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input {...field} placeholder="Ej. 123" className="text-sm h-10 sm:h-12 pl-10" />
                        </div>
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
                      <FormLabel className="text-sm font-medium">Número Interior</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input {...field} placeholder="Ej. 4B" className="text-sm h-10 sm:h-12 pl-10" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">No. interior (opcional)</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.codigoPostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Código Postal</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. 06700" className="text-sm h-10 sm:h-12" />
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
                      <FormLabel className="text-sm font-medium">Municipio o Alcaldía</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input {...field} placeholder="Ej. Cuauhtémoc" className="text-sm h-10 sm:h-12 pl-10" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Municipio o Alcaldía donde se encuentra tu domicilio
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de medidas de protección - Mejorada */}
            <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
              <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
                <Shield className="h-5 w-5 mr-3 text-primary" />
                Medidas de protección
              </h3>

              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.proteccion"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-3">
                      <FormLabel className="text-base block font-medium">¿Deseas solicitar medidas de protección?</FormLabel>
                      <FormDescription className="text-sm">
                        Las medidas de protección son acciones para garantizar la seguridad e integridad de las
                        personas involucradas en el hecho que se denuncia.
                      </FormDescription>

                      {/* Botones mejorados para protección */}
                      <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-0 md:flex-row md:space-x-4 mt-4 py-2 sm:py-3">
                        <Button
                          type="button"
                          variant={field.value ? "default" : "outline"}
                          onClick={() => field.onChange(true)}
                          className={cn(
                            "w-full flex-1 h-auto min-h-[48px] sm:min-h-[56px] py-3 px-4 text-sm sm:text-base font-medium transition-all duration-300 whitespace-normal text-left justify-start relative overflow-hidden",
                            field.value
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground border-2 border-primary/50"
                              : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground border-2",
                            field.value && "glow-effect"
                          )}
                        >
                          <span className="font-bold">Sí</span>, considero que pueden presentarse situaciones de riesgo.
                        </Button>
                        <Button
                          type="button"
                          variant={!field.value ? "default" : "outline"}
                          onClick={() => field.onChange(false)}
                          className={cn(
                            "w-full flex-1 h-auto min-h-[48px] sm:min-h-[56px] py-3 px-4 text-sm sm:text-base font-medium transition-all duration-300 whitespace-normal text-left justify-start relative overflow-hidden",
                            !field.value
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground border-2 border-primary/50"
                              : "bg-card text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground border-2",
                            !field.value && "glow-effect"
                          )}
                        >
                          <span className="font-bold">No</span>
                        </Button>
                      </div>
                    </div>

                    {/* Campo adicional para explicar las razones si selecciona "Sí" - Mejorado */}
                    {field.value && (
                      <div className="mt-5 pt-4 border-t border-primary/20 bg-primary/5 p-4 rounded-lg">
                        <FormField
                          control={form.control}
                          name="denunciante.datosDenunciante.razonesProteccion"
                          render={({ field: reasonsField }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Explica las razones por las que solicitas medidas de protección
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...reasonsField}
                                  placeholder="Describe las situaciones de riesgo que consideras podrían presentarse..."
                                  className="min-h-[120px] text-sm"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

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
                          <FormLabel className="font-normal">
                            Sí, considero que pueden presentarse situaciones de riesgo.
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
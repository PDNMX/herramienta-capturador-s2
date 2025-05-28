//@ts-nocheck
"use client"
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Phone, Mail, MapPin, Building, Hash, Shield, CheckCircle2, Check, UserCheck } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { UseFormReturn } from "react-hook-form"
import React from "react"

const CompactChoiceBox = React.forwardRef<
  HTMLDivElement,
  { checked: boolean; onChange: () => void; children: React.ReactNode }
>(({ checked, onChange, children }, ref) => (
  <div
    ref={ref}
    onClick={onChange}
    className={`relative w-full p-5 rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
      checked
        ? "border-primary bg-primary/10 text-primary shadow-lg transform scale-[1.02]"
        : "border-input bg-card text-muted-foreground hover:border-primary/50 hover:bg-accent hover:shadow-md hover:transform hover:scale-[1.01] opacity-70 hover:opacity-90"
    }`}
  >
    <div className={checked ? "opacity-100" : "opacity-60"}>{children}</div>
    {checked && (
      <div className="absolute top-3 right-3 h-6 w-6 bg-primary rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <Check className="h-3 w-3 text-primary-foreground" />
      </div>
    )}
    <div
      className={`absolute bottom-0 left-0 right-0 h-1.5 bg-primary transition-transform duration-300 ${
        checked ? "transform translate-y-0" : "transform translate-y-full"
      }`}
    ></div>
  </div>
))
CompactChoiceBox.displayName = "CompactChoiceBox"

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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 mb-6 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-3 sm:p-4 flex items-center justify-center sm:w-16">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div className="p-4 sm:p-5 space-y-3 flex-1">
            <div>
              <h4 className="text-base font-medium text-primary">Recomendaciones para una denuncia efectiva</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Siga estas pautas para asegurar que su denuncia sea procesada correctamente:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Sea específico con <span className="font-medium">fechas, lugares y nombres</span> de los
                    involucrados
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Mencione <span className="font-medium">testigos</span> si existen y cómo se pueden contactar
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Adjunte toda la <span className="font-medium">evidencia disponible</span> que respalde su denuncia
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Evite incluir <span className="font-medium">opiniones personales</span>; céntrese en hechos
                    concretos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {/* Sección de denuncia anónima */}
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem>
              <div className="rounded-lg border border-primary/20 p-3 sm:p-4 shadow-sm bg-card/95 backdrop-blur">
                <div className="space-y-4">
                  <FormLabel className="text-base block">
                    ¿Deseas presentar una denuncia anónima? <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    En ambos casos, tu denuncia será confidencial y se protegerá toda la información proporcionada.
                  </FormDescription>

                  {/* Botones mejorados con diseño más grande */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <CompactChoiceBox checked={field.value} onChange={() => field.onChange(true)}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <Shield className="h-6 w-6 text-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base mb-2">
                            Sí, deseo presentar la denuncia sin proporcionar mis datos.
                          </h4>
                        </div>
                      </div>
                    </CompactChoiceBox>

                    <CompactChoiceBox checked={!field.value} onChange={() => field.onChange(false)}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <User className="h-6 w-6 text-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base mb-2">
                            No, deseo proporcionar mis datos de contacto para recibir notificaciones y en caso de que la
                            autoridad requiera más información.
                          </h4>
                        </div>
                      </div>
                    </CompactChoiceBox>
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
                      <FormLabel className="text-sm font-medium">
                        Nombre completo {!isAnonymous && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. Juan Pérez García" className="text-sm h-10 sm:h-12" />
                      </FormControl>
                      <FormMessage />
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
                        <FormLabel className="text-sm font-medium">
                          Teléfono {!isAnonymous && <span className="text-red-500">*</span>}
                        </FormLabel>
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
                        <FormMessage />
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
                        <FormMessage />
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
                      <FormLabel className="text-sm font-medium">
                        Calle {!isAnonymous && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. Av. Insurgentes" className="text-sm h-10 sm:h-12" />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel className="text-sm font-medium">
                        Número Exterior {!isAnonymous && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input {...field} placeholder="Ej. 123" className="text-sm h-10 sm:h-12 pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                      <FormDescription className="text-xs sm:text-sm">No. interior (opcional)</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.codigoPostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Código Postal {!isAnonymous && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. 06700" className="text-sm h-10 sm:h-12" />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="text-xs sm:text-sm">Código Postal de tu domicilio</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.municipioAlcaldia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Municipio o Alcaldía {!isAnonymous && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input {...field} placeholder="Ej. Cuauhtémoc" className="text-sm h-10 sm:h-12 pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                    <div className="space-y-4">
                      <FormLabel className="text-base block font-medium">
                        ¿Deseas solicitar medidas de protección?
                      </FormLabel>
                      <FormDescription className="text-sm">
                        Las medidas de protección son acciones para garantizar la seguridad e integridad de las personas
                        involucradas en el hecho que se denuncia.
                      </FormDescription>

                      {/* Botones mejorados para protección */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <CompactChoiceBox checked={field.value} onChange={() => field.onChange(true)}>
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <Shield className="h-6 w-6 text-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-2">
                                Sí, considero que pueden presentarse situaciones de riesgo.
                              </h4>
                            </div>
                          </div>
                        </CompactChoiceBox>

                        <CompactChoiceBox checked={!field.value} onChange={() => field.onChange(false)}>
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <UserCheck className="h-6 w-6 text-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-2">No</h4>
                            </div>
                          </div>
                        </CompactChoiceBox>
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

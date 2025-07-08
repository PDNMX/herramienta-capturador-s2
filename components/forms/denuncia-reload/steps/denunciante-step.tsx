//@ts-nocheck
"use client"
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Phone, Mail, MapPin, Building, Hash, Shield, CheckCircle2, Check, UserCheck, Globe } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { UseFormReturn } from "react-hook-form"
import React, { useEffect, useState } from "react"
import { catalogosUbicacionService } from "@/lib/directus"

const CompactChoiceBox = React.forwardRef<
  HTMLDivElement,
  { checked: boolean; onChange: () => void; children: React.ReactNode }
>(({ checked, onChange, children }, ref) => (
  <div
    ref={ref}
    onClick={onChange}
    className={`relative w-full p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
      checked
        ? "border-primary bg-primary/10 text-primary shadow-lg transform scale-[1.02]"
        : "border-input bg-card text-muted-foreground hover:border-primary/50 hover:bg-accent hover:shadow-md hover:transform hover:scale-[1.01] opacity-70 hover:opacity-90"
    }`}
  >
    <div className={checked ? "opacity-100" : "opacity-60"}>{children}</div>
    {checked && (
      <div className="absolute top-4 right-4 h-7 w-7 bg-primary rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <Check className="h-4 w-4 text-primary-foreground" />
      </div>
    )}
    <div
      className={`absolute bottom-0 left-0 right-0 h-2 bg-primary transition-transform duration-300 ${
        checked ? "transform translate-y-0" : "transform translate-y-full"
      }`}
    ></div>
  </div>
))
CompactChoiceBox.displayName = "CompactChoiceBox"

interface DenuncianteStepProps {
  form: UseFormReturn<any> | null
}

interface Entidad {
  id: number
  nombre: string
  claveAGEE: number
}

interface Municipio {
  id: number
  nombre: string
  claveAGEM: string
  claveAGEE: number
}

export function DenuncianteStep({ form }: DenuncianteStepProps) {
  const [entidades, setEntidades] = useState<Entidad[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [loadingEntidades, setLoadingEntidades] = useState(true)
  const [loadingMunicipios, setLoadingMunicipios] = useState(false)

  const isAnonymous = form?.watch("denunciante.anonimo")
  const requestsProtection = form?.watch("denunciante.datosDenunciante.proteccion")
  const selectedEntidad = form?.watch("denunciante.datosDenunciante.domicilioDenunciante.entidad")

  useEffect(() => {
    const cargarEntidades = async () => {
      try {
        setLoadingEntidades(true)
        const entidadesData = await catalogosUbicacionService.getEntidades()
        setEntidades(entidadesData)
      } catch (error) {
        console.error("Error al cargar entidades:", error)
      } finally {
        setLoadingEntidades(false)
      }
    }

    cargarEntidades()
  }, [])

  useEffect(() => {
    const cargarMunicipios = async () => {
      if (!selectedEntidad) {
        setMunicipios([])
        return
      }

      try {
        setLoadingMunicipios(true)
        const municipiosData = await catalogosUbicacionService.getMunicipiosPorEntidad(selectedEntidad)
        setMunicipios(municipiosData)
        form?.setValue("denunciante.datosDenunciante.domicilioDenunciante.municipio", undefined)
      } catch (error) {
        console.error("Error al cargar municipios:", error)
        setMunicipios([])
      } finally {
        setLoadingMunicipios(false)
      }
    }

    if (entidades.length > 0 && selectedEntidad) {
      cargarMunicipios()
    }
  }, [selectedEntidad, entidades, form])

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-8 overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-4 sm:p-6 flex items-center justify-center sm:w-20">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div className="p-5 sm:p-6 space-y-4 flex-1">
            <div>
              <h4 className="text-lg font-semibold text-primary">Recomendaciones para una denuncia efectiva</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Siga estas pautas para asegurar que su denuncia sea procesada correctamente:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Sea específico con <span className="font-semibold">fechas, lugares y nombres</span> de los
                    involucrados
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Mencione <span className="font-semibold">testigos</span> si existen y cómo contactarlos
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2H5a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Adjunte toda la <span className="font-semibold">evidencia disponible</span> que respalde su denuncia
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Evite incluir <span className="font-semibold">opiniones personales</span>; céntrese en hechos
                    concretos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <FormField
          control={form.control}
          name="denunciante.anonimo"
          render={({ field }) => (
            <FormItem>
              <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-6 shadow-lg bg-card/95 backdrop-blur">
                <div className="space-y-5">
                  <div className="text-center sm:text-left">
                    <FormLabel className="text-lg font-semibold block text-primary">
                      ¿Deseas presentar una denuncia anónima? <span className="text-red-500">*</span>
                    </FormLabel>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                    <CompactChoiceBox checked={field.value} onChange={() => field.onChange(true)}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <Shield className="h-7 w-7 text-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base mb-2">
                            Sí, deseo presentar la denuncia sin proporcionar mis datos
                          </h4>
                          <p className="text-sm opacity-80">Tu identidad permanecerá completamente anónima</p>
                        </div>
                      </div>
                    </CompactChoiceBox>

                    <CompactChoiceBox checked={!field.value} onChange={() => field.onChange(false)}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <User className="h-7 w-7 text-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base mb-2">No, deseo proporcionar mis datos de contacto</h4>
                          <p className="text-sm opacity-80">
                            Para recibir notificaciones y en caso de requerir más información
                          </p>
                        </div>
                      </div>
                    </CompactChoiceBox>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <FormDescription className="text-sm text-muted-foreground">
                      En ambos casos, tu denuncia será confidencial y se protegerá toda la información proporcionada.
                    </FormDescription>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        {!isAnonymous && (
          <div className="space-y-6 sm:space-y-8">
            <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
              <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
                <div className="bg-primary/10 rounded-lg p-2 mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary">Datos personales</h3>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Nombre completo {!isAnonymous && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. Juan Pérez García" className="text-sm h-12" />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Ingresa tu nombre completo (nombres y apellidos)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <p className="text-sm font-medium text-primary mb-4">
                    Proporciona al menos uno de los siguientes medios de contacto:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="denunciante.datosDenunciante.telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Teléfono {!isAnonymous && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                              <Input
                                {...field}
                                type="tel"
                                placeholder="Ej. 55 1234 5678"
                                className="text-sm h-12 pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Número telefónico de contacto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="denunciante.datosDenunciante.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Correo electrónico</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Ej. usuario@correo.com"
                                className="text-sm h-12 pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Dirección de correo electrónico para notificaciones
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
              <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
                <div className="bg-primary/10 rounded-lg p-2 mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary">Domicilio para recibir notificaciones</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="denunciante.datosDenunciante.domicilioDenunciante.entidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Entidad Federativa {!isAnonymous && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number.parseInt(value))}
                          value={field.value ? field.value.toString() : ""}
                          disabled={loadingEntidades}
                        >
                          <FormControl>
                            <SelectTrigger className="text-sm h-12">
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 text-primary mr-2" />
                                <SelectValue
                                  placeholder={loadingEntidades ? "Cargando..." : "Selecciona una entidad"}
                                />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {entidades.map((entidad) => (
                              <SelectItem key={entidad.id} value={entidad.id.toString()}>
                                {entidad.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-muted-foreground">
                          Selecciona la entidad federativa donde te encuentras
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="denunciante.datosDenunciante.domicilioDenunciante.municipio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Municipio o Alcaldía {!isAnonymous && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number.parseInt(value))}
                          value={field.value ? field.value.toString() : ""}
                          disabled={!selectedEntidad || loadingMunicipios}
                        >
                          <FormControl>
                            <SelectTrigger className="text-sm h-12">
                              <div className="flex items-center">
                                <Building className="h-4 w-4 text-primary mr-2" />
                                <SelectValue
                                  placeholder={
                                    !selectedEntidad
                                      ? "Primero selecciona una entidad"
                                      : loadingMunicipios
                                        ? "Cargando municipios..."
                                        : "Selecciona un municipio"
                                  }
                                />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {municipios.map((municipio) => (
                              <SelectItem key={municipio.id} value={municipio.id.toString()}>
                                {municipio.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-muted-foreground">
                          Selecciona el municipio o alcaldía correspondiente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.calle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Calle {!isAnonymous && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. Av. Insurgentes" className="text-sm h-12" />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Ingresa el nombre completo de la calle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="denunciante.datosDenunciante.domicilioDenunciante.numeroExterior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Número Exterior {!isAnonymous && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input {...field} placeholder="Ej. 123" className="text-sm h-12 pl-10" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Número exterior del domicilio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="denunciante.datosDenunciante.domicilioDenunciante.numeroInterior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Número Interior</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input {...field} placeholder="Ej. 4B" className="text-sm h-12 pl-10" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Número interior del domicilio (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="denunciante.datosDenunciante.domicilioDenunciante.codigoPostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Código Postal {!isAnonymous && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. 06700" className="text-sm h-12" />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Código postal del domicilio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="denunciante.datosDenunciante.domicilioDenunciante.municipioAlcaldia"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} type="hidden" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
              <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
                <div className="bg-primary/10 rounded-lg p-2 mr-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary">Medidas de protección</h3>
              </div>

              <FormField
                control={form.control}
                name="denunciante.datosDenunciante.proteccion"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-5">
                      <div>
                        <FormLabel className="text-lg font-semibold block text-primary">
                          ¿Deseas solicitar medidas de protección?
                        </FormLabel>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <CompactChoiceBox checked={field.value} onChange={() => field.onChange(true)}>
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <Shield className="h-7 w-7 text-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-2">
                                Sí, considero que pueden presentarse situaciones de riesgo
                              </h4>
                              <p className="text-sm opacity-80">Solicitar medidas para garantizar mi seguridad</p>
                            </div>
                          </div>
                        </CompactChoiceBox>

                        <CompactChoiceBox checked={!field.value} onChange={() => field.onChange(false)}>
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <UserCheck className="h-7 w-7 text-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-2">No</h4>
                              <p className="text-sm opacity-80">No considero necesarias las medidas de protección</p>
                            </div>
                          </div>
                        </CompactChoiceBox>
                      </div>

                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                        <FormDescription className="text-sm text-muted-foreground">
                          Las medidas de protección son acciones para garantizar la seguridad e integridad de las
                          personas involucradas en el hecho que se denuncia.
                        </FormDescription>
                      </div>
                    </div>

                    {field.value && (
                      <div className="mt-6 pt-5 border-t border-primary/20 bg-primary/5 p-5 rounded-lg">
                        <FormField
                          control={form.control}
                          name="denunciante.datosDenunciante.razonesProteccion"
                          render={({ field: reasonsField }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">
                                Explica las razones por las que solicitas medidas de protección
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...reasonsField}
                                  placeholder="Describe las situaciones de riesgo que consideras podrían presentarse..."
                                  className="min-h-[120px] text-sm mt-2"
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-muted-foreground mt-2">
                                Proporciona detalles específicos sobre las situaciones de riesgo
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

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

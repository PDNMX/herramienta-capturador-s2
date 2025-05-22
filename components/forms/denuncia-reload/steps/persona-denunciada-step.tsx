//@ts-nocheck
"use client"
import React, { useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, MapPin, Building, Loader2, User, Edit } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import type { UseFormReturn } from "react-hook-form"
import Image from "next/image"
import iconParticular from "@/components/icon-particular.svg"
import iconServidorPublico from "@/components/icon-servidor-publico.svg"

interface PersonaDenunciadaStepProps {
  form: UseFormReturn<any> | null
}

interface EntePublico {
  id: number
  nombre: string
}

const entidadesFederativas = [
  { nombre: "Aguascalientes", clave: "01", valor: 1 },
  { nombre: "Baja California", clave: "02", valor: 2 },
  { nombre: "Baja California Sur", clave: "03", valor: 3 },
  { nombre: "Campeche", clave: "04", valor: 4 },
  { nombre: "Coahuila", clave: "05", valor: 5 },
  { nombre: "Colima", clave: "06", valor: 6 },
  { nombre: "Chiapas", clave: "07", valor: 7 },
  { nombre: "Chihuahua", clave: "08", valor: 8 },
  { nombre: "Ciudad de México", clave: "09", valor: 9 },
  { nombre: "Durango", clave: "10", valor: 10 },
  { nombre: "Guanajuato", clave: "11", valor: 11 },
  { nombre: "Guerrero", clave: "12", valor: 12 },
  { nombre: "Hidalgo", clave: "13", valor: 13 },
  { nombre: "Jalisco", clave: "14", valor: 14 },
  { nombre: "México", clave: "15", valor: 15 },
  { nombre: "Michoacán", clave: "16", valor: 16 },
  { nombre: "Morelos", clave: "17", valor: 17 },
  { nombre: "Nayarit", clave: "18", valor: 18 },
  { nombre: "Nuevo León", clave: "19", valor: 19 },
  { nombre: "Oaxaca", clave: "20", valor: 20 },
  { nombre: "Puebla", clave: "21", valor: 21 },
  { nombre: "Querétaro", clave: "22", valor: 22 },
  { nombre: "Quintana Roo", clave: "23", valor: 23 },
  { nombre: "San Luis Potosí", clave: "24", valor: 24 },
  { nombre: "Sinaloa", clave: "25", valor: 25 },
  { nombre: "Sonora", clave: "26", valor: 26 },
  { nombre: "Tabasco", clave: "27", valor: 27 },
  { nombre: "Tamaulipas", clave: "28", valor: 28 },
  { nombre: "Tlaxcala", clave: "29", valor: 29 },
  { nombre: "Veracruz", clave: "30", valor: 30 },
  { nombre: "Yucatán", clave: "31", valor: 31 },
  { nombre: "Zacatecas", clave: "32", valor: 32 },
]

const CustomCheckbox = React.forwardRef<
  HTMLDivElement,
  { checked: boolean; onChange: () => void; children: React.ReactNode }
>(({ checked, onChange, children }, ref) => (
  <div
    ref={ref}
    onClick={onChange}
    className={`bg-card relative w-full p-5 rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden
      ${
        checked
          ? "border-primary shadow-lg transform scale-[1.02] bg-primary/5"
          : "border-input hover:border-primary/50 hover:shadow-md hover:transform hover:scale-[1.01]"
      }`}
  >
    {children}
    {checked && (
      <div className="absolute top-3 right-3 h-7 w-7 bg-primary rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <Check className="h-4 w-4 text-primary-foreground" />
      </div>
    )}
    <div
      className={`absolute bottom-0 left-0 right-0 h-1.5 bg-primary transition-transform duration-300 ${
        checked ? "transform translate-y-0" : "transform translate-y-full"
      }`}
    ></div>
  </div>
))
CustomCheckbox.displayName = "CustomCheckbox"

const GenderCheckbox = React.forwardRef<
  HTMLDivElement,
  { checked: boolean; onChange: () => void; children: React.ReactNode }
>(({ checked, onChange, children }, ref) => (
  <div
    ref={ref}
    onClick={onChange}
    className={`relative w-full py-3 px-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
      ${
        checked
          ? "border-primary bg-primary text-primary-foreground font-medium shadow-md"
          : "border-input bg-card text-foreground hover:border-primary/50 hover:bg-accent"
      }`}
  >
    {children}
  </div>
))
GenderCheckbox.displayName = "GenderCheckbox"

export function PersonaDenunciadaStep({ form }: PersonaDenunciadaStepProps) {
  const [entesPublicos, setEntesPublicos] = useState<EntePublico[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEnteName, setSelectedEnteName] = useState<string>("")

  const fetchEntesPublicos = async (clave: string) => {
    setLoading(true)
    try {
      // Primero obtenemos los entes federales (clave "00")
      const federalResponse = await fetch(
        `https://cobertura.plataformadigitalnacional.org/directus/items/entes?filter[entidad][_eq]=00&limit=-1`,
      )
      const federalData = await federalResponse.json()

      // Luego obtenemos los entes de la entidad seleccionada
      const entidadResponse = await fetch(
        `https://cobertura.plataformadigitalnacional.org/directus/items/entes?filter[entidad][_eq]=${clave}&limit=-1`,
      )
      const entidadData = await entidadResponse.json()

      // Combinamos ambos resultados
      const combinedEntes = [...federalData.data, ...entidadData.data]
      setEntesPublicos(combinedEntes)
    } catch (error) {
      console.error("Error fetching entes públicos:", error)
    }
    setLoading(false)
  }

  // Al cambiar la entidad, actualizar el valor en el formulario y resetear el ente público
  const handleEntidadChange = (value: string) => {
    const entidad = entidadesFederativas.find((e) => e.nombre === value)
    if (entidad) {
      // Asegurarse de que se está estableciendo un número, no una cadena
      form?.setValue("personaDenunciada.entidad", entidad.valor, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      // Resetear el ente público al cambiar la entidad
      form?.setValue("personaDenunciada.entePublico", undefined, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      // Resetear las faltas seleccionadas al cambiar la entidad
      form?.setValue("faltaCometida.faltaGrave", [], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      form?.setValue("faltaCometida.faltaNoGrave", [], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      form?.setValue("faltaCometida.hechosCorrupcion", [], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      // Fetch entes públicos para la entidad seleccionada
      fetchEntesPublicos(entidad.clave)
    }
  }

  // Actualizar el ente público seleccionado
  const handleEntePublicoChange = (value: string) => {
    const selectedEnte = entesPublicos.find((ente) => ente.id.toString() === value)
    if (selectedEnte) {
      // Asegurar que se establece como número, no cadena
      form?.setValue("personaDenunciada.entePublico", selectedEnte.id, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      setSelectedEnteName(selectedEnte.nombre)
    }
  }

  // Al cambiar el tipo de persona (servidor público o particular), resetear las faltas seleccionadas
  const handleTipoPersonaChange = (value: string) => {
    form?.setValue("personaDenunciada.tipoPersona", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })

    // Resetear las faltas seleccionadas al cambiar el tipo de persona
    form?.setValue("faltaCometida.faltaGrave", [], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })

    form?.setValue("faltaCometida.faltaNoGrave", [], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })

    form?.setValue("faltaCometida.hechosCorrupcion", [], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  if (!form) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 mb-6 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-3 sm:p-4 flex items-center justify-center sm:w-16">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div className="p-4 sm:p-5 space-y-3 flex-1">
            <div>
              <h4 className="text-base font-medium text-primary">
                Recomendaciones para identificar a la persona denunciada
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Siga estas pautas para proporcionar información precisa sobre la persona denunciada:
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Sea específico con <span className="font-medium">nombre completo y cargo</span> de la persona
                    denunciada
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Indique la <span className="font-medium">institución o área</span> donde labora la persona
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Describa <span className="font-medium">características físicas</span> que faciliten su
                    identificación
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
                    Si no conoce el nombre, proporcione <span className="font-medium">detalles específicos</span> que
                    permitan identificarla
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* SECCIÓN 1: Ubicación Institucional */}
        <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
          <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
            <Building className="h-5 w-5 mr-3 text-primary" />
            Ubicación Institucional
          </h3>
          <FormDescription className="text-xs sm:text-sm mb-4">
            Selecciona la entidad federativa y la institución donde ocurrieron los hechos o donde trabaja la persona
            denunciada.
          </FormDescription>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="personaDenunciada.entidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Entidad Federativa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Select
                        onValueChange={handleEntidadChange}
                        value={
                          field.value ? entidadesFederativas.find((e) => e.valor === field.value)?.nombre || "" : ""
                        }
                      >
                        <SelectTrigger className="pl-10 text-sm h-10 sm:h-12">
                          <SelectValue placeholder="Selecciona una entidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {entidadesFederativas.map((entidad) => (
                            <SelectItem key={entidad.clave} value={entidad.nombre}>
                              {entidad.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Selecciona la entidad federativa donde ocurrieron los hechos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personaDenunciada.entePublico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Ente Público</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <div className="w-full pl-10">
                        <Combobox
                          options={entesPublicos.map((ente) => ({
                            label: ente.nombre,
                            value: ente.id.toString(),
                          }))}
                          value={field.value?.toString() || ""}
                          onChange={handleEntePublicoChange}
                          placeholder="Selecciona un ente público"
                          disabled={!form.getValues("personaDenunciada.entidad")}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Selecciona la institución donde ocurrieron los hechos. Se muestran tanto instituciones federales
                    como de la entidad seleccionada.
                  </FormDescription>
                  {loading && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Cargando entes públicos...</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECCIÓN 2: Tipo de Persona */}
        <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
          <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
            <User className="h-5 w-5 mr-3 text-primary" />
            Persona o personas denunciadas <span className="text-red-500">*</span>
          </h3>
          <FormDescription className="text-xs sm:text-sm mb-4">
            Selecciona si la persona denunciada pertenece al servicio público o es un particular. Este campo es
            obligatorio.
          </FormDescription>
          <FormField
            control={form.control}
            name="personaDenunciada.tipoPersona"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomCheckbox
                      checked={field.value === "SERVIDOR_PUBLICO"}
                      onChange={() => {
                        handleTipoPersonaChange("SERVIDOR_PUBLICO")
                      }}
                    >
                      <div className="flex flex-col items-center text-center pt-2 pb-4">
                        <div
                          className={`relative mb-5 flex items-center justify-center transition-transform duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "scale-110" : ""}`}
                        >
                          <div className="relative">
                            <Image
                              src={iconServidorPublico || "/placeholder.svg"}
                              alt="Icono de servidor público"
                              className={`h-16 w-16 transition-opacity duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "opacity-100" : "opacity-50"} dark:brightness-200`}
                            />
                          </div>
                        </div>
                        <h3
                          className={`font-semibold mb-2 text-lg transition-colors duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "text-primary" : ""}`}
                        >
                          Persona servidora pública
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Desempeña un empleo, cargo o comisión en una institución pública
                        </p>
                      </div>
                    </CustomCheckbox>
                    <CustomCheckbox
                      checked={field.value === "PARTICULAR"}
                      onChange={() => {
                        handleTipoPersonaChange("PARTICULAR")
                      }}
                    >
                      <div className="flex flex-col items-center text-center pt-2 pb-4">
                        <div
                          className={`relative mb-5 flex items-center justify-center transition-transform duration-300 ${field.value === "PARTICULAR" ? "scale-110" : ""}`}
                        >
                          <Image
                            src={iconParticular || "/placeholder.svg"}
                            alt="Icono de particular"
                            className={`h-16 w-16 transition-opacity duration-300 ${field.value === "PARTICULAR" ? "opacity-100" : "opacity-50"} dark:brightness-200`}
                          />
                        </div>
                        <h3
                          className={`font-semibold mb-2 text-lg transition-colors duration-300 ${field.value === "PARTICULAR" ? "text-primary" : ""}`}
                        >
                          Particular
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Persona física o empresa del sector privado vinculada con actividades en la administración
                          pública
                        </p>
                      </div>
                    </CustomCheckbox>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECCIÓN 3: Datos de la Persona Denunciada */}
        <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
          <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
            <User className="h-5 w-5 mr-3 text-primary" />
            Datos de la Persona Denunciada
          </h3>
          <FormDescription className="text-xs sm:text-sm mb-4">
            Proporciona los datos de identificación de la persona denunciada o involucrada en los hechos.
          </FormDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="personaDenunciada.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Nombre(s) o alias</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input {...field} placeholder="Ej. Juan" className="text-sm h-10 sm:h-12 pl-10" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Escribe el nombre, nombres o alías de la persona denunciada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personaDenunciada.apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Apellidos</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input {...field} placeholder="Ej. Pérez García" className="text-sm h-10 sm:h-12 pl-10" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Escribe el o los apellidos de la persona denunciada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="personaDenunciada.genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Género</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <GenderCheckbox checked={field.value === "FEMENINO"} onChange={() => field.onChange("FEMENINO")}>
                        <div className="text-center">
                          <h3 className="font-medium">Femenino</h3>
                        </div>
                      </GenderCheckbox>
                      <GenderCheckbox
                        checked={field.value === "MASCULINO"}
                        onChange={() => field.onChange("MASCULINO")}
                      >
                        <div className="text-center">
                          <h3 className="font-medium">Masculino</h3>
                        </div>
                      </GenderCheckbox>
                      <GenderCheckbox
                        checked={field.value === "NO_BINARIO"}
                        onChange={() => field.onChange("NO_BINARIO")}
                      >
                        <div className="text-center">
                          <h3 className="font-medium">No binario</h3>
                        </div>
                      </GenderCheckbox>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Selecciona el género de la persona denunciada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECCIÓN 4: Descripción Detallada */}
        <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
          <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
            <Edit className="h-5 w-5 mr-3 text-primary" />
            Descripción Detallada
          </h3>
          <FormField
            control={form.control}
            name="personaDenunciada.descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Descripción de la Persona</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ejemplo: Es una persona del área de finanzas, alto, delgado, de piel morena, ojos cafés, con bigote, un lunar en la mejilla izquierda, tenía una quemadura en la mano y vestía pantalón café con camisa azul"
                    className="h-48 text-sm min-h-[120px]"
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
                  Proporciona los datos que pueden ayudar a identificar a la persona denunciada. Puedes mencionar: el
                  cargo o área donde trabaja, características como altura, complexión, color de piel, color de ojos,
                  cabello, barba, lunares, cicatrices, tatuajes, perforaciones, vestimenta o cualquier otra información
                  que consideres relevante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

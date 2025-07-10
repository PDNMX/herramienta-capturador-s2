//@ts-nocheck
"use client"
import React, { useState, useEffect } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Building, Loader2, User, Globe, Flag, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UseFormReturn } from "react-hook-form"
import Image from "next/image"
import iconParticular from "@/components/icon-particular.svg"
import iconServidorPublico from "@/components/icon-servidor-publico.svg"
import { EntePublicoCombobox } from "@/components/ui/ente-publico-combobox"

interface PersonaDenunciadaStepProps {
  form: UseFormReturn<any> | null
}

interface EntePublico {
  id: number
  nombre: string
  entidad?: string
}

const entidadesFederativas = [
  { nombre: "Federal", clave: "00", valor: 33 }, // Nueva opción para entes federales
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
CustomCheckbox.displayName = "CustomCheckbox"

const GenderOption = React.forwardRef<
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
          : "border-gray-300 bg-gray-100 text-gray-600 hover:border-primary/50 hover:bg-gray-200"
      }`}
  >
    <div className="flex justify-center">
      {children}
      {checked && (
        <div className="absolute right-3 h-5 w-5 bg-white rounded-full flex items-center justify-center">
          <Check className="h-3 w-3 text-primary" />
        </div>
      )}
    </div>
  </div>
))
GenderOption.displayName = "GenderOption"

export function PersonaDenunciadaStep({ form }: PersonaDenunciadaStepProps) {
  const [entesPublicos, setEntesPublicos] = useState<EntePublico[]>([])
  const [loading, setLoading] = useState(false)

  // NUEVA: useEffect para cargar entes públicos al montar el componente si ya hay una entidad seleccionada
  useEffect(() => {
    if (!form) return

    const entidadSeleccionada = form.getValues("personaDenunciada.entidad")
    
    if (entidadSeleccionada) {
      console.log("Entidad ya seleccionada detectada:", entidadSeleccionada)
      // Buscar la clave correspondiente a la entidad seleccionada
      const entidad = entidadesFederativas.find((e) => e.valor === entidadSeleccionada)
      
      if (entidad) {
        console.log("Cargando entes públicos para la entidad:", entidad.nombre, "clave:", entidad.clave)
        fetchEntesPublicos(entidad.clave)
      }
    }
  }, [form]) // Solo se ejecuta cuando el form cambia (al montar el componente)

  const fetchEntesPublicos = async (clave: string) => {
    setLoading(true)
    try {
      console.log(`Fetching entes públicos para clave: ${clave}`)
      
      let combinedEntes: EntePublico[] = []
      
      if (clave === "00") {
        // Si seleccionaron "Federal", solo obtener entes federales (clave "00")
        const federalResponse = await fetch(
          `https://cobertura.plataformadigitalnacional.org/directus/items/entes?filter[entidad][_eq]=00&limit=-1`,
        )
        const federalData = await federalResponse.json()
        
        combinedEntes = federalData.data.map((ente: EntePublico) => ({
          ...ente,
          entidad: "00", // Federal
        }))
      } else {
        // Para entidades específicas, obtener solo los entes de esa entidad (sin federales)
        const entidadResponse = await fetch(
          `https://cobertura.plataformadigitalnacional.org/directus/items/entes?filter[entidad][_eq]=${clave}&limit=-1`,
        )
        const entidadData = await entidadResponse.json()

        combinedEntes = entidadData.data.map((ente: EntePublico) => ({
          ...ente,
          entidad: clave, // Entidad específica
        }))
      }

      console.log(`Entes públicos cargados: ${combinedEntes.length}`)
      setEntesPublicos(combinedEntes)
    } catch (error) {
      console.error("Error fetching entes públicos:", error)
      setEntesPublicos([]) // En caso de error, establecer array vacío
    }
    setLoading(false)
  }

  const handleEntidadChange = (value: string) => {
    const entidad = entidadesFederativas.find((e) => e.nombre === value)
    if (entidad) {
      form?.setValue("personaDenunciada.entidad", entidad.valor, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      })

      // MODIFICADO: Solo limpiar el ente público si realmente cambió la entidad
      const entidadAnterior = form?.getValues("personaDenunciada.entidad")
      if (entidadAnterior !== entidad.valor) {
        form?.setValue("personaDenunciada.entePublico", undefined, {
          shouldValidate: false,
          shouldDirty: true,
          shouldTouch: true,
        })
      }

      form?.setValue("faltaCometida.faltaGrave", [], {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      })

      form?.setValue("faltaCometida.faltaNoGrave", [], {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      })

      form?.setValue("faltaCometida.hechosCorrupcion", [], {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      })

      fetchEntesPublicos(entidad.clave)
    }
  }

  const handleEntePublicoChange = (value: number | undefined) => {
    form?.setValue("personaDenunciada.entePublico", value, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleTipoPersonaChange = (value: string) => {
    form?.setValue("personaDenunciada.tipoPersona", value, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    })

    form?.setValue("faltaCometida.faltaGrave", [], {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    })

    form?.setValue("faltaCometida.faltaNoGrave", [], {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    })

    form?.setValue("faltaCometida.hechosCorrupcion", [], {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const getSelectedEntidadName = () => {
    const entidadValue = form?.getValues("personaDenunciada.entidad")
    return entidadesFederativas.find((e) => e.valor === entidadValue)?.nombre || ""
  }

  if (!form) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-8 overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-4 sm:p-6 flex items-center justify-center sm:w-20">
            <Building className="h-10 w-10 text-primary" />
          </div>
          <div className="p-5 sm:p-6 space-y-4 flex-1">
            <div>
              <h4 className="text-lg font-semibold text-primary">
                Recomendaciones para identificar a la persona denunciada
              </h4>
              <p className="text-sm text-muted-foreground mt-2">
                Siga estas pautas para proporcionar información precisa sobre la persona denunciada:
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Sea específico con <span className="font-semibold">nombre completo y cargo</span> de la persona
                    denunciada
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Indique la <span className="font-semibold">institución o área</span> donde labora la persona
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Describa <span className="font-semibold">características físicas</span> que faciliten su
                    identificación
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
                    Si no conoce el nombre, proporcione <span className="font-semibold">detalles específicos</span> que
                    permitan identificarla
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
          <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
            <div className="bg-primary/10 rounded-lg p-2 mr-4">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary">Ubicación Institucional</h3>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="personaDenunciada.entidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Entidad Federativa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary z-10" />
                      <Select
                        onValueChange={handleEntidadChange}
                        value={
                          field.value ? entidadesFederativas.find((e) => e.valor === field.value)?.nombre || "" : ""
                        }
                      >
                        <SelectTrigger className="pl-10 text-sm h-12">
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
                  <FormDescription className="text-xs text-muted-foreground">
                    Selecciona la entidad federativa donde ocurrieron los hechos o donde trabaja la persona denunciada
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
                  <FormLabel className="text-sm font-semibold">Ente Público</FormLabel>
                  <FormControl>
                    <EntePublicoCombobox
                      options={entesPublicos}
                      value={field.value}
                      onChange={handleEntePublicoChange}
                      placeholder={
                        !form.getValues("personaDenunciada.entidad")
                          ? "Primero selecciona una entidad"
                          : loading
                            ? "Cargando entes públicos..."
                            : "Buscar y seleccionar ente público..."
                      }
                      disabled={!form.getValues("personaDenunciada.entidad") || loading}
                      entidadNombre={getSelectedEntidadName()}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Busca y selecciona la institución donde ocurrieron los hechos. Se muestran instituciones federales{" "}
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mx-1">
                      <Flag className="h-3 w-3 mr-1" />
                      Federal
                    </span>{" "}
                    y de la entidad seleccionada{" "}
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mx-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      Entidad
                    </span>
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

        <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
          <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
            <div className="bg-primary/10 rounded-lg p-2 mr-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary">
              Persona o personas denunciadas <span className="text-red-500">*</span>
            </h3>
          </div>

          <FormField
            control={form.control}
            name="personaDenunciada.tipoPersona"
            render={({ field }) => (
              <FormItem className="space-y-5">
                <FormControl>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <p className="text-sm opacity-80">
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
                        <p className="text-sm opacity-80">
                          Persona física o empresa del sector privado vinculada con actividades en la administración
                          pública
                        </p>
                      </div>
                    </CustomCheckbox>
                  </div>
                </FormControl>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <FormDescription className="text-sm text-muted-foreground">
                    Selecciona si la persona denunciada pertenece al servicio público o es un particular. Este campo es
                    obligatorio.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
          <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
            <div className="bg-primary/10 rounded-lg p-2 mr-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary">Datos de la Persona Denunciada</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="personaDenunciada.nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Nombre(s) o alias</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input {...field} placeholder="Ej. Juan" className="text-sm h-12 pl-10" />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Nombre, nombres o alias de la persona denunciada
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
                    <FormLabel className="text-sm font-semibold">Apellidos</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input {...field} placeholder="Ej. Pérez García" className="text-sm h-12 pl-10" />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Apellidos de la persona denunciada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="personaDenunciada.genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Género</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <GenderOption checked={field.value === "FEMENINO"} onChange={() => field.onChange("FEMENINO")}>
                        <h3 className="font-medium text-base">Femenino</h3>
                      </GenderOption>
                      <GenderOption checked={field.value === "MASCULINO"} onChange={() => field.onChange("MASCULINO")}>
                        <h3 className="font-medium text-base">Masculino</h3>
                      </GenderOption>
                      <GenderOption
                        checked={field.value === "NO_BINARIO"}
                        onChange={() => field.onChange("NO_BINARIO")}
                      >
                        <h3 className="font-medium text-base">No binario</h3>
                      </GenderOption>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Selecciona el género de la persona denunciada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personaDenunciada.descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Descripción de la Persona</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ejemplo: Es una persona del área de finanzas, alto, delgado, de piel morena, ojos cafés, con bigote, un lunar en la mejilla izquierda, tenía una quemadura en la mano y vestía pantalón café con camisa azul"
                      className="text-sm min-h-[120px]"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Proporciona los datos que pueden ayudar a identificar a la persona denunciada. Puedes mencionar: el
                    cargo o área donde trabaja, características como altura, complexión, color de piel, color de ojos,
                    cabello, barba, lunares, cicatrices, tatuajes, perforaciones, vestimenta o cualquier otra
                    información que consideres relevante
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

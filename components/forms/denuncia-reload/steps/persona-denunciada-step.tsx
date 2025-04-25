"use client"
import React, { useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CircleUser, Check, Scale, MapPin, Building, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import type { UseFormReturn } from "react-hook-form"

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

      // Fetch entes públicos para la entidad seleccionada
      fetchEntesPublicos(entidad.clave)
    }
  }

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

  if (!form) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        {/* SECCIÓN 1: Ubicación Institucional - Ahora es la primera sección */}
        <div className="space-y-4">
          <h2 className="font-semibold text-primary text-lg">Ubicación Institucional</h2>
          <FormDescription className="text-xs sm:text-sm">
            Selecciona la entidad federativa y la institución donde ocurrieron los hechos o donde trabaja la persona
            denunciada.
          </FormDescription>

          <FormField
            control={form.control}
            name="personaDenunciada.entidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Entidad Federativa</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      onValueChange={handleEntidadChange}
                      value={field.value ? entidadesFederativas.find((e) => e.valor === field.value)?.nombre || "" : ""}
                    >
                      <SelectTrigger className="pl-8">
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
                <FormLabel className="text-xs font-medium">Ente Público</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div className="w-full pl-8">
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
                  Selecciona la institución donde ocurrieron los hechos. Se muestran tanto instituciones federales como
                  de la entidad seleccionada.
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

        {/* SECCIÓN 2: Tipo de Persona - Ahora es la segunda sección */}
        <div className="space-y-4 border-t pt-4">
          <h2 className="font-semibold text-primary text-lg">Persona o personas denunciadas</h2>
          <FormDescription className="text-xs sm:text-sm">
            Selecciona si la persona denunciada pertenece al servicio público o es un particular.
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
                        field.onChange("SERVIDOR_PUBLICO")
                      }}
                    >
                      <div className="flex flex-col items-center text-center pt-2 pb-4">
                        <div
                          className={`relative mb-5 flex items-center justify-center transition-transform duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "scale-110" : ""}`}
                        >
                          <div className="relative">
                            <Scale
                              className={`h-16 w-16 transition-colors duration-300 ${field.value === "SERVIDOR_PUBLICO" ? "text-primary" : "text-primary/80"}`}
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
                        field.onChange("PARTICULAR")
                      }}
                    >
                      <div className="flex flex-col items-center text-center pt-2 pb-4">
                        <div
                          className={`relative mb-5 flex items-center justify-center transition-transform duration-300 ${field.value === "PARTICULAR" ? "scale-110" : ""}`}
                        >
                          <CircleUser
                            className={`h-16 w-16 transition-colors duration-300 ${field.value === "PARTICULAR" ? "text-primary" : "text-primary/80"}`}
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
        <div className="space-y-4 border-t pt-4">
          <h2 className="font-semibold text-primary text-lg">Datos de la Persona Denunciada</h2>
          <FormDescription className="text-xs sm:text-sm">
            Proporciona los datos de identificación de la persona denunciada o involucrada en los hechos.
          </FormDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="personaDenunciada.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Nombre(s) o alias</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej. Juan"
                      className="text-sm focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                    />
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
                  <FormLabel className="text-xs font-medium">Apellidos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej. Pérez García"
                      className="text-sm focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Escribe el o los apellidos de la persona denunciada
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
                <FormLabel className="text-xs font-medium">Género</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GenderCheckbox checked={field.value === "FEMENINO"} onChange={() => field.onChange("FEMENINO")}>
                      <div className="text-center">
                        <h3 className="font-medium">Femenino</h3>
                      </div>
                    </GenderCheckbox>
                    <GenderCheckbox checked={field.value === "MASCULINO"} onChange={() => field.onChange("MASCULINO")}>
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

        {/* SECCIÓN 4: Descripción Detallada */}
        <div className="space-y-4 border-t pt-4">
          <h2 className="font-semibold text-primary text-lg">Descripción Detallada</h2>
          <FormField
            control={form.control}
            name="personaDenunciada.descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Descripción de la Persona</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ejemplo: Es una persona del área de finanzas, alto, delgado, de piel morena, ojos cafés, con bigote, un lunar en la mejilla izquierda, tenía una quemadura en la mano y vestía pantalón café con camisa azul"
                    className="h-48 text-sm focus-visible:ring-primary/20 focus-visible:ring-offset-2"
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

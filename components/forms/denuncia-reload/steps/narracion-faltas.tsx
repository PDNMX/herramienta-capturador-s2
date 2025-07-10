//@ts-nocheck
"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Mic,
  Square,
  ClipboardList,
  Loader2,
  Flag,
  MapPin,
  Filter,
  Search,
  X,
  BookOpen,
  Scale,
  Hash,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { UseFormReturn } from "react-hook-form"
import { publicDirectus } from "@/lib/directus"
import { readItems } from "@directus/sdk"

declare var webkitSpeechRecognition: any
declare var SpeechRecognition: any

interface Falta {
  id: number
  entidad: number
  clasificacion: string
  nombre: string
  descripcion: string
  servidorPublico: boolean
  particular: boolean
  ley?: string
  articulo?: string
  fraccion?: string
  inciso?: string
  letra?: string
}

interface CheckboxGroupProps {
  title: string
  description: string
  name: string
  items: Array<{
    id: number
    label: string
    description: string
    entidad?: number
    ley?: string
    articulo?: string
    fraccion?: string
    inciso?: string
    letra?: string
  }>
  form: UseFormReturn<any>
}

// Array de entidades federativas para obtener los nombres
const entidadesFederativas = [
  { nombre: "Federal", clave: "00", valor: 33 },
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

// Función helper para formatear la referencia legal (orden invertido)
const formatearReferenciaLegal = (item: any) => {
  console.log("Formateando referencia legal para:", item.label, item) // Debug
  const partes = []
  const ley = []

  // Primero los detalles específicos
  if (item.articulo && item.articulo.trim()) partes.push(`Art. ${item.articulo.trim()}`)
  if (item.fraccion && item.fraccion.trim()) partes.push(`Frac. ${item.fraccion.trim()}`)
  if (item.inciso && item.inciso.trim()) partes.push(`Inc. ${item.inciso.trim()}`)
  if (item.letra && item.letra.trim()) partes.push(`Letra ${item.letra.trim()}`)

  // La ley al final
  if (item.ley && item.ley.trim()) ley.push(item.ley.trim())

  // Combinar: detalles específicos + ley
  const detalles = partes.length > 0 ? partes.join(", ") : null
  const leyTexto = ley.length > 0 ? ley.join("") : null

  let resultado = null
  if (detalles && leyTexto) {
    resultado = `${detalles} - ${leyTexto}`
  } else if (detalles) {
    resultado = detalles
  } else if (leyTexto) {
    resultado = leyTexto
  }

  console.log("Referencia legal formateada:", resultado) // Debug
  return resultado
}

// Función helper para crear un identificador más descriptivo de la falta
const crearIdentificadorFalta = (item: any) => {
  const partes = []

  if (item.articulo && item.articulo.trim()) partes.push(`Artículo ${item.articulo.trim()}`)
  if (item.fraccion && item.fraccion.trim()) partes.push(`Fracción ${item.fraccion.trim()}`)
  if (item.inciso && item.inciso.trim()) partes.push(`Inciso ${item.inciso.trim()}`)
  if (item.letra && item.letra.trim()) partes.push(`Letra ${item.letra.trim()}`)

  if (partes.length > 0) {
    return partes.join(" • ")
  }

  // Si no hay información legal, usar el ID
  return `Falta #${item.id}`
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, description, name, items, form }) => {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar items basado en el término de búsqueda
  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    const referenciaLegal = formatearReferenciaLegal(item)

    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      (item.ley && item.ley.toLowerCase().includes(searchLower)) ||
      (referenciaLegal && referenciaLegal.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="rounded-xl border-2 border-primary/20 p-4 sm:p-6 shadow-lg bg-gradient-to-br from-background to-muted/30 backdrop-blur dark:from-background dark:to-muted/20">
      <div className="space-y-4 sm:space-y-5">
        <div className="pb-3 sm:pb-4 border-b border-primary/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <FormLabel className="text-base sm:text-lg font-semibold text-primary">{title}</FormLabel>
          </div>
          <FormDescription className="text-xs sm:text-sm text-muted-foreground ml-7 sm:ml-10">
            {description}
          </FormDescription>
        </div>

        {/* Buscador mejorado */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Buscar por nombre, descripción o referencia legal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-background/80 border-border focus:border-primary/50 focus:ring-primary/20 text-sm"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <ScrollArea className="h-[350px] sm:h-[400px] rounded-lg border border-border bg-background/50">
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const referenciaLegal = formatearReferenciaLegal(item)

                      return (
                        <div
                          key={item.id}
                          className="group relative bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden dark:bg-card/50"
                        >
                          <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? form.setValue(name, [...(field.value || []), item.id])
                                    : form.setValue(
                                        name,
                                        field.value?.filter((value: number) => value !== item.id),
                                      )
                                }}
                                className="mt-1 flex-shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </FormControl>

                            <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                              {/* Header con identificador */}
                              <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-start justify-between gap-2 sm:gap-3">
                                  <div className="flex-1 min-w-0">
                                    {/* Identificador único */}
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/20 px-2 sm:px-3 py-1 sm:py-1.5 font-medium"
                                      >
                                        {crearIdentificadorFalta(item)}
                                      </Badge>
                                    </div>

                                    {/* Título de la falta */}
                                    <FormLabel className="text-sm sm:text-base font-semibold cursor-pointer text-foreground leading-tight block group-hover:text-primary transition-colors">
                                      {item.label}
                                    </FormLabel>
                                  </div>
                                </div>

                                {/* Referencia legal mejorada */}
                                {referenciaLegal && (
                                  <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4 dark:bg-muted/30">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <div className="p-1 sm:p-1.5 bg-muted rounded-md">
                                        <Scale className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                                          {referenciaLegal}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Descripción mejorada */}
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4 dark:bg-primary/10">
                                  <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1 sm:p-1.5 bg-primary/20 rounded-md">
                                      <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <FormDescription className="text-xs sm:text-sm leading-relaxed text-foreground/80 font-medium">
                                        {item.description}
                                      </FormDescription>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : searchTerm ? (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <Search className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm font-medium">No se encontraron resultados</p>
                      <p className="text-xs text-center mt-1">Intenta con otros términos de búsqueda</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <Filter className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">No hay faltas disponibles en esta categoría</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Contador de resultados mejorado */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground mt-3 px-1">
                <span className="font-medium">
                  {searchTerm
                    ? `${filteredItems.length} de ${items.length} resultados`
                    : `${items.length} opciones disponibles`}
                </span>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="h-6 px-2 text-xs hover:bg-muted self-start sm:self-auto"
                  >
                    Limpiar búsqueda
                  </Button>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

interface NarracionYFaltaStepProps {
  form: UseFormReturn<any> | null
}

export function NarracionYFaltaStep({ form }: NarracionYFaltaStepProps) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  // Estados para las faltas cargadas desde Directus
  const [faltas, setFaltas] = useState<Falta[]>([])
  const [loadingFaltas, setLoadingFaltas] = useState(false)

  // Estados para las faltas filtradas por tipo
  const [faltasGraves, setFaltasGraves] = useState<
    Array<{
      id: number
      label: string
      description: string
      entidad?: number
      ley?: string
      articulo?: string
      fraccion?: string
      inciso?: string
      letra?: string
    }>
  >([])
  const [faltasNoGraves, setFaltasNoGraves] = useState<
    Array<{
      id: number
      label: string
      description: string
      entidad?: number
      ley?: string
      articulo?: string
      fraccion?: string
      inciso?: string
      letra?: string
    }>
  >([])
  const [hechosCorrupcion, setHechosCorrupcion] = useState<
    Array<{
      id: number
      label: string
      description: string
      entidad?: number
      ley?: string
      articulo?: string
      fraccion?: string
      inciso?: string
      letra?: string
    }>
  >([])

  // Obtener el tipo de persona seleccionada
  const tipoPersona = form?.watch("personaDenunciada.tipoPersona") || "SERVIDOR_PUBLICO"
  const entidadSeleccionada = form?.watch("personaDenunciada.entidad")
  const entePublicoSeleccionado = form?.watch("personaDenunciada.entePublico")

  // Cargar las faltas desde Directus
  useEffect(() => {
    const fetchFaltas = async () => {
      setLoadingFaltas(true)
      try {
        // Consultar todas las faltas de la colección con los nuevos campos
        const response = await publicDirectus.request(
          readItems("faltas", {
            limit: -1,
            fields: [
              "id",
              "entidad",
              "clasificacion",
              "nombre",
              "descripcion",
              "servidorPublico",
              "particular",
              "ley",
              "articulo",
              "fraccion",
              "inciso",
              "letra",
            ],
          }),
        )

        if (response && Array.isArray(response)) {
          setFaltas(response)
          console.log("Faltas cargadas:", response)
          // Debug: verificar qué campos están llegando
          console.log("Ejemplo de falta con todos los campos:", response[0])
          console.log("Campos disponibles:", Object.keys(response[0] || {}))
        }
      } catch (err) {
        console.error("Error al cargar las faltas:", err)
        setError("No se pudieron cargar las categorías de faltas. Por favor, intente nuevamente.")
      } finally {
        setLoadingFaltas(false)
      }
    }

    fetchFaltas()
  }, [])

  // Filtrar las faltas según el tipo de persona, la entidad y el ente público seleccionado
  useEffect(() => {
    if (faltas.length > 0) {
      // Filtrar por tipo de persona (servidorPublico o particular)
      const esTipoPersonaValido = (falta: Falta) => {
        if (tipoPersona === "SERVIDOR_PUBLICO") return falta.servidorPublico
        if (tipoPersona === "PARTICULAR") return falta.particular
        return false
      }

      // LÓGICA CORREGIDA: Filtrar por entidad y ente público
      const esEntidadValida = (falta: Falta) => {
        // Si hay un ente público seleccionado
        if (entePublicoSeleccionado) {
          // Obtener el tipo de ente público (federal o estatal)
          const entePublicoData = form?.getValues("personaDenunciada.entePublicoData")
          const esFederal = entePublicoData?.entidad === "00"

          if (esFederal) {
            // Si el ente es federal, mostrar solo faltas federales
            return falta.entidad === 0 || falta.entidad === 33
          } else {
            // Si el ente es de entidad, mostrar solo faltas de esa entidad específica
            return falta.entidad === entidadSeleccionada
          }
        }

        // CORRECCIÓN: Si no hay ente público pero sí hay entidad seleccionada
        if (entidadSeleccionada) {
          if (entidadSeleccionada === 33) {
            // Si seleccionó Federal, mostrar solo faltas federales
            return falta.entidad === 0 || falta.entidad === 33
          } else {
            // Si seleccionó una entidad específica, mostrar SOLO faltas de esa entidad
            return falta.entidad === entidadSeleccionada
          }
        }

        // Si no hay entidad seleccionada, no mostrar nada
        return false
      }

      // Aplicar filtros y mapear a formato para checkboxes
      const faltasFiltradas = faltas.filter((falta) => esTipoPersonaValido(falta) && esEntidadValida(falta))

      const mapearFalta = (falta: Falta) => ({
        id: falta.id,
        label: falta.nombre,
        description: falta.descripcion,
        entidad: falta.entidad,
        ley: falta.ley,
        articulo: falta.articulo,
        fraccion: falta.fraccion,
        inciso: falta.inciso,
        letra: falta.letra,
      })

      setFaltasGraves(faltasFiltradas.filter((f) => f.clasificacion === "faltaGrave").map(mapearFalta))
      setFaltasNoGraves(faltasFiltradas.filter((f) => f.clasificacion === "noGrave").map(mapearFalta))
      setHechosCorrupcion(faltasFiltradas.filter((f) => f.clasificacion === "hechoCorrupcion").map(mapearFalta))

      console.log("Faltas filtradas:", {
        graves: faltasGraves.length,
        noGraves: faltasNoGraves.length,
        corrupcion: hechosCorrupcion.length,
      })
    }
  }, [faltas, tipoPersona, entidadSeleccionada, entePublicoSeleccionado, form])

  useEffect(() => {
    // Verificar si el navegador soporta la Web Speech API
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError(
        "Tu navegador no soporta el reconocimiento de voz. Por favor, usa Chrome o Edge en caso de que quieras usar esta función.",
      )
      setIsSpeechSupported(false)
      return
    }

    // Inicializar el reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "es-MX"

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === "not-allowed") {
        setError("Por favor, permite el acceso al micrófono para usar esta función.")
      } else {
        setError("Ocurrió un error con el reconocimiento de voz. Por favor, intenta nuevamente.")
      }
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("")

      form?.setValue("narracionHechos", transcript)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [form])

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        setError("No se pudo iniciar el reconocimiento de voz. Por favor, intenta nuevamente.")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  // Obtener el nombre de la entidad seleccionada
  const getSelectedEntidadName = () => {
    const entidadValue = form?.getValues("personaDenunciada.entidad")
    const entidad = entidadesFederativas.find((e) => e.valor === entidadValue)
    return entidad ? entidad.nombre : "Entidad"
  }

  if (!form) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-2 sm:p-4 lg:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-8 overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-4 sm:p-6 flex items-center justify-center sm:w-20">
            <ClipboardList className="h-10 w-10 text-primary" />
          </div>
          <div className="p-5 sm:p-6 space-y-4 flex-1">
            <div>
              <h4 className="text-lg font-semibold text-primary">Recomendaciones para narrar los hechos</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Siga estas pautas para describir claramente los hechos denunciados:
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
                    Mencione <span className="font-semibold">fechas, horas y lugares</span> específicos donde ocurrieron
                    los hechos
                  </p>
                </div>
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
                    Identifique <span className="font-semibold">nombres completos</span> de las personas involucradas
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Describa los hechos en <span className="font-semibold">orden cronológico</span> y con el mayor
                    detalle posible
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

      {/* Campo de narración de hechos */}
      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">
            Descripción Detallada de los Hechos <span className="text-red-500">*</span>
          </h3>
        </div>
        <FormField
          control={form.control}
          name="narracionHechos"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  {error && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <Textarea
                    {...field}
                    placeholder="Ejemplo: El día 12 de abril de 2023, aproximadamente a las 14:30 horas, en las oficinas ubicadas en Av. Reforma 101, piso 3, observé que el Lic. Juan Pérez Gómez, Director de Adquisiciones, recibió un sobre de parte del representante de la empresa Construcciones XYZ. Al abrir el sobre, pude ver que contenía dinero en efectivo. Posteriormente, el día 15 de abril, se publicó la licitación LIC-2023-001 donde la empresa Construcciones XYZ resultó ganadora sin cumplir con todos los requisitos establecidos en la convocatoria..."
                    className="h-80 resize-none text-sm pr-24 min-h-[120px]"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button
                      type="button"
                      variant={isListening ? "destructive" : "outline"}
                      size="sm"
                      onClick={isListening ? stopListening : startListening}
                      className="flex items-center gap-2 shadow-sm"
                      disabled={!isSpeechSupported}
                      title={!isSpeechSupported ? "El reconocimiento de voz no está disponible en tu navegador" : ""}
                    >
                      {isListening ? (
                        <>
                          <Square className="h-4 w-4" />
                          Detener dictado
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Iniciar dictado
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
                Describa detalladamente los hechos que desea denunciar. Sea lo más específico posible.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sección de clasificación de faltas */}
      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">Clasificación</h3>
        </div>

        <FormDescription className="text-sm text-muted-foreground mb-6">
          Seleccione las conductas que mejor describan los hechos denunciados. Tu elección nos ayudará a canalizar
          adecuadamente tu denuncia. Esta sección es opcional.
        </FormDescription>

        {loadingFaltas ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-sm text-muted-foreground">Cargando categorías de faltas...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Información sobre el ámbito de aplicación */}
            <div className="bg-primary/5 p-4 sm:p-5 rounded-xl border border-primary/10 dark:bg-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h4 className="text-sm sm:text-base font-semibold text-primary">Ámbito de aplicación:</h4>
                <div className="flex items-center flex-wrap gap-2">
                  {entidadSeleccionada === 33 && (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary hover:bg-primary/10 border-primary/20 text-xs"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Federal
                    </Badge>
                  )}
                  {entidadSeleccionada && entidadSeleccionada !== 33 && (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary hover:bg-primary/10 border-primary/20 text-xs"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {getSelectedEntidadName()}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-3">
                {entidadSeleccionada === 33
                  ? "Se muestran faltas aplicables a nivel federal."
                  : entidadSeleccionada
                    ? `Se muestran faltas aplicables para ${getSelectedEntidadName()}.`
                    : "Seleccione una entidad para ver las faltas aplicables."}
              </p>
            </div>

            {/* Faltas Graves */}
            {faltasGraves.length > 0 && (
              <CheckboxGroup
                title="Faltas Administrativas Graves"
                description="Acciones que implican abuso de autoridad, uso indebido de recursos públicos o enriquecimiento ilícito."
                name="faltaCometida.faltaGrave"
                items={faltasGraves}
                form={form}
              />
            )}

            {/* Faltas No Graves */}
            {faltasNoGraves.length > 0 && (
              <CheckboxGroup
                title="Faltas Administrativas No Graves"
                description="Conductas que representan incumplimientos menores a la normatividad sin intención de obtener beneficios indebidos."
                name="faltaCometida.faltaNoGrave"
                items={faltasNoGraves}
                form={form}
              />
            )}

            {/* Hechos de Corrupción */}
            {hechosCorrupcion.length > 0 && (
              <CheckboxGroup
                title="Hechos de Corrupción"
                description="Conductas que implican el abuso del poder para obtener beneficios privados o ventajas indebidas."
                name="faltaCometida.hechosCorrupcion"
                items={hechosCorrupcion}
                form={form}
              />
            )}

            {/* Mensaje cuando no hay faltas disponibles */}
            {faltasGraves.length === 0 && faltasNoGraves.length === 0 && hechosCorrupcion.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 bg-primary/5 rounded-xl border border-primary/10">
                <Filter className="h-12 w-12 mb-4 text-primary/50" />
                <p className="text-lg font-semibold text-primary">No hay faltas disponibles</p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {entidadSeleccionada
                    ? "No se encontraron faltas aplicables para la entidad seleccionada."
                    : "Seleccione una entidad para ver las faltas aplicables."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

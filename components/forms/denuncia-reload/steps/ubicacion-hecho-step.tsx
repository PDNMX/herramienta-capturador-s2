// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { MapPin, Search, Locate, Edit, Hash, Building, Calendar, Globe } from "lucide-react"
import debounce from "lodash/debounce"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import type { UseFormReturn } from "react-hook-form"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface AddressDetails {
  street: string
  number: string
  city: string
  state: string
  country: string
  postalCode: string
}

interface SearchResult {
  place_name: string
  center: [number, number]
  place_type: string[]
  properties: {
    category?: string
  }
}

interface UbicacionHechoStepProps {
  form: UseFormReturn<any>
}

export function UbicacionHechoStep({ form }: UbicacionHechoStepProps) {
  const [coordinates, setCoordinates] = useState(() => {
    // Intentar obtener las coordenadas del formulario
    const lat = form.getValues("ubicacionHecho.latitud")
    const lng = form.getValues("ubicacionHecho.longitud")
    return {
      lat: lat || 19.432608,
      lng: lng || -99.133209
    }
  })
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tempMarker, setTempMarker] = useState<mapboxgl.Marker | null>(null)
  const [manualAddressMode, setManualAddressMode] = useState(false)
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    street: "",
    number: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  })

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&language=es&country=mx`,
      )
      const data = await response.json()
      const features = data.features[0]

      if (features) {
        const context = features.context || []
        const address: AddressDetails = {
          street: features.text || "",
          number: features.address || "",
          city: context.find((c: any) => c.id.includes("place"))?.text || "",
          state: context.find((c: any) => c.id.includes("region"))?.text || "",
          country: context.find((c: any) => c.id.includes("country"))?.text || "",
          postalCode: context.find((c: any) => c.id.includes("postcode"))?.text || "",
        }
        setAddressDetails(address)

        // Actualizar todos los campos del formulario
        form.setValue("ubicacionHecho.calle", address.street, { shouldValidate: false })
        form.setValue("ubicacionHecho.numero", address.number, { shouldValidate: false })
        form.setValue("ubicacionHecho.ciudad", address.city, { shouldValidate: false })
        form.setValue("ubicacionHecho.estado", address.state, { shouldValidate: false })
        form.setValue("ubicacionHecho.pais", address.country, { shouldValidate: false })
        form.setValue("ubicacionHecho.codigoPostal", address.postalCode, { shouldValidate: false })
        // Guardar las coordenadas en el formulario
        form.setValue("ubicacionHecho.latitud", lat, { shouldValidate: false })
        form.setValue("ubicacionHecho.longitud", lng, { shouldValidate: false })
      }
    } catch (error) {
      console.error("Error en geocodificación inversa:", error)
    }
  }

  const getIconForPlaceType = (result: SearchResult) => {
    const type = result.place_type[0]
    const category = result.properties?.category

    if (category === "building") return "🏢"
    switch (type) {
      case "address":
        return "📍"
      case "place":
        return "🏛️"
      case "poi":
        return "🎯"
      case "neighborhood":
        return "🏘️"
      case "postcode":
        return "📮"
      default:
        return "📍"
    }
  }

  const performSearch = async (query: string) => {
    if (!query) {
      setSearchResults([])
      setShowResults(false)
      if (tempMarker) {
        tempMarker.remove()
        setTempMarker(null)
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&country=mx&language=es&types=place,address,poi,neighborhood,postcode`,
      )
      const data = await response.json()
      if (data && data.features) {
        setSearchResults(data.features)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    } catch (error) {
      console.error("Error en búsqueda:", error)
      setSearchResults([])
      setShowResults(false)
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 500),
    [],
  )

  useEffect(() => {
    debouncedSearch(searchQuery)
    return () => debouncedSearch.cancel()
  }, [searchQuery, debouncedSearch])

  // Modificado para evitar validación
  const getCurrentLocation = (e: React.MouseEvent) => {
    // Prevenir comportamiento por defecto
    e.preventDefault()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords
          setCoordinates({ lat, lng })
          if (mapRef.current && markerRef.current) {
            mapRef.current.flyTo({ center: [lng, lat], zoom: 15 })
            markerRef.current.setLngLat([lng, lat])
            reverseGeocode(lat, lng)
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
        },
      )
    }
  }

  // Modificado para evitar validación
  const toggleManualMode = (e: React.MouseEvent) => {
    // Prevenir comportamiento por defecto
    e.preventDefault()
    setManualAddressMode(!manualAddressMode)
  }

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coordinates.lng, coordinates.lat],
        zoom: 3,
        attributionControl: false,
        scrollZoom: false, // Desactivar scroll del mapa
      })
      mapRef.current = map

      const marker = new mapboxgl.Marker({
        color: "#FF0000",
        draggable: false,
      })
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map)
      markerRef.current = marker

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat()
        setCoordinates({ lat: lngLat.lat, lng: lngLat.lng })
        reverseGeocode(lngLat.lat, lngLat.lng)
      })

      map.addControl(new mapboxgl.NavigationControl(), "top-right")

      map.on("moveend", () => {
        const center = map.getCenter()
        const lat = center.lat
        const lng = center.lng
        setCoordinates({ lat, lng })
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat])
        }
        reverseGeocode(lat, lng)
      })

      // Si hay coordenadas guardadas, centrar el mapa en ellas sin animación
      const savedLat = form.getValues("ubicacionHecho.latitud")
      const savedLng = form.getValues("ubicacionHecho.longitud")
      if (savedLat && savedLng) {
        map.jumpTo({
          center: [savedLng, savedLat],
          zoom: 15,
        })
        marker.setLngLat([savedLng, savedLat])
      }

      return () => {
        if (tempMarker) tempMarker.remove()
        if (markerRef.current) markerRef.current.remove()
        map.remove()
      }
    }
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-8 overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-4 sm:p-6 flex items-center justify-center sm:w-20">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          <div className="p-5 sm:p-6 space-y-4 flex-1">
            <div>
              <h4 className="text-lg font-semibold text-primary">Recomendaciones para ubicar el lugar de los hechos</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Siga estas pautas para proporcionar información precisa sobre la ubicación:
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Utilice el <span className="font-semibold">mapa interactivo</span> para ubicar con precisión el
                    lugar
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 rounded-full p-1.5 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Proporcione <span className="font-semibold">referencias adicionales</span> como edificios cercanos
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Indique la <span className="font-semibold">fecha y hora</span> exactas en que ocurrieron los hechos
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
                    Si no conoce la dirección exacta, <span className="font-semibold">active su ubicación</span> o
                    busque un lugar cercano
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">Ubicación del Hecho</h3>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Buscar dirección (calle, número, colonia, ciudad...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-20 text-sm h-12 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                  type="button" // Importante: especificar type="button"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={getCurrentLocation}
                title="Obtener ubicación actual"
                className="h-12 px-4"
                type="button" // Importante: especificar type="button"
              >
                <Locate className="h-4 w-4 mr-2" />
                Mi Ubicación
              </Button>
            </div>

            {showResults && searchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-white shadow-xl rounded-lg mt-1 border border-primary/20 max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-primary/5 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0 transition-colors"
                    onClick={() => {
                      if (mapRef.current) {
                        if (tempMarker) tempMarker.remove()
                        const [lng, lat] = result.center

                        mapRef.current.flyTo({
                          center: [lng, lat],
                          zoom: 15,
                          speed: 1.5,
                        })

                        setCoordinates({ lat, lng })
                        reverseGeocode(lat, lng)
                      }
                      setShowResults(false)
                      setSearchQuery("")
                    }}
                  >
                    <span className="mr-3 text-lg" role="img" aria-label="location type">
                      {getIconForPlaceType(result)}
                    </span>
                    <span className="text-sm">{result.place_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div
              style={{ height: "450px", width: "100%" }}
              ref={mapContainer}
              className="rounded-xl overflow-hidden border-2 border-primary/20 shadow-md"
            />

            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ marginTop: "-20px" }}
            >
              <div className="flex flex-col items-center">
                <MapPin size={45} color="#FF4444" fill="#404040" strokeWidth={1.6} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border-2 border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Edit className="h-5 w-5 mr-3 text-primary" />
                  <h4 className="text-lg font-semibold text-primary">Edición manual de dirección</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {manualAddressMode
                    ? "Modo manual activado: Puedes editar todos los campos de dirección libremente"
                    : "Los campos se llenan automáticamente desde el mapa. Activa el modo manual para editarlos"}
                </p>
              </div>
              <Button
                onClick={toggleManualMode}
                variant={manualAddressMode ? "default" : "outline"}
                size="lg"
                className={cn(
                  "min-w-[140px] h-12 font-semibold transition-all duration-300",
                  manualAddressMode
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                )}
                type="button" // Importante: especificar type="button"
              >
                <Edit className="h-4 w-4 mr-2" />
                {manualAddressMode ? "Desactivar" : "Activar"}
              </Button>
            </div>

            {manualAddressMode && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-sm text-green-700 font-medium">
                    Modo manual activado - Ahora puedes editar todos los campos de dirección
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">Datos de la Dirección</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="ubicacionHecho.calle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Calle</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        {...field}
                        placeholder="Ej. Av. Insurgentes"
                        className={cn(
                          "text-sm h-12 pl-10 bg-background border-input",
                          !manualAddressMode ? "cursor-not-allowed opacity-50" : ""
                        )}
                        readOnly={!manualAddressMode}
                        onChange={(e) => {
                          field.onChange(e)
                          if (manualAddressMode) {
                            setAddressDetails((prev) => ({ ...prev, street: e.target.value }))
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Nombre de la calle donde ocurrieron los hechos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Número Exterior</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        {...field}
                        placeholder="Ej. 123"
                        className={cn(
                          "text-sm h-12 pl-10 bg-background border-input",
                          !manualAddressMode ? "cursor-not-allowed opacity-50" : ""
                        )}
                        readOnly={!manualAddressMode}
                        onChange={(e) => {
                          field.onChange(e)
                          if (manualAddressMode) {
                            setAddressDetails((prev) => ({ ...prev, number: e.target.value }))
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Número exterior del inmueble donde ocurrieron los hechos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="ubicacionHecho.ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Ciudad</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        {...field}
                        placeholder="Ej. Ciudad de México"
                        className={cn(
                          "text-sm h-12 pl-10 bg-background border-input",
                          !manualAddressMode ? "cursor-not-allowed opacity-50" : ""
                        )}
                        readOnly={!manualAddressMode}
                        onChange={(e) => {
                          field.onChange(e)
                          if (manualAddressMode) {
                            setAddressDetails((prev) => ({ ...prev, city: e.target.value }))
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Ciudad donde ocurrieron los hechos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Estado</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        {...field}
                        placeholder="Ej. CDMX"
                        className={cn(
                          "text-sm h-12 pl-10 bg-background border-input",
                          !manualAddressMode ? "cursor-not-allowed opacity-50" : ""
                        )}
                        readOnly={!manualAddressMode}
                        onChange={(e) => {
                          field.onChange(e)
                          if (manualAddressMode) {
                            setAddressDetails((prev) => ({ ...prev, state: e.target.value }))
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Estado o entidad federativa donde ocurrieron los hechos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacionHecho.codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Código Postal</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        {...field}
                        placeholder="Ej. 06700"
                        className={cn(
                          "text-sm h-12 pl-10 bg-background border-input",
                          !manualAddressMode ? "cursor-not-allowed opacity-50" : ""
                        )}
                        readOnly={!manualAddressMode}
                        onChange={(e) => {
                          field.onChange(e)
                          if (manualAddressMode) {
                            setAddressDetails((prev) => ({ ...prev, postalCode: e.target.value }))
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Código postal de la ubicación donde ocurrieron los hechos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ubicacionHecho.pais"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">País</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      {...field}
                      placeholder="Ej. México"
                      className={cn(
                        "text-sm h-12 pl-10 bg-background border-input",
                        !manualAddressMode ? "cursor-not-allowed opacity-50" : ""
                      )}
                      readOnly={!manualAddressMode}
                      onChange={(e) => {
                        field.onChange(e)
                        if (manualAddressMode) {
                          setAddressDetails((prev) => ({ ...prev, country: e.target.value }))
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  País donde ocurrieron los hechos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <Edit className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">Referencias adicionales del lugar</h3>
        </div>

        <FormField
          control={form.control}
          name="ubicacionHecho.otrasReferencias"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Descripción de referencias</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ej. Edificio de color azul, frente al parque, cerca de la estación del metro..."
                  className="text-sm min-h-[120px]"
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Proporciona referencias adicionales que ayuden a identificar el lugar donde ocurrieron los hechos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="rounded-xl border-2 border-primary/20 p-5 sm:p-7 bg-card/95 backdrop-blur shadow-lg">
        <div className="flex items-center mb-6 pb-4 border-b border-primary/20">
          <div className="bg-primary/10 rounded-lg p-2 mr-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary">Fecha y Hora del Hecho Denunciado</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="ubicacionHecho.fechaHecho"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Fecha del Hecho <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="date" className="text-sm h-12" />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Selecciona la fecha en que ocurrieron los hechos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ubicacionHecho.horaHecho"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Hora del Hecho</FormLabel>
                <FormControl>
                  <Input {...field} type="time" className="text-sm h-12" />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Indica la hora aproximada en que ocurrieron los hechos
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

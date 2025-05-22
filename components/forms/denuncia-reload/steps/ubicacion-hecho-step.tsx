//@ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
//import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MapPin, Search, Locate, Edit, Hash, Building, Calendar, Clock } from "lucide-react"
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
  const [coordinates, setCoordinates] = useState({ lat: 19.432608, lng: -99.133209 }) // Coordenadas iniciales (CDMX)
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

        // Actualizar los valores del formulario usando la estructura anidada correcta
        form.setValue("ubicacionHecho.calle", address.street)
        form.setValue("ubicacionHecho.numero", address.number)
        form.setValue("ubicacionHecho.ciudad", address.city)
        form.setValue("ubicacionHecho.estado", address.state)
        form.setValue("ubicacionHecho.pais", address.country)
        form.setValue("ubicacionHecho.codigoPostal", address.postalCode)
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

  const getCurrentLocation = () => {
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

  useEffect(() => {
    if (mapContainer.current) {
      // Inicializar el mapa
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coordinates.lng, coordinates.lat],
        zoom: 3,
        attributionControl: false, // Quitar la atribución (footer)
      })
      mapRef.current = map

      // Inicializar el marcador principal
      const marker = new mapboxgl.Marker({
        color: "#FF0000",
        draggable: true,
      })
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map)
      markerRef.current = marker

      // Actualizar coordenadas cuando se arrastra el marcador
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat()
        setCoordinates({ lat: lngLat.lat, lng: lngLat.lng })
        reverseGeocode(lngLat.lat, lngLat.lng)
      })

      // Añadir controles de navegación (zoom)
      map.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Actualizar coordenadas cuando el mapa se mueve
      map.on("moveend", () => {
        const center = map.getCenter()
        const lat = center.lat
        const lng = center.lng
        setCoordinates({ lat, lng })
        // Actualizar posición del marcador cuando el mapa se mueve
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat])
        }
        reverseGeocode(lat, lng)
      })

      return () => {
        if (tempMarker) tempMarker.remove()
        if (markerRef.current) markerRef.current.remove()
        map.remove()
      }
    }
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 mb-6 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-primary/20 p-3 sm:p-4 flex items-center justify-center sm:w-16">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div className="p-4 sm:p-5 space-y-3 flex-1">
            <div>
              <h4 className="text-base font-medium text-primary">Recomendaciones para ubicar el lugar de los hechos</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Siga estas pautas para proporcionar información precisa sobre la ubicación:
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
                  <p className="text-xs sm:text-sm">
                    Utilice el <span className="font-medium">mapa interactivo</span> para ubicar con precisión el lugar
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Proporcione <span className="font-medium">referencias adicionales</span> como edificios cercanos o
                    puntos de referencia
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Indique la <span className="font-medium">fecha y hora</span> exactas en que ocurrieron los hechos
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
                    Si no conoce la dirección exacta, <span className="font-medium">active su ubicación</span> o busque
                    un lugar cercano
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
        <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
          <MapPin className="h-5 w-5 mr-3 text-primary" />
          Ubicación del Hecho
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Buscar dirección (calle, número, colonia, ciudad...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-20 text-sm h-10 sm:h-12 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
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
                className="h-10 sm:h-12"
              >
                <Locate className="h-4 w-4 mr-2" />
                Mi Ubicación
              </Button>
            </div>

            {showResults && searchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      if (mapRef.current) {
                        if (tempMarker) tempMarker.remove()
                        const [lng, lat] = result.center

                        // Centramos el mapa en la ubicación seleccionada
                        mapRef.current.flyTo({
                          center: [lng, lat],
                          zoom: 15,
                          speed: 1.5,
                        })

                        // Actualizamos las coordenadas
                        setCoordinates({ lat, lng })

                        // Hacemos geocodificación inversa para actualizar la dirección
                        reverseGeocode(lat, lng)
                      }
                      setShowResults(false)
                      setSearchQuery("")
                    }}
                  >
                    <span className="mr-2" role="img" aria-label="location type">
                      {getIconForPlaceType(result)}
                    </span>
                    {result.place_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            {/* Contenedor del mapa */}
            <div
              style={{ height: "400px", width: "100%" }}
              ref={mapContainer}
              className="rounded-lg overflow-hidden border-2 border-primary/20"
            />

            {/* Pin fijo en el centro */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ marginTop: "-20px" }} // Ajuste para centrar correctamente el pin
            >
              <div className="flex flex-col items-center">
                <MapPin size={45} color="#FF4444" fill="#404040" strokeWidth={1.6} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 border-t pt-4 mt-6">
            <div>
              <h3 className="text-base font-medium flex items-center">
                <Edit className="h-4 w-4 mr-2 text-primary" />
                Edición manual de dirección
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Activa esta opción si necesitas editar manualmente los campos de la dirección
              </p>
            </div>
            <Switch checked={manualAddressMode} onCheckedChange={setManualAddressMode} id="manual-address-mode" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
        <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
          <Building className="h-5 w-5 mr-3 text-primary" />
          Datos de la Dirección
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ubicacionHecho.codigoPostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Código Postal</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      {...field}
                      placeholder="Ej. 06700"
                      className={cn(
                        "text-sm h-10 sm:h-12 pl-10",
                        !manualAddressMode ? "cursor-not-allowed bg-gray-100" : "",
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
                <FormDescription className="text-xs sm:text-sm">
                  Ingresa el código postal de la ubicación donde ocurrieron los hechos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ubicacionHecho.calle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Calle</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      {...field}
                      placeholder="Ej. Av. Insurgentes"
                      className={cn(
                        "text-sm h-10 sm:h-12 pl-10",
                        !manualAddressMode ? "cursor-not-allowed bg-gray-100" : "",
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
                <FormDescription className="text-xs sm:text-sm">
                  Escribe el nombre de la calle donde ocurrieron los hechos
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
                <FormLabel className="text-sm font-medium">Número Exterior</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      {...field}
                      placeholder="Ej. 123"
                      className={cn(
                        "text-sm h-10 sm:h-12 pl-10",
                        !manualAddressMode ? "cursor-not-allowed bg-gray-100" : "",
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
                <FormDescription className="text-xs sm:text-sm">
                  Indica el número del inmueble donde ocurrieron los hechos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ubicacionHecho.ciudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Ciudad</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      {...field}
                      placeholder="Ej. Ciudad de México"
                      className={cn(
                        "text-sm h-10 sm:h-12 pl-10",
                        !manualAddressMode ? "cursor-not-allowed bg-gray-100" : "",
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
                <FormDescription className="text-xs sm:text-sm">Ciudad donde ocurrieron los hechos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ubicacionHecho.estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Estado</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      {...field}
                      placeholder="Ej. CDMX"
                      className={cn(
                        "text-sm h-10 sm:h-12 pl-10",
                        !manualAddressMode ? "cursor-not-allowed bg-gray-100" : "",
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
                <FormDescription className="text-xs sm:text-sm">Estado o entidad federativa</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ubicacionHecho.pais"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">País</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      {...field}
                      placeholder="Ej. México"
                      className={cn(
                        "text-sm h-10 sm:h-12 pl-10",
                        !manualAddressMode ? "cursor-not-allowed bg-gray-100" : "",
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
                <FormDescription className="text-xs sm:text-sm">País donde ocurrieron los hechos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Sección de referencias adicionales */}
      <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
        <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
          <Edit className="h-5 w-5 mr-3 text-primary" />
          Referencias adicionales del lugar
        </h3>
        <FormField
          control={form.control}
          name="ubicacionHecho.otrasReferencias"
          render={({ field }) => (
            <FormItem>
              <FormDescription className="text-xs sm:text-sm mb-2">
                Proporciona referencias adicionales que ayuden a identificar el lugar donde ocurrieron los hechos
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ej. Edificio de color azul, frente al parque, cerca de la estación del metro..."
                  className="text-sm min-h-[100px]"
                  onChange={(e) => {
                    field.onChange(e)
                    // Log para verificar la actualización del valor
                    console.log("Valor de otrasReferencias actualizado:", e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sección para fecha y hora de los hechos */}
      <div className="rounded-lg border-2 border-primary/20 p-4 sm:p-6 bg-card/95 backdrop-blur shadow-md">
        <h3 className="text-lg font-semibold flex items-center mb-4 sm:mb-6 text-primary pb-3 border-b border-primary/20">
          <Calendar className="h-5 w-5 mr-3 text-primary" />
          Fecha y Hora del Hecho Denunciado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ubicacionHecho.fechaHecho"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Fecha del Hecho</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input {...field} type="date" className="text-sm h-10 sm:h-12 pl-10" />
                  </div>
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
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
                <FormLabel className="text-sm font-medium">Hora del Hecho</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input {...field} type="time" className="text-sm h-10 sm:h-12 pl-10" />
                  </div>
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
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

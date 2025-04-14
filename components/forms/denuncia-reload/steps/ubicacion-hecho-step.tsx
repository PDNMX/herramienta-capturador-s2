//@ts-nocheck
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
//import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Search, Locate, Edit } from "lucide-react";
import debounce from 'lodash/debounce';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface AddressDetails {
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface SearchResult {
  place_name: string;
  center: [number, number];
  place_type: string[];
  properties: {
    category?: string;
  };
}

export function UbicacionHechoStep({ form }: UbicacionHechoStepProps) {
  const [coordinates, setCoordinates] = useState({ lat: 19.432608, lng: -99.133209 }); // Coordenadas iniciales (CDMX)
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempMarker, setTempMarker] = useState<mapboxgl.Marker | null>(null);
  const [manualAddressMode, setManualAddressMode] = useState(false);
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    street: "",
    number: "",
    city: "",
    state: "",
    country: "",
    postalCode: ""
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&language=es&country=mx`
      );
      const data = await response.json();
      const features = data.features[0];

      if (features) {
        const context = features.context || [];
        const address: AddressDetails = {
          street: features.text || "",
          number: features.address || "",
          city: context.find((c: any) => c.id.includes('place'))?.text || "",
          state: context.find((c: any) => c.id.includes('region'))?.text || "",
          country: context.find((c: any) => c.id.includes('country'))?.text || "",
          postalCode: context.find((c: any) => c.id.includes('postcode'))?.text || ""
        };
        setAddressDetails(address);
        
        // Actualizar los valores del formulario
        form.setValue('calle', address.street);
        form.setValue('numero', address.number);
        form.setValue('ciudad', address.city);
        form.setValue('estado', address.state);
        form.setValue('pais', address.country);
        form.setValue('codigoPostal', address.postalCode);
        form.setValue('direccion', `${address.street} ${address.number}, ${address.city}, ${address.state}, ${address.country}`);
      }
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
    }
  };

  const getIconForPlaceType = (result: SearchResult) => {
    const type = result.place_type[0];
    const category = result.properties?.category;

    if (category === 'building') return '🏢';
    switch (type) {
      case 'address': return '📍';
      case 'place': return '🏛️';
      case 'poi': return '🎯';
      case 'neighborhood': return '🏘️';
      case 'postcode': return '📮';
      default: return '📍';
    }
  };

  const performSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setShowResults(false);
      if (tempMarker) {
        tempMarker.remove();
        setTempMarker(null);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&country=mx&language=es&types=place,address,poi,neighborhood,postcode`
      );
      const data = await response.json();
      if (data && data.features) {
        setSearchResults(data.features);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setCoordinates({ lat, lng });
          if (mapRef.current && markerRef.current) {
            mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
            markerRef.current.setLngLat([lng, lat]);
            reverseGeocode(lat, lng);
          }
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  useEffect(() => {
    if (mapContainer.current) {
      // Inicializar el mapa
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [coordinates.lng, coordinates.lat],
        zoom: 3,
        attributionControl: false // Quitar la atribución (footer)
      });
      mapRef.current = map;

      // Añadir controles de navegación (zoom)
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Actualizar coordenadas cuando el mapa se mueve
      map.on('moveend', () => {
        const center = map.getCenter();
        const lat = center.lat;
        const lng = center.lng;
        setCoordinates({ lat, lng });
        reverseGeocode(lat, lng);
      });

      // Hacer la geocodificación inicial
      //reverseGeocode(coordinates.lat, coordinates.lng);

      return () => {
        if (tempMarker) tempMarker.remove();
        map.remove();
      };
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Buscar dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-20"
            />
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
                    if (tempMarker) tempMarker.remove();
                    const [lng, lat] = result.center;
                    
                    // Centramos el mapa en la ubicación seleccionada
                    mapRef.current.flyTo({
                      center: [lng, lat],
                      zoom: 15,
                      speed: 1.5
                    });
                    
                    // Actualizamos las coordenadas
                    setCoordinates({ lat, lng });
                    
                    // Hacemos geocodificación inversa para actualizar la dirección
                    reverseGeocode(lat, lng);
                  }
                  setShowResults(false);
                  setSearchQuery("");
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
        <div style={{ height: "400px", width: "100%" }} ref={mapContainer} className="rounded-lg overflow-hidden" />
        
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

      <div className="flex items-center justify-end space-x-2 mb-4">
        <span className="text-sm font-medium">Ingresar manualmente la dirección</span>
        <Switch 
          checked={manualAddressMode} 
          onCheckedChange={setManualAddressMode} 
          id="manual-address-mode" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="calle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calle</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly={!manualAddressMode}
                  className={!manualAddressMode ? "cursor-not-allowed bg-gray-100" : ""}
                  onChange={(e) => {
                    field.onChange(e);
                    if (manualAddressMode) {
                      setAddressDetails(prev => ({ ...prev, street: e.target.value }));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly={!manualAddressMode}
                  className={!manualAddressMode ? "cursor-not-allowed bg-gray-100" : ""}
                  onChange={(e) => {
                    field.onChange(e);
                    if (manualAddressMode) {
                      setAddressDetails(prev => ({ ...prev, number: e.target.value }));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ciudad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly={!manualAddressMode}
                  className={!manualAddressMode ? "cursor-not-allowed bg-gray-100" : ""}
                  onChange={(e) => {
                    field.onChange(e);
                    if (manualAddressMode) {
                      setAddressDetails(prev => ({ ...prev, city: e.target.value }));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly={!manualAddressMode}
                  className={!manualAddressMode ? "cursor-not-allowed bg-gray-100" : ""}
                  onChange={(e) => {
                    field.onChange(e);
                    if (manualAddressMode) {
                      setAddressDetails(prev => ({ ...prev, state: e.target.value }));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly={!manualAddressMode}
                  className={!manualAddressMode ? "cursor-not-allowed bg-gray-100" : ""}
                  onChange={(e) => {
                    field.onChange(e);
                    if (manualAddressMode) {
                      setAddressDetails(prev => ({ ...prev, country: e.target.value }));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codigoPostal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código Postal</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly={!manualAddressMode}
                  className={!manualAddressMode ? "cursor-not-allowed bg-gray-100" : ""}
                  onChange={(e) => {
                    field.onChange(e);
                    if (manualAddressMode) {
                      setAddressDetails(prev => ({ ...prev, postalCode: e.target.value }));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};


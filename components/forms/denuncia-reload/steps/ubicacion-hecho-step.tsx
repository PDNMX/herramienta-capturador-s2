//@ts-nocheck
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Locate } from "lucide-react";
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
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&language=es`
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
      setSearchResults(data.features);
      setShowResults(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300),
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
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.lng, coordinates.lat],
      zoom: 12,
    });

    // Crear un elemento personalizado para el marcador principal
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.style.width = '30px';
    markerEl.style.height = '30px';
    markerEl.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
    markerEl.style.backgroundSize = 'cover';
    markerEl.style.cursor = 'pointer';

    const marker = new mapboxgl.Marker({
      element: markerEl,
      draggable: true
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map);

    marker.on("dragend", () => {
      const { lng, lat } = marker.getLngLat();
      setCoordinates({ lat, lng });
      reverseGeocode(lat, lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setCoordinates({ lat, lng });
      marker.setLngLat([lng, lat]);
      reverseGeocode(lat, lng);
    });

    reverseGeocode(coordinates.lat, coordinates.lng);

    return () => {
      if (tempMarker) tempMarker.remove();
      map.remove();
    };
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

        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  if (mapRef.current) {
                    if (tempMarker) tempMarker.remove();
                    const [lng, lat] = result.center;
                    const marker = new mapboxgl.Marker({
                      color: '#FF4444',
                      scale: 0.8
                    })
                      .setLngLat([lng, lat])
                      .addTo(mapRef.current);
                    setTempMarker(marker);
                    mapRef.current.flyTo({
                      center: [lng, lat],
                      zoom: 15,
                      speed: 1.5
                    });
                  }
                  setShowResults(false);
                  setSearchQuery("");
                }}
                /* onClick={() => {
                  const [lng, lat] = result.center;
                  setCoordinates({ lat, lng });
                  if (mapRef.current && markerRef.current) {
                    mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
                    markerRef.current.setLngLat([lng, lat]);
                    reverseGeocode(lat, lng);
                  }
                  if (tempMarker) {
                    tempMarker.remove();
                    setTempMarker(null);
                  }
                  setShowResults(false);
                  setSearchQuery("");
                }} */
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

      <div style={{ height: "400px", width: "100%" }} ref={mapContainer} className="rounded-lg overflow-hidden" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="calle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calle</FormLabel>
              <FormControl>
                <Input {...field} value={addressDetails.street} />
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
                <Input {...field} value={addressDetails.number} />
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
                <Input {...field} value={addressDetails.city} />
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
                <Input {...field} value={addressDetails.state} />
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
                <Input {...field} value={addressDetails.country} />
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
                <Input {...field} value={addressDetails.postalCode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};


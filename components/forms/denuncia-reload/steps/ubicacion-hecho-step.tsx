"use client";

import { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import LogoFederal from "@/components/orden-federal.svg";
import LogoEstatal from "@/components/orden-estatal.svg";

interface UbicacionHechoStepProps {
  form: UseFormReturn<any> | null;
}

interface EntePublico {
  id: number;
  nombre: string;
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

export function UbicacionHechoStep({ form }: UbicacionHechoStepProps) {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"estatal" | "federal" | null>(null);
  const [entesPublicos, setEntesPublicos] = useState<EntePublico[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEnteName, setSelectedEnteName] = useState<string>("");


  useEffect(() => {
    if (selectedOption === "federal") {
      form?.setValue("ubicacionHecho.lugarHecho.entidad", 33); // Valor para federación
      fetchEntesPublicos("00");
    }
  }, [selectedOption, form]);

  const fetchEntesPublicos = async (clave: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://cobertura.plataformadigitalnacional.org/directus/items/entes?filter[entidad][_eq]=${clave}&limit=-1`
      );
      const data = await response.json();
      setEntesPublicos(data.data);
    } catch (error) {
      console.error("Error fetching entes públicos:", error);
    }
    setLoading(false);
  };

  const handleEntidadChange = (value: string) => {
    const entidad = entidadesFederativas.find((e) => e.nombre === value);
    if (entidad) {
      // Asegurarse de que se está estableciendo un número, no una cadena
      form?.setValue("ubicacionHecho.lugarHecho.entidad", entidad.valor, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      // Resetear el ente público al cambiar la entidad
      form?.setValue("ubicacionHecho.lugarHecho.entePublico", undefined, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      // Registrar la acción para debugging
      console.log(`Entidad seleccionada: ${entidad.nombre}, valor: ${entidad.valor}, clave: ${entidad.clave}`);

      // Fetch entes públicos para la entidad seleccionada
      fetchEntesPublicos(entidad.clave);
    }
  };

  const handleEntePublicoChange = (value: string) => {
    const selectedEnte = entesPublicos.find(ente => ente.id.toString() === value);
    if (selectedEnte) {
      // Asegurar que se establece como número, no cadena
      form?.setValue("ubicacionHecho.lugarHecho.entePublico", selectedEnte.id, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      setSelectedEnteName(selectedEnte.nombre);

      // Registrar la acción para debugging
      console.log(`Ente público seleccionado: ${selectedEnte.nombre}, id: ${selectedEnte.id}`);
    }
  };

  if (!form) {
    return <div>Cargando...</div>;
  }

  const renderOptionSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center"
        onClick={() => {
          setSelectedOption("estatal")
          setStep(1)
        }}
      >
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">Estatal</h3>
          <Image
            src={LogoEstatal || "/placeholder.svg"}
            alt="Mapa de México"
            height={200}
            className="rounded-md mx-auto"
            style={{
              filter: "invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
            }}
          />
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center"
        onClick={() => {
          setSelectedOption("federal")
          setStep(1)
          fetchEntesPublicos("00")
        }}
      >
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">Federal</h3>
          <Image
            src={LogoFederal || "/placeholder.svg"}
            alt="Escudo de México"
            height={200}
            className="rounded-md mx-auto"
            style={{
              filter: "invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )

  const renderForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {selectedOption === "estatal" && (
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.entidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Entidad Federativa
                  </FormLabel>
                  <FormDescription>
                    Selecciona la entidad federativa donde ocurrió el hecho o
                    falta administrativa.
                  </FormDescription>
                  <Select
                    onValueChange={handleEntidadChange}
                    value={field.value ? entidadesFederativas.find(e => e.valor === field.value)?.nombre : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una entidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entidadesFederativas.map((entidad) => (
                        <SelectItem key={entidad.clave} value={entidad.nombre}>
                          {entidad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="ubicacionHecho.lugarHecho.entePublico"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">
                  Ente Público
                </FormLabel>
                <FormDescription>
                  {selectedOption === "estatal"
                    ? "Primero selecciona una entidad federativa para ver los entes públicos disponibles. El ente público es la institución donde ocurrió el hecho denunciado."
                    : "Selecciona la institución federal donde ocurrió el hecho denunciado."}
                </FormDescription>
                <div className="w-full">
                  <Combobox
                    options={entesPublicos.map((ente) => ({
                      label: ente.nombre,
                      value: ente.id.toString()
                    }))}
                    value={field.value?.toString() || ""}
                    onChange={handleEntePublicoChange}
                    placeholder="Selecciona un ente público"
                    disabled={
                      selectedOption === "estatal" &&
                      !form.getValues("ubicacionHecho.lugarHecho.entidad")
                    }
                  />
                </div>
                {loading && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cargando entes públicos...</span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Código Postal</FormLabel>
                  <FormDescription>Ingresa el código postal de la ubicación donde ocurrió el hecho.</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. 03100" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.calle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Calle</FormLabel>
                  <FormDescription>
                    Proporciona el nombre de la calle donde se ubica la institución o lugar del hecho.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Av. Insurgentes Sur" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.numeroExterior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Número Exterior</FormLabel>
                  <FormDescription>Indica el número exterior del inmueble donde ocurrió el hecho.</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. 1735" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubicacionHecho.lugarHecho.numeroInterior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Número Interior (opcional)</FormLabel>
                  <FormDescription>
                    Si aplica, proporciona el número interior, piso u oficina donde ocurrió el hecho.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="Ej. Piso 10, Oficina 3" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Fecha y Hora del Hecho Denunciado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ubicacionHecho.lugarHecho.fechaHecho"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Fecha del Hecho</FormLabel>
                <FormDescription>Selecciona la fecha en que ocurrió el hecho o falta administrativa.</FormDescription>
                <FormControl>
                  <Input {...field} type="date" className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ubicacionHecho.lugarHecho.horaHecho"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Hora del Hecho</FormLabel>
                <FormDescription>Indica la hora aproximada en que ocurrió el hecho denunciado.</FormDescription>
                <FormControl>
                  <Input {...field} type="time" className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {step === 0 && renderOptionSelection()}
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {selectedOption === "estatal" ? "Ubicación Estatal" : "Ubicación Federal"}
          </h2>
          {renderForm()}
          <Button
            onClick={() => {
              setStep(0);
            }}
            variant="outline"
            className="mt-4"
          >
            Volver a selección
          </Button>
        </>
      )}
    </div>
  );
}
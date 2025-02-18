"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"

interface UbicacionHechoStepProps {
  form: UseFormReturn<any> | null
}

export function UbicacionHechoStep({ form }: UbicacionHechoStepProps) {
  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 gradient-background p-6 rounded-lg shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Ubicación del Hecho</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ubicacionHecho.lugarHecho.entidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Entidad Federativa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej. Ciudad de México" className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ubicacionHecho.lugarHecho.entePublico"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Ente Público</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej. Secretaría de Educación" className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ubicacionHecho.lugarHecho.codigoPostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Código Postal</FormLabel>
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
                <FormControl>
                  <Input {...field} placeholder="Ej. Piso 10, Oficina 3" className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Fecha y Hora del Hecho</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ubicacionHecho.lugarHecho.fechaHecho"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Fecha del Hecho</FormLabel>
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
  )
}


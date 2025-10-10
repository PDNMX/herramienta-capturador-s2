// @ts-nocheck
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContratacionAdquisicionesSectionProps {
  form: any;
  loading: boolean;
}

export function ContratacionAdquisicionesSection({ form, loading }: ContratacionAdquisicionesSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="contratacionAdquisiciones"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Participación en contrataciones de adquisiciones, arrendamientos y servicios
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione una contratación de adquisiciones" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* TODO: Cargar desde contrataciones_adquisiciones en Directus */}
                <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Datos de la participación en contrataciones públicas de adquisiciones, arrendamientos y servicios
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

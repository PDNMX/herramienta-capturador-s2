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

interface DatosGeneralesSectionProps {
  form: any;
  loading: boolean;
}

export function DatosGeneralesSection({ form, loading }: DatosGeneralesSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="datosGenerales"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Datos generales de la persona servidora pública
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione una persona servidora pública" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* TODO: Cargar desde datos_generales en Directus */}
                <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              En el presente apartado se establecen los datos concernientes a la persona servidora pública que intervenga en procedimientos de contratación pública
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

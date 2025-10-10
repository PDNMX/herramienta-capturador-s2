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

interface EnajenacionBienesSectionProps {
  form: any;
  loading: boolean;
}

export function EnajenacionBienesSection({ form, loading }: EnajenacionBienesSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="enajenacionBien"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Participación en la enajenación de bienes muebles
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione una enajenación de bien" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* TODO: Cargar desde enajenaciones_bienes en Directus */}
                <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Datos de la participación en procedimientos de enajenación de bienes muebles
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

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

interface OtorgamientoConcesionesSectionProps {
  form: any;
  loading: boolean;
}

export function OtorgamientoConcesionesSection({ form, loading }: OtorgamientoConcesionesSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="otorgamientoConcesion"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Participación en el otorgamiento de concesiones
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione un otorgamiento de concesión" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* TODO: Cargar desde otorgamiento_concesiones en Directus */}
                <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Datos de la participación en procedimientos de otorgamiento de concesiones
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

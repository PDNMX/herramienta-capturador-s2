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

interface ObrasPublicasSectionProps {
  form: any;
  loading: boolean;
}

export function ObrasPublicasSection({ form, loading }: ObrasPublicasSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="obrasPublicas"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Participación en obras públicas y servicios relacionados con las mismas
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione una obra pública" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* TODO: Cargar desde obras_publicas en Directus */}
                <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Datos de la participación en contrataciones de obras públicas y servicios relacionados
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

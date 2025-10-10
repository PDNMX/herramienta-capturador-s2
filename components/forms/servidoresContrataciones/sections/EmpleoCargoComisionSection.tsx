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

interface EmpleoCargoComisionSectionProps {
  form: any;
  loading: boolean;
}

export function EmpleoCargoComisionSection({ form, loading }: EmpleoCargoComisionSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="empleoCargoComision"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Datos del empleo, cargo o comisión de la persona servidora pública
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione un empleo, cargo o comisión" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* TODO: Cargar desde empleos_cargos_comisiones en Directus */}
                <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              En el presente apartado se establecen los datos concernientes al empleo, cargo o comisión que ostenta la persona servidora pública al intervenir en actos públicos
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

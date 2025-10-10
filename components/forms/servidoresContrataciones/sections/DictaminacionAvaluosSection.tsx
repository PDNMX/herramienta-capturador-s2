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

interface DictaminacionAvaluosSectionProps {
  form: any;
  loading: boolean;
}

export function DictaminacionAvaluosSection({ form, loading }: DictaminacionAvaluosSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="dictaminacionAvaluos"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Participación en la dictaminación en materia de avalúos y justipreciación de rentas
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione un avalúo o justipreciación" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* TODO: Cargar desde dictaminaciones_avaluos en Directus */}
                <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Datos de la participación en dictaminaciones de avalúos y justipreciación de rentas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

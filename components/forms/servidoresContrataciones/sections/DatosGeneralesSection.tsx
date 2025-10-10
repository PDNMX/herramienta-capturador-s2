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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";

interface DatosGeneralesSectionProps {
  form: any;
  loading: boolean;
}

export function DatosGeneralesSection({ form, loading }: DatosGeneralesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NOMBRE (S)* */}
        <FormField
          control={form.control}
          name="datosGenerales.nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Nombre(s) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    disabled={loading}
                    placeholder="Ingrese el nombre(s)"
                    {...field}
                    value={field.value || ""}
                    className="h-12 pl-10"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Nombre(s) de la persona servidora pública
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PRIMER APELLIDO* */}
        <FormField
          control={form.control}
          name="datosGenerales.primerApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Primer Apellido <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    disabled={loading}
                    placeholder="Ingrese el primer apellido"
                    {...field}
                    value={field.value || ""}
                    className="h-12 pl-10"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Primer apellido de la persona servidora pública
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SEGUNDO APELLIDO */}
        <FormField
          control={form.control}
          name="datosGenerales.segundoApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Segundo Apellido
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    disabled={loading}
                    placeholder="Ingrese el segundo apellido"
                    {...field}
                    value={field.value || ""}
                    className="h-12 pl-10"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Segundo apellido de la persona servidora pública (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CURP* */}
        <FormField
          control={form.control}
          name="datosGenerales.curp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                CURP <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="AAAA000000HAAAAAAA"
                  {...field}
                  value={field.value || ""}
                  className="h-12 uppercase"
                  maxLength={18}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-700">
                🔒 Este campo NO será público (18 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RFC CON HOMOCLAVE* */}
        <FormField
          control={form.control}
          name="datosGenerales.rfc"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                RFC con Homoclave <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="AAAA000000AAA"
                  {...field}
                  value={field.value || ""}
                  className="h-12 uppercase"
                  maxLength={13}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                RFC con homoclave (13 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SEXO* */}
        <FormField
          control={form.control}
          name="datosGenerales.sexo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Sexo <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccione el sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HOMBRE">Hombre</SelectItem>
                  <SelectItem value="MUJER">Mujer</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-muted-foreground">
                Sexo de la persona servidora pública
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

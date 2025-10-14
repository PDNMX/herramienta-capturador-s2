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
import { User, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface DatosGeneralesSectionProps {
  form: any;
  loading: boolean;
}

// Regex para validación de CURP y RFC
const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
const RFC_REGEX = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;

export function DatosGeneralesSection({ form, loading }: DatosGeneralesSectionProps) {
  const [curpValidationState, setCurpValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [rfcValidationState, setRfcValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // Watch CURP field changes
  const curpValue = form.watch("datosGenerales.curp");
  useEffect(() => {
    if (!curpValue || curpValue.length === 0) {
      setCurpValidationState('idle');
    } else if (curpValue.length === 18 && CURP_REGEX.test(curpValue)) {
      setCurpValidationState('valid');
    } else {
      setCurpValidationState('invalid');
    }
  }, [curpValue]);

  // Watch RFC field changes
  const rfcValue = form.watch("datosGenerales.rfc");
  useEffect(() => {
    if (!rfcValue || rfcValue.length === 0) {
      setRfcValidationState('idle');
    } else if (rfcValue.length === 13 && RFC_REGEX.test(rfcValue)) {
      setRfcValidationState('valid');
    } else {
      setRfcValidationState('invalid');
    }
  }, [rfcValue]);

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
                <div className="relative">
                  <Input
                    disabled={loading}
                    placeholder="AAAA000000HAAAAAAA"
                    {...field}
                    value={field.value || ""}
                    className={`h-12 uppercase pr-10 ${
                      curpValidationState === 'valid'
                        ? 'border-green-500 focus-visible:ring-green-500'
                        : curpValidationState === 'invalid'
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                    maxLength={18}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                  {curpValidationState === 'valid' && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {curpValidationState === 'invalid' && (
                    <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
              </FormControl>
              {curpValidationState === 'valid' ? (
                <FormDescription className="text-xs text-muted-foreground bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-700">
                  ✓ Formato de CURP válido. 🔒 Este campo NO será público
                </FormDescription>
              ) : curpValidationState === 'invalid' ? (
                <FormDescription className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-700">
                  ✗ Formato de CURP inválido (debe tener 18 caracteres)
                </FormDescription>
              ) : (
                <FormDescription className="text-xs text-muted-foreground">
                  🔒 Este campo NO será público (18 caracteres)
                </FormDescription>
              )}
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
                <div className="relative">
                  <Input
                    disabled={loading}
                    placeholder="AAAA000000AAA"
                    {...field}
                    value={field.value || ""}
                    className={`h-12 uppercase pr-10 ${
                      rfcValidationState === 'valid'
                        ? 'border-green-500 focus-visible:ring-green-500'
                        : rfcValidationState === 'invalid'
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                    maxLength={13}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                  {rfcValidationState === 'valid' && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {rfcValidationState === 'invalid' && (
                    <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
              </FormControl>
              {rfcValidationState === 'valid' ? (
                <FormDescription className="text-xs text-muted-foreground bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-700">
                  ✓ Formato de RFC válido
                </FormDescription>
              ) : rfcValidationState === 'invalid' ? (
                <FormDescription className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-700">
                  ✗ Formato de RFC inválido (debe tener 13 caracteres)
                </FormDescription>
              ) : (
                <FormDescription className="text-xs text-muted-foreground">
                  RFC con homoclave (13 caracteres)
                </FormDescription>
              )}
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

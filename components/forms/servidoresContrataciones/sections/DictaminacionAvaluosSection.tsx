// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DictaminacionAvaluosSectionProps {
  form: any;
  loading: boolean;
}

// Niveles de Responsabilidad según PDF páginas 8-9
const responsabilidades = [
  {
    id: 1,
    pregunta: "Elaboración del avalúo",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: true }, // N/A - siempre deshabilitado
    }
  },
  {
    id: 2,
    pregunta: "Validación del avalúo",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: true }, // N/A - siempre deshabilitado
    }
  },
  {
    id: 3,
    pregunta: "Dictaminación del avalúo",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: true }, // N/A - siempre deshabilitado
    }
  },
  {
    id: 4,
    pregunta: "Otro (Especifique)",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: false },
    }
  },
];

export function DictaminacionAvaluosSection({ form, loading }: DictaminacionAvaluosSectionProps) {
  const { toast } = useToast();

  // Watch para detectar cambios en las fechas
  const watchFechaElaboracion = form.watch("dictaminacionAvaluos.0.fechaInicio");
  const watchFechaVigencia = form.watch("dictaminacionAvaluos.0.fechaConclusion");

  // Efecto para validar fechas
  useEffect(() => {
    if (watchFechaElaboracion && watchFechaVigencia) {
      const fechaElaboracion = new Date(watchFechaElaboracion);
      const fechaVigencia = new Date(watchFechaVigencia);

      if (fechaVigencia < fechaElaboracion) {
        form.setError("dictaminacionAvaluos.0.fechaConclusion", {
          type: "manual",
          message: "La fecha de vigencia no puede ser menor a la fecha de elaboración.",
        });

        toast({
          variant: "destructive",
          title: "Error en fechas",
          description: "La fecha de vigencia no puede ser menor a la fecha de elaboración.",
        });
      } else {
        form.clearErrors("dictaminacionAvaluos.0.fechaConclusion");
      }
    }
  }, [watchFechaElaboracion, watchFechaVigencia, form, toast]);

  return (
    <div className="space-y-8">
      {/* NIVELES DE RESPONSABILIDAD */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Niveles de Responsabilidad
        </h4>
        <p className="text-sm text-muted-foreground mb-6">
          Marque las actividades que realiza en cada uno de los siguientes objetos de responsabilidad:
        </p>

        <div className="space-y-4">
          {responsabilidades.map((resp) => (
            <div key={resp.id} className="p-4 rounded-lg border-2 border-primary/20 bg-card/50">
              <div className="mb-3">
                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-semibold mr-2">
                  {resp.id}
                </span>
                <span className="text-sm font-medium">{resp.pregunta}</span>
              </div>

              {/* Para la pregunta 4 (Otro), solo mostrar el campo de input */}
              {resp.id === 4 ? (
                <div className="ml-8">
                  <FormField
                    control={form.control}
                    name={`dictaminacionAvaluos.0.responsabilidades.${resp.id - 1}.objetoResponsabilidad`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Especifique el objeto de responsabilidad
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Ingrese el objeto de responsabilidad"
                            {...field}
                            value={field.value || ""}
                            className="h-10"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Describa el objeto de responsabilidad específico (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 ml-8">
                {/* Elaborar (A) */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`resp-avaluo-${resp.id}-elaborar`}
                    disabled={loading || resp.opciones.elaborar.disabled}
                    className={resp.opciones.elaborar.disabled ? "opacity-50" : ""}
                  />
                  <Label
                    htmlFor={`resp-avaluo-${resp.id}-elaborar`}
                    className={`text-sm font-normal ${resp.opciones.elaborar.disabled ? "text-muted-foreground line-through" : "cursor-pointer"}`}
                  >
                    Elaborar (A)
                    {resp.opciones.elaborar.disabled && <span className="ml-1 text-xs">(N/A)</span>}
                  </Label>
                </div>

                {/* Revisar (B) */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`resp-avaluo-${resp.id}-revisar`}
                    disabled={loading || resp.opciones.revisar.disabled}
                    className={resp.opciones.revisar.disabled ? "opacity-50" : ""}
                  />
                  <Label
                    htmlFor={`resp-avaluo-${resp.id}-revisar`}
                    className={`text-sm font-normal ${resp.opciones.revisar.disabled ? "text-muted-foreground line-through" : "cursor-pointer"}`}
                  >
                    Revisar (B)
                    {resp.opciones.revisar.disabled && <span className="ml-1 text-xs">(N/A)</span>}
                  </Label>
                </div>

                {/* Firmar, Autorizar o Dictaminar (C) */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`resp-avaluo-${resp.id}-firmar`}
                    disabled={loading || resp.opciones.firmarAutorizar.disabled}
                    className={resp.opciones.firmarAutorizar.disabled ? "opacity-50" : ""}
                  />
                  <Label
                    htmlFor={`resp-avaluo-${resp.id}-firmar`}
                    className={`text-sm font-normal ${resp.opciones.firmarAutorizar.disabled ? "text-muted-foreground line-through" : "cursor-pointer"}`}
                  >
                    Firmar, Autorizar o Dictaminar (C)
                    {resp.opciones.firmarAutorizar.disabled && <span className="ml-1 text-xs">(N/A)</span>}
                  </Label>
                </div>

                {/* Supervisar (D) */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`resp-avaluo-${resp.id}-supervisar`}
                    disabled={loading || resp.opciones.supervisar.disabled}
                    className={resp.opciones.supervisar.disabled ? "opacity-50" : ""}
                  />
                  <Label
                    htmlFor={`resp-avaluo-${resp.id}-supervisar`}
                    className={`text-sm font-normal ${resp.opciones.supervisar.disabled ? "text-muted-foreground line-through" : "cursor-pointer"}`}
                  >
                    Supervisar (D)
                    {resp.opciones.supervisar.disabled && <span className="ml-1 text-xs">(N/A)</span>}
                  </Label>
                </div>

                {/* Emitir o Suscribir (E) */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`resp-avaluo-${resp.id}-emitir`}
                    disabled={loading || resp.opciones.emitirSuscribir.disabled}
                    className={resp.opciones.emitirSuscribir.disabled ? "opacity-50" : ""}
                  />
                  <Label
                    htmlFor={`resp-avaluo-${resp.id}-emitir`}
                    className={`text-sm font-normal ${resp.opciones.emitirSuscribir.disabled ? "text-muted-foreground line-through" : "cursor-pointer"}`}
                  >
                    Emitir o Suscribir (E)
                    {resp.opciones.emitirSuscribir.disabled && <span className="ml-1 text-xs">(N/A)</span>}
                  </Label>
                </div>
              </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DATOS GENERALES DE LOS PROCEDIMIENTOS */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Datos Generales de los Procedimientos
        </h4>
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-6">
          Esta sección se podrá actualizar quincenalmente agregando un nuevo procedimiento
        </p>

        <div className="space-y-6 p-6 rounded-lg border-2 border-primary/20 bg-card/50">
          {/* Número de Expediente */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.numeroExpediente"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Número de Expediente <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: EXP-AVAL-2024-001"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Número de expediente del avalúo o justipreciación
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Descripción <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ingrese la descripción del procedimiento de dictaminación"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Descripción detallada del procedimiento de dictaminación de avalúos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de Inicio (Fecha de Elaboración) */}
            <FormField
              control={form.control}
              name="dictaminacionAvaluos.0.fechaInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Fecha de Elaboración (DD-MM-AAAA) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        type="date"
                        disabled={loading}
                        {...field}
                        value={field.value || ""}
                        className="h-12 pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha de Conclusión (Fecha de Vigencia) */}
            <FormField
              control={form.control}
              name="dictaminacionAvaluos.0.fechaConclusion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Fecha de Vigencia (DD-MM-AAAA)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        type="date"
                        disabled={loading}
                        {...field}
                        value={field.value || ""}
                        className="h-12 pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Fecha hasta la cual es válido el avalúo (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ¿Continúa Participando? */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.continuaParticipando"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  ¿La persona servidora pública continúa participando en la dictaminación en materia de avalúos y justipreciación de rentas? <span className="text-red-500">*</span>
                </FormLabel>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                  (Esta sección se podrá actualizar quincenalmente)
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="continua-avaluo-si"
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked ? true : false)}
                      disabled={loading}
                    />
                    <Label htmlFor="continua-avaluo-si" className="text-sm font-normal cursor-pointer">
                      Sí
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="continua-avaluo-no"
                      checked={field.value === false}
                      onCheckedChange={(checked) => field.onChange(checked ? false : true)}
                      disabled={loading}
                    />
                    <Label htmlFor="continua-avaluo-no" className="text-sm font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

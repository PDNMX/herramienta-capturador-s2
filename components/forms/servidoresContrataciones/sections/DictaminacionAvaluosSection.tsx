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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, FileText } from "lucide-react";

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
      firmarAutorizar: { disabled: true }, // N/A
      supervisar: { disabled: true }, // N/A
      emitirSuscribir: { disabled: false },
    }
  },
  {
    id: 2,
    pregunta: "Validación del avalúo",
    opciones: {
      elaborar: { disabled: true }, // N/A
      revisar: { disabled: false },
      firmarAutorizar: { disabled: true }, // N/A
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: false },
    }
  },
  {
    id: 3,
    pregunta: "Dictaminación del avalúo",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: true }, // N/A
      emitirSuscribir: { disabled: true }, // N/A
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

          {/* Tipo de Avalúo */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.tipoAvaluo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Tipo de Avalúo <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="COMERCIAL">Comercial</SelectItem>
                    <SelectItem value="FISCAL">Fiscal</SelectItem>
                    <SelectItem value="CATASTRAL">Catastral</SelectItem>
                    <SelectItem value="JUSTIPRECIACION_RENTAS">Justipreciación de Rentas</SelectItem>
                    <SelectItem value="OTRO">Otro (Especifique)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Objeto del Avalúo */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.objetoAvaluo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Objeto del Avalúo <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Descripción del bien o inmueble a valuar"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Motivos y Fundamentos Legales */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.motivosFundamentosLegales"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Motivos y Fundamentos Legales <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Fundamentos legales aplicables"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Artículos y leyes que fundamentan el avalúo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de Elaboración */}
            <FormField
              control={form.control}
              name="dictaminacionAvaluos.0.fechaElaboracion"
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

            {/* Fecha de Vigencia */}
            <FormField
              control={form.control}
              name="dictaminacionAvaluos.0.fechaVigencia"
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

          {/* Valor del Avalúo */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.valorAvaluo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Valor del Avalúo <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={loading}
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Valor determinado en pesos mexicanos (MXN)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombre del Perito */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.nombrePerito"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Nombre del Perito Valuador
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Nombre completo del perito"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Nombre del perito que elaboró el avalúo (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hipervínculo */}
          <FormField
            control={form.control}
            name="dictaminacionAvaluos.0.hipervinculo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Hipervínculo
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    disabled={loading}
                    placeholder="https://ejemplo.gob.mx/documento"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  URL del documento del avalúo (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

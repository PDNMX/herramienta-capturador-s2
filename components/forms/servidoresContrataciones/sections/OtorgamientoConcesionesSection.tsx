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

interface OtorgamientoConcesionesSectionProps {
  form: any;
  loading: boolean;
}

// Tipos de Acto Jurídico según PDF página 5
const tiposActoJuridico = [
  { value: "CONCESIONES", label: "Concesiones" },
  { value: "LICENCIAS", label: "Licencias" },
  { value: "PERMISOS", label: "Permisos" },
  { value: "AUTORIZACIONES", label: "Autorizaciones" },
];

// Niveles de Responsabilidad según PDF página 6
const responsabilidades = [
  {
    id: 1,
    pregunta:
      "Convocatoria a concurso, licitación o excitativa a presentar la solicitud de autorización.",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: true }, // N/A
    },
  },
  {
    id: 2,
    pregunta: "Dictámenes u opiniones previos.",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: true }, // N/A
    },
  },
  {
    id: 3,
    pregunta: "Visitas de verificación.",
    opciones: {
      elaborar: { disabled: true }, // N/A
      revisar: { disabled: true }, // N/A
      firmarAutorizar: { disabled: true }, // N/A
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: false },
    },
  },
  {
    id: 4,
    pregunta:
      "Evaluación del cumplimiento de los requisitos para el otorgamiento de la concesión, licencia, autorización, permiso, o sus prórrogas.",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: true }, // N/A
    },
  },
  {
    id: 5,
    pregunta:
      "Determinación sobre el otorgamiento de la concesión, licencia, autorización, permiso o sus prórrogas.",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: true }, // N/A
      supervisar: { disabled: true }, // N/A
      emitirSuscribir: { disabled: false },
    },
  },
  {
    id: 6,
    pregunta: "Otro (Especifique)",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: false },
    },
  },
];

export function OtorgamientoConcesionesSection({
  form,
  loading,
}: OtorgamientoConcesionesSectionProps) {
  const { toast } = useToast();

  // Watch para detectar cambios en las fechas de vigencia
  const watchFechaInicioVigencia = form.watch(
    "otorgamientoConcesiones.0.fechaInicioVigencia"
  );
  const watchFechaConclusionVigencia = form.watch(
    "otorgamientoConcesiones.0.fechaConclusionVigencia"
  );

  // Efecto para validar fechas de vigencia
  useEffect(() => {
    if (watchFechaInicioVigencia && watchFechaConclusionVigencia) {
      const fechaInicio = new Date(watchFechaInicioVigencia);
      const fechaConclusion = new Date(watchFechaConclusionVigencia);

      if (fechaConclusion < fechaInicio) {
        form.setError("otorgamientoConcesiones.0.fechaConclusionVigencia", {
          type: "manual",
          message:
            "La fecha de término de vigencia no puede ser menor a la fecha de inicio de vigencia.",
        });

        toast({
          variant: "destructive",
          title: "Error en fechas",
          description:
            "La fecha de término de vigencia no puede ser menor a la fecha de inicio de vigencia.",
        });
      } else {
        form.clearErrors("otorgamientoConcesiones.0.fechaConclusionVigencia");
      }
    }
  }, [watchFechaInicioVigencia, watchFechaConclusionVigencia, form, toast]);

  return (
    <div className="space-y-8">
      {/* TIPO DE ACTO JURÍDICO */}
      <div className="p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <h4 className="text-sm font-semibold mb-4 text-purple-900 dark:text-purple-100">
          Tipo de Acto Jurídico{" "}
          <span className="text-xs text-muted-foreground">
            (Esta sección se actualizará quincenalmente)
          </span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiposActoJuridico.map((tipo) => (
            <div key={tipo.value} className="flex items-start space-x-2">
              <Checkbox
                id={`tipo-acto-${tipo.value}`}
                disabled={loading}
                className="mt-1"
              />
              <Label
                htmlFor={`tipo-acto-${tipo.value}`}
                className="text-sm font-normal cursor-pointer leading-tight"
              >
                {tipo.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* NIVELES DE RESPONSABILIDAD */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Niveles de Responsabilidad
        </h4>
        <p className="text-sm text-muted-foreground mb-6">
          Marque las actividades que realiza en cada uno de los siguientes
          objetos de responsabilidad:
        </p>

        <div className="space-y-4">
          {responsabilidades.map((resp) => (
            <div
              key={resp.id}
              className="p-4 rounded-lg border-2 border-primary/20 bg-card/50"
            >
              <div className="mb-3">
                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-semibold mr-2">
                  {resp.id}
                </span>
                <span className="text-sm font-medium">{resp.pregunta}</span>
              </div>

              {/* Para la pregunta 6, solo mostrar el campo de input */}
              {resp.id === 6 ? (
                <div className="ml-8">
                  <FormField
                    control={form.control}
                    name={`otorgamientoConcesiones.0.responsabilidades.${
                      resp.id - 1
                    }.objetoResponsabilidad`}
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
                          Describa el objeto de responsabilidad específico
                          (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 ml-8">
                  {/* Elaborar (A) */}
                  <FormField
                    control={form.control}
                    name={`otorgamientoConcesiones.0.responsabilidades.${resp.id - 1}.elaborar`}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`resp-concesion-${resp.id}-elaborar`}
                          disabled={loading || resp.opciones.elaborar.disabled}
                          className={
                            resp.opciones.elaborar.disabled ? "opacity-50" : ""
                          }
                          checked={field.value === true}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor={`resp-concesion-${resp.id}-elaborar`}
                          className={`text-sm font-normal ${
                            resp.opciones.elaborar.disabled
                              ? "text-muted-foreground line-through"
                              : "cursor-pointer"
                          }`}
                        >
                          Elaborar (A)
                          {resp.opciones.elaborar.disabled && (
                            <span className="ml-1 text-xs">(N/A)</span>
                          )}
                        </Label>
                      </div>
                    )}
                  />

                  {/* Revisar (B) */}
                  <FormField
                    control={form.control}
                    name={`otorgamientoConcesiones.0.responsabilidades.${resp.id - 1}.revisar`}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`resp-concesion-${resp.id}-revisar`}
                          disabled={loading || resp.opciones.revisar.disabled}
                          className={
                            resp.opciones.revisar.disabled ? "opacity-50" : ""
                          }
                          checked={field.value === true}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor={`resp-concesion-${resp.id}-revisar`}
                          className={`text-sm font-normal ${
                            resp.opciones.revisar.disabled
                              ? "text-muted-foreground line-through"
                              : "cursor-pointer"
                          }`}
                        >
                          Revisar (B)
                          {resp.opciones.revisar.disabled && (
                            <span className="ml-1 text-xs">(N/A)</span>
                          )}
                        </Label>
                      </div>
                    )}
                  />

                  {/* Firmar, Autorizar o Dictaminar (C) */}
                  <FormField
                    control={form.control}
                    name={`otorgamientoConcesiones.0.responsabilidades.${resp.id - 1}.firmarAutorizar`}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`resp-concesion-${resp.id}-firmar`}
                          disabled={
                            loading || resp.opciones.firmarAutorizar.disabled
                          }
                          className={
                            resp.opciones.firmarAutorizar.disabled
                              ? "opacity-50"
                              : ""
                          }
                          checked={field.value === true}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor={`resp-concesion-${resp.id}-firmar`}
                          className={`text-sm font-normal ${
                            resp.opciones.firmarAutorizar.disabled
                              ? "text-muted-foreground line-through"
                              : "cursor-pointer"
                          }`}
                        >
                          Firmar, Autorizar o Dictaminar (C)
                          {resp.opciones.firmarAutorizar.disabled && (
                            <span className="ml-1 text-xs">(N/A)</span>
                          )}
                        </Label>
                      </div>
                    )}
                  />

                  {/* Supervisar (D) */}
                  <FormField
                    control={form.control}
                    name={`otorgamientoConcesiones.0.responsabilidades.${resp.id - 1}.supervisar`}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`resp-concesion-${resp.id}-supervisar`}
                          disabled={loading || resp.opciones.supervisar.disabled}
                          className={
                            resp.opciones.supervisar.disabled ? "opacity-50" : ""
                          }
                          checked={field.value === true}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor={`resp-concesion-${resp.id}-supervisar`}
                          className={`text-sm font-normal ${
                            resp.opciones.supervisar.disabled
                              ? "text-muted-foreground line-through"
                              : "cursor-pointer"
                          }`}
                        >
                          Supervisar (D)
                          {resp.opciones.supervisar.disabled && (
                            <span className="ml-1 text-xs">(N/A)</span>
                          )}
                        </Label>
                      </div>
                    )}
                  />

                  {/* Emitir o Suscribir (E) */}
                  <FormField
                    control={form.control}
                    name={`otorgamientoConcesiones.0.responsabilidades.${resp.id - 1}.emitirSuscribir`}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`resp-concesion-${resp.id}-emitir`}
                          disabled={
                            loading || resp.opciones.emitirSuscribir.disabled
                          }
                          className={
                            resp.opciones.emitirSuscribir.disabled
                              ? "opacity-50"
                              : ""
                          }
                          checked={field.value === true}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor={`resp-concesion-${resp.id}-emitir`}
                          className={`text-sm font-normal ${
                            resp.opciones.emitirSuscribir.disabled
                              ? "text-muted-foreground line-through"
                              : "cursor-pointer"
                          }`}
                        >
                          Emitir o Suscribir (E)
                          {resp.opciones.emitirSuscribir.disabled && (
                            <span className="ml-1 text-xs">(N/A)</span>
                          )}
                        </Label>
                      </div>
                    )}
                  />
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
          Datos generales de los procedimientos de concesiones, licencias,
          permisos, autorizaciones y sus prórrogas
        </h4>
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-6">
          Esta sección se podrá actualizar quincenalmente agregando un nuevo
          procedimiento
        </p>

        <div className="space-y-6 p-6 rounded-lg border-2 border-primary/20 bg-card/50">
          {/* Número de Expediente */}
          <FormField
            control={form.control}
            name="otorgamientoConcesiones.0.numeroExpediente"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Número de Expediente <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: EXP-CONC-2024-001"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Número de expediente del procedimiento de otorgamiento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Denominación */}
          <FormField
            control={form.control}
            name="otorgamientoConcesiones.0.denominacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Denominación <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Denominación de la concesión, licencia, permiso o autorización"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Objeto */}
          <FormField
            control={form.control}
            name="otorgamientoConcesiones.0.objeto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Objeto <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Objeto de la concesión, licencia, permiso o autorización"
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
            name="otorgamientoConcesiones.0.motivosFundamentosLegales"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Motivos o fundamentos legales aplicados para realizar el
                  procedimiento <span className="text-red-500">*</span>
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
                  Artículos y leyes que fundamentan el otorgamiento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre Persona Física */}
            <FormField
              control={form.control}
              name="otorgamientoConcesiones.0.nombrePersonaFisica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Nombre de la persona física que solicita o se le otorga el
                    acto jurídico
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nombre completo de la persona física"
                      {...field}
                      value={field.value || ""}
                      className="h-12"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Solo si aplica persona física
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Razón Social Persona Moral */}
            <FormField
              control={form.control}
              name="otorgamientoConcesiones.0.razonSocialPersonaMoral"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Denominación o razón social de la persona moral que solicita
                    o se le otorga el acto jurídico
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Razón social de la empresa"
                      {...field}
                      value={field.value || ""}
                      className="h-12"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Solo si aplica persona moral
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* Sector */}
          <FormField
            control={form.control}
            name="otorgamientoConcesiones.0.sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Sector al cual se otorgó el acto jurídico{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleccione el sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PUBLICO">Público</SelectItem>
                    <SelectItem value="PRIVADO">Privado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de Inicio de Vigencia */}
            <FormField
              control={form.control}
              name="otorgamientoConcesiones.0.fechaInicioVigencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Fecha de Inicio de Vigencia (DD-MM-AAAA){" "}
                    <span className="text-red-500">*</span>
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

            {/* Fecha de Término de Vigencia */}
            <FormField
              control={form.control}
              name="otorgamientoConcesiones.0.fechaTerminoVigencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Fecha de Término de Vigencia (DD-MM-AAAA){" "}
                    <span className="text-red-500">*</span>
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
          </div>

          {/* Monto */}
          <FormField
            control={form.control}
            name="otorgamientoConcesiones.0.monto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Monto <span className="text-red-500">*</span>
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
                  Monto en pesos mexicanos (MXN)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hipervínculo */}
          <FormField
            control={form.control}
            name="otorgamientoConcesiones.0.hipervinculo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Hipervínculo de la información del acto jurídico
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
                  URL del documento o información relacionada (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Datos de la Persona Beneficiaria */}
          <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
            <h5 className="text-sm font-semibold mb-4 text-purple-900 dark:text-purple-100">
              Datos de la(s) Persona(s) Beneficiaria(s) Final(es)
              <span className="text-xs font-normal text-muted-foreground ml-2">
                (Solo aplica a personas morales)
              </span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="otorgamientoConcesiones.0.razonSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Razón Social</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Razón social de la empresa"
                        {...field}
                        value={field.value || ""}
                        className="h-10"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otorgamientoConcesiones.0.nombreBeneficiario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Nombre(s)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nombre del beneficiario"
                        {...field}
                        value={field.value || ""}
                        className="h-10"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otorgamientoConcesiones.0.primerApellidoBeneficiario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Primer Apellido</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Primer apellido"
                        {...field}
                        value={field.value || ""}
                        className="h-10"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otorgamientoConcesiones.0.segundoApellidoBeneficiario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Segundo Apellido</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Segundo apellido"
                        {...field}
                        value={field.value || ""}
                        className="h-10"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ¿Continúa Participando? */}
          <FormField
            control={form.control}
            name="otorgamientoConcesiones.0.continuaParticipando"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  ¿La persona servidora pública continúa participando en los
                  procedimientos de concesiones, licencias, permisos,
                  autorizaciones y sus prórrogas?{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                  (Esta sección se podrá actualizar quincenalmente)
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="continua-concesion-si"
                      checked={field.value === true}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? true : false)
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor="continua-concesion-si"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Sí
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="continua-concesion-no"
                      checked={field.value === false}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? false : true)
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor="continua-concesion-no"
                      className="text-sm font-normal cursor-pointer"
                    >
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

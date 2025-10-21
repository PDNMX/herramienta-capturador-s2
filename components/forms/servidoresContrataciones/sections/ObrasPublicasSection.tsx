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

interface ObrasPublicasSectionProps {
  form: any;
  loading: boolean;
}

// Tipos de Área según PDF página 4
const tiposArea = [
  {
    value: "AREA_RESPONSABLE_EJECUCION",
    label: "Área Responsable de la Ejecución de los Trabajos",
  },
  {
    value: "AREA_RESPONSABLE_CONTRATACION",
    label: "Área Responsable de la Contratación",
  },
  { value: "AREA_TECNICA", label: "Área Técnica" },
  { value: "AREA_REQUIRENTE", label: "Área Requirente" },
  {
    value: "INTEGRANTE_COMITE",
    label: "Integrante del comité de adquisiciones, arrendamientos y servicios",
  },
  { value: "ORGANO_REVISION", label: "Órgano de Revisión" },
  {
    value: "PARTICIPANTE_JUNTA",
    label: "Participante en Junta de Aclaraciones",
  },
  { value: "OTRO", label: "Otro (Especifique)" },
];

// Niveles de Responsabilidad según PDF página 4
const responsabilidades = [
  {
    id: 1,
    pregunta:
      "Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de contratación",
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
    pregunta: "Justificación para excepción a la licitación pública",
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
    pregunta:
      "Convocatoria, invitación o solicitud de cotización y, en su caso, bases del concurso y modificaciones",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: false },
      supervisar: { disabled: false },
      emitirSuscribir: { disabled: true }, // N/A
    },
  },
  {
    id: 4,
    pregunta: "Evaluación de proposiciones",
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
    pregunta: "Adjudicación del contrato",
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
    pregunta: "Formalización del contrato",
    opciones: {
      elaborar: { disabled: false },
      revisar: { disabled: false },
      firmarAutorizar: { disabled: true }, // N/A
      supervisar: { disabled: true }, // N/A
      emitirSuscribir: { disabled: false },
    },
  },
  {
    id: 7,
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

export function ObrasPublicasSection({
  form,
  loading,
}: ObrasPublicasSectionProps) {
  const { toast } = useToast();

  // Estado para manejar la visibilidad de campos condicionales
  const [mostrarTipoAreaOtro, setMostrarTipoAreaOtro] = useState(false);
  const [mostrarTipoProcedimientoOtro, setMostrarTipoProcedimientoOtro] =
    useState(false);
  const [mostrarMateriaOtro, setMostrarMateriaOtro] = useState(false);

  // Watch para detectar cambios en los selects y checkboxes
  const watchTipoArea = form.watch("obrasPublicas.0.tipoArea");
  const watchTipoProcedimiento = form.watch(
    "obrasPublicas.0.tipoProcedimiento"
  );
  const watchMateria = form.watch("obrasPublicas.0.materia");
  const watchFechaInicio = form.watch("obrasPublicas.0.fechaInicio");
  const watchFechaConclusion = form.watch("obrasPublicas.0.fechaConclusion");

  // Efecto para mostrar/ocultar campo "Otro" en Tipo de Área
  useEffect(() => {
    const tieneOtro = watchTipoArea?.includes("OTRO");
    setMostrarTipoAreaOtro(tieneOtro);
    if (!tieneOtro) {
      form.setValue("obrasPublicas.0.tipoAreaOtro", "");
    }
  }, [watchTipoArea, form]);

  // Efecto para mostrar/ocultar campo "Otro" en Tipo de Procedimiento
  useEffect(() => {
    setMostrarTipoProcedimientoOtro(watchTipoProcedimiento === "OTRO");
    if (watchTipoProcedimiento !== "OTRO") {
      form.setValue("obrasPublicas.0.tipoProcedimientoOtro", "");
    }
  }, [watchTipoProcedimiento, form]);

  // Efecto para mostrar/ocultar campo "Otro" en Materia
  useEffect(() => {
    setMostrarMateriaOtro(watchMateria === "OTRO");
    if (watchMateria !== "OTRO") {
      form.setValue("obrasPublicas.0.materiaOtro", "");
    }
  }, [watchMateria, form]);

  // Efecto para validar fechas
  useEffect(() => {
    if (watchFechaInicio && watchFechaConclusion) {
      const fechaInicio = new Date(watchFechaInicio);
      const fechaConclusion = new Date(watchFechaConclusion);

      if (fechaConclusion < fechaInicio) {
        form.setError("obrasPublicas.0.fechaConclusion", {
          type: "manual",
          message:
            "La fecha de conclusión no puede ser menor a la fecha de inicio del procedimiento.",
        });

        toast({
          variant: "destructive",
          title: "Error en fechas",
          description:
            "La fecha de conclusión no puede ser menor a la fecha de inicio del procedimiento.",
        });
      } else {
        form.clearErrors("obrasPublicas.0.fechaConclusion");
      }
    }
  }, [watchFechaInicio, watchFechaConclusion, form, toast]);

  return (
    <div className="space-y-8">
      {/* TIPO DE ÁREA */}
      <div className="p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <h4 className="text-sm font-semibold mb-4 text-blue-900 dark:text-blue-100">
          Tipo de Área{" "}
          <span className="text-xs text-muted-foreground">
            (Esta sección se actualizará quincenalmente)
          </span>
        </h4>
        <FormField
          control={form.control}
          name="obrasPublicas.0.tipoArea"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tiposArea.map((tipo) => (
                  <FormField
                    key={tipo.value}
                    control={form.control}
                    name="obrasPublicas.0.tipoArea"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tipo.value}
                          className="flex items-start space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              id={`tipo-obra-${tipo.value}`}
                              disabled={loading}
                              className="mt-1"
                              checked={field.value?.includes(tipo.value)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, tipo.value]);
                                } else {
                                  field.onChange(
                                    currentValue.filter(
                                      (value) => value !== tipo.value
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <Label
                            htmlFor={`tipo-obra-${tipo.value}`}
                            className="text-sm font-normal cursor-pointer leading-tight"
                          >
                            {tipo.label}
                          </Label>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo condicional: Tipo de Área - Otro (Especifique) */}
        {mostrarTipoAreaOtro && (
          <div className="mt-4">
            <FormField
              control={form.control}
              name="obrasPublicas.0.tipoAreaOtro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Especifique el Tipo de Área{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ingrese el tipo de área"
                      {...field}
                      value={field.value || ""}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
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

              {/* Para la pregunta 7, solo mostrar el campo de input */}
              {resp.id === 7 ? (
                <div className="ml-8">
                  <FormField
                    control={form.control}
                    name={`obrasPublicas.0.responsabilidades.${
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`resp-obra-${resp.id}-elaborar`}
                      disabled={loading || resp.opciones.elaborar.disabled}
                      className={
                        resp.opciones.elaborar.disabled ? "opacity-50" : ""
                      }
                    />
                    <Label
                      htmlFor={`resp-obra-${resp.id}-elaborar`}
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

                  {/* Revisar (B) */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`resp-obra-${resp.id}-revisar`}
                      disabled={loading || resp.opciones.revisar.disabled}
                      className={
                        resp.opciones.revisar.disabled ? "opacity-50" : ""
                      }
                    />
                    <Label
                      htmlFor={`resp-obra-${resp.id}-revisar`}
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

                  {/* Firmar, Autorizar o Dictaminar (C) */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`resp-obra-${resp.id}-firmar`}
                      disabled={
                        loading || resp.opciones.firmarAutorizar.disabled
                      }
                      className={
                        resp.opciones.firmarAutorizar.disabled
                          ? "opacity-50"
                          : ""
                      }
                    />
                    <Label
                      htmlFor={`resp-obra-${resp.id}-firmar`}
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

                  {/* Supervisar (D) */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`resp-obra-${resp.id}-supervisar`}
                      disabled={loading || resp.opciones.supervisar.disabled}
                      className={
                        resp.opciones.supervisar.disabled ? "opacity-50" : ""
                      }
                    />
                    <Label
                      htmlFor={`resp-obra-${resp.id}-supervisar`}
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

                  {/* Emitir o Suscribir (E) */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`resp-obra-${resp.id}-emitir`}
                      disabled={
                        loading || resp.opciones.emitirSuscribir.disabled
                      }
                      className={
                        resp.opciones.emitirSuscribir.disabled
                          ? "opacity-50"
                          : ""
                      }
                    />
                    <Label
                      htmlFor={`resp-obra-${resp.id}-emitir`}
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
          Datos Generales de los Procedimientos de Contrataciones Públicas
        </h4>
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-6">
          Esta sección se podrá actualizar quincenalmente agregando un nuevo
          procedimiento
        </p>

        <div className="space-y-6 p-6 rounded-lg border-2 border-primary/20 bg-card/50">
          {/* Número de Expediente */}
          <FormField
            control={form.control}
            name="obrasPublicas.0.numeroExpediente"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Número de Expediente, Folio o Nomenclatura{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: EXP-OBRA-2024-001"
                    {...field}
                    value={field.value || ""}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Número de expediente o folio del procedimiento de obra pública
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Procedimiento */}
            <FormField
              control={form.control}
              name="obrasPublicas.0.tipoProcedimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Tipo de Procedimiento{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LICITACION_PUBLICA_NACIONAL">
                        Licitación Pública (Nacional)
                      </SelectItem>
                      <SelectItem value="LICITACION_PUBLICA_INTERNACIONAL">
                        Licitación Pública (Internacional)
                      </SelectItem>
                      <SelectItem value="INVITACION_TRES_PERSONAS">
                        Invitación a cuando menos tres personas
                      </SelectItem>
                      <SelectItem value="ADJUDICACION_DIRECTA">
                        Adjudicación Directa
                      </SelectItem>
                      <SelectItem value="OTRO">Otro (Especifique)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Materia */}
            <FormField
              control={form.control}
              name="obrasPublicas.0.materia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Materia <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Seleccione la materia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OBRA_PUBLICA">Obra Pública</SelectItem>
                      <SelectItem value="SERVICIOS_RELACIONADOS">
                        Servicios Relacionados con Obra Pública
                      </SelectItem>
                      <SelectItem value="OTRO">Otro (Especifique)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Campo condicional: Tipo de Procedimiento - Otro (Especifique) */}
          {mostrarTipoProcedimientoOtro && (
            <FormField
              control={form.control}
              name="obrasPublicas.0.tipoProcedimientoOtro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Especifique el Tipo de Procedimiento{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ingrese el tipo de procedimiento"
                      {...field}
                      value={field.value || ""}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Campo condicional: Materia - Otro (Especifique) */}
          {mostrarMateriaOtro && (
            <FormField
              control={form.control}
              name="obrasPublicas.0.materiaOtro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Especifique la Materia{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ingrese la materia"
                      {...field}
                      value={field.value || ""}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de Inicio */}
            <FormField
              control={form.control}
              name="obrasPublicas.0.fechaInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Fecha de Inicio del Procedimiento (DD-MM-AAAA){" "}
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

            {/* Fecha de Conclusión */}
            <FormField
              control={form.control}
              name="obrasPublicas.0.fechaConclusion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Fecha de Conclusión del Procedimiento (DD-MM-AAAA)
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
                    Fecha de conclusión (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Datos de la Persona Beneficiaria */}
          <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <h5 className="text-sm font-semibold mb-4 text-blue-900 dark:text-blue-100">
              Datos de la(s) Persona(s) Beneficiaria(s) Final(es)
              <span className="text-xs font-normal text-muted-foreground ml-2">
                (Solo aplica a personas morales)
              </span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="obrasPublicas.0.razonSocial"
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
                name="obrasPublicas.0.nombreBeneficiario"
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
                name="obrasPublicas.0.primerApellidoBeneficiario"
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
                name="obrasPublicas.0.segundoApellidoBeneficiario"
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
            name="obrasPublicas.0.continuaParticipando"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  ¿La persona servidora pública continúa participando en los
                  procedimientos de contratación de obra pública y los servicios
                  relacionados con la misma?{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                  (Esta sección se podrá actualizar quincenalmente)
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="continua-obra-si"
                      checked={field.value === true}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? true : false)
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor="continua-obra-si"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Sí
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="continua-obra-no"
                      checked={field.value === false}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? false : true)
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor="continua-obra-no"
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

// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useMemo } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  FileText,
  Calendar,
  Clipboard,
  Users,
  Briefcase,
  ShoppingCart,
  Building,
} from "lucide-react";

// Imports de archivos separados
import {
  servidoresContratacionesSchema,
  type ServidoresContratacionesFormValues,
} from "./schema";
import { getServidoresContratacionesDefaults } from "./defaults";
import { saveServidorContratacion } from "./handler";

// Imports de secciones
import { DatosGeneralesSection } from "./sections/DatosGeneralesSection";
import { EmpleoCargoComisionSection } from "./sections/EmpleoCargoComisionSection";
import { ContratacionAdquisicionesSection } from "./sections/ContratacionAdquisicionesSection";
import { ObrasPublicasSection } from "./sections/ObrasPublicasSection";
import { OtorgamientoConcesionesSection } from "./sections/OtorgamientoConcesionesSection";
import { EnajenacionBienesSection } from "./sections/EnajenacionBienesSection";
import { DictaminacionAvaluosSection } from "./sections/DictaminacionAvaluosSection";

interface ServidoresContratacionesFormProps {
  initialData: any | null;
}

const tipoProcedimientoOptions = [
  {
    value: "CONTRATACION_PUBLICA",
    label:
      "Contratación pública, de tramitación, atención y resolución para la adjudicación de un contrato",
  },
  {
    value: "OTORGAMIENTO_CONCECIONES",
    label:
      "Otorgamiento de concesiones, licencias, permisos, autorizaciones y sus prórrogas",
  },
  {
    value: "ENAJENACION_BIENES",
    label: "Enajenación de bienes muebles",
  },
  {
    value: "DICTAMEN_VALUATORIO",
    label: "Emisión de dictamen valuatorio y justipreciación de rentas",
  },
];

export const ServidoresContratacionesForm: React.FC<
  ServidoresContratacionesFormProps
> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { session } = useCurrentSession();

  const title = initialData
    ? "Actualizar servidor público en procedimientos de contrataciones"
    : "Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas";
  const description = initialData
    ? "Edita la información del servidor público que interviene en procedimientos de contrataciones públicas"
    : "Formato que indica los datos que se inscribirán en el Sistema de Servidores Públicos que Intervengan en Procedimientos de Contrataciones Públicas de la Plataforma Digital Nacional previsto en el artículo 49, fracción II de la Ley General del Sistema Nacional Anticorrupción.";
  const toastMessage = initialData
    ? "Registro actualizado"
    : "Nuevo registro creado.";
  const action = initialData ? "Actualizar" : "Guardar";

  // Valores por defecto usando la función separada
  const defaultValues = useMemo(
    () =>
      getServidoresContratacionesDefaults(initialData, session?.user?.entePublico),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<ServidoresContratacionesFormValues>({
    resolver: zodResolver(servidoresContratacionesSchema),
    defaultValues,
  });

  const tipoProcedimiento = form.watch("tipoProcedimiento");
  const tipoContratacion = form.watch("tipoContratacion");

  // Establecer los datos cuando carga el componente
  useEffect(() => {
    if (initialData) {
      // Cargar campos principales
      for (const key in initialData) {
        if (servidoresContratacionesSchema.shape.hasOwnProperty(key)) {
          form.setValue(key, initialData[key]);
        }
      }
    } else {
      // Si es nuevo registro, establecer el entePublico del usuario
      if (session && session.user?.entePublico) {
        form.setValue("entePublico", session.user.entePublico);
      }
    }
  }, [initialData, form, session]);

  const onSubmit = async (data: ServidoresContratacionesFormValues) => {
    // Mostrar en consola el objeto completo que se forma con los campos del formulario
    console.log("=== DATOS DEL FORMULARIO (onSubmit) ===");
    console.log("Objeto completo:", data);
    console.log("JSON formateado:");
    console.log(JSON.stringify(data, null, 2));
    console.log("========================================");

    try {
      setLoading(true);

      await saveServidorContratacion(data, initialData, session?.access_token);

      router.refresh();
      router.push(`/inicio/entes`);
      toast({
        variant: "default",
        className: "bg-green-600",
        title: "Éxito",
        description: toastMessage,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al intentar guardar el registro",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* Campo oculto para entePublico */}
          <FormField
            control={form.control}
            name="entePublico"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Ente Público</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    readOnly
                    placeholder="Automático del usuario"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nota de campos obligatorios */}
          <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
            <div className="bg-amber-100 dark:bg-amber-800/30 rounded-lg p-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              Los campos marcados con un asterisco (
              <span className="text-red-500">*</span>) son de carácter
              obligatorio.
            </p>
          </div>

          {/* Box con los campos iniciales */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo 1: Fecha */}
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        1. Fecha (DD-MM-AAAA){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input
                            type="date"
                            disabled={loading}
                            {...field}
                            className="h-12 pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Indicar la fecha en la que se registra la información
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo 2: Ejercicio */}
                <FormField
                  control={form.control}
                  name="ejercicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        2. Ejercicio <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input
                            disabled={loading}
                            placeholder="2024"
                            {...field}
                            className="h-12 pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Registrar el ejercicio presupuestal en que se realizó el
                        acto público
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ACCORDION - Secciones 3 y 4 */}
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Sección 3: Datos Generales de la Persona Servidora Pública */}
            <AccordionItem
              value="datos-generales"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    3. Datos generales de la persona servidora pública
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DatosGeneralesSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 4: Empleo, Cargo o Comisión */}
            <AccordionItem
              value="empleo-cargo-comision"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    4. Datos del empleo, cargo o comisión de la persona
                    servidora pública
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <EmpleoCargoComisionSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Campo 5: Tipo de procedimiento - A nivel raíz */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 rounded-lg p-2 mr-4">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                5. Tipo de procedimiento en el que participa la persona
                servidora pública
              </h3>
            </div>

            <FormField
              control={form.control}
              name="tipoProcedimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Seleccione el tipo de procedimiento
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Seleccione un tipo de procedimiento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoProcedimientoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-muted-foreground">
                    Seleccione el tipo de procedimiento en el que participa la
                    persona servidora pública
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección 5.1: Tipo de Contratación Pública (solo si tipoProcedimiento === CONTRATACION_PUBLICA) */}
          {tipoProcedimiento === "CONTRATACION_PUBLICA" && (
            <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 rounded-lg p-2 mr-4">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">
                  5.1 Participación en procedimientos de contratación pública
                </h3>
              </div>

              <FormField
                control={form.control}
                name="tipoContratacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Tipo de Contratación Pública <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Seleccione el tipo de contratación pública" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CONTRATACION_ADQUISICIONES">
                          Contratación de adquisiciones y arrendamientos de bienes muebles y servicios de cualquier naturaleza
                        </SelectItem>
                        <SelectItem value="CONTRATACION_OBRA">
                          Contratación de obra pública y los servicios relacionados con la misma
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-muted-foreground">
                      Seleccione el tipo de contratación pública en el que participa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Sección 5.1.1: Contratación de Adquisiciones (solo si tipoContratacion === CONTRATACION_ADQUISICIONES) */}
          {tipoProcedimiento === "CONTRATACION_PUBLICA" && tipoContratacion === "CONTRATACION_ADQUISICIONES" && (
            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem
                value="contratacion-adquisiciones"
                className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                  <div className="flex items-center w-full">
                    <div className="bg-primary/10 rounded-lg p-2 mr-4">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-left text-lg font-semibold text-primary">
                      5.1.1 Participación en contrataciones de adquisiciones,
                      arrendamientos y servicios
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <ContratacionAdquisicionesSection
                    form={form}
                    loading={loading}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Sección 5.1.2: Obras Públicas (solo si tipoContratacion === CONTRATACION_OBRA) */}
          {tipoProcedimiento === "CONTRATACION_PUBLICA" && tipoContratacion === "CONTRATACION_OBRA" && (
            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem
                value="obras-publicas"
                className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                  <div className="flex items-center w-full">
                    <div className="bg-primary/10 rounded-lg p-2 mr-4">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-left text-lg font-semibold text-primary">
                      5.1.2 Participación en obras públicas y servicios
                      relacionados con las mismas
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <ObrasPublicasSection form={form} loading={loading} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {tipoProcedimiento === "OTORGAMIENTO_CONCECIONES" && (
            <Accordion type="multiple" className="w-full space-y-4">
              {/* 5.2 Otorgamiento de Concesiones */}
              <AccordionItem
                value="otorgamiento-concesiones"
                className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                  <div className="flex items-center w-full">
                    <div className="bg-primary/10 rounded-lg p-2 mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-left text-lg font-semibold text-primary">
                      5.2 Participación en el otorgamiento de concesiones, licencias, permisos, autorizaciones y sus prórrogas
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <OtorgamientoConcesionesSection form={form} loading={loading} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {tipoProcedimiento === "ENAJENACION_BIENES" && (
            <Accordion type="multiple" className="w-full space-y-4">
              {/* 5.3 Enajenación de Bienes */}
              <AccordionItem
                value="enajenacion-bienes"
                className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                  <div className="flex items-center w-full">
                    <div className="bg-primary/10 rounded-lg p-2 mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-left text-lg font-semibold text-primary">
                      5.3 Participación en la enajenación de bienes muebles
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <EnajenacionBienesSection form={form} loading={loading} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {tipoProcedimiento === "DICTAMEN_VALUATORIO" && (
            <Accordion type="multiple" className="w-full space-y-4">
              {/* 5.4 Dictaminación de Avalúos */}
              <AccordionItem
                value="dictaminacion-avaluos"
                className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                  <div className="flex items-center w-full">
                    <div className="bg-primary/10 rounded-lg p-2 mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-left text-lg font-semibold text-primary">
                      5.4 Participación en la dictaminación en materia de
                      avalúos y justipreciación de rentas
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <DictaminacionAvaluosSection form={form} loading={loading} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Campo 6: Observaciones */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 rounded-lg p-2 mr-4">
                <Clipboard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                6. Observaciones
              </h3>
            </div>

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Ej: Información adicional sobre el servidor público..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    En este espacio podrá realizar las aclaraciones u
                    observaciones que considere pertinentes respecto de alguno o
                    algunos de los apartados del documento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="h-12 px-6"
            >
              Cancelar
            </Button>
            <Button
              disabled={loading}
              type="submit"
              className="h-12 px-6"
              onClick={() => {
                console.log("=== BOTÓN GUARDAR PRESIONADO ===");
                console.log("Valores actuales del formulario:", form.getValues());
                console.log("Errores de validación:", form.formState.errors);
                console.log("=================================");
              }}
            >
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

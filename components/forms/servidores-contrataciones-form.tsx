// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { createItem, updateItem, withToken } from "@directus/sdk";

// Schema de validación basado en los campos de Directus
const servidoresContratacionesSchema = z.object({
  entePublico: z.number({
    required_error: "Ente público es requerido.",
  }),
  fecha: z.string().min(1, {
    message: "La fecha es requerida.",
  }),
  ejercicio: z.string().min(4, {
    message: "El ejercicio es requerido (4 dígitos).",
  }),
  datosGenerales: z.string().optional(),
  empleoCargoComision: z.string().optional(),
  tipoProcedimiento: z
    .enum(
      [
        "CONTRATACION_PUBLICA",
        "OTORGAMIENTO_CONCECIONES",
        "ENAJENACION_BIENES",
        "DICTAMEN_VALUATORIO",
      ],
      {
        required_error: "Debe seleccionar un tipo de procedimiento",
      }
    )
    .optional(),
  otorgamientoConcesion: z.string().optional(),
  enajenacionBien: z.string().optional(),
  avaluosJustipreciacion: z.string().optional(),
  observaciones: z.string().nullable().optional(),
});

type ServidoresContratacionesFormValues = z.infer<
  typeof servidoresContratacionesSchema
>;

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

  const defaultValues = useMemo(
    () => ({
      entePublico: initialData?.entePublico ?? session?.user?.entePublico ?? 0,
      fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
      ejercicio: initialData?.ejercicio ?? new Date().getFullYear().toString(),
      datosGenerales: initialData?.datosGenerales ?? "",
      empleoCargoComision: initialData?.empleoCargoComision ?? "",
      tipoProcedimiento: initialData?.tipoProcedimiento ?? undefined,
      otorgamientoConcesion: initialData?.otorgamientoConcesion ?? "",
      enajenacionBien: initialData?.enajenacionBien ?? "",
      avaluosJustipreciacion: initialData?.avaluosJustipreciacion ?? "",
      observaciones: initialData?.observaciones ?? "",
    }),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<ServidoresContratacionesFormValues>({
    resolver: zodResolver(servidoresContratacionesSchema),
    defaultValues,
  });

  const tipoProcedimiento = form.watch("tipoProcedimiento");

  // Establecer el entePublico desde la sesión cuando carga el componente
  useEffect(() => {
    if (initialData) {
      // Si hay datos iniciales, cargar todos los campos
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
  }, [initialData, form.setValue, session]);

  const onSubmit = async (data: ServidoresContratacionesFormValues) => {
    try {
      setLoading(true);
      console.log(data);

      // Preparar los datos del registro principal
      const mainData = {
        entePublico: data.entePublico,
        fecha: data.fecha,
        ejercicio: data.ejercicio,
        datosGenerales: data.datosGenerales,
        empleoCargoComision: data.empleoCargoComision,
        tipoProcedimiento: data.tipoProcedimiento,
        otorgamientoConcesion: data.otorgamientoConcesion,
        enajenacionBien: data.enajenacionBien,
        avaluosJustipreciacion: data.avaluosJustipreciacion,
        observaciones: data.observaciones,
      };

      if (initialData) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem(
              "servidores_intervengan_procedimientos_contrataciones",
              initialData.id,
              mainData
            )
          )
        );
      } else {
        await directus.request(
          withToken(
            session?.access_token,
            createItem(
              "servidores_intervengan_procedimientos_contrataciones",
              mainData
            )
          )
        );
      }

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
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Nota:</span> Todos los campos
              señalados con un asterisco (*) son de carácter obligatorio.
            </p>
          </div>

          <div className="space-y-6">
            <div className="md:grid md:grid-cols-2 gap-6">
              {/* Campo 1: Fecha */}
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      1. Fecha (DD-MM-AAAA){" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" disabled={loading} {...field} />
                    </FormControl>
                    <FormDescription>
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
                    <FormLabel>2. Ejercicio *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={loading}
                        placeholder="2024"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Registrar el ejercicio presupuestal en que se realizó el
                      acto público
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campo Datos Generales */}
            <FormField
              control={form.control}
              name="datosGenerales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    3. Datos generales de la persona servidora pública
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una persona servidora pública" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO: Cargar desde datos_generales en Directus */}
                      <SelectItem value="placeholder">
                        Sin datos disponibles
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    En el presente apartado se establecen los datos
                    concernientes a la persona servidora pública que intervenga
                    en procedimientos de contratación pública
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Empleo, Cargo o Comisión */}
            <FormField
              control={form.control}
              name="empleoCargoComision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    4. Datos del empleo, cargo o comisión de la persona
                    servidora pública
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un empleo, cargo o comisión" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO: Cargar desde empleos_cargos_comisiones en Directus */}
                      <SelectItem value="placeholder">
                        Sin datos disponibles
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    En el presente apartado se establecen los datos
                    concernientes al empleo, cargo o comisión que ostenta la
                    persona servidora pública al intervenir en actos públicos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Sección: Tipo de procedimiento */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="tipoProcedimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    5. Tipo de procedimiento en el que participa la persona
                    servidora pública
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                  <FormDescription>
                    Seleccione el tipo de procedimiento en el que participa la
                    persona servidora pública
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos condicionales según el tipo de procedimiento */}
            {tipoProcedimiento === "OTORGAMIENTO_CONCECIONES" && (
              <FormField
                control={form.control}
                name="otorgamientoConcesion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      5.2 Participación en el otorgamiento de concesiones,
                      licencias, permisos ó autorizaciones
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un otorgamiento de concesión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Cargar desde otorgamientos_concesiones en Directus */}
                        <SelectItem value="placeholder">
                          Sin datos disponibles
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {tipoProcedimiento === "ENAJENACION_BIENES" && (
              <FormField
                control={form.control}
                name="enajenacionBien"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      5.3 Participación en la enajenación de bienes muebles
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una enajenación de bien" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Cargar desde enajenaciones_bienes en Directus */}
                        <SelectItem value="placeholder">
                          Sin datos disponibles
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {tipoProcedimiento === "DICTAMEN_VALUATORIO" && (
              <FormField
                control={form.control}
                name="avaluosJustipreciacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      5.4 Participación en la dictaminación en materia de
                      avalúos y justipreciación de rentas
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un avalúo o justipreciación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Cargar desde dictaminaciones_avaluos en Directus */}
                        <SelectItem value="placeholder">
                          Sin datos disponibles
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Separator />

          {/* Campo 6: Observaciones */}
          <FormField
            control={form.control}
            name="observaciones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>6. Observaciones</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Ej: Información adicional sobre el servidor público..."
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  En este espacio podrá realizar las aclaraciones u
                  observaciones que considere pertinentes respecto de alguno o
                  algunos de los apartados del documento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button disabled={loading} type="submit">
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

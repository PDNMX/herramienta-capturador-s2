//@ts-nocheck
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schema de validación basado en los campos de Directus
const servidoresContratacionesSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  ejercicio: z.number({
    required_error: "El ejercicio es requerido",
  }).min(2017, "El ejercicio debe ser 2017 o posterior"),
  datosGenerales: z.string({
    required_error: "Los datos generales son requeridos",
  }).min(1, "Debe seleccionar una persona servidora pública"),
  empleoCargoComision: z.string({
    required_error: "El empleo, cargo o comisión es requerido",
  }).min(1, "Debe seleccionar un empleo, cargo o comisión"),
  tipoProcedimiento: z.enum(
    ["CONTRATACION_PUBLICA", "OTORGAMIENTO_CONCECIONES", "ENAJENACION_BIENES", "DICTAMEN_VALUATORIO"],
    {
      required_error: "Debe seleccionar un tipo de procedimiento",
    }
  ),
  otorgamientoConcesion: z.string().optional(),
  enajenacionBien: z.string().optional(),
  avaluosJustipreciacion: z.string().optional(),
  Observaciones: z.string().optional(),
});

type ServidoresContratacionesFormValues = z.infer<typeof servidoresContratacionesSchema>;

const tipoProcedimientoOptions = [
  {
    value: "CONTRATACION_PUBLICA",
    label: "Contratación pública, de tramitación, atención y resolución para la adjudicación de un contrato",
  },
  {
    value: "OTORGAMIENTO_CONCECIONES",
    label: "Otorgamiento de concesiones, licencias, permisos, autorizaciones y sus prórrogas",
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

export function ServidoresContratacionesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServidoresContratacionesFormValues>({
    resolver: zodResolver(servidoresContratacionesSchema),
    defaultValues: {
      Observaciones: "",
    },
  });

  const tipoProcedimiento = form.watch("tipoProcedimiento");

  async function onSubmit(data: ServidoresContratacionesFormValues) {
    try {
      setIsSubmitting(true);
      console.log("Datos a enviar:", data);

      // TODO: Implementar llamada a API de Directus
      // const response = await directusClient.items('servidores_intervengan_procedimientos_contrataciones').createOne(data);

      alert("Formulario enviado correctamente");
      form.reset();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Error al enviar el formulario");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Sección informativa */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Formato que indica los datos que se inscribirán en el Sistema de Servidores Públicos que Intervengan en Procedimientos de Contrataciones Públicas de la Plataforma Digital Nacional</strong> previsto en el artículo 49, fracción II de la Ley General del Sistema Nacional Anticorrupción.
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertDescription>
          Todos los campos señalados con un asterisco (*) son de carácter obligatorio.
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertDescription>
          <a
            href="https://docs.google.com/document/d/1opPJxgWek0vHYsNoI1Xh-zqYepTjU6px/edit?usp=sharing&ouid=114879368646852403050&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Instructivo para el registro de información
          </a>
        </AlertDescription>
      </Alert>

      {/* Formulario */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Fecha */}
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>1. Fecha (DD-MM-AAAA) *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd-MM-yyyy", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Indicar la fecha en la que se registra la información
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Ejercicio */}
                <FormField
                  control={form.control}
                  name="ejercicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Ejercicio *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={2017}
                          placeholder="2024"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Registrar el ejercicio presupuestal en que se realizó el acto público
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
                    <FormLabel>3. Datos generales de la persona servidora pública *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una persona servidora pública" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Cargar desde datos_generales en Directus */}
                        <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      En el presente apartado se establecen los datos concernientes a la persona servidora pública que intervenga en procedimientos de contratación pública
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
                    <FormLabel>4. Datos del empleo, cargo o comisión de la persona servidora pública *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un empleo, cargo o comisión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Cargar desde empleos_cargos_comisiones en Directus */}
                        <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      En el presente apartado se establecen los datos concernientes al empleo, cargo o comisión que ostenta la persona servidora pública al intervenir en actos públicos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Tipo de procedimiento en el que participa la persona servidora pública</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="tipoProcedimiento"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {tipoProcedimientoOptions.map((option) => (
                          <FormItem
                            key={option.value}
                            className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent"
                          >
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex-1">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
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
                      <FormLabel>5.2 Participación en el otorgamiento de concesiones, licencias, permisos ó autorizaciones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un otorgamiento de concesión" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* TODO: Cargar desde otorgamientos_concesiones en Directus */}
                          <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
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
                      <FormLabel>5.3 Participación en la enajenación de bienes muebles</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una enajenación de bien" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* TODO: Cargar desde enajenaciones_bienes en Directus */}
                          <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
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
                      <FormLabel>5.4 Participación en la dictaminación en materia de avalúos y justipreciación de rentas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un avalúo o justipreciación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* TODO: Cargar desde dictaminaciones_avaluos en Directus */}
                          <SelectItem value="placeholder">Sin datos disponibles</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="Observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6. Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingrese observaciones adicionales (opcional)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Guardar registro"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

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
import { Briefcase, Building, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface EmpleoCargoComisionSectionProps {
  form: any;
  loading: boolean;
}

const entidadesFederativas = [
  { value: "01", label: "AGUASCALIENTES" },
  { value: "02", label: "BAJA CALIFORNIA" },
  { value: "03", label: "BAJA CALIFORNIA SUR" },
  { value: "04", label: "CAMPECHE" },
  { value: "05", label: "COAHUILA DE ZARAGOZA" },
  { value: "06", label: "COLIMA" },
  { value: "07", label: "CHIAPAS" },
  { value: "08", label: "CHIHUAHUA" },
  { value: "09", label: "CIUDAD DE MÉXICO" },
  { value: "10", label: "DURANGO" },
  { value: "11", label: "GUANAJUATO" },
  { value: "12", label: "GUERRERO" },
  { value: "13", label: "HIDALGO" },
  { value: "14", label: "JALISCO" },
  { value: "15", label: "ESTADO DE MÉXICO" },
  { value: "16", label: "MICHOACÁN DE OCAMPO" },
  { value: "17", label: "MORELOS" },
  { value: "18", label: "NAYARIT" },
  { value: "19", label: "NUEVO LEÓN" },
  { value: "20", label: "OAXACA" },
  { value: "21", label: "PUEBLA" },
  { value: "22", label: "QUERÉTARO" },
  { value: "23", label: "QUINTANA ROO" },
  { value: "24", label: "SAN LUIS POTOSÍ" },
  { value: "25", label: "SINALOA" },
  { value: "26", label: "SONORA" },
  { value: "27", label: "TABASCO" },
  { value: "28", label: "TAMAULIPAS" },
  { value: "29", label: "TLAXCALA" },
  { value: "30", label: "VERACRUZ DE IGNACIO DE LA LLAVE" },
  { value: "31", label: "YUCATÁN" },
  { value: "32", label: "ZACATECAS" },
];

const nivelesJerarquicos = [
  { value: "OPERATIVO", label: "OPERATIVO U HOMÓLOGO" },
  { value: "ENLACE", label: "ENLACE U HOMÓLOGO" },
  { value: "JEFATURA_DEPARTAMENTO", label: "JEFATURA DE DEPARTAMENTO U HOMÓLOGO" },
  { value: "SUBDIRECCION_AREA", label: "SUBDIRECCIÓN DE ÁREA U HOMÓLOGO" },
  { value: "DIRECCION_AREA", label: "DIRECCIÓN DE ÁREA U HOMÓLOGO" },
  { value: "DIRECCION_GENERAL", label: "DIRECCIÓN GENERAL U HOMÓLOGO" },
  { value: "JEFATURA_UNIDAD", label: "JEFATURA DE UNIDAD U HOMÓLOGO" },
  { value: "SUBSECRETARIA", label: "SUBSECRETARÍA DE ESTADO, OFICIALÍA MAYOR U HOMÓLOGO" },
  { value: "SECRETARIA", label: "SECRETARÍA DE ESTADO U HOMÓLOGO" },
  { value: "OTRO", label: "OTRO (ESPECIFIQUE)" },
];

export function EmpleoCargoComisionSection({ form, loading }: EmpleoCargoComisionSectionProps) {
  const [showNivelJerarquicoOtro, setShowNivelJerarquicoOtro] = useState(false);

  // Sincronizar el estado local con el valor del formulario cuando se carga
  useEffect(() => {
    const nivelJerarquico = form.watch("empleoCargoComision.nivelJerarquico");
    setShowNivelJerarquicoOtro(nivelJerarquico === "OTRO");
  }, [form.watch("empleoCargoComision.nivelJerarquico")]);

  return (
    <div className="space-y-6">
      {/* ENTIDAD FEDERATIVA* */}
      <FormField
        control={form.control}
        name="empleoCargoComision.entidadFederativa"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Entidad Federativa <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione una entidad federativa" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {entidadesFederativas.map((entidad) => (
                  <SelectItem key={entidad.value} value={entidad.value}>
                    {entidad.value} - {entidad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Seleccione la entidad federativa donde labora la persona servidora pública
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NIVEL/ORDEN DE GOBIERNO* */}
        <FormField
          control={form.control}
          name="empleoCargoComision.nivelOrdenGobierno"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Nivel/Orden de Gobierno <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccione el nivel de gobierno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FEDERAL">FEDERAL</SelectItem>
                  <SelectItem value="ESTATAL">ESTATAL</SelectItem>
                  <SelectItem value="MUNICIPAL_ALCALDIA">MUNICIPAL/ALCALDÍA</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-muted-foreground">
                Nivel u orden de gobierno al que pertenece
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ÁMBITO PÚBLICO* */}
        <FormField
          control={form.control}
          name="empleoCargoComision.ambitoPublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Ámbito Público <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccione el ámbito público" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EJECUTIVO">EJECUTIVO</SelectItem>
                  <SelectItem value="LEGISLATIVO">LEGISLATIVO</SelectItem>
                  <SelectItem value="JUDICIAL">JUDICIAL</SelectItem>
                  <SelectItem value="ORGANO_AUTONOMO">ÓRGANO AUTÓNOMO</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-muted-foreground">
                Ámbito del poder público al que pertenece
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NOMBRE DEL ENTE PÚBLICO* */}
        <FormField
          control={form.control}
          name="empleoCargoComision.nombreEntePublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Nombre del Ente Público <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    disabled={loading}
                    placeholder="Ingrese el nombre del ente público"
                    maxLength={50}
                    {...field}
                    value={field.value || ""}
                    className="h-12 pl-10"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Nombre completo del ente público donde labora
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SIGLAS DEL ENTE PÚBLICO */}
        <FormField
          control={form.control}
          name="empleoCargoComision.siglasEntePublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Siglas del Ente Público
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    disabled={loading}
                    placeholder="Ej: SESNA, INAI, etc."
                    maxLength={50}
                    {...field}
                    value={field.value || ""}
                    className="h-12 pl-10 uppercase"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Siglas o acrónimo del ente público (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* NIVEL JERÁRQUICO* */}
      <FormField
        control={form.control}
        name="empleoCargoComision.nivelJerarquico"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Nivel Jerárquico del Empleo, Cargo o Comisión <span className="text-red-500">*</span>
            </FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setShowNivelJerarquicoOtro(value === "OTRO");

                // Si NO es "OTRO", limpiar el campo nivelJerarquicoOtro
                if (value !== "OTRO") {
                  form.setValue("empleoCargoComision.nivelJerarquicoOtro", "");
                }
              }}
              value={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccione el nivel jerárquico" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {nivelesJerarquicos.map((nivel) => (
                  <SelectItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs text-muted-foreground">
              Nivel jerárquico del empleo, cargo o comisión
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NIVEL JERÁRQUICO OTRO (Condicional) */}
      {showNivelJerarquicoOtro && (
        <FormField
          control={form.control}
          name="empleoCargoComision.nivelJerarquicoOtro"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Especifique el Nivel Jerárquico <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Especifique el nivel jerárquico"
                  maxLength={50}
                  {...field}
                  value={field.value || ""}
                  className="h-12"
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Especifique el nivel jerárquico si seleccionó "OTRO"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DENOMINACIÓN DEL EMPLEO* */}
        <FormField
          control={form.control}
          name="empleoCargoComision.denominacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Denominación del Empleo, Cargo o Comisión <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    disabled={loading}
                    placeholder="Ej: Director General, Subdirector, etc."
                    maxLength={50}
                    {...field}
                    value={field.value || ""}
                    className="h-12 pl-10"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Denominación o nombre del puesto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ÁREA DE ADSCRIPCIÓN* */}
        <FormField
          control={form.control}
          name="empleoCargoComision.areaAdscripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Área de Adscripción <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    disabled={loading}
                    placeholder="Ej: Dirección de Tecnologías, etc."
                    maxLength={50}
                    {...field}
                    value={field.value || ""}
                    className="h-12 pl-10"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Área o departamento donde está adscrito el empleo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

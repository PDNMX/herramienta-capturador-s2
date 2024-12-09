// @ts-nocheck
"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  entidadFederativa: z.string({
    required_error: "Por favor selecciona una entidad federativa.",
  }),
});

const entidadesFederativas = [
  "Federal",
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Coahuila",
  "Colima",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas"
];

export function DenunciaForm({ initialData = null }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entidadFederativa: ""
    },
  });

  function onSubmit(values) {
    console.log(values);
    // Aquí manejaremos la lógica de envío del formulario
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Presentar Denuncia</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="entidadFederativa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entidad Federativa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tu entidad federativa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entidadesFederativas.map((entidad) => (
                        <SelectItem key={entidad} value={entidad}>
                          {entidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default DenunciaForm;
//@ts-nocheck
"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { WelcomeStep } from "./steps/welcome-step"
import { DenunciaForm } from "./denuncia-form"
import { FeatureCards } from "./feature-cards"

const formSchema = z.object({
  denunciante: z.object({
    anonimo: z.boolean().default(false),
    datosDenunciante: z
      .object({
        nombre: z.string().min(1, "El nombre es requerido"),
        telefono: z.string().min(1, "El teléfono es requerido"),
        email: z.string().email("Email inválido"),
        proteccion: z.boolean().default(false),
        domicilioDenunciante: z.object({
          codigoPostal: z.string().min(1, "El código postal es requerido"),
          calle: z.string().min(1, "La calle es requerida"),
          numeroExterior: z.string().min(1, "El número exterior es requerido"),
          numeroInterior: z.string().optional(),
          municipioAlcaldia: z.string().min(1, "El municipio es requerido"),
        }),
      })
      .optional(),
  }),
  ubicacionHecho: z.object({
    lugarHecho: z.object({
      entidad: z.string().min(1, "La entidad es requerida"),
      entePublico: z.string().min(1, "El ente público es requerido"),
      calle: z.string().min(1, "La calle es requerida"),
      numeroExterior: z.string().min(1, "El número exterior es requerido"),
      numeroInterior: z.string().optional(),
      codigoPostal: z.string().min(1, "El código postal es requerido"),
      fechaHecho: z.string().min(1, "La fecha es requerida"),
      horaHecho: z.string().min(1, "La hora es requerida"),
    }),
  }),
  personaDenunciada: z.object({
    tipoPersona: z.enum(["SERVIDOR_PUBLICO", "PARTICULAR"]),
    nombre: z.string().min(1, "El nombre es requerido"),
    apellidoPaterno: z.string().min(1, "El apellido paterno es requerido"),
    apellidoMaterno: z.string().min(1, "El apellido materno es requerido"),
    descripcion: z.string().min(1, "La descripción es requerida"),
  }),
  faltaCometida: z.object({
    faltaGrave: z.array(z.number()).default([]),
    faltaNoGrave: z.array(z.number()).default([]),
    hechosCorrupcion: z.array(z.number()).default([]),
  }),
  narracionHechos: z.string().min(1, "La narración de hechos es requerida"),
  archivosEvidencia: z.array(z.any()).default([]),
});

export function MultiStepDenunciaForm() {
  const [currentStep, setCurrentStep] = useState(-1)

 const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      denunciante: {
        anonimo: false,
        datosDenunciante: {
          nombre: "",
          telefono: "",
          email: "",
          proteccion: false,
          domicilioDenunciante: {
            codigoPostal: "",
            calle: "",
            numeroExterior: "",
            numeroInterior: "",
            municipioAlcaldia: "",
          },
        },
      },
      ubicacionHecho: {
        lugarHecho: {
          entidad: "",
          entePublico: "",
          codigoPostal: "",
          calle: "",
          numeroExterior: "",
          numeroInterior: "",
          fechaHecho: "",
          horaHecho: "",
        },
      },
      personaDenunciada: {
        tipoPersona: "SERVIDOR_PUBLICO",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        descripcion: "",
      },
      faltaCometida: {
        faltaGrave: [],
        faltaNoGrave: [],
        hechosCorrupcion: [],
      },
      narracionHechos: "",
      archivosEvidencia: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === -1 ? (
            <WelcomeStep onNext={() => setCurrentStep(0)} />
          ) : (
            <DenunciaForm
              form={form}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onSubmit={onSubmit}
              onBackToWelcome={() => setCurrentStep(-1)}
            />
          )}
        </form>
      </Form>

      <FeatureCards />
    </div>
  )
}

export default MultiStepDenunciaForm


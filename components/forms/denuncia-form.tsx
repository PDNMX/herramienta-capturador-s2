//@ts-nocheck
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Search } from "lucide-react";
import { WelcomeStep } from "./welcome-step";
import { DenuncianteStep } from "./steps/denunciante-step";
import { UbicacionHechoStep } from "./steps/ubicacion-hecho-step";
import { PersonaDenunciadaStep } from "./steps/persona-denunciada-step";
import { FaltaCometidaStep } from "./steps/falta-cometida-step";
import { NarracionYEvidenciaStep } from "./steps/narracion-evidencia-step";

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

const steps = [
  { title: "Bienvenida", component: WelcomeStep },
  { title: "Datos del Denunciante", component: DenuncianteStep },
  { title: "Ubicación del Hecho", component: UbicacionHechoStep },
  { title: "Persona Denunciada", component: PersonaDenunciadaStep },
  { title: "Faltas Cometidas", component: FaltaCometidaStep },
  { title: "Narración de Hechos", component: NarracionYEvidenciaStep },
];

export function MultiStepDenunciaForm() {
  const [currentStep, setCurrentStep] = useState(0);

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

  function onSubmit(values) {
    console.log(values);
  }

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  const showNavigation = currentStep > 0;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === 0 ? (
            <WelcomeStep form={form} onNext={handleNext} />
          ) : (
            <Card className="w-full mx-auto shadow-lg">
              <CardHeader className="bg-primary text-primary-foreground py-4">
                <CardTitle className="text-2xl font-bold">
                  Quiero presentar una denuncia
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {showNavigation && (
                  <>
                    <div className="mb-8">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-foreground bg-primary">
                              Progreso
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-primary">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={progress} className="h-2 w-full" />
                      </div>
                    </div>
                    <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                      {steps.slice(1).map((step, index) => (
                        <Button
                          key={index}
                          variant={currentStep === index + 1 ? "default" : "outline"}
                          className={`px-2 py-1 text-xs sm:text-sm w-full h-auto min-h-[2.5rem] whitespace-normal ${
                            index + 1 > currentStep ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => index + 1 <= currentStep && setCurrentStep(index + 1)}
                          disabled={index + 1 > currentStep}
                        >
                          <span className="line-clamp-2">
                            {index + 1}. {step.title}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
                <div className="bg-background p-4 rounded-lg">
                  <CurrentStepComponent form={form} />
                </div>
                {showNavigation && (
                  <div className="mt-6 flex justify-between">
                    <Button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      variant="outline"
                    >
                      Anterior
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                      >
                        Siguiente
                      </Button>
                    ) : (
                      <Button type="submit">Enviar Denuncia</Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </form>
      </Form>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect border-2 border-custom-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Search className="h-6 w-6 text-custom-primary" />
              <h4 className="font-medium">Seguimiento de Denuncias</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Consulta el estado de tu denuncia en tiempo real
            </p>
            <Button
              variant="outline"
              className="w-full border-custom-primary text-custom-primary hover:bg-custom-primary hover:text-white transition-colors duration-300"
              asChild
            >
              <Link href="/seguimiento">Consultar Estado</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 border-custom-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="h-6 w-6 text-custom-primary" />
                          <h4 className="font-medium">Estadísticas</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Accede a datos actualizados sobre denuncias
            </p>
            <Button
              variant="outline"
              className="w-full border-custom-primary text-custom-primary hover:bg-custom-primary hover:text-white transition-colors duration-300"
              asChild
            >
              <Link href="/estadisticas">Ver Datos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MultiStepDenunciaForm;
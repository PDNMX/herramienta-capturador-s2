//@ts-nocheck
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DenuncianteStep } from "./steps/denunciante-step";
import { UbicacionHechoStep } from "./steps/ubicacion-hecho-step";
import { PersonaDenunciadaStep } from "./steps/persona-denunciada-step";
import { FaltaCometidaStep } from "./steps/falta-cometida-step";
import { NarracionYEvidenciaStep } from "./steps/narracion-evidencia-step";
import { ShieldAlertIcon } from "lucide-react";
import { stepIcons } from "./step-icons/step-icons";

const steps = [
  {
    title: "Datos del Denunciante",
    component: DenuncianteStep,
    icon: "denunciante",
  },
  {
    title: "Ubicación del Hecho",
    component: UbicacionHechoStep,
    icon: "ubicacion",
  },
  {
    title: "Persona Denunciada",
    component: PersonaDenunciadaStep,
    icon: "persona",
  },
  {
    title: "Faltas Cometidas",
    component: FaltaCometidaStep,
    icon: "faltas",
  },
  {
    title: "Narración de Hechos",
    component: NarracionYEvidenciaStep,
    icon: "narracion",
  },
];

interface DenunciaFormProps {
  form: UseFormReturn<any>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: (values: any) => void;
  onBackToWelcome: () => void;
}

export function DenunciaForm({
  form,
  currentStep,
  setCurrentStep,
  onSubmit,
  onBackToWelcome,
}: DenunciaFormProps) {
  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  return (
    <Card className="w-full mx-auto border-2 border-primary shadow-lg overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground py-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary-foreground rounded-full">
            <ShieldAlertIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Quiero presentar una denuncia
            </CardTitle>
            <p className="text-sm mt-1 text-primary-foreground/80">
              Tu información será tratada con confidencialidad
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Progreso de su denuncia
            </h2>
            <span className="text-primary font-medium">
              Paso {currentStep + 1} de {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, index) => {
            const Icon = stepIcons[step.icon];
            const isActive = currentStep === index;
            const isPast = index < currentStep;
            const isFuture = index > currentStep;

            return (
              <div
                key={index}
                className={`
                  relative p-6 rounded-lg border-2 transition-all
                  ${isActive
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : isPast
                      ? "border-primary/50 bg-primary/5 dark:bg-primary/10"
                      : "border-border bg-background"
                  }
                  ${isFuture ? "opacity-50" : ""}
                  cursor-pointer
                `}
                onClick={() => index <= currentStep && setCurrentStep(index)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon
                    className={`w-8 h-8 ${isActive
                        ? "text-primary"
                        : isPast
                          ? "text-primary/70"
                          : "text-muted-foreground"
                      }`}
                  />
                  <h3
                    className={`font-medium ${isActive
                        ? "text-primary"
                        : isPast
                          ? "text-primary/70"
                          : "text-muted-foreground"
                      }`}
                  >
                    {step.title}
                  </h3>
                  {isPast && (
                    <span className="absolute top-2 right-2 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 bg-card p-6 rounded-lg border border-border">
          <CurrentStepComponent form={form} />
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            onClick={currentStep === 0 ? onBackToWelcome : handlePrevious}
            variant="outline"
            className="px-6"
          >
            {currentStep === 0 ? "Volver al inicio" : "Anterior"}
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} className="px-6">
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="px-6"
            >
              Enviar Denuncia
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

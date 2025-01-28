import React from "react"
import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DenuncianteStep } from "./steps/denunciante-step"
import { UbicacionHechoStep } from "./steps/ubicacion-hecho-step"
import { PersonaDenunciadaStep } from "./steps/persona-denunciada-step"
import { FaltaCometidaStep } from "./steps/falta-cometida-step"
import { NarracionYEvidenciaStep } from "./steps/narracion-evidencia-step"

const steps = [
  { title: "Datos del Denunciante", component: DenuncianteStep },
  { title: "Ubicación del Hecho", component: UbicacionHechoStep },
  { title: "Persona Denunciada", component: PersonaDenunciadaStep },
  { title: "Faltas Cometidas", component: FaltaCometidaStep },
  { title: "Narración de Hechos", component: NarracionYEvidenciaStep },
]

interface DenunciaFormProps {
  form: UseFormReturn<any>
  currentStep: number
  setCurrentStep: (step: number) => void
  onSubmit: (values: any) => void
  onBackToWelcome: () => void
}

export function DenunciaForm({ form, currentStep, setCurrentStep, onSubmit, onBackToWelcome }: DenunciaFormProps) {
  const CurrentStepComponent = steps[currentStep].component
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
  }

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground py-4">
        <CardTitle className="text-2xl font-bold">Quiero presentar una denuncia</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-foreground bg-primary">
                  Progreso
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-primary">{Math.round(progress)}%</span>
              </div>
            </div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <Button
              key={index}
              variant={currentStep === index ? "default" : "outline"}
              className={`px-2 py-1 text-xs sm:text-sm w-full h-auto min-h-[2.5rem] whitespace-normal ${
                index > currentStep ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => index <= currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
            >
              <span className="line-clamp-2">
                {index + 1}. {step.title}
              </span>
            </Button>
          ))}
        </div>
        <div className="bg-background p-4 rounded-lg">
          <CurrentStepComponent form={form} />
        </div>
        <div className="mt-6 flex justify-between">
          <Button type="button" onClick={currentStep === 0 ? onBackToWelcome : handlePrevious} variant="outline">
            {currentStep === 0 ? "Volver al inicio" : "Anterior"}
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Enviar Denuncia
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


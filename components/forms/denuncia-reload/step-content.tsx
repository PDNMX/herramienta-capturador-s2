"use client"
import type { UseFormReturn } from "react-hook-form"
import { DenuncianteStep } from "./steps/denunciante-step"
import { UbicacionHechoStep } from "./steps/ubicacion-hecho-step"
import { PersonaDenunciadaStep } from "./steps/persona-denunciada-step"
import { NarracionYFaltaStep } from "./steps/narracion-faltas"

interface StepContentProps {
  step: number
  form: UseFormReturn<any>
}

export function StepContent({ step, form }: StepContentProps) {
  switch (step) {
    case 0:
      return <DenuncianteStep form={form} />
    case 1:
      return <UbicacionHechoStep form={form} />
    case 2:
      return <PersonaDenunciadaStep form={form} />
    case 3:
      return <NarracionYFaltaStep form={form} />
    /* case 4:
      return <NarracionYEvidenciaStep form={form} /> */
    default:
      return null
  }
}

//@ts-nocheck
"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form } from "@/components/ui/form"
import { WelcomeStep } from "./steps/welcome-step"
import { DenunciaForm } from "./denuncia-form"
import { FeatureCards } from "./feature-cards"
import { useToast } from "@/components/ui/use-toast"
import { denunciasPublicService } from "@/lib/directus"
import { DenunciaModal } from "@/components/modal/denuncia-modal"

const formSchema = z.object({
  denunciante: z.object({
    anonimo: z.boolean().default(false),
    datosDenunciante: z
      .object({
        nombre: z.string(),
        telefono: z.string(),
        email: z.string(),
        proteccion: z.boolean().default(false),
        domicilioDenunciante: z.object({
          codigoPostal: z.string(),
          calle: z.string(),
          numeroExterior: z.string(),
          numeroInterior: z.string(),
          municipioAlcaldia: z.string(),
        }),
      })
  }),
  ubicacionHecho: z.object({
    lugarHecho: z.object({
      entidad: z.string(),
      entePublico: z.string(),
      calle: z.string(),
      numeroExterior: z.string(),
      numeroInterior: z.string(),
      codigoPostal: z.string(),
      fechaHecho: z.string(),
      horaHecho: z.string(),
    }),
  }),
  personaDenunciada: z.object({
    tipoPersona: z.enum(["SERVIDOR_PUBLICO", "PARTICULAR"]),
    nombre: z.string(),
    apellidoPaterno: z.string(),
    apellidoMaterno: z.string(),
    descripcion: z.string(),
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"confirm" | "success">("confirm")
  const [denunciaId, setDenunciaId] = useState<string>()
  const { toast } = useToast()

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
          calle: "",
          numeroExterior: "",
          numeroInterior: "",
          codigoPostal: "",
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
  })

  const handleSubmitDenuncia = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // Create the denuncia using the service
      const denunciaResult = await denunciasPublicService.createDenuncia({
        ...values,
      })

      // Save the ID and show success modal
      setDenunciaId(denunciaResult.id)
      setModalMode("success")

    } catch (error) {
      console.error('Error al enviar la denuncia:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al enviar tu denuncia. Por favor, intenta nuevamente.",
      })
      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmSubmit = () => {
    setModalMode("success")
    form.handleSubmit(handleSubmitDenuncia)()
  }

  const handleCancelSubmit = () => {
    setIsModalOpen(false)
  }

  const handleCloseSuccess = () => {
    setIsModalOpen(false)
    setCurrentStep(-1)
    form.reset()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault()
          setModalMode("confirm")
          setIsModalOpen(true)
        }} className="space-y-8">
          {currentStep === -1 ? (
            <WelcomeStep onNext={() => setCurrentStep(0)} />
          ) : (
            <DenunciaForm
              form={form}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isSubmitting={isSubmitting}
              onBackToWelcome={() => setCurrentStep(-1)}
            />
          )}
        </form>
      </Form>

      <DenunciaModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        denunciaId={denunciaId}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        onClose={handleCloseSuccess}
      />

      <FeatureCards />
    </div>
  )
}

export default MultiStepDenunciaForm
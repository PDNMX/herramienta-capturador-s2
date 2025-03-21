//@ts-nocheck
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react"
import { StepContent } from "./step-content"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { stepIcons } from "./step-icons"
import { Form } from "@/components/ui/form"
import { denunciasPublicService } from "@/lib/directus"
import { HelpContent } from "./help-content"
import { DenunciaModal } from "@/components/modal/denuncia-modal"

const formSchema = z.object({
  denunciante: z
    .object({
      anonimo: z.boolean().default(false),
      datosDenunciante: z
        .object({
          nombre: z.string().optional(),
          telefono: z.string().optional(),
          email: z.string().optional(),
          proteccion: z.boolean().default(false),
          razonesProteccion: z.string().optional(),
          domicilioDenunciante: z
            .object({
              codigoPostal: z.string().optional(),
              calle: z.string().optional(),
              numeroExterior: z.string().optional(),
              numeroInterior: z.string().optional(),
              municipioAlcaldia: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),

  ubicacionHecho: z
    .object({
      lugarHecho: z
        .object({
          entidad: z.number().optional(),
          entePublico: z.number().optional(),
          calle: z.string().optional(),
          numeroExterior: z.string().optional(),
          numeroInterior: z.string().optional(),
          codigoPostal: z.string().optional(),
          fechaHecho: z.string().optional(),
          horaHecho: z.string().optional(),
        })
        .optional(),
    })
    .optional(),

  personaDenunciada: z
    .object({
      tipoPersona: z.enum(["SERVIDOR_PUBLICO", "PARTICULAR"]).optional(),
      nombre: z.string().optional(),
      apellidoPaterno: z.string().optional(),
      apellidoMaterno: z.string().optional(),
      descripcion: z.string().optional(),
    })
    .optional(),

  faltaCometida: z
    .object({
      faltaGrave: z.array(z.number()).default([]),
      faltaNoGrave: z.array(z.number()).default([]),
      hechosCorrupcion: z.array(z.number()).default([]),
    })
    .optional(),

  narracionHechos: z.string().optional(),
  archivosEvidencia: z.array(z.any()).default([]),
})

const steps = [
  { title: "Datos del Denunciante", icon: "denunciante" },
  { title: "Ubicación del Hecho", icon: "ubicacion" },
  { title: "Persona Denunciada", icon: "persona" },
  { title: "Hechos y Faltas Cometidas", icon: "faltas" },
]

export function MultiStepForm() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const totalSteps = steps.length
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"confirm" | "success">("confirm")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [denunciaId, setDenunciaId] = React.useState<string | undefined>(undefined)

  // Corrección para los defaultValues en el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      denunciante: {
        anonimo: false,
        datosDenunciante: {
          nombre: "",
          telefono: "",
          email: "",
          proteccion: false,
          razonesProteccion: "", // Valor por defecto para el nuevo campo
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
          entidad: undefined, // Cambiado de "" a undefined para campos numéricos
          entePublico: undefined, // Cambiado de "" a undefined para campos numéricos
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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const handleNextStep = async () => {
    const fields = Object.keys(form.getValues())
    const currentStepFields = fields.filter((field) => {
      const fieldStep = getFieldStep(field)
      return fieldStep === step
    })

    const isStepValid = await form.trigger(currentStepFields as any)

    if (isStepValid) {
      if (step === totalSteps - 1) {
        setIsModalOpen(true)
        setModalMode("confirm")
      } else {
        nextStep()
      }
    }
  }

  const getFieldStep = (field: string) => {
    // Implementa la lógica para determinar a qué paso pertenece cada campo
    // Esto es un ejemplo, ajústalo según la estructura de tu formulario
    if (field.startsWith("denunciante")) return 0
    if (field.startsWith("ubicacionHecho")) return 1
    if (field.startsWith("personaDenunciada")) return 2
    if (field.startsWith("faltaCometida")) return 3
    if (field.startsWith("narracionHechos") || field.startsWith("archivosEvidencia")) return 4
    return -1
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (step === totalSteps - 1) {
      setIsModalOpen(true)
      setModalMode("confirm")
    }
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await denunciasPublicService.createDenuncia(form.getValues())
      setDenunciaId(result.id)
      setModalMode("success")
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsModalOpen(false)
      // Maneja el error apropiadamente, por ejemplo, muestra un mensaje de error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    if (modalMode === "success") {
      router.push("/")
    }
  }

  const progress = ((step + 1) / totalSteps) * 100

  return (
    <Form {...form}>
      <div className="w-full gradient-background shadow-md rounded-lg overflow-hidden flex flex-col">
        <div className="border-b">
          <div className="container mx-auto px-4 py-4 md:py-6">
            {/* Header section with title and help button */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold foregroundy">{steps[step].title}</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </SheetTrigger>
                <HelpContent step={step} />
              </Sheet>
            </div>

            {/* Navigation buttons and progress section */}
            <div className="space-y-4">
              {/* Step indicators for larger screens */}
              <div className="hidden md:flex justify-center space-x-2 mb-2">
                {steps.map((s, index) => {
                  const Icon = stepIcons[s.icon as keyof typeof stepIcons]
                  return (
                    <div key={index} className="flex flex-col items-center group">
                      <Button
                        type="button"
                        variant="ghost"
                        className={`w-10 h-10 p-0 rounded-full flex items-center justify-center transition-colors duration-200 ${
                          index === step
                            ? "bg-primary text-primary-foreground"
                            : index < step
                              ? "bg-primary/80 text-primary-foreground hover:bg-primary"
                              : "bg-muted/90 text-muted-foreground pointer-events-none"
                        }`}
                        onClick={() => index < step && setStep(index)}
                        disabled={index >= step}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                      <span className="text-xs mt-1 text-center hidden md:block max-w-[80px] truncate">{s.title}</span>
                      {index < steps.length - 1 && (
                        <div className="hidden md:block h-[2px] w-8 bg-muted absolute left-[calc(100%+0.5rem)] top-5" />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="relative">
                <Progress value={progress} className="h-2" />

                {/* Step indicators for mobile - dots only */}
                <div className="flex md:hidden justify-center space-x-2 mt-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === step ? "bg-primary" : index < step ? "bg-primary/80" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={step === 0 ? () => router.push("/") : prevStep}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{step === 0 ? "Regresar" : "Anterior"}</span>
                  <span className="sm:hidden">{step === 0 ? "Inicio" : "Atrás"}</span>
                </Button>

                {/* Current step indicator for mobile */}
                <div className="text-sm font-medium">
                  {step + 1}/{totalSteps}
                </div>

                <Button type="button" size="sm" className="h-9" onClick={handleNextStep} disabled={isSubmitting}>
                  <span className="hidden sm:inline">
                    {step === totalSteps - 1 ? (isSubmitting ? "Enviando..." : "Enviar") : "Siguiente"}
                  </span>
                  <span className="sm:hidden">
                    {step === totalSteps - 1 ? (isSubmitting ? "..." : "Enviar") : "Sig."}
                  </span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="flex flex-col justify-between min-h-[calc(100vh-220px)]">
          <div className="container mx-auto px-4 py-6 md:py-8 overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <StepContent step={step} form={form} />
            </form>
          </div>

          {/* Footer with helpful text */}
          <div className="border-t mt-auto">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>Complete todos los campos requeridos</p>
                <p className="mt-1 sm:mt-0">
                  Paso {step + 1} de {totalSteps}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DenunciaModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        denunciaId={denunciaId}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsModalOpen(false)}
        onClose={handleModalClose}
      />
    </Form>
  )
}


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
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"confirm" | "success">("confirm")
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
  });

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
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold foregroundy">{steps[step].title}</h2>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <HelpContent step={step} />
              </Sheet>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        <div className="flex flex-col justify-between min-h-[calc(100vh-180px)]">
          <div className="container mx-auto px-4 py-8 mb-4 overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <StepContent step={step} form={form} />
            </form>
          </div>
          <div className="border-t">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0 || isSubmitting}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
                <div className="flex space-x-2 order-first sm:order-none mb-2 sm:mb-0">
                  {steps.map((s, index) => {
                    const Icon = stepIcons[s.icon as keyof typeof stepIcons]
                    return (
                      <div
                        key={index}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${index === step
                            ? "bg-primary text-primary-foreground"
                            : index < step
                              ? "bg-primary/50 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    )
                  })}
                </div>
                <Button type="button" onClick={handleNextStep} disabled={isSubmitting} className="w-full sm:w-auto">
                  {step === totalSteps - 1 ? (isSubmitting ? "Enviando..." : "Enviar") : "Siguiente"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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

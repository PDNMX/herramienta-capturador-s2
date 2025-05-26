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
import { toast } from "@/components/ui/use-toast"

// Modificado el esquema para usar "testigo" en singular en lugar de "testigos"
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
      codigoPostal: z.string().optional(),
      calle: z.string().optional(),
      numero: z.string().optional(),
      ciudad: z.string().optional(),
      estado: z.string().optional(),
      pais: z.string().optional(),
      otrasReferencias: z.string().optional(),
      fechaHecho: z.string().optional(),
      horaHecho: z.string().optional(),
    })
    .optional(),

  personaDenunciada: z
    .object({
      entidad: z.number().optional(),
      entePublico: z.number().optional(),
      tipoPersona: z.enum(["SERVIDOR_PUBLICO", "PARTICULAR"]).optional(),
      nombre: z.string().optional(),
      apellidos: z.string().optional(),
      genero: z.enum(["MASCULINO", "FEMENINO", "NO_BINARIO"]).optional(),
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

  // Cambiado de "testigos" a "testigo" para coincidir con tu esquema
  testigo: z.boolean().optional(),

  datosTestigos: z
    .array(
      z.object({
        nombre: z.string().optional(),
        contacto: z.string().optional(),
      }),
    )
    .optional(),
})

const steps = [
  { title: "Datos del Denunciante", icon: "denunciante" },
  { title: "Datos de los Hechos", icon: "ubicacion" },
  { title: "Datos de la Persona Denunciada", icon: "persona" },
  { title: "Hechos y Faltas Cometidas", icon: "faltas" },
  { title: "Pruebas y Testigos", icon: "pruebas" },
]

export function MultiStepForm() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const totalSteps = steps.length
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"confirm" | "success">("confirm")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [denunciaId, setDenunciaId] = React.useState<string | undefined>(undefined)
  const [uploadProgress, setUploadProgress] = React.useState(0) // Estado para el progreso de carga

  // Corregido: defaultValues para el formulario con estructura anidada completa
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
          razonesProteccion: "",
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
        codigoPostal: "",
        calle: "",
        numero: "",
        ciudad: "",
        estado: "",
        pais: "México", // Valor por defecto
        otrasReferencias: "",
        fechaHecho: "",
        horaHecho: "",
      },
      personaDenunciada: {
        entidad: undefined,
        entePublico: undefined,
        tipoPersona: "SERVIDOR_PUBLICO",
        nombre: "",
        apellidos: "",
        genero: undefined,
        descripcion: "",
      },
      faltaCometida: {
        faltaGrave: [],
        faltaNoGrave: [],
        hechosCorrupcion: [],
      },
      narracionHechos: "",
      archivosEvidencia: [],
      testigo: false, // Cambiado a singular
      datosTestigos: [],
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
    if (field.startsWith("denunciante")) return 0
    if (field.startsWith("ubicacionHecho")) return 1
    if (field.startsWith("personaDenunciada")) return 2
    if (field.startsWith("faltaCometida") || field.startsWith("narracionHechos")) return 3
    if (field.startsWith("archivosEvidencia") || field.startsWith("testigo") || field.startsWith("datosTestigos"))
      return 4
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
      // Obtenemos los valores completos del formulario
      const formValues = form.getValues()

      // Registro para depuración
      console.log("Valores del formulario que se envían:", JSON.stringify(formValues, null, 2))

      // 1. Primero subimos los archivos de evidencia (solo si son objetos File)
      const archivosFiles = formValues.archivosEvidencia || []
      let archivoIds = []

      // Verificar si hay archivos por subir (objetos File)
      const archivosParaSubir = archivosFiles.filter((archivo) => archivo instanceof File)

      if (archivosParaSubir.length > 0) {
        toast({
          title: "Subiendo archivos",
          description: `Iniciando la subida de ${archivosParaSubir.length} archivo(s)`,
          variant: "default",
        })

        // Subir los archivos uno por uno y recopilar sus IDs
        setUploadProgress(0)
        let filesCompleted = 0

        for (const file of archivosParaSubir) {
          try {
            // Actualizar el progreso para este archivo
            const currentProgress = Math.round((filesCompleted / archivosParaSubir.length) * 100)
            setUploadProgress(currentProgress)

            // Subir el archivo
            const result = await denunciasPublicService.uploadEvidencia(file)

            // MODIFICADO: Guardar solo el ID del archivo (verificar que existe)
            if (result && result.id) {
              archivoIds.push(result.id)
              console.log(`Archivo ${file.name} subido con ID: ${result.id}`)
            } else {
              console.error(`No se pudo obtener el ID para el archivo ${file.name}`, result)
              toast({
                title: "Error al procesar archivo",
                description: `El archivo ${file.name} se subió pero no se pudo obtener su ID`,
                variant: "destructive",
              })
            }

            // Incrementar contador y actualizar progreso
            filesCompleted++
            setUploadProgress(Math.round((filesCompleted / archivosParaSubir.length) * 100))
          } catch (error) {
            console.error(`Error al subir archivo ${file.name}:`, error)
            toast({
              title: "Error al subir archivo",
              description: `No se pudo subir el archivo ${file.name}: ${error.message || "Error desconocido"}`,
              variant: "destructive",
            })
          }
        }

        if (archivoIds.length > 0) {
          toast({
            title: "Archivos subidos correctamente",
            description: `${archivoIds.length} de ${archivosParaSubir.length} archivos subidos con éxito`,
            variant: "default",
          })
        } else {
          toast({
            title: "Error en la subida de archivos",
            description: "No se pudo procesar ningún archivo correctamente",
            variant: "destructive",
          })
        }
      } else {
        console.log("No hay archivos para subir o los archivos no son objetos File válidos")
      }

      // Imprimir los IDs de archivos que se van a enviar
      console.log("IDs de archivos a enviar:", archivoIds)

      // MODIFICADO: Asegurarnos de que archivoIds es siempre un array
      if (!Array.isArray(archivoIds)) {
        archivoIds = []
      }

      // 2. Preparar datos de testigos
      const hayTestigos = Boolean(formValues.testigo)

      // Si hay testigos pero no hay datos, inicializamos un array vacío
      let datosTestigos = null

      if (hayTestigos && Array.isArray(formValues.datosTestigos) && formValues.datosTestigos.length > 0) {
        datosTestigos = formValues.datosTestigos
          .filter((testigo) => testigo && (testigo.nombre || testigo.contacto))
          .map((testigo) => ({
            nombre: testigo.nombre || "",
            contacto: testigo.contacto || "",
          }))

        // Si después de filtrar no quedan testigos, establecer a null
        if (datosTestigos.length === 0) {
          datosTestigos = null
        }
      }

      // 3. Preparar el objeto final para enviar
      const validatedValues = {
        ...formValues,
        // Asegurarse de que ubicacionHecho tenga todos sus campos
        ubicacionHecho: {
          codigoPostal: formValues.ubicacionHecho?.codigoPostal || "",
          calle: formValues.ubicacionHecho?.calle || "",
          numero: formValues.ubicacionHecho?.numero || "",
          ciudad: formValues.ubicacionHecho?.ciudad || "",
          estado: formValues.ubicacionHecho?.estado || "",
          pais: formValues.ubicacionHecho?.pais || "",
          otrasReferencias: formValues.ubicacionHecho?.otrasReferencias || "",
          fechaHecho: formValues.ubicacionHecho?.fechaHecho || "",
          horaHecho: formValues.ubicacionHecho?.horaHecho || "",
        },
        // Asegurarse de que personaDenunciada tenga los valores correctos
        personaDenunciada: {
          ...formValues.personaDenunciada,
          // Convertir a número o null para los campos de ID
          entidad: formValues.personaDenunciada?.entidad ? Number(formValues.personaDenunciada.entidad) : null,
          entePublico: formValues.personaDenunciada?.entePublico
            ? Number(formValues.personaDenunciada.entePublico)
            : null,
        },
        // Asegurar que los arrays siempre estén inicializados
        faltaCometida: {
          faltaGrave: formValues.faltaCometida?.faltaGrave || [],
          faltaNoGrave: formValues.faltaCometida?.faltaNoGrave || [],
          hechosCorrupcion: formValues.faltaCometida?.hechosCorrupcion || [],
        },
        // MODIFICADO: Usar archivoIds en lugar de formValues.archivosEvidencia
        archivosEvidencia: archivoIds,
        // Asegurar que testigo sea un booleano
        testigo: hayTestigos,
        // Usar los datos de testigos limpios
        datosTestigos: datosTestigos,
      }

      // Log para depuración
      console.log("Datos validados para enviar:", JSON.stringify(validatedValues, null, 2))

      // Mostrar toast de envío
      toast({
        title: "Enviando denuncia",
        description: "Su denuncia está siendo procesada...",
        variant: "default",
      })

      // Enviar los datos validados
      const result = await denunciasPublicService.createDenuncia(validatedValues)

      // En caso de éxito, mostrar toast y actualizar estado
      toast({
        title: "Denuncia enviada",
        description: "Su denuncia ha sido recibida correctamente.",
        variant: "default",
      })

      setDenunciaId(result.id)
      setModalMode("success")
    } catch (error) {
      console.error("Error al enviar el formulario:", error)

      // Mostrar toast de error
      toast({
        title: "Error al enviar denuncia",
        description: error.message || "Ha ocurrido un error al procesar su denuncia. Intente nuevamente.",
        variant: "destructive",
      })

      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
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
                        className={`m-3 w-12 h-12 p-0 rounded-full flex items-center justify-center transition-colors duration-200 ${
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
            <div className="mb-4 text-sm text-muted-foreground">
              <span className="text-red-500">*</span> Campos obligatorios
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <StepContent step={step} form={form} />
            </form>
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
        // Información de progreso de carga
        uploadProgress={uploadProgress}
        isUploading={isSubmitting && uploadProgress > 0 && uploadProgress < 100}
      />
    </Form>
  )
}

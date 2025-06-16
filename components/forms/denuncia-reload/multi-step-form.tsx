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
import { denunciasPublicService, catalogosUbicacionService } from "@/lib/directus"
import { HelpContent } from "./help-content"
import { DenunciaModal } from "@/components/modal/denuncia-modal"
import { toast } from "@/components/ui/use-toast"

// Esquema modificado con validaciones mejoradas
const formSchema = z
  .object({
    denunciante: z
      .object({
        anonimo: z.boolean().default(false),
        datosDenunciante: z
          .object({
            nombre: z.string()
              .min(2, "El nombre debe tener al menos 2 caracteres")
              .max(100, "El nombre no puede exceder 100 caracteres")
              .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, "El nombre solo puede contener letras y espacios")
              .refine(val => val.trim().split(/\s+/).length >= 2, "Debe incluir nombre y al menos un apellido")
              .optional(),
            telefono: z.string()
              .regex(/^\d{10}$/, "El teléfono debe contener exactamente 10 dígitos")
              .refine(val => !val.startsWith('0'), "El teléfono no puede comenzar con 0")
              .optional(),
            email: z.string()
              .email("Ingrese un correo electrónico válido")
              .max(254, "El correo electrónico es demasiado largo")
              .optional(),
            proteccion: z.boolean().default(false),
            razonesProteccion: z.string()
              .max(1000, "Las razones no pueden exceder 1000 caracteres")
              .optional(),
            domicilioDenunciante: z
              .object({
                entidad: z.number().optional(),
                municipio: z.number().optional(),
                codigoPostal: z.string()
                  .regex(/^\d{5}$/, "El código postal debe contener exactamente 5 dígitos")
                  .optional(),
                calle: z.string()
                  .min(3, "La calle debe tener al menos 3 caracteres")
                  .max(100, "La calle no puede exceder 100 caracteres")
                  .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\d\.\-#]+$/, "La calle contiene caracteres no válidos")
                  .optional(),
                numeroExterior: z.string()
                  .min(1, "El número exterior es obligatorio")
                  .max(10, "El número exterior no puede exceder 10 caracteres")
                  .regex(/^[a-zA-Z\d\-#]+$/, "El número exterior contiene caracteres no válidos")
                  .optional(),
                numeroInterior: z.string()
                  .max(10, "El número interior no puede exceder 10 caracteres")
                  .regex(/^[a-zA-Z\d\-#]*$/, "El número interior contiene caracteres no válidos")
                  .optional(),
                municipioAlcaldia: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),

    ubicacionHecho: z
      .object({
        codigoPostal: z.string()
          .regex(/^\d{5}$/, "El código postal debe contener exactamente 5 dígitos")
          .optional(),
        calle: z.string()
          .min(3, "La calle debe tener al menos 3 caracteres")
          .max(100, "La calle no puede exceder 100 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\d\.\-#]*$/, "La calle contiene caracteres no válidos")
          .optional(),
        numero: z.string()
          .min(1, "El número es obligatorio")
          .max(10, "El número no puede exceder 10 caracteres")
          .regex(/^[a-zA-Z\d\-#]*$/, "El número contiene caracteres no válidos")
          .optional(),
        ciudad: z.string()
          .min(2, "La ciudad debe tener al menos 2 caracteres")
          .max(50, "La ciudad no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "La ciudad solo puede contener letras y espacios")
          .optional(),
        estado: z.string()
          .min(2, "El estado debe tener al menos 2 caracteres")
          .max(50, "El estado no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El estado solo puede contener letras y espacios")
          .optional(),
        pais: z.string()
          .min(2, "El país debe tener al menos 2 caracteres")
          .max(50, "El país no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El país solo puede contener letras y espacios")
          .optional(),
        otrasReferencias: z.string()
          .max(500, "Las referencias no pueden exceder 500 caracteres")
          .optional(),
        fechaHecho: z.string()
          .min(1, "La fecha del hecho es obligatoria")
          .refine(val => {
            const fecha = new Date(val);
            const hoy = new Date();
            hoy.setHours(23, 59, 59, 999); // Permitir fechas de hoy
            return fecha <= hoy;
          }, "La fecha no puede ser futura"),
        horaHecho: z.string()
          .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)")
          .optional(),
      })
      .optional(),

    personaDenunciada: z
      .object({
        entidad: z.number().min(1, "Debe seleccionar una entidad federativa").optional(),
        entePublico: z.number().optional(),
        tipoPersona: z.enum(["SERVIDOR_PUBLICO", "PARTICULAR"], {
          required_error: "Debe seleccionar el tipo de persona",
        }),
        nombre: z.string()
          .max(50, "El nombre no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El nombre solo puede contener letras y espacios")
          .optional(),
        apellidos: z.string()
          .max(50, "Los apellidos no pueden exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "Los apellidos solo pueden contener letras y espacios")
          .optional(),
        genero: z.enum(["MASCULINO", "FEMENINO", "NO_BINARIO"]).optional(),
        descripcion: z.string()
          .max(1000, "La descripción no puede exceder 1000 caracteres")
          .optional(),
      })
      .optional(),

    faltaCometida: z
      .object({
        faltaGrave: z.array(z.number()).default([]),
        faltaNoGrave: z.array(z.number()).default([]),
        hechosCorrupcion: z.array(z.number()).default([]),
      })
      .optional(),

    narracionHechos: z.string()
      .min(10, "La narración debe tener al menos 10 caracteres")
      .max(5000, "La narración no puede exceder 5000 caracteres"),

    archivosEvidencia: z.array(z.any()).default([]),

    testigo: z.boolean().optional(),

    datosTestigos: z
      .array(
        z.object({
          nombre: z.string()
            .min(2, "El nombre del testigo debe tener al menos 2 caracteres")
            .max(100, "El nombre del testigo no puede exceder 100 caracteres")
            .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El nombre solo puede contener letras y espacios")
            .optional(),
          contacto: z.string()
            .min(10, "El contacto debe tener al menos 10 caracteres")
            .max(100, "El contacto no puede exceder 100 caracteres")
            .refine(val => {
              if (!val || val.trim().length === 0) return true;
              // Validar si es teléfono (10 dígitos) o email
              const phoneRegex = /^\d{10}$/;
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return phoneRegex.test(val) || emailRegex.test(val);
            }, "Debe ser un teléfono de 10 dígitos o un email válido")
            .optional(),
        }),
      )
      .optional(),
  })
  // Refinamiento para validaciones condicionales
  .refine(
    (data) => {
      // Si no es anónimo, validar campos obligatorios del denunciante
      if (data.denunciante && !data.denunciante.anonimo) {
        const datosDenunciante = data.denunciante.datosDenunciante
        if (!datosDenunciante) return false

        // Campos obligatorios cuando no es anónimo
        if (!datosDenunciante.nombre || datosDenunciante.nombre.trim().length < 2) return false
        if (!datosDenunciante.telefono || !/^\d{10}$/.test(datosDenunciante.telefono)) return false

        // Validar domicilio obligatorio
        const domicilio = datosDenunciante.domicilioDenunciante
        if (!domicilio) return false
        if (!domicilio.calle || domicilio.calle.trim().length < 3) return false
        if (!domicilio.numeroExterior || domicilio.numeroExterior.trim().length < 1) return false
        if (!domicilio.entidad || domicilio.entidad <= 0) return false
        if (!domicilio.municipio || domicilio.municipio <= 0) return false
        if (!domicilio.codigoPostal || !/^\d{5}$/.test(domicilio.codigoPostal)) return false
      }
      return true
    },
    {
      message:
        "Cuando no es anónimo, los campos de nombre completo, teléfono, calle, número exterior, entidad, municipio y código postal son obligatorios",
      path: ["denunciante"],
    },
  )

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
  const [uploadProgress, setUploadProgress] = React.useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validar en tiempo real
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
            entidad: undefined,
            municipio: undefined,
            codigoPostal: "",
            calle: "",
            numeroExterior: "",
            numeroInterior: "",
            municipioAlcaldia: "", // Campo legacy para compatibilidad
          },
        },
      },
      ubicacionHecho: {
        codigoPostal: "",
        calle: "",
        numero: "",
        ciudad: "",
        estado: "",
        pais: "México",
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
      testigo: false,
      datosTestigos: [],
    },
  })

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  // Función para obtener los campos que deben validarse en cada paso - ACTUALIZADA
  const getStepFields = (stepIndex: number): string[] => {
    switch (stepIndex) {
      case 0: // Datos del Denunciante
        const isAnonymous = form.getValues("denunciante.anonimo")
        if (isAnonymous) {
          return ["denunciante.anonimo"]
        } else {
          return [
            "denunciante.anonimo",
            "denunciante.datosDenunciante.nombre",
            "denunciante.datosDenunciante.telefono",
            "denunciante.datosDenunciante.domicilioDenunciante.entidad",
            "denunciante.datosDenunciante.domicilioDenunciante.municipio",
            "denunciante.datosDenunciante.domicilioDenunciante.calle",
            "denunciante.datosDenunciante.domicilioDenunciante.numeroExterior",
            "denunciante.datosDenunciante.domicilioDenunciante.codigoPostal",
          ]
        }
      case 1: // Ubicación del Hecho
        return ["ubicacionHecho.fechaHecho"]
      case 2: // Persona Denunciada
        return ["personaDenunciada.tipoPersona", "personaDenunciada.entidad"]
      case 3: // Faltas y Narración
        return ["narracionHechos"]
      case 4: // Pruebas y Testigos
        return [] // No hay campos obligatorios en este paso
      default:
        return []
    }
  }

  // Función para validar un paso específico - ACTUALIZADA
  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const fieldsToValidate = getStepFields(stepIndex)

    if (fieldsToValidate.length === 0) {
      return true // No hay campos que validar
    }

    // Validar campos específicos del paso
    const isValid = await form.trigger(fieldsToValidate as any)

    // Validaciones adicionales personalizadas ACTUALIZADAS
    if (stepIndex === 0) {
      const isAnonymous = form.getValues("denunciante.anonimo")
      if (!isAnonymous) {
        // Validar campos obligatorios manualmente
        const nombre = form.getValues("denunciante.datosDenunciante.nombre")
        const telefono = form.getValues("denunciante.datosDenunciante.telefono")
        const entidad = form.getValues("denunciante.datosDenunciante.domicilioDenunciante.entidad")
        const municipio = form.getValues("denunciante.datosDenunciante.domicilioDenunciante.municipio")
        const calle = form.getValues("denunciante.datosDenunciante.domicilioDenunciante.calle")
        const numeroExterior = form.getValues("denunciante.datosDenunciante.domicilioDenunciante.numeroExterior")
        const codigoPostal = form.getValues("denunciante.datosDenunciante.domicilioDenunciante.codigoPostal")

        if (!nombre || nombre.trim().length < 2) {
          form.setError("denunciante.datosDenunciante.nombre", {
            message: "El nombre completo es obligatorio (mínimo 2 caracteres)",
          })
          return false
        }

        if (!telefono || telefono.trim().length < 10) {
          form.setError("denunciante.datosDenunciante.telefono", {
            message: "El teléfono es obligatorio (mínimo 10 caracteres)",
          })
          return false
        }

        if (!entidad || entidad <= 0) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.entidad", {
            message: "La entidad federativa es obligatoria",
          })
          return false
        }

        if (!municipio || municipio <= 0) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.municipio", {
            message: "El municipio o alcaldía es obligatorio",
          })
          return false
        }

        if (!calle || calle.trim().length < 3) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.calle", {
            message: "La calle es obligatoria (mínimo 3 caracteres)",
          })
          return false
        }

        if (!numeroExterior || numeroExterior.trim().length < 1) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.numeroExterior", {
            message: "El número exterior es obligatorio",
          })
          return false
        }

        if (!codigoPostal || codigoPostal.trim().length < 5) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.codigoPostal", {
            message: "El código postal es obligatorio (mínimo 5 caracteres)",
          })
          return false
        }
      }
    }

    return isValid
  }

  const handleNextStep = async () => {
    // Validar el paso actual antes de continuar
    const isStepValid = await validateStep(step)

    if (!isStepValid) {
      // Mostrar toast con error
      toast({
        title: "Campos incompletos",
        description: "Por favor, complete todos los campos obligatorios antes de continuar.",
        variant: "destructive",
      })
      return
    }

    if (step === totalSteps - 1) {
      setIsModalOpen(true)
      setModalMode("confirm")
    } else {
      nextStep()
      // Mostrar toast de éxito al avanzar
      toast({
        title: "Paso completado",
        description: "Puede continuar al siguiente paso.",
        variant: "default",
      })
    }
  }

  const getFieldStep = (field: string) => {
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
      const formValues = form.getValues()

      console.log("Valores del formulario que se envían:", JSON.stringify(formValues, null, 2))

      const archivosFiles = formValues.archivosEvidencia || []
      let archivoIds = []

      const archivosParaSubir = archivosFiles.filter((archivo) => archivo instanceof File)

      if (archivosParaSubir.length > 0) {
        toast({
          title: "Subiendo archivos",
          description: `Iniciando la subida de ${archivosParaSubir.length} archivo(s)`,
          variant: "default",
        })

        setUploadProgress(0)
        let filesCompleted = 0

        for (const file of archivosParaSubir) {
          try {
            const currentProgress = Math.round((filesCompleted / archivosParaSubir.length) * 100)
            setUploadProgress(currentProgress)

            const result = await denunciasPublicService.uploadEvidencia(file)

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

      console.log("IDs de archivos a enviar:", archivoIds)

      if (!Array.isArray(archivoIds)) {
        archivoIds = []
      }

      const hayTestigos = Boolean(formValues.testigo)

      let datosTestigos = null

      if (hayTestigos && Array.isArray(formValues.datosTestigos) && formValues.datosTestigos.length > 0) {
        datosTestigos = formValues.datosTestigos
          .filter((testigo) => testigo && (testigo.nombre || testigo.contacto))
          .map((testigo) => ({
            nombre: testigo.nombre || "",
            contacto: testigo.contacto || "",
          }))

        if (datosTestigos.length === 0) {
          datosTestigos = null
        }
      }

      const validatedValues = {
        ...formValues,
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
        personaDenunciada: {
          ...formValues.personaDenunciada,
          entidad: formValues.personaDenunciada?.entidad ? Number(formValues.personaDenunciada.entidad) : null,
          entePublico: formValues.personaDenunciada?.entePublico
            ? Number(formValues.personaDenunciada.entePublico)
            : null,
        },
        faltaCometida: {
          faltaGrave: formValues.faltaCometida?.faltaGrave || [],
          faltaNoGrave: formValues.faltaCometida?.faltaNoGrave || [],
          hechosCorrupcion: formValues.faltaCometida?.hechosCorrupcion || [],
        },
        archivosEvidencia: archivoIds,
        testigo: hayTestigos,
        datosTestigos: datosTestigos,
      }

      console.log("Datos validados para enviar:", JSON.stringify(validatedValues, null, 2))

      toast({
        title: "Enviando denuncia",
        description: "Su denuncia está siendo procesada...",
        variant: "default",
      })

      const result = await denunciasPublicService.createDenuncia(validatedValues)

      toast({
        title: "Denuncia enviada",
        description: "Su denuncia ha sido recibida correctamente.",
        variant: "default",
      })

      setDenunciaId(result.id)
      setModalMode("success")
    } catch (error) {
      console.error("Error al enviar el formulario:", error)

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

            <div className="space-y-4">
              <div className="hidden md:flex justify-center space-x-2 mb-2">
                {steps.map((s, index) => {
                  const Icon = stepIcons[s.icon as keyof typeof stepIcons]
                  return (
                    <div key={index} className="flex flex-col items-center group">
                      <Button
                        type="button"
                        variant="ghost"
                        className={`m-3 w-12 h-12 p-0 rounded-full flex items-center justify-center transition-colors duration-200 ${index === step
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

              <div className="relative">
                <Progress value={progress} className="h-2" />

                <div className="flex md:hidden justify-center space-x-2 mt-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === step ? "bg-primary" : index < step ? "bg-primary/80" : "bg-muted"
                        }`}
                    />
                  ))}
                </div>
              </div>

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
        uploadProgress={uploadProgress}
        isUploading={isSubmitting && uploadProgress > 0 && uploadProgress < 100}
        formData={form.getValues()} // ← NUEVO: Pasar los datos del formulario
      />
    </Form>
  )
}
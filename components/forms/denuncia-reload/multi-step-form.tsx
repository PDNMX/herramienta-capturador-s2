//@ts-nocheck
"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react"
import { StepContent } from "./step-content"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { stepIcons } from "./step-icons"
import { Form } from "@/components/ui/form"
import { denunciasPublicService } from "@/lib/directus"
import { HelpContent } from "./help-content"
import { DenunciaModal } from "@/components/modal/denuncia-modal"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Esquema de validación (mantengo el mismo del archivo original)
const formSchema = z
  .object({
    denunciante: z
      .object({
        anonimo: z.boolean().default(false),
        datosDenunciante: z
          .object({
            nombre: z
              .string()
              .min(2, "El nombre debe tener al menos 2 caracteres")
              .max(100, "El nombre no puede exceder 100 caracteres")
              .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, "El nombre solo puede contener letras y espacios")
              .refine((val) => val.trim().split(/\s+/).length >= 2, "Debe incluir nombre y al menos un apellido")
              .optional(),
            telefono: z
              .string()
              .regex(/^\d{10}$/, "El teléfono debe contener exactamente 10 dígitos")
              .refine((val) => !val.startsWith("0"), "El teléfono no puede comenzar con 0")
              .optional(),
            email: z
              .string()
              .email("Ingrese un correo electrónico válido")
              .max(254, "El correo electrónico es demasiado largo")
              .optional(),
            proteccion: z.boolean().default(false),
            razonesProteccion: z.string().max(1000, "Las razones no pueden exceder 1000 caracteres").optional(),
            domicilioDenunciante: z
              .object({
                entidad: z.number().optional(),
                municipio: z.number().optional(),
                codigoPostal: z
                  .string()
                  .regex(/^\d{5}$/, "El código postal debe contener exactamente 5 dígitos")
                  .optional(),
                calle: z
                  .string()
                  .min(3, "La calle debe tener al menos 3 caracteres")
                  .max(100, "La calle no puede exceder 100 caracteres")
                  .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\d.\-#]+$/, "La calle contiene caracteres no válidos")
                  .optional(),
                numeroExterior: z
                  .string()
                  .min(1, "El número exterior es obligatorio")
                  .max(10, "El número exterior no puede exceder 10 caracteres")
                  .regex(/^[a-zA-Z\d\-#]+$/, "El número exterior contiene caracteres no válidos")
                  .optional(),
                numeroInterior: z
                  .string()
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
        codigoPostal: z
          .string()
          .regex(/^\d{5}$/, "El código postal debe contener exactamente 5 dígitos")
          .optional(),
        calle: z
          .string()
          .min(3, "La calle debe tener al menos 3 caracteres")
          .max(100, "La calle no puede exceder 100 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\d.\-#]*$/, "La calle contiene caracteres no válidos")
          .optional(),
        numero: z
          .string()
          .min(1, "El número es obligatorio")
          .max(10, "El número no puede exceder 10 caracteres")
          .regex(/^[a-zA-Z\d\-#]*$/, "El número contiene caracteres no válidos")
          .optional(),
        ciudad: z
          .string()
          .min(2, "La ciudad debe tener al menos 2 caracteres")
          .max(50, "La ciudad no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "La ciudad solo puede contener letras y espacios")
          .optional(),
        estado: z
          .string()
          .min(2, "El estado debe tener al menos 2 caracteres")
          .max(50, "El estado no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El estado solo puede contener letras y espacios")
          .optional(),
        pais: z
          .string()
          .min(2, "El país debe tener al menos 2 caracteres")
          .max(50, "El país no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El país solo puede contener letras y espacios")
          .optional(),
        otrasReferencias: z.string().max(500, "Las referencias no pueden exceder 500 caracteres").optional(),
        fechaHecho: z
          .string()
          .min(1, "La fecha del hecho es obligatoria")
          .refine((val) => {
            const fecha = new Date(val)
            const hoy = new Date()
            hoy.setHours(23, 59, 59, 999)
            return fecha <= hoy
          }, "La fecha no puede ser futura"),
        horaHecho: z
          .string()
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
        nombre: z
          .string()
          .max(50, "El nombre no puede exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El nombre solo puede contener letras y espacios")
          .optional(),
        apellidos: z
          .string()
          .max(50, "Los apellidos no pueden exceder 50 caracteres")
          .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "Los apellidos solo pueden contener letras y espacios")
          .optional(),
        genero: z.enum(["MASCULINO", "FEMENINO", "NO_BINARIO"]).nullable().optional(),
        descripcion: z.string().max(1000, "La descripción no puede exceder 1000 caracteres").optional(),
      })
      .optional(),

    faltaCometida: z
      .object({
        faltaGrave: z.array(z.number()).default([]),
        faltaNoGrave: z.array(z.number()).default([]),
        hechosCorrupcion: z.array(z.number()).default([]),
      })
      .optional(),

    narracionHechos: z
      .string()
      .min(10, "La narración debe tener al menos 10 caracteres")
      .max(5000, "La narración no puede exceder 5000 caracteres"),

    archivosEvidencia: z.array(z.any()).default([]),

    testigo: z.boolean().optional(),

    datosTestigos: z
      .array(
        z.object({
          nombre: z
            .string()
            .min(2, "El nombre del testigo debe tener al menos 2 caracteres")
            .max(100, "El nombre del testigo no puede exceder 100 caracteres")
            .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "El nombre solo puede contener letras y espacios")
            .optional(),
          contacto: z
            .string()
            .min(10, "El contacto debe tener al menos 10 caracteres")
            .max(100, "El contacto no puede exceder 100 caracteres")
            .refine((val) => {
              if (!val || val.trim().length === 0) return true
              const phoneRegex = /^\d{10}$/
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return phoneRegex.test(val) || emailRegex.test(val)
            }, "Debe ser un teléfono de 10 dígitos o un email válido")
            .optional(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.denunciante && !data.denunciante.anonimo) {
        const datosDenunciante = data.denunciante.datosDenunciante
        if (!datosDenunciante) return false

        if (!datosDenunciante.nombre || datosDenunciante.nombre.trim().length < 2) return false
        if (!datosDenunciante.telefono || !/^\d{10}$/.test(datosDenunciante.telefono)) return false

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
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])
  const [showCustomToast, setShowCustomToast] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
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
        genero: null,
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

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps - 1))
    // Scroll suave al inicio del contenido
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
    // Scroll suave al inicio del contenido
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const getStepFields = (stepIndex: number): string[] => {
    switch (stepIndex) {
      case 0:
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
      case 1:
        return ["ubicacionHecho.fechaHecho"]
      case 2:
        return ["personaDenunciada.tipoPersona", "personaDenunciada.entidad"]
      case 3:
        return ["narracionHechos"]
      case 4:
        return []
      default:
        return []
    }
  }

  const getFieldDisplayName = (fieldPath: string): string => {
    const fieldNames: Record<string, string> = {
      "denunciante.datosDenunciante.nombre": "Nombre completo",
      "denunciante.datosDenunciante.telefono": "Teléfono",
      "denunciante.datosDenunciante.domicilioDenunciante.entidad": "Entidad federativa",
      "denunciante.datosDenunciante.domicilioDenunciante.municipio": "Municipio/Alcaldía",
      "denunciante.datosDenunciante.domicilioDenunciante.calle": "Calle",
      "denunciante.datosDenunciante.domicilioDenunciante.numeroExterior": "Número exterior",
      "denunciante.datosDenunciante.domicilioDenunciante.codigoPostal": "Código postal",
      "ubicacionHecho.fechaHecho": "Fecha del hecho",
      "personaDenunciada.tipoPersona": "Tipo de persona",
      "personaDenunciada.entidad": "Entidad federativa de la persona denunciada",
      narracionHechos: "Narración de los hechos",
    }
    return fieldNames[fieldPath] || fieldPath
  }

  const validateStep = async (stepIndex: number): Promise<{ isValid: boolean; errors: string[] }> => {
    const fieldsToValidate = getStepFields(stepIndex)

    if (fieldsToValidate.length === 0) {
      return { isValid: true, errors: [] }
    }

    const isValid = await form.trigger(fieldsToValidate as any)
    const errors: string[] = []

    if (stepIndex === 0) {
      const isAnonymous = form.getValues("denunciante.anonimo")
      if (!isAnonymous) {
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
          errors.push("Nombre completo")
        }

        if (!telefono || telefono.trim().length < 10) {
          form.setError("denunciante.datosDenunciante.telefono", {
            message: "El teléfono es obligatorio (mínimo 10 caracteres)",
          })
          errors.push("Teléfono")
        }

        if (!entidad || entidad <= 0) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.entidad", {
            message: "La entidad federativa es obligatoria",
          })
          errors.push("Entidad federativa")
        }

        if (!municipio || municipio <= 0) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.municipio", {
            message: "El municipio o alcaldía es obligatorio",
          })
          errors.push("Municipio/Alcaldía")
        }

        if (!calle || calle.trim().length < 3) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.calle", {
            message: "La calle es obligatoria (mínimo 3 caracteres)",
          })
          errors.push("Calle")
        }

        if (!numeroExterior || numeroExterior.trim().length < 1) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.numeroExterior", {
            message: "El número exterior es obligatorio",
          })
          errors.push("Número exterior")
        }

        if (!codigoPostal || codigoPostal.trim().length < 5) {
          form.setError("denunciante.datosDenunciante.domicilioDenunciante.codigoPostal", {
            message: "El código postal es obligatorio (mínimo 5 caracteres)",
          })
          errors.push("Código postal")
        }
      }
    }

    if (stepIndex === 1) {
      const fechaHecho = form.getValues("ubicacionHecho.fechaHecho")
      if (!fechaHecho || fechaHecho.trim().length === 0) {
        errors.push("Fecha del hecho")
      }
    }

    if (stepIndex === 2) {
      const tipoPersona = form.getValues("personaDenunciada.tipoPersona")
      const entidad = form.getValues("personaDenunciada.entidad")

      if (!tipoPersona) {
        errors.push("Tipo de persona")
      }
      if (!entidad || entidad <= 0) {
        errors.push("Entidad federativa de la persona denunciada")
      }
    }

    if (stepIndex === 3) {
      const narracion = form.getValues("narracionHechos")
      if (!narracion || narracion.trim().length < 10) {
        errors.push("Narración de los hechos")
      }
    }

    setValidationErrors(errors) // Mantener para otros usos si es necesario
    return { isValid: isValid && errors.length === 0, errors }
  }

  const handleNextStep = async () => {
    const { isValid: isStepValid, errors: currentErrors } = await validateStep(step)

    if (!isStepValid) {
      // Usar currentErrors directamente en lugar de validationErrors
      toast({
        variant: "destructive",
        description: (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-sm font-medium">Campos obligatorios faltantes:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 ml-6">
              {currentErrors.map((error, index) => (
                <li key={index} className="text-xs text-red-700 dark:text-red-300">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ),
        duration: 10000,
        className:
          "bg-red-50/95 backdrop-blur-sm border-red-200/60 text-red-900 \
     dark:bg-red-950/90 dark:border-red-800/60 dark:text-red-200",
      })
      return
    }

    if (step === totalSteps - 1) {
      setIsModalOpen(true)
      setModalMode("confirm")
    } else {
      nextStep()
      // Eliminar completamente este toast de "Paso completado"
      // toast({
      //   variant: "default",
      //   title: "✅ Paso completado",
      //   description: `Paso ${step + 2}: ${steps[step + 1]?.title}`,
      //   duration: 3000,
      //   className: "bg-green-50/95 backdrop-blur-sm border-green-200/60 text-green-800",
      // })
    }
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

      if (formValues.denunciante) {
        formValues.denunciante.anonimo = Boolean(formValues.denunciante.anonimo || false)
      }

      if (formValues.personaDenunciada) {
        if (!formValues.personaDenunciada.genero || formValues.personaDenunciada.genero === "") {
          formValues.personaDenunciada.genero = null
        }
      }

      console.log("Valores del formulario que se envían:", JSON.stringify(formValues, null, 2))

      const archivosFiles = formValues.archivosEvidencia || []
      let archivoIds = []

      const archivosParaSubir = archivosFiles.filter((archivo) => archivo instanceof File)

      if (archivosParaSubir.length > 0) {
        toast({
          variant: "default",
          title: "📤 Subiendo archivos",
          description: `${archivosParaSubir.length} archivo(s) en proceso...`,
          duration: 3000,
          className: "bg-blue-50/95 backdrop-blur-sm border-blue-200/60 text-blue-800",
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
                variant: "destructive",
                title: "❌ Error al procesar archivo",
                description: `El archivo ${file.name} se subió pero no se pudo obtener su ID`,
                action: <ToastAction altText="Reintentar">Continuar</ToastAction>,
                duration: 5000,
                className:
                  "bg-red-50/95 backdrop-blur-sm border-red-200/60 text-red-900 \
           dark:bg-red-950/90 dark:border-red-800/60 dark:text-red-200",
              })
            }

            filesCompleted++
            setUploadProgress(Math.round((filesCompleted / archivosParaSubir.length) * 100))
          } catch (error) {
            console.error(`Error al subir archivo ${file.name}:`, error)
            toast({
              variant: "destructive",
              title: "❌ Error al subir archivo",
              description: `No se pudo subir ${file.name}: ${error.message || "Error desconocido"}`,
              action: <ToastAction altText="Reintentar">Reintentar</ToastAction>,
              duration: 6000,
              className:
                "bg-red-50/95 backdrop-blur-sm border-red-200/60 text-red-900 \
           dark:bg-red-950/90 dark:border-red-800/60 dark:text-red-200",
            })
          }
        }

        if (archivoIds.length > 0) {
          toast({
            variant: "default",
            title: "✅ Archivos procesados",
            description: `${archivoIds.length}/${archivosParaSubir.length} archivos subidos exitosamente`,
            duration: 4000,
            className: "bg-green-50/95 backdrop-blur-sm border-green-200/60 text-green-800",
          })
        } else {
          toast({
            variant: "destructive",
            title: "❌ Error en la subida de archivos",
            description: "No se pudo procesar ningún archivo correctamente",
            action: <ToastAction altText="Revisar archivos">Revisar</ToastAction>,
            duration: 6000,
            className:
              "bg-red-50/95 backdrop-blur-sm border-red-200/60 text-red-900 \
           dark:bg-red-950/90 dark:border-red-800/60 dark:text-red-200",
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
          genero: formValues.personaDenunciada?.genero || null,
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
        variant: "default",
        title: "📤 Enviando denuncia",
        description: "Su denuncia está siendo procesada. Por favor espere...",
        duration: 3000,
        className: "bg-blue-50/95 backdrop-blur-sm border-blue-200/60 text-blue-800",
      })

      const result = await denunciasPublicService.createDenuncia(validatedValues)

      toast({
        variant: "default",
        title: "🎉 Denuncia enviada",
        description: "Su denuncia ha sido recibida correctamente y será procesada por las autoridades.",
        duration: 5000,
        className: "bg-green-50/95 backdrop-blur-sm border-green-200/60 text-green-800",
      })

      setDenunciaId(result.id)
      setModalMode("success")
    } catch (error) {
      console.error("Error al enviar el formulario:", error)

      toast({
        variant: "destructive",
        title: "❌ Error al enviar",
        description: error.message || "Error al procesar la denuncia. Intente nuevamente.",
        action: (
          <ToastAction
            altText="Reintentar"
            onClick={() => {
              setIsModalOpen(true)
              setModalMode("confirm")
            }}
            className="bg-red-100/90 hover:bg-red-200/90 text-red-900 border-red-300/70 shrink-0 
       dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-200 dark:border-red-700/50"
          >
            Reintentar
          </ToastAction>
        ),
        duration: 8000,
        className:
          "bg-red-50/95 backdrop-blur-sm border-red-200/60 text-red-900 \
   dark:bg-red-950/90 dark:border-red-800/60 dark:text-red-200",
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
      <div className="w-full gradient-background shadow-md rounded-lg overflow-hidden flex flex-col min-h-screen pt-10">
        {/* Header simplificado */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold foregroundy">{steps[step].title}</h1>
              {step === 3 && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="group relative overflow-hidden rounded-xl border border-border/60 bg-background/95 hover:bg-accent/50 backdrop-blur-sm shadow-md hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-auto hover:border-border dark:border-border/40 dark:hover:border-border/60
        px-3 py-2.5 min-h-[44px] 
        sm:px-4 sm:py-3 sm:min-h-[48px] 
        md:px-5 md:py-3 md:min-h-[56px]"
                    >
                      {/* Contenido del botón optimizado para móvil */}
                      <div className="relative flex items-center justify-center w-full">
                        {/* Layout móvil (pantallas pequeñas) */}
                        <div className="flex sm:hidden items-center space-x-2">
                          <div className="relative bg-gradient-to-br from-primary to-primary/90 dark:from-primary dark:to-primary/80 p-1.5 rounded-lg shadow-sm">
                            <MessageCircle className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="flex flex-col items-start">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                IA
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                                BETA
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Layout tablet y desktop */}
                        <div className="hidden sm:flex items-center space-x-3">
                          <div className="relative bg-gradient-to-br from-primary to-primary/90 dark:from-primary dark:to-primary/80 p-2 rounded-lg shadow-sm dark:shadow-md">
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                              Asistente IA
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                              BETA
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Efecto de brillo sutil */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 dark:via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
                    </Button>
                  </SheetTrigger>
                  <HelpContent step={step} />
                </Sheet>
              )}
            </div>
            
          {/* Aviso de campos obligatorios */}
          <div className="flex items-center gap-2 p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Los campos marcados con (*) son obligatorios.
            </p>
          </div>

          </div>
        </div>

        <div className="flex flex-col justify-between min-h-[calc(100vh-280px)] pb-28">
          <div className="container mx-auto px-4 py-6 md:py-8 overflow-y-auto">

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <StepContent step={step} form={form} />
            </form>
          </div>
        </div>

        {/* BOTONES FLOTANTES MEJORADOS - RESPONSIVOS TEMA CLARO/OSCURO */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center justify-center">
            {/* Contenedor principal con glassmorphism responsivo */}
            <div
              className="flex items-center space-x-2 
                 bg-white/90 dark:bg-gray-900/90 
                 backdrop-blur-xl shadow-2xl 
                 dark:shadow-black/50
                 rounded-2xl px-3 py-2 
                 border border-white/30 dark:border-gray-700/50
                 md:space-x-4 md:px-6 md:py-3 md:rounded-3xl"
            >
              {/* Botón anterior/cancelar responsivo */}
              <Button
                type="button"
                variant="outline"
                className="rounded-xl shadow-lg border-2 hover:shadow-xl transition-all duration-300 
                   bg-white/95 hover:bg-white 
                   dark:bg-gray-800/95 dark:hover:bg-gray-800
                   border-gray-200 hover:border-gray-300
                   dark:border-gray-600 dark:hover:border-gray-500
                   h-11 w-11 p-0 md:h-12 md:w-auto md:px-5 md:py-3
                   hover:scale-105 active:scale-95"
                onClick={step === 0 ? () => router.push("/") : prevStep}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 md:mr-2 text-gray-600 dark:text-gray-300" />
                <span className="hidden md:inline font-medium text-gray-700 dark:text-gray-200">
                  {step === 0 ? "Cancelar" : "Anterior"}
                </span>
              </Button>

              {/* Indicador de paso central responsivo */}
              <div
                className="flex items-center space-x-3 
                   bg-gradient-to-r from-primary/10 to-primary/5 
                   dark:from-primary/20 dark:to-primary/10
                   px-4 py-2 rounded-xl 
                   border border-primary/20 dark:border-primary/30
                   backdrop-blur-sm
                   md:px-6 md:py-3 md:rounded-2xl"
              >
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-bold text-primary dark:text-primary-foreground md:text-base">
                    {step + 1}
                  </div>
                  <div className="text-primary/60 dark:text-primary-foreground/60 font-medium">/</div>
                  <div className="text-sm font-bold text-primary/80 dark:text-primary-foreground/80 md:text-base">
                    {totalSteps}
                  </div>
                </div>
                <div className="hidden lg:block text-xs text-primary/70 dark:text-primary-foreground/70 font-medium max-w-32 truncate">
                  {steps[step].title}
                </div>
              </div>

              {/* Botón siguiente/enviar responsivo */}
              <Button
                type="button"
                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                   bg-gradient-to-r from-primary to-primary/90 
                   hover:from-primary/90 hover:to-primary
                   dark:from-primary dark:to-primary/80
                   dark:hover:from-primary/90 dark:hover:to-primary
                   h-11 w-11 p-0 md:h-12 md:w-auto md:px-5 md:py-3
                   hover:scale-105 active:scale-95 border-0
                   text-primary-foreground dark:text-primary-foreground"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                {step === totalSteps - 1 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline font-medium">
                      {isSubmitting ? "Enviando..." : "Enviar Denuncia"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="hidden md:inline font-medium mr-2">Siguiente</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
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
        uploadProgress={uploadProgress}
        isUploading={isSubmitting && uploadProgress > 0 && uploadProgress < 100}
        formData={form.getValues()}
      />
    </Form>
  )
}

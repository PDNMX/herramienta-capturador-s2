//@ts-nocheck
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { StepContent } from "./step-content"

const formSchema = z.object({
    denunciante: z.object({
        anonimo: z.boolean().default(false),
        datosDenunciante: z.object({
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
        }),
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
})

const InfoPanel = ({ step, totalSteps, getStepTitle, getStepDescription }) => (
    <div className="w-1/2 bg-custom-primary p-8 flex flex-col justify-between transition-all duration-500">
        <div className="mt-8">
            <div className="text-5xl font-bold text-primary-foreground font-mono leading-none mb-6">
                {String(step).padStart(2, "0")}
            </div>
            <h2 className="text-xl text-primary-foreground mb-2">{getStepTitle()}</h2>
            <p className="text-primary-foreground/80 text-sm">{getStepDescription()}</p>
        </div>
    </div>
)

const FormPanel = ({ form, onSubmit, step, totalSteps, router, nextStep }) => (
    <div className="w-1/2 p-8 flex flex-col justify-between transition-all duration-500">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex items-center">
            <div className="w-full max-w-xl mx-auto">
                <StepContent step={step} form={form} />
            </div>
        </form>

        <div className="mt-8 flex items-center justify-between border-t dark:border-gray-200 pt-4">
            <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-gray-600 dark:text-gray-100 hover:text-gray-200 dark:hover:text-gray-700 hover:bg-primary dark:hover:bg-gray-50"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
            </Button>
            <div className="font-mono text-gray-600">
                {step} / {totalSteps}
            </div>
            <Button
                onClick={step === totalSteps ? form.handleSubmit(onSubmit) : nextStep}
                className="bg-custom-primary text-white hover:bg-custom-primary/90"
            >
                {step === totalSteps ? "Enviar" : "Siguiente"}
                {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
        </div>
    </div>
)


export function MultiStepForm() {
    const router = useRouter()
    const [step, setStep] = React.useState(1)
    const totalSteps = 5

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
        },
    })

    const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps))
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
        // Handle form submission
    }

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Información del Denunciante"
            case 2:
                return "Ubicación del Hecho"
            case 3:
                return "Persona Denunciada"
            case 4:
                return "Falta Cometida"
            case 5:
                return "Narración de Hechos"
            default:
                return ""
        }
    }

    const getStepDescription = () => {
        switch (step) {
            case 1:
                return "Proporciona tus datos personales o presenta tu denuncia de manera anónima."
            case 2:
                return "Indica dónde y cuándo ocurrieron los hechos que deseas denunciar."
            case 3:
                return "Identifica a la persona o servidor público involucrado en los hechos."
            case 4:
                return "Selecciona el tipo de falta administrativa o hecho de corrupción."
            case 5:
                return "Describe detalladamente los hechos que deseas denunciar."
            default:
                return ""
        }
    }

    return (
        <div className="flex h-full gradient-background">
            <FormPanel
                form={form}
                onSubmit={onSubmit}
                step={step}
                totalSteps={totalSteps}
                router={router}
                nextStep={nextStep}
            />
            <InfoPanel
                step={step}
                totalSteps={totalSteps}
                getStepTitle={getStepTitle}
                getStepDescription={getStepDescription}
            />
        </div>
    )
}
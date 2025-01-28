//@ts-nocheck
import React from "react"
import Image from "next/image"
import { Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LogoS5 from "@/components/s5-logo-white.svg"

export function WelcomeStep({ form, onNext }) {
  return (
    <Card className="w-full mx-auto border-2 border-custom-primary shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 h-[63vh]">
          {/* Left column */}
          <div className="header-gradient h-full p-8 md:p-10 lg:p-12 flex flex-col justify-between">
            <div className="flex flex-col items-center md:items-start">
              <Image
                src={LogoS5 || "/placeholder.svg"}
                alt="Logo Sistema 5"
                width={100}
                height={100}
                className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center md:text-left">
                Sistema 5
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 leading-tight text-center md:text-left">
                Sistema de Denuncias Públicas de Faltas Administrativas y Hechos de Corrupción
              </h2>
            </div>
          </div>

          {/* Right column */}
          <div className="bg-background dark:bg-background/5 h-full p-8 md:p-10 lg:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-custom-primary dark:text-white/90 leading-tight">
                Bienvenido/a
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-foreground dark:text-white/90 leading-relaxed">
                Aquí podrás presentar una denuncia de manera segura y confidencial.
              </p>
              <div className="space-y-4 text-base md:text-lg text-foreground dark:text-white/90">
                <p>Instrucciones breves:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Proporciona la información solicitada en cada paso.</li>
                  <li>Describe los hechos de manera clara y concisa.</li>
                  <li>Adjunta evidencias si las tienes (opcional).</li>
                  <li>Revisa tu denuncia antes de enviarla.</li>
                </ol>
              </div>
              <div className="flex items-start gap-3 text-foreground dark:text-white/90">
                <Info className="h-6 w-6 flex-shrink-0 mt-1 text-custom-primary" />
                <span className="text-base md:text-lg">
                  Todos los datos proporcionados son tratados con estricta confidencialidad.
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={onNext}
                className="bg-custom-primary hover:bg-custom-primary/90 text-white text-base md:text-lg px-6 py-3 md:py-4 h-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                <span>Inicia tu denuncia ahora</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
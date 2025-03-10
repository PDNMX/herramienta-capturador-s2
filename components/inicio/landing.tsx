// @ts-nocheck
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Clock, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Search, ArrowRight, Shield, FileText, UserCheck, AlertCircle, CheckCircle2 } from "lucide-react"

import { SeguimientoModal } from "@/components/modal/seguimiento-modal"

import logoS5w from "@/components/s5-logo-white.svg"
import logoS5d from "@/components/s5-logo-color.svg"

export function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <main className="relative  gradient-background">
      <div className="container relative mx-auto px-4 pt-1">
        {/* Header - Updated layout */}
        <div className="mb-12 flex items-center justify-center gap-8">
          <Image
            src={theme === "dark" ? logoS5w : logoS5d}
            alt="Logo Sistema 5"
            className="h-24 w-auto"
          />
          <h1 className="text-4xl font-bold tracking-tight text-foreground max-w-3xl">
            Sistema de Denuncias Públicas de Faltas Administrativas y Hechos de Corrupción
          </h1>
        </div>

        {/* Main Card: Submit a Complaint - Updated design */}
        <Card className="mb-12 border-primary/10 bg-card/95  backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-primary">Presenta tu Caso</CardTitle>
              <p className="text-muted-foreground">Ayúdanos a combatir la corrupción y las faltas administrativas</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-primary/5 px-4 py-2 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
              <span>20 minutos aproximadamente</span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="mb-8 text-lg text-muted-foreground">
              Su denuncia debe detallar la supuesta conducta, incluyendo quién estuvo involucrado, qué sucedió, dónde y
              cuándo, y cualquier documentación de respaldo.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Lo que necesitas saber */}
              <div>
                <h3 className="mb-4 text-xl font-semibold text-primary">Lo que necesitas saber</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span>Puede presentar una denuncia anónima.</span>
                  </li>
                  {/* <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      Weirll le informará si su denuncia califica para protecciones adicionales bajo la{" "}
                      <Link href="/ley-de-divulgaciones" className="text-primary hover:underline">
                        Ley de Divulgaciones de Interés Público
                      </Link>
                      .
                    </span>
                  </li> */}
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <AlertCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>Hay varios posibles resultados.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <span>Si nos proporciona sus datos de contacto, le mantendremos informado.</span>
                  </li>
                </ul>
              </div>

              {/* Antes de comenzar */}
              <div>
                <h3 className="mb-4 text-xl font-semibold text-primary">Antes de comenzar</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      Saber{" "}
                      <Link href="/quien-investigamos" className="text-primary hover:underline">
                        a quién podemos y a quién no podemos investigar
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>Sea claro de quién se trata la denuncia.</span>
                  </li>
                  {/* <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <span>¿Ya presentó una denuncia a otra organización? Tenga los detalles listos.</span>
                  </li> */}
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      <Link href="/aviso-de-privacidad" className="text-primary hover:underline">
                        Aviso de privacidad
                      </Link>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-6">
            <Button
              size="lg"
              className="w-full max-w-md bg-primary text-primary-foreground hover:bg-accent py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              asChild
            >
              <Link href="/presentar-denuncia" className="flex items-center justify-center gap-3 hover:text-accent-foreground">
                Presentar Denuncia
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Additional Buttons Section */}
        <div className="mb-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="bg-card hover:bg-accent hover:text-accent-foreground text-lg p-4 h-auto flex items-center justify-center gap-4 border-2 hover:shadow-lg transition-all duration-300"
          >
            <div className="rounded-full bg-primary/20 p-3">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold">Consultar Estatus</span>
              <span className="text-sm text-muted-foreground">Seguimiento de tu denuncia</span>
            </div>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-card hover:bg-accent hover:text-accent-foreground text-lg p-4 h-auto flex items-center justify-center gap-4 border-2 hover:shadow-lg transition-all duration-300"
            asChild
          >
            <Link href="/estadisticas">
              <div className="rounded-full bg-primary/20 p-3">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Estadísticas Nacionales</span>
                <span className="text-sm text-muted-foreground">Transparencia en cifras</span>
              </div>
            </Link>
          </Button>
        </div>
        <SeguimientoModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

        {/* Feature Cards */}
        {/* <div className="grid gap-7 md:grid-cols-3 mx-auto">
          <Card className="border-2 border-primary/10 bg-card shadow-md transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="flex flex-col items-center space-y-4 pb-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-center text-primary">Seguridad Garantizada</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-muted-foreground">
                Protegemos tu información con los más altos estándares de seguridad.
              </p>
              <ul className="text-sm space-y-1 mt-4">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Datos encriptados</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Anonimato opcional</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-card shadow-md transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="flex flex-col items-center space-y-4 pb-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors duration-300">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-center text-primary">Proceso Transparente</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-muted-foreground">Seguimiento detallado del estado de tu denuncia en cada etapa.</p>
              <ul className="text-sm space-y-1 mt-4">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Actualizaciones en tiempo real</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Comunicación directa</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-card shadow-md transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="flex flex-col items-center space-y-4 pb-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors duration-300">
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-center text-primary">Proceso Simplificado</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-muted-foreground">
                Interfaz intuitiva para un proceso de denuncia sin complicaciones.
              </p>
              <ul className="text-sm space-y-1 mt-4">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Guía paso a paso</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Asistencia disponible</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </main>
  )
}

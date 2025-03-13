// @ts-nocheck
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Clock, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Search, ArrowRight, Shield, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

import { SeguimientoModal } from "@/components/modal/seguimiento-modal"

import logoS5w from "@/components/s5-logo-white.svg"
import logoS5d from "@/components/s5-logo-color.svg"

export function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <main className="relative gradient-background">
      <div className="container relative mx-auto px-4 pt-1">
        {/* Header - Updated layout */}
        <div className="mb-12 flex items-center justify-center gap-8">
          <Image src={theme === "dark" ? logoS5w : logoS5d} alt="Logo Sistema 5" className="h-24 w-auto" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground max-w-3xl">
            Sistema de Denuncias Públicas de Faltas Administrativas y Hechos de Corrupción
          </h1>
        </div>

        {/* Main Card: Submit a Complaint - Updated design */}
        <Card className="mb-12 border-primary/10 bg-card/95 backdrop-blur">
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
              Tu denuncia es importante para combatir la corrupción. Para garantizar la seguridad y confidencialidad de
              tu identidad, podrás presentar una denuncia anónima. Podrás consultar el estado de tu denuncia con el
              folio de seguimiento o, a través de notificaciones, en caso de que proporciones tus datos de contacto.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Podrás denunciar */}
              <div className="p-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Podrás denunciar</h3>
                </div>
                <ul className="space-y-4 pl-2">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/5 p-1 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span>Conductas de personas servidoras públicas en el ejercicio de sus funciones.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/5 p-1 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      Conductas de personas particulares o empresas que manejen recursos públicos, participen en
                      contrataciones públicas o realicen transacciones comerciales internacionales.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/5 p-1 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span>
                      Conductas de candidatos a cargos de elección popular, miembros de equipos de campaña electoral o
                      de transición, o líderes de sindicatos del sector público.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 mt-6 pt-4 border-t border-primary/10">
                    <div className="rounded-full bg-primary/5 p-1 mt-0.5">
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

              {/* No podrás denunciar */}
              <div className="p-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <XCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">No podrás denunciar</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Este sistema no está diseñado para atender los siguientes casos:
                </p>
                <ul className="space-y-4 pl-2">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/5 p-1 mt-0.5">
                      <AlertCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">Trámites y/o servicios</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Problemas con trámites administrativos o servicios públicos.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/5 p-1 mt-0.5">
                      <AlertCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">Conflictos laborales</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Disputas entre empleadores y empleados o relacionadas con condiciones de trabajo.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/5 p-1 mt-0.5">
                      <AlertCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">Conflictos entre particulares</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Disputas civiles o comerciales entre personas o entidades privadas.
                      </p>
                    </div>
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
              <Link
                href="/presentar-denuncia"
                className="flex items-center justify-center gap-3 hover:text-accent-foreground"
              >
                Presenta tu Denuncia
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
      </div>
    </main>
  )
}


"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Clock, BarChart3, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Search, ArrowRight, Shield, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

import { SeguimientoModal } from "@/components/modal/seguimiento-modal"

import logoS5w from "@/components/s5-logo-white.svg"
import logoS5d from "@/components/s5-logo-color.svg"
import logoS5h from "@/components/s5-logo-high-contrast.svg"

export function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const { theme } = useTheme()

  const handlePresentarDenuncia = () => {
    setShowComplaintForm(true)
  }

  return (
    <main className="relative gradient-background min-h-screen flex flex-col items-center justify-start md:justify-center">
      <div className="container relative mx-auto px-3 md:px-4 pt-1 flex flex-col items-center">
        {/* Header - Always visible */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <Image
            src={theme === "dark" ? logoS5w : theme === "high-contrast" ? logoS5h : logoS5d}
            alt="Logo Sistema 5"
            className="h-16 md:h-24 w-auto"
          />
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground max-w-3xl">
            Sistema de Denuncias Públicas de Faltas Administrativas y Hechos de Corrupción
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {!showComplaintForm ? (
            /* Clean Landing with 3 Buttons */
            <motion.div
              key="clean-landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="grid gap-6 md:grid-cols-1">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground text-base md:text-lg p-4 md:p-6 h-auto flex items-center justify-center gap-2 md:gap-4 border-2 border-primary/50 shadow-lg transition-all duration-300 overflow-hidden relative glow-effect"
                  onClick={handlePresentarDenuncia}
                >
                  <div className="rounded-full bg-primary-foreground/20 p-2 md:p-3">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-lg md:text-xl">Presentar Denuncia</span>
                    <span className="text-xs md:text-sm text-primary-foreground/80">
                      Reporta faltas administrativas y hechos de corrupción
                    </span>
                  </div>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-card hover:bg-accent hover:text-accent-foreground text-base md:text-lg p-4 md:p-6 h-auto flex items-center justify-center gap-2 md:gap-4 border-2 border-primary/30 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="rounded-full bg-primary/20 p-2 md:p-3">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-lg md:text-xl">Consultar Estatus</span>
                    <span className="text-xs md:text-sm text-muted-foreground">Seguimiento de tu denuncia</span>
                  </div>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="bg-card hover:bg-accent hover:text-accent-foreground text-base md:text-lg p-4 md:p-6 h-auto flex items-center justify-center gap-2 md:gap-4 border-2 border-primary/30 shadow-md hover:shadow-lg transition-all duration-300"
                  asChild
                >
                  <Link href="/estadisticas">
                    <div className="rounded-full bg-primary/20 p-2 md:p-3">
                      <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-lg md:text-xl">Estadísticas Nacionales</span>
                      <span className="text-xs md:text-sm text-muted-foreground">Transparencia en cifras</span>
                    </div>
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Complaint Form Card - Shown after clicking "Presentar Denuncia" */
            <motion.div
              key="complaint-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="w-full"
            >
              {/* Main Card: Submit a Complaint - Diseño mejorado */}
              <Card className="mb-12 border-2 border-primary/20 bg-card/95 backdrop-blur shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">Presenta tu Caso</CardTitle>
                    <p className="text-muted-foreground">
                      Ayúdanos a combatir la corrupción y las faltas administrativas
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-primary/10 px-4 py-2 rounded-full shadow-sm">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>20 minutos aproximadamente</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <p className="mb-8 text-lg text-muted-foreground">
                    Tu denuncia es importante para combatir la corrupción. Para garantizar la seguridad y
                    confidencialidad de tu identidad, podrás presentar una denuncia anónima. Podrás consultar el estado
                    de tu denuncia con el folio de seguimiento o, a través de notificaciones, en caso de que
                    proporciones tus datos de contacto.
                  </p>

                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Podrás denunciar - Mejorado */}
                    <div className="p-4 rounded-lg border-2 border-primary/20 bg-card shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="rounded-full bg-primary/20 p-3 shadow-sm">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-primary">Podrás denunciar</h3>
                      </div>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg">
                          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-foreground">Conductas de personas servidoras públicas en el ejercicio de sus funciones.</span>
                        </li>
                        <li className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg">
                          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-foreground">
                            Conductas de personas particulares o empresas que manejen recursos públicos, participen en
                            contrataciones públicas o realicen transacciones comerciales internacionales.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg">
                          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-foreground">
                            Conductas de candidatos a cargos de elección popular, miembros de equipos de campaña
                            electoral o de transición, o líderes de sindicatos del sector público.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 mt-6 pt-4 border-t border-primary/20">
                          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shadow-sm">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-foreground hover:text-primary transition-colors duration-300">
                            <Link href="/aviso-de-privacidad" className="text-primary hover:underline font-medium">
                              Aviso de privacidad
                            </Link>
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* No podrás denunciar - Mejorado */}
                    <div className="p-4 rounded-lg border-2 border-primary/20 bg-card shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="rounded-full bg-primary/20 p-3 shadow-sm">
                          <XCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-primary">No podrás denunciar</h3>
                      </div>
                      <p className="text-muted-foreground mb-4 bg-primary/5 p-3 rounded-lg">
                        Este sistema no está diseñado para atender los siguientes casos:
                      </p>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg">
                          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shadow-sm">
                            <AlertCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Trámites y/o servicios</span>
                            <p className="text-sm text-muted-foreground mt-1">
                              Problemas con trámites administrativos o servicios públicos.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg">
                          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shadow-sm">
                            <AlertCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Conflictos laborales</span>
                            <p className="text-sm text-muted-foreground mt-1">
                              Disputas entre empleadores y empleados o relacionadas con condiciones de trabajo.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg">
                          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shadow-sm">
                            <AlertCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Conflictos entre particulares</span>
                            <p className="text-sm text-muted-foreground mt-1">
                              Disputas civiles o comerciales entre personas o entidades privadas.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-6">
                  <Button
                    size="lg"
                    className="w-full max-w-md bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground py-6 text-lg border-2 border-primary/50 shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden glow-effect"
                    asChild
                  >
                    <Link
                      href="/presentar-denuncia"
                      className="flex items-center justify-center gap-3"
                    >
                      Presenta tu Denuncia
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => setShowComplaintForm(false)} 
                    className="mt-2 hover:bg-primary/10 transition-all duration-300"
                  >
                    Regresar
                  </Button>
                </CardFooter>
              </Card>

              {/* Additional Buttons Section - Shown below the complaint form */}
              <div className="mb-8 md:mb-16 grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-card hover:bg-accent hover:text-accent-foreground text-base md:text-lg p-3 md:p-4 h-auto flex items-center justify-center gap-2 md:gap-4 border-2 border-primary/30 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="rounded-full bg-primary/20 p-2 md:p-3 shadow-sm">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Consultar Estatus</span>
                    <span className="text-xs md:text-sm text-muted-foreground">Seguimiento de tu denuncia</span>
                  </div>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-card hover:bg-accent hover:text-accent-foreground text-base md:text-lg p-3 md:p-4 h-auto flex items-center justify-center gap-2 md:gap-4 border-2 border-primary/30 shadow-md hover:shadow-lg transition-all duration-300"
                  asChild
                >
                  <Link href="/estadisticas">
                    <div className="rounded-full bg-primary/20 p-2 md:p-3 shadow-sm">
                      <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Estadísticas Nacionales</span>
                      <span className="text-xs md:text-sm text-muted-foreground">Transparencia en cifras</span>
                    </div>
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SeguimientoModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </main>
  )
}
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
                  <div className="flex flex-col items-start flex-1 justify-center">
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
                  <div className="flex flex-col items-start flex-1 justify-center">
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
                    <div className="flex flex-col items-start flex-1 justify-center">
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
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">Presenta tu denuncia</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-primary/10 px-4 py-2 rounded-full shadow-sm">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-xs">20 minutos aproximadamente</span>
                  </div>
                </CardHeader>

                  <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 shadow-md">
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tu denuncia es importante</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                              Ayúdanos a combatir la corrupción. Tu denuncia podrá ser <span className="font-semibold text-emerald-600 dark:text-emerald-400">anónima</span> para 
                              garantizar la seguridad y confidencialidad de tu identidad.
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/30">
                          <p className="text-sm md:text-base text-muted-foreground">
                            💡 Podrás consultar el estado de tu denuncia en cualquier momento con tu <span className="font-semibold">folio de seguimiento.</span>
                          </p>
                        </div>
                  </div>

                  <div className="grid gap-4 md:gap-5 lg:grid-cols-2 p-6 pt-0">
                    {/* Podrás denunciar - Diseño profesional */}
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 md:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2.5 shadow-md">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Podrás denunciar</h3>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 bg-green-50/80 dark:bg-green-900/20 p-3 rounded-lg border border-green-200/50 dark:border-green-700/30">
                          <div className="bg-green-100 dark:bg-green-800/50 rounded-lg p-1.5 mt-0.5 shadow-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="font-semibold">Personas Servidoras Públicas:</span> Conductas en el ejercicio de sus funciones.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 bg-green-50/80 dark:bg-green-900/20 p-3 rounded-lg border border-green-200/50 dark:border-green-700/30">
                          <div className="bg-green-100 dark:bg-green-800/50 rounded-lg p-1.5 mt-0.5 shadow-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="font-semibold">Particulares y empresas:</span> Que manejen recursos públicos o participen en contrataciones.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 bg-green-50/80 dark:bg-green-900/20 p-3 rounded-lg border border-green-200/50 dark:border-green-700/30">
                          <div className="bg-green-100 dark:bg-green-800/50 rounded-lg p-1.5 mt-0.5 shadow-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="font-semibold">Candidatos y líderes:</span> De elección popular, campañas electorales o sindicatos públicos.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* No podrás denunciar - Diseño profesional */}
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 md:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-2.5 shadow-md">
                          <XCircle className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">No podrás denunciar</h3>
                      </div>
                      <div className="bg-orange-50/80 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200/50 dark:border-orange-700/30 mb-4">
                        <p className="text-xs md:text-sm text-orange-800 dark:text-orange-200 font-medium">
                          ⚠️ Este sistema no está diseñado para atender los siguientes casos:
                        </p>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 bg-red-50/80 dark:bg-red-900/20 p-3 rounded-lg border border-red-200/50 dark:border-red-700/30">
                          <div className="bg-red-100 dark:bg-red-800/50 rounded-lg p-1.5 mt-0.5 shadow-sm">
                            <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs md:text-sm">Trámites y servicios</span>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              Problemas con trámites administrativos o servicios públicos.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3 bg-red-50/80 dark:bg-red-900/20 p-3 rounded-lg border border-red-200/50 dark:border-red-700/30">
                          <div className="bg-red-100 dark:bg-red-800/50 rounded-lg p-1.5 mt-0.5 shadow-sm">
                            <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs md:text-sm">Asuntos laborales</span>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              Conflictos entre empleadores y empleados, o relacionados con condiciones de trabajo.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3 bg-red-50/80 dark:bg-red-900/20 p-3 rounded-lg border border-red-200/50 dark:border-red-700/30">
                          <div className="bg-red-100 dark:bg-red-800/50 rounded-lg p-1.5 mt-0.5 shadow-sm">
                            <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs md:text-sm">Asuntos entre particulares</span>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              Conflictos civiles o mercantiles entre personas u organizaciones privadas.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                <CardFooter className="p-4 md:p-6 flex flex-col gap-4">
                  <div className="relative group w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <Button
                      size="lg"
                      className="relative w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 md:py-5 text-sm md:text-base font-bold border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                      asChild
                    >
                                              <Link
                          href="/presentar-denuncia"
                          className="flex items-center justify-center gap-3"
                        >
                          <FileText className="h-5 w-5 md:h-6 md:w-6" />
                          Presenta tu Denuncia
                          <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                    </Button>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => setShowComplaintForm(false)} 
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-6 py-3 font-medium transition-all duration-300"
                  >
                  Regresar al inicio
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <SeguimientoModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </main>
  )
}

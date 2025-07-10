"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { BarChart3, FileText } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
/* import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Search, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

import { SeguimientoModal } from "@/components/modal/seguimiento-modal"

import logoS5w from "@/components/s5-logo-white.svg"
import logoS5d from "@/components/s5-logo-color.svg"
import logoS5h from "@/components/s5-logo-high-contrast.svg"
import LogoSNA from "@/components/SNA-logo"

export function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false)
  const { theme } = useTheme()

  const handlePresentarDenuncia = () => {
    setIsInstructionsModalOpen(true)
  }

  return (
    <main className="relative gradient-background min-h-screen flex flex-col items-center justify-start md:justify-center">
      <div className="container relative mx-auto px-3 md:px-4 pt-1 flex flex-col items-center">
        {/* Header - Always visible */}
        <div className="mt-20 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <Image
            src={theme === "dark" ? logoS5w : theme === "high-contrast" ? logoS5h : logoS5d}
            alt="Logo Sistema 5"
            className="h-16 md:h-24 w-auto"
          />
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground max-w-3xl">
            Sistema de Denuncias Públicas de Faltas Administrativas y Hechos de Corrupción
          </h1>
        </div>

        {/* Clean Landing with 3 Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                <span className="text-xs text-primary-foreground/80">
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
                <span className="text-xs text-muted-foreground">Seguimiento de tu denuncia</span>
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
                  <span className="text-xs text-muted-foreground">Consulta el trabajo de las autoridades</span>
                </div>
              </Link>
            </Button>
            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="flex items-center justify-center">
                <LogoSNA className="h-12 md:h-16 w-auto" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions Modal */}
        <Dialog open={isInstructionsModalOpen} onOpenChange={setIsInstructionsModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col rounded-md">
            <DialogHeader className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 pb-2 z-1">
              <DialogTitle className="text-xl md:text-2xl xl:text-3xl font-bold tracking-tight text-primary">
                Tu denuncia es importante
              </DialogTitle>
              <DialogDescription>
                Ayúdanos a combatir la corrupción. Tu denuncia podrá ser{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  anónima
                </span>{" "}
                para garantizar la seguridad y confidencialidad de tu identidad.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-1 space-y-3">

              {/* Leyenda de avisos de privacidad */}
              <div className="bg-blue-50/80 dark:bg-blue-900/20 rounded-xl p-2 border border-blue-200/50 dark:border-blue-700/30">
                <p className="text-xs md:text-sm xl:text-base text-blue-800 dark:text-blue-200 text-center">
                  📖 Conoce nuestros Avisos de Privacidad:{" "}
                  <Link
                    target="_blank"
                    href="https://drive.google.com/file/d/1XBt6l1MumH32_VMOqBtiMjnacThK4fLn/view?usp=sharing"
                    className="font-semibold hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                  >
                    Simplificado
                  </Link>{" "}
                  e{" "}
                  <Link
                    target="_blank"
                    href="https://drive.google.com/file/d/1iupn-Q_jw12bnxo4Jktvco-pwth3LwLc/view?usp=sharing"
                    className="font-semibold hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                  >
                    Integral
                  </Link>
                </p>
              </div>

              {/* Grid de información */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Podrás denunciar */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2 md:p-2.5 shadow-md">
                      <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <h3 className="text-sm md:text-base xl:text-lg font-bold text-gray-900 dark:text-gray-100">
                      Podrás denunciar
                    </h3>
                  </div>
                  <ul className="space-y-2 md:space-y-3">
                    <li className="flex items-start gap-2 md:gap-3 bg-green-50/80 dark:bg-green-900/20 p-2 md:p-3 rounded-lg border border-green-200/50 dark:border-green-700/30">
                      <div className="bg-green-100 dark:bg-green-800/50 rounded-lg p-1 md:p-1.5 mt-0.5 shadow-sm">
                        <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="font-semibold">Personas Servidoras Públicas:</span> Conductas en el ejercicio de sus funciones.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3 bg-green-50/80 dark:bg-green-900/20 p-2 md:p-3 rounded-lg border border-green-200/50 dark:border-green-700/30">
                      <div className="bg-green-100 dark:bg-green-800/50 rounded-lg p-1 md:p-1.5 mt-0.5 shadow-sm">
                        <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="font-semibold">Particulares y empresas:</span> Que manejen recursos públicos o participen en contrataciones.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3 bg-green-50/80 dark:bg-green-900/20 p-2 md:p-3 rounded-lg border border-green-200/50 dark:border-green-700/30">
                      <div className="bg-green-100 dark:bg-green-800/50 rounded-lg p-1 md:p-1.5 mt-0.5 shadow-sm">
                        <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="font-semibold">Candidatos y líderes:</span> De elección popular, campañas electorales o sindicatos públicos.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* No podrás denunciar */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-2 md:p-2.5 shadow-md">
                      <XCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <h3 className="text-sm md:text-base xl:text-lg font-bold text-gray-900 dark:text-gray-100">
                      No podrás denunciar
                    </h3>
                  </div>
                  <ul className="space-y-2 md:space-y-3">
                    <li className="flex items-start gap-2 md:gap-3 bg-red-50/80 dark:bg-red-900/20 p-2 md:p-3 rounded-lg border border-red-200/50 dark:border-red-700/30">
                      <div className="bg-red-100 dark:bg-red-800/50 rounded-lg p-1 md:p-1.5 mt-0.5 shadow-sm">
                        <AlertCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                          Trámites y servicios
                        </span>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                          Problemas con trámites administrativos o servicios públicos.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3 bg-red-50/80 dark:bg-red-900/20 p-2 md:p-3 rounded-lg border border-red-200/50 dark:border-red-700/30">
                      <div className="bg-red-100 dark:bg-red-800/50 rounded-lg p-1 md:p-1.5 mt-0.5 shadow-sm">
                        <AlertCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                          Asuntos laborales
                        </span>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                          Conflictos entre empleadores y empleados, o relacionados con condiciones de trabajo.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3 bg-red-50/80 dark:bg-red-900/20 p-2 md:p-3 rounded-lg border border-red-200/50 dark:border-red-700/30">
                      <div className="bg-red-100 dark:bg-red-800/50 rounded-lg p-1 md:p-1.5 mt-0.5 shadow-sm">
                        <AlertCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                          Asuntos entre particulares
                        </span>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                          Conflictos civiles o mercantiles entre personas u organizaciones privadas.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50/80 dark:bg-blue-900/20 rounded-xl p-2 border border-blue-200/50 dark:border-blue-700/30">
                <p className="text-xs md:text-sm xl:text-base text-blue-800 dark:text-blue-200 text-center">
                  💡 Consulta el estado de tu denuncia en cualquier momento con tu folio de seguimiento.
                </p>
              </div>

            </div>

            {/* Botones de acción - Sticky bottom */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-6 pt-4 z-10">
              <div className="flex flex-col gap-4">
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
                      Aceptar
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <SeguimientoModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </main>
  )
}

//@ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, FileText, Download, Shield, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface DenunciaModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode: "confirm" | "success"
  denunciaId?: string
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

export function DenunciaModal({
  isOpen,
  onOpenChange,
  mode,
  denunciaId,
  onConfirm,
  onCancel,
  onClose,
}: DenunciaModalProps) {
  const [downloadReady, setDownloadReady] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (mode === "success" && denunciaId) {
      setDownloadReady(true)
    }
  }, [mode, denunciaId])

  const handleDownloadFolio = () => {
    if (!denunciaId) return

    const content = `
FOLIO DE DENUNCIA
================
Número de Folio: ${denunciaId}

IMPORTANTE: 
Por favor, guarde este número de folio en un lugar seguro.
Lo necesitará para dar seguimiento al estado de su denuncia.

Fecha de generación: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `folio-denuncia-${denunciaId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    onOpenChange(false)
    onClose?.()
    if (mode === "success") {
      router.push("/")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-lg border-0 shadow-lg">
        {mode === "confirm" ? (
          <>
            <div className="bg-primary/10 dark:bg-primary/5 p-6 border-b border-primary/20 dark:border-primary/10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <div className="bg-primary/15 dark:bg-primary/10 p-1.5 rounded-full">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  Confirmar Envío
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-2">
                  ¿Está seguro que desea enviar esta denuncia? Una vez enviada, no podrá modificar la información
                  proporcionada.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Por favor revise cuidadosamente toda la información antes de enviar.</span>
              </div>

              <div
                className={cn(
                  "border-2 rounded-md p-5 shadow-sm",
                  "bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-700/30",
                )}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={isChecked}
                    onCheckedChange={setIsChecked}
                    className={cn(
                      "mt-1 h-5 w-5 border-2 transition-all duration-200",
                      "border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white",
                      "dark:border-amber-400 dark:data-[state=checked]:bg-amber-400 dark:data-[state=checked]:text-black",
                    )}
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor="terms"
                      className={cn(
                        "text-sm font-semibold leading-tight cursor-pointer",
                        "text-amber-800 dark:text-amber-300",
                      )}
                    >
                      Protesto decir verdad respecto de la denuncia presentada
                    </label>
                    <p className={cn("text-xs", "text-amber-700/80 dark:text-amber-400/90")}>
                      Al marcar esta casilla, confirmo bajo protesta de decir verdad que toda la información
                      proporcionada en esta denuncia es verídica y exacta.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-primary/70" />
                <span>Su información será tratada con estricta confidencialidad.</span>
              </div>
            </div>

            <Separator className="bg-border dark:bg-border/50" />

            <DialogFooter className="p-6 flex flex-col sm:flex-row gap-3 sm:justify-end bg-muted/30 dark:bg-muted/10">
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-2 hover:bg-muted/50 transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                disabled={!isChecked}
                className={cn(
                  "font-medium transition-all duration-300",
                  isChecked ? "bg-primary hover:bg-primary/90 shadow-md" : "bg-primary/60 dark:bg-primary/40",
                )}
              >
                {isChecked ? "Confirmar y Enviar" : "Marque la casilla para continuar"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div
              className={cn(
                "p-6 border-b",
                "bg-green-50 border-green-100 text-green-800",
                "dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-300",
              )}
            >
              <DialogHeader>
                <DialogTitle
                  className={cn("text-2xl font-bold flex items-center gap-2", "text-green-700 dark:text-green-300")}
                >
                  <div className={cn("p-1.5 rounded-full", "bg-green-100 dark:bg-green-800/40")}>
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  Denuncia Recibida
                </DialogTitle>
                <DialogDescription className={cn("text-base mt-2", "text-green-700/70 dark:text-green-400/90")}>
                  Gracias por presentar su denuncia. Su caso será revisado por nuestro equipo y se le dará el
                  seguimiento correspondiente.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-4">
              <Alert
                className={cn(
                  "border-2 shadow-sm",
                  "bg-blue-50 border-blue-200 text-blue-800",
                  "dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300",
                )}
              >
                <div className={cn("p-1.5 rounded-full", "bg-blue-100 dark:bg-blue-800/40")}>
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <AlertDescription className="mt-2">
                  <span className={cn("font-semibold text-base block mb-1", "text-blue-800 dark:text-blue-300")}>
                    Su número de folio es:
                  </span>
                  <span
                    className={cn(
                      "text-lg font-mono px-3 py-1 rounded border inline-block",
                      "bg-white border-blue-200 text-blue-800",
                      "dark:bg-blue-950/50 dark:border-blue-800/50 dark:text-blue-200",
                    )}
                  >
                    {denunciaId}
                  </span>
                </AlertDescription>
              </Alert>

              <p className="text-sm text-muted-foreground">
                Guarde este número de folio para dar seguimiento a su denuncia.
              </p>
            </div>

            <Separator className="bg-border dark:bg-border/50" />

            <DialogFooter className="p-6 flex flex-col gap-3 bg-muted/30 dark:bg-muted/10">
              <Button
                className={cn(
                  "w-full font-medium transition-all duration-200 shadow-md",
                  "bg-green-600 hover:bg-green-700 text-white",
                  "dark:bg-green-700 dark:hover:bg-green-600 dark:text-white",
                )}
                onClick={handleDownloadFolio}
                disabled={!downloadReady}
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar Folio
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 hover:bg-muted/50 transition-all duration-200"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

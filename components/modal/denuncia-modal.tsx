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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-lg border-2 shadow-lg">
        {mode === "confirm" ? (
          <>
            <div className="bg-primary/10 p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary" />
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

              <div className="border-2 rounded-md p-5 bg-amber-50/50 shadow-sm border-amber-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={isChecked}
                    onCheckedChange={setIsChecked}
                    className="mt-1 h-5 w-5 border-2 border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white transition-all duration-200"
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor="terms"
                      className="text-sm font-semibold leading-tight cursor-pointer text-amber-800"
                    >
                      Protesto decir verdad respecto de la denuncia presentada
                    </label>
                    <p className="text-xs text-amber-700/80">
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

            <Separator />

            <DialogFooter className="p-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
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
                className={`font-medium transition-all duration-300 ${isChecked ? "bg-primary hover:bg-primary/90 shadow-md" : "bg-primary/60"}`}
              >
                {isChecked ? "Confirmar y Enviar" : "Marque la casilla para continuar"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="bg-green-50 p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                  Denuncia Recibida
                </DialogTitle>
                <DialogDescription className="text-base text-green-700/70 mt-2">
                  Gracias por presentar su denuncia. Su caso será revisado por nuestro equipo y se le dará el
                  seguimiento correspondiente.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-4">
              <Alert variant="info" className="border-2 bg-blue-50 border-blue-200 text-blue-800">
                <FileText className="h-5 w-5 text-blue-600" />
                <AlertDescription className="mt-2">
                  <span className="font-semibold text-base block mb-1">Su número de folio es:</span>
                  <span className="text-lg font-mono bg-white px-3 py-1 rounded border border-blue-200 inline-block">
                    {denunciaId}
                  </span>
                </AlertDescription>
              </Alert>

              <p className="text-sm text-muted-foreground">
                Guarde este número de folio para dar seguimiento a su denuncia.
              </p>
            </div>

            <Separator />

            <DialogFooter className="p-6 flex flex-col gap-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 shadow-md"
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

//@ts-nocheck
"use client"

import { useState, useEffect } from "react"
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
import { AlertCircle, CheckCircle2, FileText, Download } from "lucide-react"

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {mode === "confirm" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Confirmar Envío
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                ¿Está seguro que desea enviar esta denuncia? Una vez enviada, no podrá modificar la información
                proporcionada.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={onConfirm}>Confirmar y Enviar</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Denuncia Recibida
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Gracias por presentar su denuncia. Su caso será revisado por nuestro equipo y se le dará el seguimiento
                correspondiente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert variant="info">
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-semibold">Su número de folio es:</span>
                  <br />
                  {denunciaId}
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={handleDownloadFolio} disabled={!downloadReady}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Folio
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onOpenChange(false)
                  onClose?.()
                }}
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
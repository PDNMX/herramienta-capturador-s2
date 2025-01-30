// @ts-nocheck
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { seguimientoService } from "@/lib/directus"

interface SeguimientoModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_MESSAGES = {
  PENDIENTE: {
    title: "En Revisión Inicial",
    description: "Su denuncia está siendo revisada por la Autoridad Resolutora correspondiente.",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800"
  },
  PROCESO: {
    title: "En Proceso",
    description: "Su denuncia está siendo investigada activamente.",
    color: "bg-blue-50 border-blue-200 text-blue-800"
  },
  COMPLETADA: {
    title: "Completada",
    description: "Se ha completado la investigación de su denuncia.",
    color: "bg-green-50 border-green-200 text-green-800"
  },
  CANCELADA: {
    title: "CANCELADA",
    description: "Su denuncia ha sido cancelada.",
    color: "bg-gray-50 border-gray-200 text-gray-800"
  }
}

export function SeguimientoModal({ isOpen, onOpenChange }: SeguimientoModalProps) {
  const [folio, setFolio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [denunciaData, setDenunciaData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDenunciaData(null)

    try {
      const denuncia = await seguimientoService.consultarDenuncia(folio)
      setDenunciaData(denuncia)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar el folio")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-custom-primary flex items-center gap-2">
            <Search className="h-6 w-6" />
            Consulta de Denuncia
          </DialogTitle>
          <DialogDescription className="text-base">
            Ingrese el folio de seguimiento para verificar el estado de su denuncia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="folio" className="text-sm font-medium">
              Número de Folio
            </Label>
            <Input
              id="folio"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="w-full"
              placeholder="Ingrese el folio de su denuncia"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {denunciaData && (
            <Alert className={STATUS_MESSAGES[denunciaData.status].color}>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">
                  {STATUS_MESSAGES[denunciaData.status].title}
                </div>
                <div className="mt-1">
                  {STATUS_MESSAGES[denunciaData.status].description}
                </div>
                <div className="mt-2 text-sm">
                  Fecha de registro: {new Date(denunciaData.date_created).toLocaleDateString()}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Consultando..." : "Consultar Estado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
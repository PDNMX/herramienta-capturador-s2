"use client"

import type React from "react"

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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, AlertCircle, Clock, FileText, ArrowRight, CheckCircle2, PlayCircle, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { seguimientoService } from "@/lib/directus"

interface SeguimientoModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_CONFIG = {
  Registrada: {
    title: "Registrada",
    description: "Su denuncia ha sido registrada exitosamente y está en espera de revisión inicial.",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    badgeColor: "bg-blue-100 text-blue-800",
    icon: FileText,
    step: 1,
  },
  Turnada: {
    title: "Turnada",
    description: "Su denuncia ha sido turnada a la autoridad competente para su atención.",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    badgeColor: "bg-orange-100 text-orange-800",
    icon: ArrowRight,
    step: 2,
  },
  "En proceso": {
    title: "En Proceso",
    description: "Su denuncia está siendo investigada activamente por la autoridad correspondiente.",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    badgeColor: "bg-yellow-100 text-yellow-800",
    icon: PlayCircle,
    step: 3,
  },
  Atendida: {
    title: "Atendida",
    description: "Su denuncia ha sido completamente atendida y el proceso ha finalizado.",
    color: "bg-green-50 border-green-200 text-green-800",
    badgeColor: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    step: 4,
  },
}

export function SeguimientoModal({ isOpen, onOpenChange }: SeguimientoModalProps) {
  const [folio, setFolio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [denunciaData, setDenunciaData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!folio.trim()) {
      setError("Por favor ingrese un número de folio válido")
      return
    }

    setIsLoading(true)
    setError("")
    setDenunciaData(null)

    try {
      const denuncia = await seguimientoService.consultarDenuncia(folio.trim())
      setDenunciaData(denuncia)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al consultar el folio. Verifique que el número sea correcto.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFolio("")
    setError("")
    setDenunciaData(null)
    onOpenChange(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentStatus = denunciaData ? STATUS_CONFIG[denunciaData.status as keyof typeof STATUS_CONFIG] : null
  const StatusIcon = currentStatus?.icon

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            Consulta de Denuncia
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            Ingrese el número de folio para consultar el estado actual de su denuncia.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="folio" className="text-sm font-semibold text-gray-700">
              Número de Folio
            </Label>
            <Input
              id="folio"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="w-full h-12 text-lg"
              placeholder="Ej: DEN-2024-001234"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-200">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {denunciaData && currentStatus && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {StatusIcon && (
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor:
                            currentStatus.badgeColor.split(" ")[0] === "bg-blue-100"
                              ? "#dbeafe"
                              : currentStatus.badgeColor.split(" ")[0] === "bg-orange-100"
                                ? "#fed7aa"
                                : currentStatus.badgeColor.split(" ")[0] === "bg-yellow-100"
                                  ? "#fef3c7"
                                  : "#dcfce7",
                        }}
                      >
                        <StatusIcon
                          className="h-5 w-5"
                          style={{
                            color:
                              currentStatus.badgeColor.split(" ")[1] === "text-blue-800"
                                ? "#1e40af"
                                : currentStatus.badgeColor.split(" ")[1] === "text-orange-800"
                                  ? "#9a3412"
                                  : currentStatus.badgeColor.split(" ")[1] === "text-yellow-800"
                                    ? "#92400e"
                                    : "#166534",
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{currentStatus.title}</h3>
                      <Badge variant="secondary" className={currentStatus.badgeColor}>
                        Paso {currentStatus.step} de 4
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">{currentStatus.description}</p>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Fecha de registro:</span>
                    <span>{formatDate(denunciaData.date_created)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Folio:</span>
                    <span className="font-mono">{folio}</span>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Progreso</span>
                    <span className="text-xs font-medium text-gray-500">{currentStatus.step}/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStatus.step / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cerrar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !folio.trim()}
            >
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Consultar Estado
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { 
  Search, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  RefreshCw,
  Copy,
  Eye,
  Shield
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { seguimientoService } from "@/lib/directus"

interface SeguimientoModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface DenunciaData {
  id: string
  folio: string
  status: 'REGISTRADA' | 'TURNADA' | 'PROCESO' | 'ATENDIDA'
  date_created: string
  fecha_actualizacion?: string | null
  observaciones?: string
  tiempo_transcurrido?: string
}

const STATUS_CONFIG = {
  REGISTRADA: {
    title: "Registrada",
    description: "Su denuncia ha sido registrada exitosamente y está pendiente de revisión inicial.",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    badgeColor: "bg-blue-100 text-blue-800",
    icon: FileText,
    step: 1
  },
  TURNADA: {
    title: "Turnada",
    description: "Su denuncia ha sido asignada a la Autoridad Resolutora correspondiente para su atención.",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    badgeColor: "bg-orange-100 text-orange-800",
    icon: ArrowRight,
    step: 2
  },
  PROCESO: {
    title: "En Proceso",
    description: "Su denuncia está siendo investigada y atendida activamente por la autoridad competente.",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    badgeColor: "bg-yellow-100 text-yellow-800",
    icon: RefreshCw,
    step: 3
  },
  ATENDIDA: {
    title: "Atendida",
    description: "Su denuncia ha sido completamente procesada y resuelta.",
    color: "bg-green-50 border-green-200 text-green-800",
    badgeColor: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    step: 4
  }
}

const PROGRESS_STEPS = ['REGISTRADA', 'TURNADA', 'PROCESO', 'ATENDIDA'] as const

export function SeguimientoModal({ isOpen, onOpenChange }: SeguimientoModalProps) {
  const [folio, setFolio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [denunciaData, setDenunciaData] = useState<DenunciaData | null>(null)

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
        err instanceof Error 
          ? err.message 
          : "No se pudo encontrar la denuncia. Verifique que el folio sea correcto."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFolio("")
    setError("")
    setDenunciaData(null)
  }

  const copyFolio = async () => {
    if (denunciaData?.folio) {
      try {
        await navigator.clipboard.writeText(denunciaData.folio)
        toast({
          title: "Folio copiado",
          description: "El número de folio ha sido copiado al portapapeles",
        })
      } catch (err) {
        console.error("Error al copiar:", err)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderProgressBar = (currentStatus: string) => {
    const currentStep = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG]?.step || 1
    
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          {PROGRESS_STEPS.map((status, index) => {
            const config = STATUS_CONFIG[status]
            const isActive = index + 1 <= currentStep
            const isCurrent = status === currentStatus
            
            return (
              <div key={status} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive 
                      ? isCurrent 
                        ? 'bg-custom-primary text-white' 
                        : 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isActive && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${
                  isCurrent ? 'text-custom-primary font-medium' : 'text-gray-500'
                }`}>
                  {config.title}
                </span>
              </div>
            )
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-custom-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / PROGRESS_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-custom-primary flex items-center gap-2">
            <Search className="h-6 w-6" />
            Consulta de Denuncia
          </DialogTitle>
          <DialogDescription className="text-base">
            Ingrese el folio de seguimiento para verificar el estado actual de su denuncia.
            <div className="flex items-center gap-2 mt-2 text-sm text-green-700 bg-green-50 p-2 rounded">
              <Shield className="h-4 w-4" />
              Sus datos personales están protegidos conforme a la normativa vigente.
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folio" className="text-sm font-medium">
                Número de Folio *
              </Label>
              <div className="relative">
                <Input
                  id="folio"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value.toUpperCase())}
                  className="w-full pr-10"
                  placeholder="Ej: DEN-2024-001234"
                  required
                  disabled={isLoading}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading || !folio.trim()}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Consultar Estado
                  </>
                )}
              </Button>
              
              {(denunciaData || error) && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Nueva Consulta
                </Button>
              )}
            </div>
          </form>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {denunciaData && (
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Barra de progreso */}
                {renderProgressBar(denunciaData.status)}

                {/* Información del folio */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600">Folio de seguimiento</span>
                    <p className="font-mono font-semibold text-lg">{denunciaData.folio}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyFolio}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                {/* Estado actual */}
                <Alert className={STATUS_CONFIG[denunciaData.status].color}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {(() => {
                        const IconComponent = STATUS_CONFIG[denunciaData.status].icon
                        return <IconComponent className="h-5 w-5" />
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-lg">
                          {STATUS_CONFIG[denunciaData.status].title}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={STATUS_CONFIG[denunciaData.status].badgeColor}
                        >
                          Activo
                        </Badge>
                      </div>
                      <AlertDescription className="text-sm leading-relaxed mb-3">
                        {STATUS_CONFIG[denunciaData.status].description}
                      </AlertDescription>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha de registro:</span>
                          <span className="font-medium">{formatDate(denunciaData.date_created)}</span>
                        </div>
                        
                        {denunciaData.fecha_actualizacion && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Última actualización:</span>
                            <span className="font-medium">{formatDate(denunciaData.fecha_actualizacion)}</span>
                          </div>
                        )}
                        
                        {denunciaData.autoridad_resolutora && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Autoridad asignada:</span>
                            <span className="font-medium text-xs">{denunciaData.autoridad_resolutora}</span>
                          </div>
                        )}

                        {denunciaData.ubicacion && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ubicación:</span>
                            <span className="font-medium">{denunciaData.ubicacion}</span>
                          </div>
                        )}

                        {denunciaData.es_anonima && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tipo:</span>
                            <Badge variant="outline" className="text-xs">Anónima</Badge>
                          </div>
                        )}

                        {denunciaData.tiene_evidencia && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Evidencia:</span>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              Con archivos adjuntos
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Alert>

                {denunciaData.observaciones && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Información del Proceso
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {denunciaData.observaciones}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center pt-4 border-t space-y-1">
                  <p>Mantenga este folio para futuras consultas.</p>
                  <p>El estado se actualiza automáticamente conforme avanza el proceso.</p>
                  <p className="font-medium">Para más información, contacte a la autoridad competente.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
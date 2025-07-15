// @ts-nocheck
"use client"

import type React from "react"

import { useState, useRef } from "react"
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
  Shield,
  Building,
  Calendar,
  User,
  MapPin,
  ArrowUp,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { seguimientoService } from "@/lib/directus"
import { cn } from "@/lib/utils"

interface SeguimientoModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface DenunciaData {
  id: string
  folio: string
  status: "REGISTRADA" | "TURNADA" | "PROCESO" | "ATENDIDA"
  date_created: string
  fecha_actualizacion?: string | null
  observaciones?: string
  tiempo_transcurrido?: string
  autoridad_resolutora?: string
  ubicacion?: string
  es_anonima?: boolean
  tiene_evidencia?: boolean
}

const STATUS_CONFIG = {
  REGISTRADA: {
    title: "Registrada",
    description: "Su denuncia ha sido registrada exitosamente y está pendiente de revisión inicial.",
    color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200",
    icon: FileText,
    step: 1,
    progressColor: "bg-blue-500",
  },
  TURNADA: {
    title: "Turnada",
    description: "Su denuncia ha sido asignada a la Autoridad Resolutora correspondiente para su atención.",
    color:
      "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-300",
    badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-800/40 dark:text-orange-200",
    icon: ArrowRight,
    step: 2,
    progressColor: "bg-orange-500",
  },
  PROCESO: {
    title: "En Proceso",
    description: "Su denuncia está siendo investigada y atendida activamente por la autoridad competente.",
    color:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-300",
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-200",
    icon: RefreshCw,
    step: 3,
    progressColor: "bg-yellow-500",
  },
  ATENDIDA: {
    title: "Atendida",
    description: "Su denuncia ha sido completamente procesada y resuelta.",
    color:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200",
    icon: CheckCircle2,
    step: 4,
    progressColor: "bg-green-500",
  },
}

const PROGRESS_STEPS = ["REGISTRADA", "TURNADA", "PROCESO", "ATENDIDA"] as const

export function SeguimientoModal({ isOpen, onOpenChange }: SeguimientoModalProps) {
  const [folio, setFolio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [denunciaData, setDenunciaData] = useState<DenunciaData | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

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
      // CAMBIO: Ahora consultamos por folio en lugar de ID
      const denuncia = await seguimientoService.consultarDenuncia(folio.trim())
      setDenunciaData(denuncia)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo encontrar la denuncia. Verifique que el folio sea correcto.",
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
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Monitorear el scroll para mostrar/ocultar el botón de volver arriba
  const handleScroll = () => {
    if (contentRef.current) {
      setShowScrollTop(contentRef.current.scrollTop > 200)
    }
  }

  // Función para volver al inicio del scroll
  const scrollToTop = () => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const renderProgressBar = (currentStatus: string) => {
    const currentStep = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG]?.step || 1
    const currentConfig = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG]

    return (
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          {PROGRESS_STEPS.map((status, index) => {
            const config = STATUS_CONFIG[status]
            const isActive = index + 1 <= currentStep
            const isCurrent = status === currentStatus

            return (
              <div key={status} className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm border-2",
                    isActive
                      ? isCurrent
                        ? `${currentConfig.progressColor} text-white border-white shadow-md`
                        : "bg-green-500 text-white border-green-300 shadow-md"
                      : "bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",
                  )}
                >
                  {isActive && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 text-center font-medium max-w-16 leading-tight",
                    isCurrent
                      ? "text-primary font-semibold"
                      : isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {config.title}
                </span>

                {/* Línea conectora */}
                {index < PROGRESS_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-12 w-16 h-0.5 transition-all duration-300",
                      index + 1 < currentStep
                        ? "bg-green-400"
                        : index + 1 === currentStep
                          ? currentConfig.progressColor
                          : "bg-gray-200 dark:bg-gray-700",
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}:</span>
      </div>
      <span className="text-sm font-medium text-right max-w-48 truncate">{value}</span>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden rounded-lg border-0 shadow-lg">
        {/* Header mejorado */}
        <div className="bg-primary/10 dark:bg-primary/5 p-6 border-b border-primary/20 dark:border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <div className="bg-primary/15 dark:bg-primary/10 p-1.5 rounded-full">
                <Search className="h-6 w-6 text-primary" />
              </div>
              Consulta de Denuncia
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Ingrese el folio de seguimiento para verificar el estado actual de su denuncia.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[60vh]" ref={contentRef} onScroll={handleScroll}>
          {/* Aviso de protección de datos */}
          <Alert className="bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-700/30">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
              Sus datos personales están protegidos conforme a la normativa vigente de protección de datos.
            </AlertDescription>
          </Alert>

          {/* Formulario de consulta */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Búsqueda por Folio
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                      className="w-full pr-10 h-11 text-base"
                      placeholder="Ej: DEN-12345"
                      required
                      disabled={isLoading}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingrese el folio completo que recibió al enviar su denuncia
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1 h-11 font-medium" disabled={isLoading || !folio.trim()}>
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
                      className="h-11 border-2 bg-transparent"
                    >
                      Nueva Consulta
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Resultados */}
          {denunciaData && (
            <Card className="border-2 shadow-md">
              <CardContent className="p-6 space-y-6">
                {/* Información del folio */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div>
                    <span className="text-sm text-muted-foreground">Folio de seguimiento</span>
                    <p className="font-mono font-bold text-xl text-primary">{denunciaData.folio}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyFolio}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Barra de progreso */}
                {renderProgressBar(denunciaData.status)}

                <Separator />

                {/* Estado actual */}
                <Alert className={cn("border-2 shadow-sm", STATUS_CONFIG[denunciaData.status].color)}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-full bg-white/50">
                      {(() => {
                        const IconComponent = STATUS_CONFIG[denunciaData.status].icon
                        return <IconComponent className="h-5 w-5" />
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-xl">{STATUS_CONFIG[denunciaData.status].title}</span>
                        <Badge
                          variant="secondary"
                          className={cn("font-medium", STATUS_CONFIG[denunciaData.status].badgeColor)}
                        >
                          Activo
                        </Badge>
                      </div>
                      <AlertDescription className="text-sm leading-relaxed mb-4 font-medium">
                        {STATUS_CONFIG[denunciaData.status].description}
                      </AlertDescription>

                      {/* Información detallada */}
                      <div className="space-y-1 bg-white/30 p-3 rounded border">
                        <InfoRow
                          icon={Calendar}
                          label="Fecha de registro"
                          value={formatDate(denunciaData.date_created)}
                        />

                        {denunciaData.fecha_actualizacion && (
                          <InfoRow
                            icon={Clock}
                            label="Última actualización"
                            value={formatDate(denunciaData.fecha_actualizacion)}
                          />
                        )}

                        {denunciaData.autoridad_resolutora && (
                          <InfoRow
                            icon={Building}
                            label="Autoridad asignada"
                            value={denunciaData.autoridad_resolutora}
                          />
                        )}

                        {denunciaData.ubicacion && (
                          <InfoRow icon={MapPin} label="Ubicación" value={denunciaData.ubicacion} />
                        )}

                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Tiempo transcurrido:</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {denunciaData.tiempo_transcurrido}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Alert>

                {/* Observaciones */}
                {denunciaData.observaciones && (
                  <Card className="bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Información del Proceso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                        {denunciaData.observaciones}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Información adicional */}
                <div className="text-xs text-muted-foreground text-center pt-4 border-t space-y-1 bg-muted/30 p-4 rounded-lg">
                  <p className="font-medium">Mantenga este folio para futuras consultas.</p>
                  <p>El estado se actualiza automáticamente conforme avanza el proceso.</p>
                  <p className="font-medium text-primary">Para más información, contacte a la autoridad competente.</p>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Botón para volver arriba */}
          {showScrollTop && (
            <Button
              variant="secondary"
              size="icon"
              className="fixed bottom-24 right-6 h-12 w-12 rounded-full shadow-lg z-50 bg-primary/90 text-white hover:bg-primary transition-all duration-300"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          )}
        </div>

        <Separator className="bg-border dark:bg-border/50" />

        <DialogFooter className="p-6 bg-muted/30 dark:bg-muted/10 sticky bottom-0 z-10">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full border-2 hover:bg-muted/50 transition-all duration-200"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

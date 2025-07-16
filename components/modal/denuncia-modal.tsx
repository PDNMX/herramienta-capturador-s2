//@ts-nocheck
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Download,
  Shield,
  Loader2,
  UploadCloud,
  User,
  MapPin,
  Eye,
  EyeOff,
  Building,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowUp,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { jsPDF } from "jspdf"

interface DenunciaData {
  denunciante?: {
    anonimo: boolean
    datosDenunciante?: {
      nombre?: string
      telefono?: string
      email?: string
      proteccion?: boolean
      razonesProteccion?: string
      domicilioDenunciante?: {
        codigoPostal?: string
        calle?: string
        numeroExterior?: string
        numeroInterior?: string
        municipioAlcaldia?: string
      }
    }
  }
  ubicacionHecho?: {
    codigoPostal?: string
    calle?: string
    numero?: string
    ciudad?: string
    estado?: string
    pais?: string
    otrasReferencias?: string
    fechaHecho?: string
    horaHecho?: string
  }
  personaDenunciada?: {
    entidad?: number
    entePublico?: number
    tipoPersona?: string
    nombre?: string
    apellidos?: string
    genero?: string
    descripcion?: string
  }
  faltaCometida?: {
    faltaGrave?: number[]
    faltaNoGrave?: number[]
    hechosCorrupcion?: number[]
  }
  narracionHechos?: string
  archivosEvidencia?: any[]
  testigo?: boolean
  datosTestigos?: Array<{
    nombre?: string
    contacto?: string
  }>
}

interface DenunciaModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode: "confirm" | "success"
  denunciaFolio?: string
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
  uploadProgress?: number
  isUploading?: boolean
  formData?: DenunciaData
}

const entidadesFederativas = {
  1: "Aguascalientes",
  2: "Baja California",
  3: "Baja California Sur",
  4: "Campeche",
  5: "Coahuila",
  6: "Colima",
  7: "Chiapas",
  8: "Chihuahua",
  9: "Ciudad de México",
  10: "Durango",
  11: "Guanajuato",
  12: "Guerrero",
  13: "Hidalgo",
  14: "Jalisco",
  15: "México",
  16: "Michoacán",
  17: "Morelos",
  18: "Nayarit",
  19: "Nuevo León",
  20: "Oaxaca",
  21: "Puebla",
  22: "Querétaro",
  23: "Quintana Roo",
  24: "San Luis Potosí",
  25: "Sinaloa",
  26: "Sonora",
  27: "Tabasco",
  28: "Tamaulipas",
  29: "Tlaxcala",
  30: "Veracruz",
  31: "Yucatán",
  32: "Zacatecas",
  0: "Federal",
  33: "Tribunal de Justicia Administrativa",
}

export function DenunciaModal({
  isOpen,
  onOpenChange,
  mode,
  denunciaFolio,
  onConfirm,
  onCancel,
  onClose,
  uploadProgress = 0,
  isUploading = false,
  formData,
}: DenunciaModalProps) {
  const [downloadReady, setDownloadReady] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    denunciante: true,
    ubicacion: false,
    persona: false,
    faltas: false,
    evidencia: false,
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Monitorear el scroll para mostrar/ocultar el botón de volver arriba
  const handleScroll = () => {
    if (contentRef.current) {
      setShowScrollTop(contentRef.current.scrollTop > 300)
    }
  }

  // Función para volver al inicio del scroll
  const scrollToTop = () => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    if (mode === "success" && denunciaFolio) {
      setDownloadReady(true)
    }
  }, [mode, denunciaFolio])

  useEffect(() => {
    if (isOpen && mode === "confirm") {
      setIsChecked(false)
    }
  }, [isOpen, mode])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Expandir todas las secciones
  const expandAllSections = () => {
    setExpandedSections({
      denunciante: true,
      ubicacion: true,
      persona: true,
      faltas: true,
      evidencia: true,
    })
  }

  // Colapsar todas las secciones
  const collapseAllSections = () => {
    setExpandedSections({
      denunciante: false,
      ubicacion: false,
      persona: false,
      faltas: false,
      evidencia: false,
    })
  }

  const generateFolioPDF = () => {
    if (!denunciaFolio) return

    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF()

      // Configuración de colores
      const primaryColor = [59, 130, 246] // Azul
      const secondaryColor = [107, 114, 128] // Gris
      const successColor = [34, 197, 94] // Verde
      const backgroundColor = [248, 250, 252] // Gris claro

      // Configurar fuente
      doc.setFont("helvetica")

      // ENCABEZADO CON LOGOS
      // Fondo del encabezado
      doc.setFillColor(...backgroundColor)
      doc.rect(0, 0, 210, 50, "F")

      // Línea decorativa superior
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 3, "F")

      // Logo PDN (izquierda) - simulado con texto por ahora
      // REMOVE START
      // Logo SNA (derecha) - simulado con texto

      // REMOVE END

      // Título principal centrado
      doc.setFontSize(18)
      doc.setTextColor(...primaryColor)
      doc.setFont("helvetica", "bold")
      doc.text("COMPROBANTE DE DENUNCIA", 105, 25, { align: "center" })

      // Subtítulo del sistema
      doc.setFontSize(10)
      doc.setTextColor(...secondaryColor)
      doc.setFont("helvetica", "normal")
      doc.text("Sistema de Denuncias Públicas de Faltas", 105, 32, { align: "center" })
      doc.text("Administrativas y Hechos de Corrupción", 105, 38, { align: "center" })

      // Logo SNA (derecha) - simulado con texto
      // REMOVE START
      // REMOVE END

      // SECCIÓN DEL FOLIO
      let yPosition = 70

      // Marco del folio más elegante
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(...primaryColor)
      doc.setLineWidth(2)
      doc.roundedRect(20, yPosition - 10, 170, 35, 5, 5, "FD")

      // Etiqueta "FOLIO"
      doc.setFontSize(12)
      doc.setTextColor(...secondaryColor)
      doc.setFont("helvetica", "bold")
      doc.text("NÚMERO DE FOLIO:", 30, yPosition)

      // Número de folio destacado
      doc.setFontSize(24)
      doc.setTextColor(...primaryColor)
      doc.setFont("helvetica", "bold")
      doc.text(denunciaFolio, 105, yPosition + 15, { align: "center" })

      yPosition += 50

      // ESTADO DE LA DENUNCIA (sin paloma)
      doc.setFillColor(...successColor)
      doc.rect(20, yPosition, 170, 3, "F")
      yPosition += 15

      doc.setFontSize(14)
      doc.setTextColor(...successColor)
      doc.setFont("helvetica", "bold")
      doc.text("DENUNCIA REGISTRADA EXITOSAMENTE", 105, yPosition, { align: "center" })

      yPosition += 25

      // DETALLES DE LA DENUNCIA
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "bold")
      doc.text("DETALLES DEL REGISTRO:", 20, yPosition)

      yPosition += 10
      doc.setFont("helvetica", "normal")

      // Fecha y hora de generación
      const now = new Date()
      const fechaGeneracion = now.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const horaGeneracion = now.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      doc.text(`• Fecha de registro: ${fechaGeneracion}`, 25, yPosition)
      yPosition += 8
      doc.text(`• Hora de registro: ${horaGeneracion}`, 25, yPosition)
      yPosition += 8
      doc.text(`• Estado inicial: REGISTRADA`, 25, yPosition)

      yPosition += 25

      // INSTRUCCIONES
      doc.setFillColor(...backgroundColor)
      doc.rect(20, yPosition - 5, 170, 50, "F")
      doc.setDrawColor(...secondaryColor)
      doc.setLineWidth(1)
      doc.rect(20, yPosition - 5, 170, 50, "D")

      doc.setFontSize(12)
      doc.setTextColor(...primaryColor)
      doc.setFont("helvetica", "bold")
      doc.text("INSTRUCCIONES IMPORTANTES:", 25, yPosition + 5)

      yPosition += 15
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "normal")

      const instrucciones = [
        "1. Conserve este comprobante como evidencia de su denuncia",
        "2. Use el número de folio para consultar el estado de su caso",
        "3. Consulte en: https://dev-denuncias.plataformadigitalnacional.org/",
        "4. Su denuncia será procesada conforme a los procedimientos legales",
      ]

      instrucciones.forEach((instruccion, index) => {
        doc.text(instruccion, 25, yPosition + index * 6)
      })

      yPosition += 35

      // INFORMACIÓN LEGAL
      doc.setFillColor(...primaryColor)
      doc.rect(20, yPosition, 170, 3, "F")
      yPosition += 15

      doc.setFontSize(11)
      doc.setTextColor(...primaryColor)
      doc.setFont("helvetica", "bold")
      doc.text("MARCO LEGAL:", 20, yPosition)

      yPosition += 10
      doc.setFontSize(9)
      doc.setTextColor(...secondaryColor)
      doc.setFont("helvetica", "normal")

      doc.text("Este sistema opera conforme a la Ley General del Sistema Nacional", 25, yPosition)
      yPosition += 5
      doc.text("Anticorrupción y demás normatividad aplicable en materia de", 25, yPosition)
      yPosition += 5
      doc.text("responsabilidades administrativas.", 25, yPosition)

      // PIE DE PÁGINA
      yPosition = 270

      // Línea separadora
      doc.setDrawColor(...secondaryColor)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, 190, yPosition)

      yPosition += 8
      doc.setFontSize(8)
      doc.setTextColor(...secondaryColor)
      doc.setFont("helvetica", "italic")
      doc.text("Este documento es generado automáticamente por el Sistema de Denuncias Públicas", 105, yPosition, {
        align: "center",
      })

      yPosition += 4
      doc.text(`Generado el ${fechaGeneracion} a las ${horaGeneracion}`, 105, yPosition, { align: "center" })

      // MARCA DE AGUA DE FONDO "OFICIAL"
      doc.setGState(new doc.GState({ opacity: 0.1 }))
      doc.setFontSize(60)
      doc.setTextColor(100, 100, 100)
      doc.setFont("helvetica", "bold")

      // Posicionar la marca de agua en el centro, rotada
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height

      doc.text("OFICIAL", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      })

      // Restaurar opacidad normal
      doc.setGState(new doc.GState({ opacity: 1 }))

      // Guardar el PDF
      doc.save(`Comprobante-Denuncia-${denunciaFolio}.pdf`)
    } catch (error) {
      console.error("Error al generar PDF:", error)

      // Fallback al método anterior si falla el PDF
      const content = `
COMPROBANTE DE DENUNCIA
=======================
Sistema de Denuncias Públicas de Faltas Administrativas y Hechos de Corrupción

Número de Folio: ${denunciaFolio}

IMPORTANTE: 
Por favor, guarde este número de folio en un lugar seguro.
Lo necesitará para dar seguimiento al estado de su denuncia.

Fecha de generación: ${new Date().toLocaleString()}

Para consultar el estado de su denuncia, utilice este folio 
en la sección de "Consultar Estatus" del sistema.
    `.trim()

      const blob = new Blob([content], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `folio-denuncia-${denunciaFolio}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    onClose?.()
    if (mode === "success") {
      router.push("/")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada"
    try {
      return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const SummarySection = ({
    title,
    icon: Icon,
    children,
    sectionKey,
    isEmpty = false,
  }: {
    title: string
    icon: any
    children: React.ReactNode
    sectionKey: string
    isEmpty?: boolean
  }) => (
    <div className="mb-4">
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md",
          isEmpty ? "border-gray-200 bg-gray-50" : "border-blue-200 bg-blue-50",
        )}
      >
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleSection(sectionKey)}>
          <CardTitle
            className={cn(
              "text-sm font-medium flex items-center justify-between",
              isEmpty ? "text-gray-600" : "text-blue-800",
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {title}
              {isEmpty && (
                <Badge variant="secondary" className="text-xs">
                  Sin información
                </Badge>
              )}
            </div>
            {expandedSections[sectionKey] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>

        {expandedSections[sectionKey] && <CardContent className="pt-0 pb-4">{children}</CardContent>}
      </Card>
    </div>
  )

  const InfoRow = ({
    label,
    value,
    sensitive = false,
  }: {
    label: string
    value: string | undefined | null
    sensitive?: boolean
  }) => {
    const [showSensitive, setShowSensitive] = useState(false)

    if (!value) return null

    return (
      <div className="flex justify-between items-center py-1">
        <span className="text-sm text-gray-600">{label}:</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-right max-w-48 truncate">
            {sensitive && !showSensitive ? "••••••••••" : value}
          </span>
          {sensitive && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowSensitive(!showSensitive)}>
              {showSensitive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden rounded-lg border-0 shadow-lg">
        {mode === "confirm" ? (
          <>
            <div className="bg-primary/10 dark:bg-primary/5 p-6 border-b border-primary/20 dark:border-primary/10 sticky top-0 z-10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <div className="bg-primary/15 dark:bg-primary/10 p-1.5 rounded-full">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  Confirmar Envío de Denuncia
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-2">
                  Revise cuidadosamente la información antes de enviar. Una vez enviada, no podrá modificar los datos.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Contenedor con scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]" ref={contentRef} onScroll={handleScroll}>
              {/* Controles de expansión */}
              <div className="flex justify-between items-center mb-2 sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-2 -mx-2 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resumen de la Información
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={expandAllSections}
                    className="text-xs h-8 bg-transparent"
                  >
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Expandir todo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={collapseAllSections}
                    className="text-xs h-8 bg-transparent"
                  >
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Colapsar todo
                  </Button>
                </div>
              </div>

              {/* Progreso de carga */}
              {isUploading && (
                <div className="space-y-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <UploadCloud className="h-4 w-4" />
                      Subiendo archivos de evidencia...
                    </span>
                    <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 bg-blue-100 dark:bg-blue-800/40" />
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/90 mt-1">
                    Por favor no cierre esta ventana mientras se suban los archivos.
                  </p>
                </div>
              )}

              {/* Resumen de información */}
              {formData && (
                <div className="space-y-4">
                  {/* Datos del Denunciante */}
                  <SummarySection
                    title="Datos del Denunciante"
                    icon={User}
                    sectionKey="denunciante"
                    isEmpty={formData.denunciante?.anonimo}
                  >
                    {formData.denunciante?.anonimo ? (
                      <div className="text-center py-4 text-gray-500">
                        <Shield className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Denuncia Anónima</p>
                        <p className="text-xs text-gray-400">No se han proporcionado datos personales</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <InfoRow
                          label="Nombre completo"
                          value={formData.denunciante?.datosDenunciante?.nombre}
                          sensitive
                        />
                        <InfoRow label="Teléfono" value={formData.denunciante?.datosDenunciante?.telefono} sensitive />
                        <InfoRow label="Email" value={formData.denunciante?.datosDenunciante?.email} sensitive />
                        {formData.denunciante?.datosDenunciante?.domicilioDenunciante && (
                          <>
                            <Separator className="my-2" />
                            <p className="text-xs font-medium text-gray-700 mb-1">Domicilio:</p>
                            <InfoRow
                              label="Calle y número"
                              value={`${formData.denunciante.datosDenunciante.domicilioDenunciante.calle || ""} ${formData.denunciante.datosDenunciante.domicilioDenunciante.numeroExterior || ""}`.trim()}
                            />
                            <InfoRow
                              label="Municipio/Alcaldía"
                              value={formData.denunciante.datosDenunciante.domicilioDenunciante.municipioAlcaldia}
                            />
                            <InfoRow
                              label="Código Postal"
                              value={formData.denunciante.datosDenunciante.domicilioDenunciante.codigoPostal}
                            />
                          </>
                        )}
                        {formData.denunciante?.datosDenunciante?.proteccion && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                            <p className="text-xs text-amber-800">
                              <Shield className="h-3 w-3 inline mr-1" />
                              Solicita protección de identidad
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </SummarySection>

                  {/* Ubicación del Hecho */}
                  <SummarySection
                    title="Ubicación del Hecho"
                    icon={MapPin}
                    sectionKey="ubicacion"
                    isEmpty={!formData.ubicacionHecho?.fechaHecho}
                  >
                    <div className="space-y-2">
                      <InfoRow label="Fecha del hecho" value={formatDate(formData.ubicacionHecho?.fechaHecho || "")} />
                      <InfoRow label="Hora" value={formData.ubicacionHecho?.horaHecho} />
                      <InfoRow
                        label="Calle y número"
                        value={`${formData.ubicacionHecho?.calle || ""} ${formData.ubicacionHecho?.numero || ""}`.trim()}
                      />
                      <InfoRow label="Ciudad" value={formData.ubicacionHecho?.ciudad} />
                      <InfoRow label="Estado" value={formData.ubicacionHecho?.estado} />
                      <InfoRow label="Referencias adicionales" value={formData.ubicacionHecho?.otrasReferencias} />
                    </div>
                  </SummarySection>

                  {/* Persona Denunciada */}
                  <SummarySection
                    title="Persona Denunciada"
                    icon={Building}
                    sectionKey="persona"
                    isEmpty={!formData.personaDenunciada?.tipoPersona}
                  >
                    <div className="space-y-2">
                      <InfoRow
                        label="Tipo de persona"
                        value={
                          formData.personaDenunciada?.tipoPersona === "SERVIDOR_PUBLICO"
                            ? "Servidor Público"
                            : "Particular"
                        }
                      />
                      <InfoRow
                        label="Entidad"
                        value={
                          formData.personaDenunciada?.entidad
                            ? entidadesFederativas[formData.personaDenunciada.entidad]
                            : undefined
                        }
                      />
                      <InfoRow label="Nombre" value={formData.personaDenunciada?.nombre} />
                      <InfoRow label="Apellidos" value={formData.personaDenunciada?.apellidos} />
                      <InfoRow label="Descripción adicional" value={formData.personaDenunciada?.descripcion} />
                    </div>
                  </SummarySection>

                  {/* Narración de Hechos */}
                  <SummarySection
                    title="Narración de los Hechos"
                    icon={FileText}
                    sectionKey="faltas"
                    isEmpty={!formData.narracionHechos}
                  >
                    <div className="bg-gray-50 p-3 rounded border text-sm">
                      <p className="leading-relaxed">
                        {formData.narracionHechos || "No se ha proporcionado narración de hechos"}
                      </p>
                    </div>
                  </SummarySection>

                  {/* Evidencia y Testigos */}
                  <SummarySection
                    title="Evidencia y Testigos"
                    icon={Users}
                    sectionKey="evidencia"
                    isEmpty={!formData.archivosEvidencia?.length && !formData.testigo}
                  >
                    <div className="space-y-3">
                      {formData.archivosEvidencia && formData.archivosEvidencia.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Archivos de evidencia:</p>
                          <div className="space-y-1">
                            {formData.archivosEvidencia.map((archivo, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span>{archivo.name || `Archivo ${index + 1}`}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {archivo.size ? `${Math.round(archivo.size / 1024)} KB` : "Tamaño desconocido"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.testigo && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Testigos:</p>
                          {formData.datosTestigos && formData.datosTestigos.length > 0 ? (
                            <div className="space-y-2">
                              {formData.datosTestigos.map((testigo, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded border">
                                  <InfoRow label="Nombre" value={testigo.nombre} />
                                  <InfoRow label="Contacto" value={testigo.contacto} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Se cuenta con testigos (sin datos específicos)</p>
                          )}
                        </div>
                      )}

                      {!formData.archivosEvidencia?.length && !formData.testigo && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          No se han proporcionado evidencias o testigos
                        </p>
                      )}
                    </div>
                  </SummarySection>
                </div>
              )}

              {/* Checkbox de confirmación */}
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
                    disabled={isUploading}
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor="terms"
                      className={cn(
                        "text-sm font-semibold leading-tight cursor-pointer",
                        "text-amber-800 dark:text-amber-300",
                        isUploading ? "opacity-70" : "",
                      )}
                    >
                      Protesto decir verdad respecto de la denuncia presentada
                    </label>
                    <p
                      className={cn(
                        "text-xs",
                        "text-amber-700/80 dark:text-amber-400/90",
                        isUploading ? "opacity-70" : "",
                      )}
                    >
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

              {/* Botón para volver arriba */}
              {showScrollTop && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="fixed bottom-20 right-6 h-10 w-10 rounded-full shadow-lg z-50 bg-primary/90 text-white hover:bg-primary"
                  onClick={scrollToTop}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              )}
            </div>

            <Separator className="bg-border dark:bg-border/50" />

            <DialogFooter className="p-6 flex flex-col sm:flex-row gap-3 sm:justify-end bg-muted/30 dark:bg-muted/10 sticky bottom-0 z-10">
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-2 hover:bg-muted/50 transition-all duration-200 bg-transparent"
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                disabled={!isChecked || isUploading}
                className={cn(
                  "font-medium transition-all duration-300 flex items-center gap-2",
                  isChecked && !isUploading
                    ? "bg-primary hover:bg-primary/90 shadow-md"
                    : "bg-primary/60 dark:bg-primary/40",
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : !isChecked ? (
                  "Marque la casilla para continuar"
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    Confirmar y Enviar
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Modal de éxito */}
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
              {/* Sección del folio mejorada */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-700/30 shadow-lg">
                  {/* Decoración superior */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-3 shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="text-center pt-4">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Folio de Seguimiento</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Guarde este número para consultar el estado de su denuncia
                    </p>

                    {/* Folio destacado */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-blue-300 dark:border-blue-600 shadow-inner">
                      <div className="font-mono text-2xl font-bold text-blue-800 dark:text-blue-200 tracking-wider">
                        {denunciaFolio}
                      </div>
                    </div>

                    {/* Botón de copiar */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(denunciaFolio || "")
                        // Aquí podrías agregar un toast de confirmación
                      }}
                      className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copiar folio
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Descargue su comprobante oficial en formato PDF para conservar como evidencia.
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
                onClick={generateFolioPDF}
                disabled={!downloadReady}
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar Comprobante PDF
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 hover:bg-muted/50 transition-all duration-200 bg-transparent"
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

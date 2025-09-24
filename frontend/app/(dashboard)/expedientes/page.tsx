"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  FileText,
  Folder,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
} from "lucide-react"

export default function ExpedientesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for expedientes
  const expedientes = [
    {
      id: "1",
      codigo: "EXP-2024-001",
      titulo: "Expediente Adquisición de Equipos de Cómputo",
      contratacion: "CONT-2024-001",
      institucion: "Secretaría de Educación Pública",
      status: "active",
      fecha_creacion: "2024-01-15",
      fecha_vencimiento: "2024-03-15",
      documentos: 12,
      responsable: "Ana García López",
    },
    {
      id: "2",
      codigo: "EXP-2024-002",
      titulo: "Expediente Servicios de Consultoría",
      contratacion: "CONT-2024-002",
      institucion: "Secretaría de Salud",
      status: "pending",
      fecha_creacion: "2024-01-20",
      fecha_vencimiento: "2024-04-20",
      documentos: 8,
      responsable: "Carlos Mendoza",
    },
    {
      id: "3",
      codigo: "EXP-2024-003",
      titulo: "Expediente Obra Pública Carretera",
      contratacion: "CONT-2024-003",
      institucion: "Secretaría de Comunicaciones",
      status: "completed",
      fecha_creacion: "2024-01-10",
      fecha_vencimiento: "2024-02-10",
      documentos: 25,
      responsable: "María Rodríguez",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Activo
        </Badge>
      case "pending":
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pendiente
        </Badge>
      case "completed":
        return <Badge variant="info" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completado
        </Badge>
      case "expired":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Vencido
        </Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDaysToExpire = (fechaVencimiento: string) => {
    const today = new Date()
    const expireDate = new Date(fechaVencimiento)
    const diffTime = expireDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredExpedientes = expedientes.filter(exp =>
    exp.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.institucion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expedientes</h1>
          <p className="text-muted-foreground">
            Gestión de expedientes y documentación de procedimientos de contratación
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button className="bg-government-primary hover:bg-government-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Expediente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expedientes</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expedientes.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 nuevos esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expedientes.filter(e => e.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              En proceso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expedientes.filter(e => e.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expedientes.reduce((sum, e) => sum + e.documentos, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de documentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Expedientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, título o institución..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtros Avanzados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expedientes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExpedientes.map((expediente) => {
          const daysToExpire = getDaysToExpire(expediente.fecha_vencimiento)

          return (
            <Card key={expediente.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{expediente.codigo}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {expediente.titulo}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="mr-2 h-4 w-4" />
                        Subir documento
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estado:</span>
                    {getStatusBadge(expediente.status)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Institución:</span>
                    <span className="text-right max-w-[200px] truncate">{expediente.institucion}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Responsable:</span>
                    <span>{expediente.responsable}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Documentos:</span>
                    <Badge variant="outline">{expediente.documentos}</Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vence en:</span>
                    <span className={`font-medium ${
                      daysToExpire < 7 ? 'text-red-600' :
                      daysToExpire < 30 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {daysToExpire > 0 ? `${daysToExpire} días` : 'Vencido'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Fecha límite: {new Date(expediente.fecha_vencimiento).toLocaleDateString('es-MX')}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button size="sm" className="flex-1 bg-government-primary hover:bg-government-primary/90">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredExpedientes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron expedientes</h3>
            <p className="text-muted-foreground text-center mb-4">
              No hay expedientes que coincidan con los criterios de búsqueda.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear nuevo expediente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
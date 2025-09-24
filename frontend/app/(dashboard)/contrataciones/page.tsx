"use client"

import { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/tables/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Download, FileText, Calendar, DollarSign, Users } from "lucide-react"
import { ProcurementContract } from "@/types"
import { directusClient } from "@/lib/directus"
import { formatDate, formatCurrency } from "@/lib/utils"

export default function ContratacionesPage() {
  const [data, setData] = useState<ProcurementContract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContrataciones()
  }, [])

  const fetchContrataciones = async () => {
    try {
      setLoading(true)
      const contrataciones = await directusClient.getContrataciones()
      setData(contrataciones as ProcurementContract[])
    } catch (error) {
      console.error("Error fetching contrataciones:", error)
      // Set mock data for now
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Borrador</Badge>
      case "published":
        return <Badge variant="info">Publicado</Badge>
      case "in_progress":
        return <Badge variant="warning">En Progreso</Badge>
      case "completed":
        return <Badge variant="success">Completado</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    const tipos = {
      adquisiciones: { label: "Adquisiciones", color: "bg-blue-100 text-blue-800" },
      arrendamientos: { label: "Arrendamientos", color: "bg-green-100 text-green-800" },
      servicios: { label: "Servicios", color: "bg-purple-100 text-purple-800" },
      obra_publica: { label: "Obra Pública", color: "bg-orange-100 text-orange-800" },
    }

    const tipoInfo = tipos[tipo as keyof typeof tipos] || { label: tipo, color: "bg-gray-100 text-gray-800" }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipoInfo.color}`}>
        {tipoInfo.label}
      </span>
    )
  }

  const columns: ColumnDef<ProcurementContract>[] = [
    {
      accessorKey: "numero_procedimiento",
      header: "Número de Procedimiento",
      cell: ({ row }) => {
        const contract = row.original
        return (
          <div>
            <div className="font-medium">{contract.numero_procedimiento}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
              {contract.titulo_contratacion}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "tipo_contratacion",
      header: "Tipo",
      cell: ({ row }) => getTipoBadge(row.getValue("tipo_contratacion")),
    },
    {
      accessorKey: "institucion_dependencia",
      header: "Institución",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("institucion_dependencia")}</div>
      ),
    },
    {
      accessorKey: "precio_total",
      header: "Monto",
      cell: ({ row }) => formatCurrency(row.getValue("precio_total")),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "fecha_inicio",
      header: "Fecha Inicio",
      cell: ({ row }) => formatDate(row.getValue("fecha_inicio")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contract = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
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
                <FileText className="mr-2 h-4 w-4" />
                Documentos
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-government-primary"></div>
      </div>
    )
  }

  const totalMonto = data.reduce((sum, contract) => sum + (contract.precio_total || 0), 0)
  const activeContracts = data.filter(c => c.status === "in_progress").length
  const completedContracts = data.filter(c => c.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contrataciones Públicas</h1>
          <p className="text-muted-foreground">
            Gestión de procedimientos de contrataciones públicas del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button className="bg-government-primary hover:bg-government-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Contratación
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contrataciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              Procedimientos activos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonto)}</div>
            <p className="text-xs text-muted-foreground">
              Valor total de contratos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedContracts}</div>
            <p className="text-xs text-muted-foreground">
              Procedimientos finalizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Contratación</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos</option>
                <option value="adquisiciones">Adquisiciones</option>
                <option value="servicios">Servicios</option>
                <option value="obra_publica">Obra Pública</option>
                <option value="arrendamientos">Arrendamientos</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos</option>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Desde</label>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Hasta</label>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contrataciones</CardTitle>
          <CardDescription>
            Administra los procedimientos de contrataciones públicas registrados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="numero_procedimiento"
            searchPlaceholder="Buscar por número, título o institución..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/tables/data-table"
import { PublicServantForm } from "@/components/forms/public-servant-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Download } from "lucide-react"
import { PublicServant } from "@/types"
import { PublicServantFormData } from "@/lib/validations"
import { directusClient } from "@/lib/directus"
import { formatDate } from "@/lib/utils"

export default function ServidoresPage() {
  const [data, setData] = useState<PublicServant[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingServant, setEditingServant] = useState<PublicServant | null>(null)
  const [deleteServant, setDeleteServant] = useState<PublicServant | null>(null)

  useEffect(() => {
    fetchServidores()
  }, [])

  const fetchServidores = async () => {
    try {
      setLoading(true)
      const servidores = await directusClient.getServidoresPublicos()
      setData(servidores as PublicServant[])
    } catch (error) {
      console.error("Error fetching servidores:", error)
      // Set mock data for now
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateServant = async (formData: PublicServantFormData) => {
    try {
      await directusClient.createItem("servidores_publicos", {
        ...formData,
        status: "active",
      })
      await fetchServidores()
      setShowForm(false)
    } catch (error) {
      console.error("Error creating servant:", error)
      throw error
    }
  }

  const handleEditServant = async (formData: PublicServantFormData) => {
    if (!editingServant) return

    try {
      await directusClient.updateItem("servidores_publicos", editingServant.id, formData)
      await fetchServidores()
      setEditingServant(null)
    } catch (error) {
      console.error("Error updating servant:", error)
      throw error
    }
  }

  const handleDeleteServant = async () => {
    if (!deleteServant) return

    try {
      await directusClient.deleteItem("servidores_publicos", deleteServant.id)
      await fetchServidores()
      setDeleteServant(null)
    } catch (error) {
      console.error("Error deleting servant:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Activo</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactivo</Badge>
      case "suspended":
        return <Badge variant="warning">Suspendido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const columns: ColumnDef<PublicServant>[] = [
    {
      accessorKey: "nombres",
      header: "Nombre Completo",
      cell: ({ row }) => {
        const servant = row.original
        return (
          <div>
            <div className="font-medium">
              {servant.nombres} {servant.primer_apellido} {servant.segundo_apellido}
            </div>
            <div className="text-sm text-muted-foreground">{servant.curp}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "institucion_dependencia",
      header: "Institución",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("institucion_dependencia")}</div>
      ),
    },
    {
      accessorKey: "puesto_cargo",
      header: "Puesto/Cargo",
    },
    {
      accessorKey: "tipo_area",
      header: "Área",
      cell: ({ row }) => {
        const tipo = row.getValue("tipo_area") as string
        return (
          <Badge variant="outline">
            {tipo === "administrativa" ? "Administrativa" :
             tipo === "tecnica" ? "Técnica" :
             tipo === "juridica" ? "Jurídica" :
             tipo === "financiera" ? "Financiera" : tipo}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "fecha_ingreso",
      header: "Fecha Ingreso",
      cell: ({ row }) => formatDate(row.getValue("fecha_ingreso")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const servant = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingServant(servant)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteServant(servant)}
                className="text-red-600"
              >
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servidores Públicos</h1>
          <p className="text-muted-foreground">
            Gestión de servidores públicos que intervienen en procedimientos de contrataciones públicas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-government-primary hover:bg-government-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Servidor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servidores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(s => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instituciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(data.map(s => s.institucion_dependencia)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos (Este mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Servidores Públicos</CardTitle>
          <CardDescription>
            Administra la información de los servidores públicos registrados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="nombres"
            searchPlaceholder="Buscar por nombre, CURP o institución..."
          />
        </CardContent>
      </Card>

      {/* Create Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Servidor Público</DialogTitle>
          </DialogHeader>
          <PublicServantForm
            onSubmit={handleCreateServant}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={!!editingServant} onOpenChange={() => setEditingServant(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Servidor Público</DialogTitle>
          </DialogHeader>
          {editingServant && (
            <PublicServantForm
              initialData={editingServant}
              onSubmit={handleEditServant}
              onCancel={() => setEditingServant(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteServant} onOpenChange={() => setDeleteServant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro del servidor público{" "}
              <strong>
                {deleteServant?.nombres} {deleteServant?.primer_apellido}
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteServant}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
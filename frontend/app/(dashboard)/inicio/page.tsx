"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/charts/stats-card"
import { OverviewChart } from "@/components/charts/overview-chart"
import { PieChartComponent } from "@/components/charts/pie-chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  Folder,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react"
import { directusClient } from "@/lib/directus"
import { DashboardStats } from "@/types"
import { formatCurrency } from "@/lib/utils"

export default function InicioPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const dashboardStats = await directusClient.getDashboardStats()
        setStats(dashboardStats as DashboardStats)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        // Set mock stats for now
        setStats({
          total_servidores: 0,
          total_contrataciones: 0,
          total_expedientes: 0,
          contrataciones_activas: 0,
          servidores_activos: 0,
          expedientes_pendientes: 0,
          monto_total_contrataciones: 0,
          promedio_duracion_procedimientos: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-government-primary"></div>
      </div>
    )
  }

  const overviewData = [
    {
      name: "Ene",
      servidores: 120,
      contrataciones: 45,
    },
    {
      name: "Feb",
      servidores: 132,
      contrataciones: 52,
    },
    {
      name: "Mar",
      servidores: 145,
      contrataciones: 48,
    },
    {
      name: "Abr",
      servidores: 155,
      contrataciones: 61,
    },
    {
      name: "May",
      servidores: 168,
      contrataciones: 55,
    },
    {
      name: "Jun",
      servidores: 178,
      contrataciones: 67,
    },
  ]

  const contractTypesData = [
    { name: "Adquisiciones", value: 35, color: "#8B1538" },
    { name: "Servicios", value: 28, color: "#1C4E80" },
    { name: "Obra Pública", value: 22, color: "#B8860B" },
    { name: "Arrendamientos", value: 15, color: "#7A0019" },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "Nuevo servidor público registrado",
      user: "Ana García López",
      time: "Hace 2 horas",
      type: "servidor",
    },
    {
      id: 2,
      action: "Contratación pública actualizada",
      user: "Carlos Mendoza",
      time: "Hace 4 horas",
      type: "contratacion",
    },
    {
      id: 3,
      action: "Expediente completado",
      user: "María Rodríguez",
      time: "Hace 6 horas",
      type: "expediente",
    },
    {
      id: 4,
      action: "Nuevo documento cargado",
      user: "José Hernández",
      time: "Hace 8 horas",
      type: "documento",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
          <p className="text-muted-foreground">
            Resumen general del Sistema de Servidores Públicos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="success" className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Sistema Activo</span>
          </Badge>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Servidores"
          value={stats?.total_servidores.toLocaleString() || "0"}
          change={{
            value: 12,
            label: "vs mes anterior",
            type: "increase",
          }}
          icon={Users}
        />
        <StatsCard
          title="Total Contrataciones"
          value={stats?.total_contrataciones.toLocaleString() || "0"}
          change={{
            value: 8,
            label: "vs mes anterior",
            type: "increase",
          }}
          icon={FileText}
        />
        <StatsCard
          title="Expedientes"
          value={stats?.total_expedientes.toLocaleString() || "0"}
          change={{
            value: 5,
            label: "vs mes anterior",
            type: "increase",
          }}
          icon={Folder}
        />
        <StatsCard
          title="Monto Total"
          value={formatCurrency(stats?.monto_total_contrataciones || 0)}
          change={{
            value: 15,
            label: "vs mes anterior",
            type: "increase",
          }}
          icon={DollarSign}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen Mensual</CardTitle>
            <CardDescription>
              Registro de servidores públicos y contrataciones por mes
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={overviewData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
            <CardDescription>
              Tipos de contrataciones públicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={contractTypesData} />
          </CardContent>
        </Card>
      </div>

      {/* Activity and Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-government-primary rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} - {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Alertas y Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">5 expedientes por vencer</p>
                  <p className="text-xs text-muted-foreground">
                    Revisa los expedientes que vencen esta semana
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo reporte disponible</p>
                  <p className="text-xs text-muted-foreground">
                    Reporte mensual de contrataciones públicas
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <Users className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sistema actualizado</p>
                  <p className="text-xs text-muted-foreground">
                    Nueva versión del sistema S2 implementada
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
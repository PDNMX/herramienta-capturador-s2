"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { OverviewChart } from "@/components/charts/overview-chart"
import { PieChartComponent } from "@/components/charts/pie-chart"
import {
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: "2024-12-31"
  })

  // Mock data for charts
  const monthlyData = [
    { name: "Ene", servidores: 120, contrataciones: 45, monto: 2500000 },
    { name: "Feb", servidores: 132, contrataciones: 52, monto: 3200000 },
    { name: "Mar", servidores: 145, contrataciones: 48, monto: 2800000 },
    { name: "Abr", servidores: 155, contrataciones: 61, monto: 4100000 },
    { name: "May", servidores: 168, contrataciones: 55, monto: 3500000 },
    { name: "Jun", servidores: 178, contrataciones: 67, monto: 4800000 },
  ]

  const institutionData = [
    { name: "SEP", value: 35, color: "#8B1538" },
    { name: "SALUD", value: 28, color: "#1C4E80" },
    { name: "COMUNICACIONES", value: 22, color: "#B8860B" },
    { name: "HACIENDA", value: 15, color: "#7A0019" },
  ]

  const contractTypeData = [
    { name: "Adquisiciones", value: 40, color: "#8B1538" },
    { name: "Servicios", value: 30, color: "#1C4E80" },
    { name: "Obra Pública", value: 20, color: "#B8860B" },
    { name: "Arrendamientos", value: 10, color: "#7A0019" },
  ]

  const reportTemplates = [
    {
      id: 1,
      title: "Reporte Mensual de Servidores Públicos",
      description: "Estadísticas mensuales de servidores públicos registrados",
      icon: Users,
      color: "bg-blue-100 text-blue-700",
      lastGenerated: "2024-02-01",
    },
    {
      id: 2,
      title: "Reporte de Contrataciones por Institución",
      description: "Análisis de contrataciones agrupadas por institución",
      icon: FileText,
      color: "bg-green-100 text-green-700",
      lastGenerated: "2024-01-28",
    },
    {
      id: 3,
      title: "Reporte Financiero de Contrataciones",
      description: "Análisis de montos y presupuestos de contrataciones",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-700",
      lastGenerated: "2024-01-25",
    },
    {
      id: 4,
      title: "Reporte de Cumplimiento y Expedientes",
      description: "Estado de expedientes y cumplimiento de plazos",
      icon: Calendar,
      color: "bg-purple-100 text-purple-700",
      lastGenerated: "2024-01-20",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes y Analytics</h1>
          <p className="text-muted-foreground">
            Análisis estadístico y reportes del sistema de servidores públicos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button className="bg-government-primary hover:bg-government-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Exportar Todo
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
          <CardDescription>
            Selecciona el rango de fechas para generar los reportes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Desde</label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Hasta</label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Institución</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todas las instituciones</option>
                <option value="sep">Secretaría de Educación Pública</option>
                <option value="salud">Secretaría de Salud</option>
                <option value="comunicaciones">Secretaría de Comunicaciones</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Actualizar Reportes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTemplates.map((template) => {
          const Icon = template.icon
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${template.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Último: {new Date(template.lastGenerated).toLocaleDateString('es-MX')}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Generar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Tendencias Mensuales</span>
            </CardTitle>
            <CardDescription>
              Evolución mensual de servidores públicos y contrataciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Distribución por Institución</span>
            </CardTitle>
            <CardDescription>
              Porcentaje de servidores públicos por institución
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={institutionData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Tipos de Contratación</span>
            </CardTitle>
            <CardDescription>
              Distribución de contrataciones por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={contractTypeData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Principales</CardTitle>
            <CardDescription>
              Indicadores clave del período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Servidores</div>
                <div className="text-2xl font-bold">1,298</div>
                <div className="text-xs text-green-600">+12% vs anterior</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Contrataciones</div>
                <div className="text-2xl font-bold">328</div>
                <div className="text-xs text-green-600">+8% vs anterior</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Monto Total</div>
                <div className="text-2xl font-bold">$20.9M</div>
                <div className="text-xs text-green-600">+15% vs anterior</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Instituciones</div>
                <div className="text-2xl font-bold">45</div>
                <div className="text-xs text-blue-600">+3 nuevas</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full bg-government-primary hover:bg-government-primary/90">
                <FileText className="mr-2 h-4 w-4" />
                Generar Reporte Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Opciones de Exportación</CardTitle>
          <CardDescription>
            Exporta los datos en diferentes formatos para análisis externo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Exportar a PDF</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Exportar a Excel</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <LineChart className="h-6 w-6" />
              <span>Exportar Datos CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
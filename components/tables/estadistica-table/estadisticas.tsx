import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, Users, Building, CheckCircle, Clock, AlertTriangle, MapPin } from "lucide-react"

// Datos de ejemplo (reemplazar con datos reales de tu API)
const datosEntidades = [
  { nombre: "Aguascalientes", denuncias: 120, completadas: 80, enProceso: 30, pendientes: 10 },
  { nombre: "Baja California", denuncias: 230, completadas: 150, enProceso: 60, pendientes: 20 },
  { nombre: "Baja California Sur", denuncias: 90, completadas: 60, enProceso: 20, pendientes: 10 },
  { nombre: "Campeche", denuncias: 80, completadas: 50, enProceso: 20, pendientes: 10 },
  { nombre: "Chiapas", denuncias: 150, completadas: 100, enProceso: 40, pendientes: 10 },
]

const datosEntes = [
  { nombre: "Secretaría de Educación", denuncias: 150, completadas: 100, enProceso: 40, pendientes: 10 },
  { nombre: "Secretaría de Salud", denuncias: 200, completadas: 130, enProceso: 50, pendientes: 20 },
  { nombre: "Secretaría de Seguridad", denuncias: 180, completadas: 120, enProceso: 45, pendientes: 15 },
  { nombre: "Secretaría de Hacienda", denuncias: 120, completadas: 80, enProceso: 30, pendientes: 10 },
  { nombre: "Secretaría de Desarrollo Social", denuncias: 90, completadas: 60, enProceso: 25, pendientes: 5 },
]

const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9E9E9E"]

export function Estadisticas() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("ultimo-mes")
  const totalDenuncias = datosEntidades.reduce((acc, curr) => acc + curr.denuncias, 0)
  const totalCompletadas = datosEntidades.reduce((acc, curr) => acc + curr.completadas, 0)
  const totalEnProceso = datosEntidades.reduce((acc, curr) => acc + curr.enProceso, 0)
  const totalPendientes = datosEntidades.reduce((acc, curr) => acc + curr.pendientes, 0)

  const datosEstado = [
    { nombre: "Completadas", valor: totalCompletadas, color: COLORS[0], icon: CheckCircle },
    { nombre: "En Proceso", valor: totalEnProceso, color: COLORS[1], icon: Clock },
    { nombre: "Pendientes", valor: totalPendientes, color: COLORS[2], icon: AlertTriangle },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden gradient-background">

      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="entidades">Entidades</TabsTrigger>
          <TabsTrigger value="entes">Entes Públicos</TabsTrigger>
          <TabsTrigger value="mapas">Mapas de Calor</TabsTrigger>
        </TabsList>

        <div className="flex justify-end mb-4">
          <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimo-mes">Último mes</SelectItem>
              <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
              <SelectItem value="ultimo-anio">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="resumen">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Denuncias</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDenuncias}</div>
                <p className="text-xs text-muted-foreground">+20.1% desde el último periodo</p>
              </CardContent>
            </Card>
            {datosEstado.map((estado) => (
              <Card key={estado.nombre}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{estado.nombre}</CardTitle>
                  <estado.icon className="h-4 w-4" style={{ color: estado.color }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estado.valor}</div>
                  <p className="text-xs text-muted-foreground">
                    {((estado.valor / totalDenuncias) * 100).toFixed(1)}% del total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Entidades Federativas</CardTitle>
                <CardDescription>Entidades con más denuncias</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosEntidades.slice(0, 5)} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" />
                    <Tooltip />
                    <Bar dataKey="denuncias" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Ente Público</CardTitle>
                <CardDescription>Porcentaje de denuncias por ente</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosEntes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="denuncias"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {datosEntes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="entidades">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Denuncias por Entidad</CardTitle>
              <CardDescription>Desglose de denuncias por estado y entidad</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosEntidades} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completadas" stackId="a" fill={COLORS[0]} />
                  <Bar dataKey="enProceso" stackId="a" fill={COLORS[1]} />
                  <Bar dataKey="pendientes" stackId="a" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entes">
          <Card>
            <CardHeader>
              <CardTitle>Denuncias por Ente Público</CardTitle>
              <CardDescription>Desglose detallado de denuncias por ente público</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosEntes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completadas" stackId="a" fill={COLORS[0]} />
                  <Bar dataKey="enProceso" stackId="a" fill={COLORS[1]} />
                  <Bar dataKey="pendientes" stackId="a" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapas">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor de Denuncias</CardTitle>
              <CardDescription>Distribución geográfica de denuncias en la República Mexicana</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p>Aquí se integrará el mapa de calor de la República Mexicana.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  (Se requiere integración con una biblioteca de mapas como react-simple-maps o react-leaflet)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-end mt-4">
          <Button>Descargar Reporte Completo</Button>
        </div>
      </Tabs>
    </main>
  )
}


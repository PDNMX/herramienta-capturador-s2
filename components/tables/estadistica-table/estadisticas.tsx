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
import { ArrowUpRight, TrendingUp, Users, Building } from "lucide-react"

// Datos de ejemplo (reemplazar con datos reales de tu API)
const datosEntidades = [
  { nombre: "Aguascalientes", denuncias: 120, porcentaje: 5 },
  { nombre: "Baja California", denuncias: 230, porcentaje: 10 },
  { nombre: "Baja California Sur", denuncias: 90, porcentaje: 4 },
  { nombre: "Campeche", denuncias: 80, porcentaje: 3.5 },
  { nombre: "Chiapas", denuncias: 150, porcentaje: 6.5 },
  // ... Agregar más estados
]

const datosEntes = [
  { nombre: "Secretaría de Educación", denuncias: 150, porcentaje: 20 },
  { nombre: "Secretaría de Salud", denuncias: 200, porcentaje: 26 },
  { nombre: "Secretaría de Seguridad", denuncias: 180, porcentaje: 24 },
  { nombre: "Secretaría de Hacienda", denuncias: 120, porcentaje: 16 },
  { nombre: "Secretaría de Desarrollo Social", denuncias: 90, porcentaje: 14 },
  // ... Agregar más entes públicos
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function Estadisticas() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("ultimo-mes")
  const totalDenuncias = datosEntidades.reduce((acc, curr) => acc + curr.denuncias, 0)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entidad con más denuncias</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datosEntidades[0].nombre}</div>
            <p className="text-xs text-muted-foreground">
              {datosEntidades[0].denuncias} denuncias ({datosEntidades[0].porcentaje}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ente con más denuncias</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datosEntes[0].nombre}</div>
            <p className="text-xs text-muted-foreground">
              {datosEntes[0].denuncias} denuncias ({datosEntes[0].porcentaje}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio diario</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalDenuncias / 30)}</div>
            <p className="text-xs text-muted-foreground">+15% desde el último periodo</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entidades" className="w-full">
        <TabsList>
          <TabsTrigger value="entidades">Por Entidad Federativa</TabsTrigger>
          <TabsTrigger value="entes">Por Ente Público</TabsTrigger>
        </TabsList>
        <TabsContent value="entidades">
          <Card>
            <CardHeader>
              <CardTitle>Denuncias por Entidad Federativa</CardTitle>
              <CardDescription>Distribución de denuncias en las principales entidades</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosEntidades.slice(0, 10)} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nombre" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="denuncias" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="entes">
          <Card>
            <CardHeader>
              <CardTitle>Denuncias por Ente Público</CardTitle>
              <CardDescription>Distribución de denuncias en los principales entes públicos</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosEntes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
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
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Denuncias</CardTitle>
          <CardDescription>Evolución de denuncias en los últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { mes: "Ene", denuncias: 400 },
                { mes: "Feb", denuncias: 300 },
                { mes: "Mar", denuncias: 500 },
                { mes: "Abr", denuncias: 280 },
                { mes: "May", denuncias: 200 },
                { mes: "Jun", denuncias: 450 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="denuncias" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Descargar Reporte Completo</Button>
      </div>
    </div>
  )
}


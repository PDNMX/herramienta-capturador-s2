"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, Legend } from "recharts";
import { FileText, Clock, UserX, AlertTriangle, CheckCircle, Users, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { AvanceMapa } from './avance-mapa';
import { 
  dataMensual, 
  dataTipos, 
  dataEstatus, 
  metricasPrincipales,
  obtenerColoresAdaptativos,
  obtenerTotalDenunciasPorEstatus,
  calcularPorcentaje
} from './data-estadisticas';

export function Estadisticas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Colores adaptativos para tema oscuro/claro
  const chartColors = obtenerColoresAdaptativos(isDark);
  
  // Cálculos dinámicos
  const totalDenunciasEstatus = obtenerTotalDenunciasPorEstatus();
  const porcentajeHechosCorrupcion = calcularPorcentaje(metricasPrincipales.hechosCorrupcion, metricasPrincipales.totalDenuncias);
  const porcentajeFaltasAdmin = calcularPorcentaje(metricasPrincipales.faltasAdministrativas, metricasPrincipales.totalDenuncias);
  const casosResueltos = Math.round((metricasPrincipales.totalDenuncias * metricasPrincipales.tasaResolucion) / 100);
  const denunciasAnonimas = Math.round((metricasPrincipales.totalDenuncias * metricasPrincipales.porcentajeDenunciasAnonimas) / 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Estadísticas del Sistema de Denuncias</h1>
        <p className="text-muted-foreground max-w-5xl mx-auto">
          Panel de información estadística del Sistema Nacional Anticorrupción para el seguimiento y análisis 
          de denuncias de faltas administrativas y hechos de corrupción.
        </p>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-muted-foreground">Total de denuncias</p>
            </div>
            <p className="text-2xl font-semibold mt-2">{metricasPrincipales.totalDenuncias.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Sistema Nacional Anticorrupción</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-muted-foreground">Hechos de corrupción</p>
            </div>
            <p className="text-2xl font-semibold mt-2">{metricasPrincipales.hechosCorrupcion.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{porcentajeHechosCorrupcion}% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-muted-foreground">Faltas administrativas</p>
            </div>
            <p className="text-2xl font-semibold mt-2">{metricasPrincipales.faltasAdministrativas.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">{porcentajeFaltasAdmin}% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <p className="text-sm text-muted-foreground">Tiempo promedio resolución</p>
            </div>
            <p className="text-2xl font-semibold mt-2">{metricasPrincipales.tiempoPromedioResolucion} días</p>
            <p className="text-xs text-muted-foreground mt-1">Meta: 45 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-muted-foreground">Denuncias anónimas</p>
            </div>
            <p className="text-2xl font-semibold mt-2">{metricasPrincipales.porcentajeDenunciasAnonimas}%</p>
            <p className="text-xs text-muted-foreground mt-1">{denunciasAnonimas.toLocaleString()} de {metricasPrincipales.totalDenuncias.toLocaleString()} denuncias</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <p className="text-sm text-muted-foreground">Tasa de resolución</p>
            </div>
            <p className="text-2xl font-semibold mt-2">{metricasPrincipales.tasaResolucion}%</p>
            <p className="text-xs text-green-600 mt-1">{casosResueltos.toLocaleString()} casos resueltos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de tendencia temporal */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl">Evolución mensual de denuncias</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Análisis temporal que muestra la evolución de las denuncias a lo largo del año, diferenciando entre 
            faltas administrativas y hechos de corrupción para identificar patrones y tendencias.
          </p>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataMensual}>
              <XAxis 
                dataKey="mes" 
                stroke={chartColors.text}
                fontSize={12}
              />
              <YAxis 
                stroke={chartColors.text}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: '8px',
                  color: chartColors.text
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="denuncias" 
                stroke={chartColors.primary} 
                strokeWidth={3}
                name="Total denuncias"
              />
              <Line 
                type="monotone" 
                dataKey="faltasAdministrativas" 
                stroke={chartColors.secondary} 
                strokeWidth={2}
                name="Faltas administrativas"
              />
              <Line 
                type="monotone" 
                dataKey="hechosCorrupcion" 
                stroke={chartColors.quaternary} 
                strokeWidth={2}
                name="Hechos de corrupción"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grid de gráficas secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfica de tipos de denuncia */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-xl">Clasificación por tipo de denuncia</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Distribución de denuncias según su naturaleza jurídica, clasificadas entre faltas administrativas 
              y hechos de corrupción conforme a la normativa del Sistema Nacional Anticorrupción.
            </p>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTipos} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <XAxis 
                  dataKey="tipo" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                  stroke={chartColors.text}
                />
                <YAxis 
                  stroke={chartColors.text}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${chartColors.grid}`,
                    borderRadius: '8px',
                    color: chartColors.text
                  }}
                />
                <Bar dataKey="cantidad" fill={chartColors.primary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfica de estatus */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-xl">Estado del trámite de denuncias</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Seguimiento del procedimiento de atención de denuncias según el artículo 59, mostrando el estado 
              actual de cada caso para garantizar transparencia en el proceso.
            </p>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={dataEstatus} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={120}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {dataEstatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} denuncias (${((Number(value) / totalDenunciasEstatus) * 100).toFixed(1)}%)`, 
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${chartColors.grid}`,
                    borderRadius: '8px',
                    color: chartColors.text
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry?.color || '#000', fontSize: '12px' }}>
                      {value}: {entry?.payload?.value || 0}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Mapa de distribución territorial */}
      <Card>
        <AvanceMapa />
      </Card>
    </div>
  );
}

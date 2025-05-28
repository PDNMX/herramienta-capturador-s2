"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { FileText, Clock, UserX, AlertTriangle, CheckCircle, Users, TrendingUp, BarChart3, PieChart as PieChartIcon, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

import { AvanceMapa } from './avance-mapa';
import { 
  dataMensual, 
  dataTipos, 
  dataEstatus, 
  metricasPrincipales as metricasEstaticas,
  obtenerColoresAdaptativos,
  obtenerTotalDenunciasPorEstatus,
  calcularPorcentaje,
  type MetricasPrincipales
} from './data-estadisticas';

// Importar funciones de API
import { obtenerMetricasPrincipales, obtenerDatosMensualesSimplificados } from './api-estadisticas';

export function Estadisticas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Estados para manejar datos de API
  const [metricasPrincipales, setMetricasPrincipales] = useState<MetricasPrincipales>(metricasEstaticas);
  const [cargandoMetricas, setCargandoMetricas] = useState(true);
  const [errorMetricas, setErrorMetricas] = useState<string | null>(null);

  // Estados para datos mensuales
  const [datosMensuales, setDatosMensuales] = useState(dataMensual);
  const [cargandoDatosMensuales, setCargandoDatosMensuales] = useState(true);

  // Colores adaptativos para tema oscuro/claro
  const chartColors = obtenerColoresAdaptativos(isDark);
  
  // Cálculos dinámicos basados en métricas (API o estáticas)
  const totalDenunciasEstatus = obtenerTotalDenunciasPorEstatus();
  const porcentajeHechosCorrupcion = calcularPorcentaje(metricasPrincipales.hechosCorrupcion, metricasPrincipales.totalDenuncias);
  const porcentajeFaltasAdmin = calcularPorcentaje(metricasPrincipales.faltasAdministrativas, metricasPrincipales.totalDenuncias);
  const casosAtendidos = Math.round((metricasPrincipales.totalDenuncias * metricasPrincipales.tasaResolucion) / 100);
  const denunciasAnonimas = Math.round((metricasPrincipales.totalDenuncias * metricasPrincipales.porcentajeDenunciasAnonimas) / 100);

  // Efecto para cargar métricas desde API
  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        setCargandoMetricas(true);
        setErrorMetricas(null);
        
        const metricasAPI = await obtenerMetricasPrincipales();
        setMetricasPrincipales(metricasAPI);
        
      } catch (error) {
        console.error('Error al cargar métricas:', error);
        //setErrorMetricas('Error al cargar datos desde la API. Mostrando datos de ejemplo.');
        // Mantener datos estáticos en caso de error
        setMetricasPrincipales(metricasEstaticas);
      } finally {
        setCargandoMetricas(false);
      }
    };

    cargarMetricas();
  }, []);

  // Efecto para cargar datos mensuales desde API
  useEffect(() => {
    const cargarDatosMensuales = async () => {
      try {
        setCargandoDatosMensuales(true);
        
        const datosMensualesAPI = await obtenerDatosMensualesSimplificados();
        
        // Transformar datos para compatibilidad con la gráfica
        const datosTransformados = datosMensualesAPI.map(dato => ({
          mes: dato.mes,
          denuncias: dato.totalDenuncias,
          faltasAdministrativas: dato.conFaltasAdministrativas,
          hechosCorrupcion: dato.conHechosCorrupcion,
          mixtas: dato.mixtas,
          sinClasificacion: dato.sinClasificacion
        }));
        
        setDatosMensuales(datosTransformados);
        
      } catch (error) {
        console.error('Error al cargar datos mensuales:', error);
        // Mantener datos estáticos en caso de error
        setDatosMensuales(dataMensual);
      } finally {
        setCargandoDatosMensuales(false);
      }
    };

    cargarDatosMensuales();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Estadísticas del Sistema de Denuncias</h1>
        <p className="text-muted-foreground max-w-5xl mx-auto">
          Panel de información estadística del Sistema Nacional Anticorrupción para el seguimiento y análisis 
          de denuncias de faltas administrativas y hechos de corrupción.
        </p>
        {/* {errorMetricas && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ {errorMetricas}
            </p>
          </div>
        )} */}
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-muted-foreground">Total de denuncias</p>
            </div>
            <div className="flex items-center mt-2">
              {cargandoMetricas ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-2xl font-semibold">{metricasPrincipales.totalDenuncias.toLocaleString()}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {cargandoMetricas ? 'Cargando...' : 'Sistema Nacional Anticorrupción'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-muted-foreground">Hechos de corrupción</p>
            </div>
            <div className="flex items-center mt-2">
              {cargandoMetricas ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-2xl font-semibold">{metricasPrincipales.hechosCorrupcion.toLocaleString()}</p>
              )}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {cargandoMetricas ? 'Cargando...' : `${porcentajeHechosCorrupcion}% del total`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-muted-foreground">Faltas administrativas</p>
            </div>
            <div className="flex items-center mt-2">
              {cargandoMetricas ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-2xl font-semibold">{metricasPrincipales.faltasAdministrativas.toLocaleString()}</p>
              )}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {cargandoMetricas ? 'Cargando...' : `${porcentajeFaltasAdmin}% del total`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <p className="text-sm text-muted-foreground">Tiempo promedio atención</p>
            </div>
            <div className="flex items-center mt-2">
              {cargandoMetricas ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-2xl font-semibold">{metricasPrincipales.tiempoPromedioResolucion} días</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {cargandoMetricas ? 'Cargando...' : 'Solo denuncias atendidas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-muted-foreground">Denuncias anónimas</p>
            </div>
            <div className="flex items-center mt-2">
              {cargandoMetricas ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-2xl font-semibold">{metricasPrincipales.porcentajeDenunciasAnonimas}%</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {cargandoMetricas ? 'Cargando...' : `${denunciasAnonimas.toLocaleString()} de ${metricasPrincipales.totalDenuncias.toLocaleString()} denuncias`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <p className="text-sm text-muted-foreground">Tasa de atención</p>
            </div>
            <div className="flex items-center mt-2">
              {cargandoMetricas ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-2xl font-semibold">{metricasPrincipales.tasaResolucion}%</p>
              )}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {cargandoMetricas ? 'Cargando...' : `${casosAtendidos.toLocaleString()} casos atendidos`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de tendencia temporal mejorada */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl">Evolución mensual por clasificación de denuncias</CardTitle>
            {cargandoDatosMensuales && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Análisis temporal que muestra la evolución de las denuncias considerando que una denuncia puede tener 
            múltiples clasificaciones: solo faltas administrativas, solo hechos de corrupción, ambas (mixtas), o sin clasificar.
          </p>
        </CardHeader>
        <CardContent className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datosMensuales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    'denuncias': 'Total denuncias',
                    'faltasAdministrativas': 'Solo faltas administrativas',
                    'hechosCorrupcion': 'Solo hechos de corrupción',
                    'mixtas': 'Mixtas (faltas + hechos)',
                    'sinClasificacion': 'Sin clasificación'
                  };
                  return [value, labels[name as string] || name];
                }}
              />
              <Legend 
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    'denuncias': 'Total denuncias',
                    'faltasAdministrativas': 'Solo faltas administrativas',
                    'hechosCorrupcion': 'Solo hechos de corrupción',
                    'mixtas': 'Mixtas (faltas + hechos)',
                    'sinClasificacion': 'Sin clasificación'
                  };
                  return labels[value] || value;
                }}
              />
              
              {/* Línea del total */}
              <Line 
                type="monotone" 
                dataKey="denuncias" 
                stroke={chartColors.primary} 
                strokeWidth={3}
                name="denuncias"
                dot={{ r: 4 }}
              />
              
              {/* Áreas apiladas para mostrar la composición */}
              <Area 
                type="monotone" 
                dataKey="faltasAdministrativas" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#f59e0b"
                fillOpacity={0.6}
                name="faltasAdministrativas"
              />
              <Area 
                type="monotone" 
                dataKey="hechosCorrupcion" 
                stackId="1"
                stroke="#ef4444" 
                fill="#ef4444"
                fillOpacity={0.6}
                name="hechosCorrupcion"
              />
              <Area 
                type="monotone" 
                dataKey="mixtas" 
                stackId="1"
                stroke="#8b5cf6" 
                fill="#8b5cf6"
                fillOpacity={0.6}
                name="mixtas"
              />
              <Area 
                type="monotone" 
                dataKey="sinClasificacion" 
                stackId="1"
                stroke="#6b7280" 
                fill="#6b7280"
                fillOpacity={0.4}
                name="sinClasificacion"
              />
            </AreaChart>
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

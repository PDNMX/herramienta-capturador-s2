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
        
        //const metricasAPI = await obtenerMetricasPrincipales();
        setMetricasPrincipales(metricasEstaticas);
        
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
        
        /* const datosMensualesAPI = await obtenerDatosMensualesSimplificados();
        
        // Transformar datos para compatibilidad con la gráfica
        const datosTransformados = datosMensualesAPI.map(dato => ({
          mes: dato.mes,
          denuncias: dato.totalDenuncias,
          faltasAdministrativas: dato.conFaltasAdministrativas,
          hechosCorrupcion: dato.conHechosCorrupcion,
          mixtas: dato.mixtas,
          sinClasificacion: dato.sinClasificacion
        })); */
        
        setDatosMensuales(dataMensual);
        
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
    <div className="space-y-8 bg-background min-h-screen p-6">
      {/* Header mejorado */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Estadísticas del Sistema de Denuncias
        </h1>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Panel integral de análisis y seguimiento de denuncias por faltas administrativas y hechos de corrupción 
          en el marco del Sistema Nacional Anticorrupción mexicano.
        </p>
        {/* {errorMetricas && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ {errorMetricas}
            </p>
          </div>
        )} */}
      </div>

      {/* Tarjetas de métricas principales mejoradas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total de denuncias</p>
            </div>
            <div className="flex items-center mt-3">
              {cargandoMetricas ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{metricasPrincipales.totalDenuncias.toLocaleString()}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {cargandoMetricas ? 'Cargando...' : 'Registradas en el sistema'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Hechos de corrupción</p>
            </div>
            <div className="flex items-center mt-3">
              {cargandoMetricas ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{metricasPrincipales.hechosCorrupcion.toLocaleString()}</p>
              )}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
              {cargandoMetricas ? 'Cargando...' : `${porcentajeHechosCorrupcion}% del total`}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-300" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Faltas administrativas</p>
            </div>
            <div className="flex items-center mt-3">
              {cargandoMetricas ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{metricasPrincipales.faltasAdministrativas.toLocaleString()}</p>
              )}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
              {cargandoMetricas ? 'Cargando...' : `${porcentajeFaltasAdmin}% del total`}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Tiempo promedio atención</p>
            </div>
            <div className="flex items-center mt-3">
              {cargandoMetricas ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{metricasPrincipales.tiempoPromedioResolucion} días</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {cargandoMetricas ? 'Cargando...' : 'Solo denuncias atendidas'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                <UserX className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Denuncias anónimas</p>
            </div>
            <div className="flex items-center mt-3">
              {cargandoMetricas ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{metricasPrincipales.porcentajeDenunciasAnonimas}%</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {cargandoMetricas ? 'Cargando...' : `${denunciasAnonimas.toLocaleString()} de ${metricasPrincipales.totalDenuncias.toLocaleString()} denuncias`}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Tasa de atención</p>
            </div>
            <div className="flex items-center mt-3">
              {cargandoMetricas ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{metricasPrincipales.tasaResolucion}%</p>
              )}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
              {cargandoMetricas ? 'Cargando...' : `${casosAtendidos.toLocaleString()} casos atendidos`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de tendencia temporal mejorada */}
      <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold">Evolución mensual por clasificación de denuncias</CardTitle>
              {cargandoDatosMensuales && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground inline ml-2" />
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Evolución temporal de las denuncias clasificadas por tipo. Una denuncia puede contener múltiples 
            clasificaciones: solo faltas administrativas, solo hechos de corrupción, casos mixtos que 
            incluyen ambos tipos, o casos pendientes de clasificar por el área técnica.
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
                    'denuncias': 'Total de denuncias',
                    'faltasAdministrativas': 'Solo faltas administrativas',
                    'hechosCorrupcion': 'Solo hechos de corrupción',
                    'mixtas': 'Casos mixtos (faltas + corrupción)',
                    'sinClasificacion': 'Pendientes de clasificar'
                  };
                  return [`${value} casos`, labels[name as string] || name];
                }}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend 
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    'denuncias': 'Total de denuncias recibidas',
                    'faltasAdministrativas': 'Solo faltas administrativas',
                    'hechosCorrupcion': 'Solo hechos de corrupción',
                    'mixtas': 'Casos mixtos (faltas + corrupción)',
                    'sinClasificacion': 'Pendientes de clasificar'
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

      {/* Grid de gráficas secundarias mejoradas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfica de tipos de denuncia */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold">Clasificación por tipo de infracción</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Distribución de denuncias según la Ley General de Responsabilidades Administrativas, 
              diferenciando entre faltas administrativas y hechos de corrupción.
            </p>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTipos} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <XAxis 
                  dataKey="tipo" 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  fontSize={11}
                  stroke={chartColors.text}
                  interval={0}
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
                  formatter={(value, name, props) => [
                    `${value} denuncias`,
                    props.payload.categoria === "Hecho de Corrupción" ? "🚨 Hecho de Corrupción" : "📋 Falta Administrativa"
                  ]}
                  labelFormatter={(label) => `Tipo: ${label}`}
                />
                <Bar 
                  dataKey="cantidad" 
                  radius={[4, 4, 0, 0]}
                >
                  {dataTipos.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.categoria === "Hecho de Corrupción" 
                        ? isDark ? "#f87171" : "#ef4444"  // Rojo para hechos de corrupción
                        : isDark ? "#34d399" : "#10b981"  // Verde para faltas administrativas
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfica de estatus mejorada */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold">Estado del trámite de denuncias</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seguimiento del procedimiento de atención de denuncias según su estado actual en el sistema.
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

      {/* Mapa de distribución territorial mejorado */}
      <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <AvanceMapa />
      </Card>
    </div>
  );
}

// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import dataMex from './data-mexico';
import { scalePow } from 'd3-scale';
import { interpolateRgb } from 'd3-interpolate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, AlertTriangle, Users, BarChart3, FileText, ArrowLeftRight, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importar datos del archivo centralizado
import { 
  dataEntidades, 
  municipiosData, 
  calcularTasaPorHabitantes,
  obtenerEntidadesOrdenadas 
} from './data-estadisticas';

const generateColorRange = (baseColor: string) => {
  const lighterColor = interpolateRgb(baseColor, '#ffffff')(0.85);
  const darkerColor = interpolateRgb(baseColor, '#000000')(0.2);

  return scalePow<string>()
    .exponent(0.5)
    .domain([0, 200, 450])
    .range([lighterColor, baseColor, darkerColor])
    .clamp(true);
};

const ColorLegend = ({ colorScale, width, height, x, y }) => {
  const gradientId = 'colorGradient';
  const numStops = 20;

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {Array.from({ length: numStops }, (_, i) => i / (numStops - 1)).map(t => (
            <stop key={t} offset={`${t * 100}%`} stopColor={colorScale(t * 450)} />
          ))}
        </linearGradient>
      </defs>
      <rect stroke="#888888" strokeWidth={0.5} width={width} height={height} fill={`url(#${gradientId})`} />
      <text fill="#888" x="0" y={height + 15} fontSize="12">
        0
      </text>
      <text fill="#888" x={width/2} y={height + 15} fontSize="12" textAnchor="middle">
        225
      </text>
      <text fill="#888" x={width} y={height + 15} fontSize="12" textAnchor="end">
        450+
      </text>
    </g>
  );
};

const MunicipiosModal = ({ entidadData, isOpen, onClose }) => {
  const [entidadComparacion, setEntidadComparacion] = useState(null);
  const [mostrarComparacion, setMostrarComparacion] = useState(false);

  if (!entidadData) return null;

  const handleCompararEstado = (clave) => {
    const datosComparacion = municipiosData[clave];
    if (datosComparacion) {
      setEntidadComparacion(datosComparacion);
      setMostrarComparacion(true);
    }
  };

  const estadosDisponibles = Object.keys(municipiosData).filter(
    clave => clave !== entidadData.entidad && municipiosData[clave]
  );

  return (
    <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-800 dark:via-blue-900/20 dark:to-slate-900 m-4">
      <DialogHeader className="pb-6 pr-12">
        <DialogTitle className="flex items-center justify-between text-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="font-bold">Denuncias por municipio</span>
              <p className="text-lg font-normal text-muted-foreground">{entidadData.entidad}</p>
            </div>
          </div>
          
          {/* Selector de comparación mejorado */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                onChange={(e) => e.target.value && handleCompararEstado(e.target.value)}
                className="appearance-none bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                          border border-blue-200/60 dark:border-blue-700/40 rounded-xl px-4 py-3 pr-10
                          text-sm font-medium text-gray-700 dark:text-gray-200
                          hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                          shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[200px]"
                defaultValue=""
              >
                <option value="" className="bg-white dark:bg-gray-800">
                  Comparar con otro estado...
                </option>
                {estadosDisponibles.map(clave => {
                  const entidad = dataEntidades.find(e => e.entidad === clave);
                  return (
                    <option key={clave} value={clave} className="bg-white dark:bg-gray-800">
                      {entidad?.nombreEntidad}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ArrowLeftRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            {mostrarComparacion && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMostrarComparacion(false)}
                className="bg-white/90 dark:bg-gray-800/90 border-red-200/60 dark:border-red-700/40 
                          text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                          shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2
                          flex items-center gap-2 whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                Ocultar comparación
              </Button>
            )}
          </div>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-8">
        {/* Resumen comparativo si está activo */}
        {mostrarComparacion && entidadComparacion && (
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-blue-200/40 dark:border-blue-700/30 shadow-xl">
            {/* Decorative elements sutiles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/6 to-slate-400/6 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-400/6 to-blue-400/6 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              {/* Header de comparación */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-md">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Análisis Comparativo
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {entidadData.entidad} vs {entidadComparacion.entidad}
                    </p>
                  </div>
                </div>
                
                {/* Indicador de diferencia general */}
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    entidadData.totalDenuncias > entidadComparacion.totalDenuncias 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                      : entidadData.totalDenuncias < entidadComparacion.totalDenuncias
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {entidadData.totalDenuncias > entidadComparacion.totalDenuncias ? (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Mayor incidencia
                      </>
                    ) : entidadData.totalDenuncias < entidadComparacion.totalDenuncias ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Menor incidencia
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Igual incidencia
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid de comparación mejorado */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total de denuncias */}
                <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Total de denuncias</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{entidadData.entidad}</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{entidadData.totalDenuncias}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{entidadComparacion.entidad}</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{entidadComparacion.totalDenuncias}</span>
                    </div>
                    
                    {/* Barra de comparación */}
                    <div className="pt-2">
                      <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="bg-blue-500 transition-all duration-1000" 
                          style={{ 
                            width: `${(entidadData.totalDenuncias / (entidadData.totalDenuncias + entidadComparacion.totalDenuncias)) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-purple-500 transition-all duration-1000" 
                          style={{ 
                            width: `${(entidadComparacion.totalDenuncias / (entidadData.totalDenuncias + entidadComparacion.totalDenuncias)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Municipios activos */}
                <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Municipios activos</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{entidadData.entidad}</span>
                      </div>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">{entidadData.municipios.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{entidadComparacion.entidad}</span>
                      </div>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">{entidadComparacion.municipios.length}</span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="bg-blue-500 transition-all duration-1000" 
                          style={{ 
                            width: `${(entidadData.municipios.length / (entidadData.municipios.length + entidadComparacion.municipios.length)) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-purple-500 transition-all duration-1000" 
                          style={{ 
                            width: `${(entidadComparacion.municipios.length / (entidadData.municipios.length + entidadComparacion.municipios.length)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promedio por municipio */}
                <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Promedio/municipio</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{entidadData.entidad}</span>
                      </div>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {Math.round(entidadData.totalDenuncias / entidadData.municipios.length)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{entidadComparacion.entidad}</span>
                      </div>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {Math.round(entidadComparacion.totalDenuncias / entidadComparacion.municipios.length)}
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="bg-blue-500 transition-all duration-1000" 
                          style={{ 
                            width: `${(Math.round(entidadData.totalDenuncias / entidadData.municipios.length) / (Math.round(entidadData.totalDenuncias / entidadData.municipios.length) + Math.round(entidadComparacion.totalDenuncias / entidadComparacion.municipios.length))) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-purple-500 transition-all duration-1000" 
                          style={{ 
                            width: `${(Math.round(entidadComparacion.totalDenuncias / entidadComparacion.municipios.length) / (Math.round(entidadData.totalDenuncias / entidadData.municipios.length) + Math.round(entidadComparacion.totalDenuncias / entidadComparacion.municipios.length))) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diferencia y análisis */}
                <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      entidadData.totalDenuncias > entidadComparacion.totalDenuncias 
                        ? 'bg-red-100 dark:bg-red-800/50' 
                        : entidadData.totalDenuncias < entidadComparacion.totalDenuncias
                        ? 'bg-green-100 dark:bg-green-800/50'
                        : 'bg-gray-100 dark:bg-gray-800/50'
                    }`}>
                      <TrendingUp className={`h-5 w-5 ${
                        entidadData.totalDenuncias > entidadComparacion.totalDenuncias 
                          ? 'text-red-600 dark:text-red-300' 
                          : entidadData.totalDenuncias < entidadComparacion.totalDenuncias
                          ? 'text-green-600 dark:text-green-300'
                          : 'text-gray-600 dark:text-gray-300'
                      }`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Diferencia</h4>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      entidadData.totalDenuncias > entidadComparacion.totalDenuncias 
                        ? 'text-red-600 dark:text-red-400' 
                        : entidadData.totalDenuncias < entidadComparacion.totalDenuncias
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {entidadData.totalDenuncias > entidadComparacion.totalDenuncias ? '+' : ''}
                      {entidadData.totalDenuncias - entidadComparacion.totalDenuncias}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">denuncias</p>
                    
                    {/* Porcentaje de diferencia */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className={`text-lg font-semibold ${
                        entidadData.totalDenuncias > entidadComparacion.totalDenuncias 
                          ? 'text-red-600 dark:text-red-400' 
                          : entidadData.totalDenuncias < entidadComparacion.totalDenuncias
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {entidadComparacion.totalDenuncias !== 0 
                          ? `${Math.abs(Math.round(((entidadData.totalDenuncias - entidadComparacion.totalDenuncias) / entidadComparacion.totalDenuncias) * 100))}%`
                          : 'N/A'
                        }
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">diferencia relativa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de la entidad mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total denuncias</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{entidadData.totalDenuncias}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Municipios activos</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{entidadData.municipios.length}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Promedio por municipio</span>
              </div>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(entidadData.totalDenuncias / entidadData.municipios.length)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de municipios mejorada */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-bold">Clasificación de municipios por número de denuncias</h3>
          </div>
          
          {/* Tabla compacta para mejor uso del espacio */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-700/40 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50/80 to-slate-50/80 dark:from-blue-900/30 dark:to-slate-800/30 border-b border-blue-200/60 dark:border-blue-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Municipio</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">F. Admin.</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">H. Corrup.</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Distribución</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100/60 dark:divide-blue-800/40">
                  {entidadData.municipios
                    .sort((a, b) => b.denuncias - a.denuncias)
                    .map((municipio, index) => (
                      <tr key={municipio.nombre} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <Badge 
                            variant={index < 3 ? "default" : "secondary"} 
                            className={`text-xs font-bold shadow-sm border-0
                              ${index < 3 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                          >
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                            {municipio.nombre}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{municipio.denuncias}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-bold text-green-600 dark:text-green-400">{municipio.faltasAdmin}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-bold text-red-600 dark:text-red-400">{municipio.hechosCorrupcion}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full flex">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300" 
                                  style={{ width: `${(municipio.faltasAdmin / municipio.denuncias) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300" 
                                  style={{ width: `${(municipio.hechosCorrupcion / municipio.denuncias) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400 min-w-[4rem] font-medium">
                              {Math.round((municipio.faltasAdmin / municipio.denuncias) * 100)}% / {Math.round((municipio.hechosCorrupcion / municipio.denuncias) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export const AvanceMapa = ({ baseColor = '#3b82f6' }: { baseColor?: string }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [selectedEntidad, setSelectedEntidad] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMunicipios, setSelectedMunicipios] = useState(null);

  const colorScale = useMemo(() => generateColorRange(baseColor), [baseColor]);
  const entidadesOrdenadas = obtenerEntidadesOrdenadas();

  const handleEntidadHover = (entidad: string | null) => {
    setSelectedEntidad(entidad);
  };

  const handleEntidadClick = (entidadClave: string) => {
    const municipiosInfo = municipiosData[entidadClave];
    if (municipiosInfo) {
      setSelectedMunicipios(municipiosInfo);
      setModalOpen(true);
    }
  };

  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <MapPin className="h-5 w-5 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-bold">Distribución por entidad federativa</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Haz clic en cualquier estado para ver el desglose por municipios.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          <div className="w-full h-[50vh] lg:h-[60vh] min-h-[400px] relative">
            <ComposableMap
              className="w-full h-full cursor-pointer"
              projection="geoMercator"
              projectionConfig={{
                center: [-102, 24],
                scale: 1450,
              }}>
              <Geographies geography={dataMex}>
                {({ geographies }: any) =>
                  geographies.map((geo: any) => {
                    const entidadInfo = dataEntidades.find((s: any) => s.entidad == geo.properties.clave);
                    const count = entidadInfo ? entidadInfo.count : 0;
                    const isSelected = selectedEntidad === geo.properties.clave;
                    const hasData = municipiosData[geo.properties.clave];
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={count && entidadInfo
                          ? isSelected 
                            ? interpolateRgb(colorScale(count), '#000000')(0.3)
                            : colorScale(count) 
                          : '#f3f4f6'}
                        stroke="#6b7280"
                        strokeWidth={isSelected ? 2 : 0.8}
                        style={{
                          default: {
                            opacity: isSelected ? 1 : 0.9,
                            cursor: hasData ? 'pointer' : 'default',
                          },
                          hover: {
                            fill: count && entidadInfo
                              ? interpolateRgb(colorScale(count), '#000000')(0.3)
                              : interpolateRgb('#f3f4f6', '#000000')(0.2),
                            transition: 'all 250ms',
                            strokeWidth: 1.5,
                          },
                        }}
                        onMouseEnter={() => {
                          const tooltipText = entidadInfo?.nombreEntidad 
                            ? `${entidadInfo.nombreEntidad}: ${count} denuncias${hasData ? ' (clic para detalles)' : ''}`
                            : 'Sin datos';
                          setTooltipContent(tooltipText);
                          handleEntidadHover(geo.properties.clave);
                        }}
                        onMouseLeave={() => {
                          setTooltipContent('');
                          handleEntidadHover(null);
                        }}
                        onClick={() => handleEntidadClick(geo.properties.clave)}
                        data-tooltip-id="my-tooltip"
                      />
                    );
                  })
                }
              </Geographies>
              <ColorLegend colorScale={colorScale} width={150} height={15} x={620} y={40} />
            </ComposableMap>
          </div>
          
          <div className="w-full lg:w-[350px] xl:w-[450px] border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-6 lg:ml-2">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 dark:border-gray-700/40 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Concentración por entidad</h3>
                  {/* <p className="text-sm text-muted-foreground">Ranking nacional de denuncias</p> */}
                </div>
              </div>
              
              <div className="space-y-2 max-h-[300px] lg:max-h-[500px] overflow-y-auto pr-2">
                {entidadesOrdenadas.map((entidad, index) => {
                  const hasDetails = municipiosData[entidad.entidad];
                  return (
                    <div 
                      key={entidad.entidad}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer border
                        ${selectedEntidad === entidad.entidad 
                          ? 'bg-blue-50/90 dark:bg-blue-900/30 border-blue-300/60 dark:border-blue-600/50 shadow-md' 
                          : 'border-transparent hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:shadow-sm'}
                        ${hasDetails ? 'hover:border-blue-200/60 dark:hover:border-blue-700/40' : 'opacity-75'}`}
                      onMouseEnter={() => handleEntidadHover(entidad.entidad)}
                      onMouseLeave={() => handleEntidadHover(null)}
                      onClick={() => hasDetails && handleEntidadClick(entidad.entidad)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={index < 3 ? "default" : "secondary"} 
                          className={`text-xs min-w-[28px] h-6 font-semibold shadow-sm
                            ${index < 3 ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : ''}`}
                        >
                          {index + 1}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {entidad.nombreEntidad}
                            </span>
                            {hasDetails && (
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                          </div>
                          {hasDetails && (
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Clic para ver municipios
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {typeof entidad.count === 'number' ? entidad.count.toLocaleString() : 0}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">denuncias</p>
                        </div>
                        {hasDetails && (
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 opacity-60 hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <Tooltip id="my-tooltip" content={tooltipContent} />
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <MunicipiosModal 
          entidadData={selectedMunicipios} 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
        />
      </Dialog>
    </>
  );
};

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
import { MapPin, TrendingUp, AlertTriangle, Users } from 'lucide-react';

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
  if (!entidadData) return null;

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Denuncias por municipio - {entidadData.entidad}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Resumen de la entidad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total denuncias</span>
              </div>
              <p className="text-2xl font-bold mt-1">{entidadData.totalDenuncias}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Municipios activos</span>
              </div>
              <p className="text-2xl font-bold mt-1">{entidadData.municipios.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Promedio por municipio</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {Math.round(entidadData.totalDenuncias / entidadData.municipios.length)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de municipios */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Top de municipios por número de denuncias</h3>
          <div className="space-y-3">
            {entidadData.municipios
              .sort((a, b) => b.denuncias - a.denuncias)
              .map((municipio, index) => (
                <div key={municipio.nombre} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? "default" : "secondary"} className="text-xs min-w-[24px]">
                        {index + 1}
                      </Badge>
                      <h4 className="font-medium">{municipio.nombre}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{municipio.denuncias}</p>
                      <p className="text-xs text-muted-foreground">denuncias</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Faltas Admin.</p>
                      <p className="font-medium text-green-600">{municipio.faltasAdmin}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hechos Corrupción</p>
                      <p className="font-medium text-red-600">{municipio.hechosCorrupcion}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Población</p>
                      <p className="font-medium">{municipio.poblacion.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tasa por 100k hab.</p>
                      <p className="font-medium text-blue-600">
                        {calcularTasaPorHabitantes(municipio.denuncias, municipio.poblacion)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-600" />
          Distribución por entidad federativa
        </CardTitle>
        <CardDescription>
          Información pública agregada según el artículo 61. Haz clic en cualquier estado para ver el desglose por municipios.
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
          
          <div className="w-full lg:w-[350px] xl:w-[450px] border-t lg:border-t-0 lg:border-l lg:border-l-border pt-4 lg:pt-0 lg:pl-6 lg:ml-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium">Concentración de denuncias por entidad</h3>
            </div>
            <div className="space-y-2 max-h-[300px] lg:max-h-[500px] overflow-y-auto pr-2">
              {entidadesOrdenadas.map((entidad, index) => {
                const hasDetails = municipiosData[entidad.entidad];
                return (
                  <div 
                    key={entidad.entidad}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer border
                      ${selectedEntidad === entidad.entidad 
                        ? 'bg-primary/10 border-primary/20 shadow-sm' 
                        : 'border-transparent hover:bg-muted/50 hover:shadow-sm'}
                      ${hasDetails ? 'hover:border-primary/30' : ''}`}
                    onMouseEnter={() => handleEntidadHover(entidad.entidad)}
                    onMouseLeave={() => handleEntidadHover(null)}
                    onClick={() => hasDetails && handleEntidadClick(entidad.entidad)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? "default" : "secondary"} className="text-xs min-w-[24px]">
                        {index + 1}
                      </Badge>
                      <div>
                        <span className="text-sm font-medium">{entidad.nombreEntidad}</span>
                        {hasDetails && (
                          <p className="text-xs text-muted-foreground">Clic para ver municipios</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">
                        {typeof entidad.count === 'number' ? entidad.count : 0}
                      </span>
                      {hasDetails && (
                        <MapPin className="h-3 w-3 text-blue-600 ml-1 inline" />
                      )}
                    </div>
                  </div>
                );
              })}
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

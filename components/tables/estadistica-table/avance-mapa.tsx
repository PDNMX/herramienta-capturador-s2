// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import dataMex from './data-mexico';
import { scalePow } from 'd3-scale';
import { interpolateRgb } from 'd3-interpolate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const data = [
    {
      entidad: "00",
      nombreEntidad: "Federación",
      count: "Fed.",
    },
    {
      entidad: "01",
      nombreEntidad: "Aguascalientes",
      count: 23,
    },
    {
      entidad: "02",
      nombreEntidad: "Baja California",
      count: 44,
    },
    {
      entidad: "03",
      nombreEntidad: "Baja California Sur",
      count: 59,
    },
    {
      entidad: "04",
      nombreEntidad: "Campeche",
      count: 77,
    },
    {
      entidad: "05",
      nombreEntidad: "Coahuila",
      count: 89,
    },
    {
      entidad: "06",
      nombreEntidad: "Colima",
      count: 99,
    },
    {
      entidad: "07",
      nombreEntidad: "Chiapas",
      count: 1,
    },
    {
      entidad: "08",
      nombreEntidad: "Chihuahua",
      count: 12,
    },
    {
      entidad: "09",
      nombreEntidad: "Ciudad de México",
      count: 22,
    },
    {
      entidad: "10",
      nombreEntidad: "Durango",
      count: 44,
    },
    {
      entidad: "11",
      nombreEntidad: "Guanajuato",
      count: 3,
    },
    {
      entidad: "12",
      nombreEntidad: "Guerrero",
      count: 69,
    },
    {
      entidad: "13",
      nombreEntidad: "Hidalgo",
      count: 77,
    },
    {
      entidad: "14",
      nombreEntidad: "Jalisco",
      count: 72,
    },
    {
      entidad: "15",
      nombreEntidad: "México",
      count: 1,
    },
    {
      entidad: "16",
      nombreEntidad: "Michoacán",
      count: 0,
    },
    {
      entidad: "17",
      nombreEntidad: "Morelos",
      count: 2,
    },
    {
      entidad: "18",
      nombreEntidad: "Nayarit",
      count: 0,
    },
    {
      entidad: "19",
      nombreEntidad: "Nuevo León",
      count: 0,
    },
    {
      entidad: "20",
      nombreEntidad: "Oaxaca",
      count: 0,
    },
    {
      entidad: "21",
      nombreEntidad: "Puebla",
      count: 0,
    },
    {
      entidad: "22",
      nombreEntidad: "Querétaro",
      count: 23,
    },
    {
      entidad: "23",
      nombreEntidad: "Quintana Roo",
      count: 22,
    },
    {
      entidad: "24",
      nombreEntidad: "San Luis Potosí",
      count: 23,
    },
    {
      entidad: "25",
      nombreEntidad: "Sinaloa",
      count: 55,
    },
    {
      entidad: "26",
      nombreEntidad: "Sonora",
      count: 11,
    },
    {
      entidad: "27",
      nombreEntidad: "Tabasco",
      count: 21,
    },
    {
      entidad: "28",
      nombreEntidad: "Tamaulipas",
      count: 11,
    },
    {
      entidad: "29",
      nombreEntidad: "Tlaxcala",
      count: 22,
    },
    {
      entidad: "30",
      nombreEntidad: "Veracruz",
      count: 23,
    },
    {
      entidad: "31",
      nombreEntidad: "Yucatán",
      count: 24,
    },
    {
      entidad: "32",
      nombreEntidad: "Zacatecas",
      count: 0,
    },
  ];


const generateColorRange = (baseColor: string) => {
  const lighterColor = interpolateRgb(baseColor, '#ffffff')(0.99);
  const darkerColor = interpolateRgb(baseColor, '#000000')(0.01);

  // Usar una escala de potencia en lugar de una escala lineal
  return scalePow<string>()
    .exponent(0.3) // Ajusta este valor para controlar la curvatura de la escala
    .domain([0, 50, 100])
    .range([lighterColor, baseColor, darkerColor])
    .clamp(true); // Asegura que los valores fuera del dominio se ajusten al rango
};

const ColorLegend = ({ colorScale, width, height, x, y }) => {
  const gradientId = 'colorGradient';
  const numStops = 20; // Número de paradas en el gradiente

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {Array.from({ length: numStops }, (_, i) => i / (numStops - 1)).map(t => (
            <stop key={t} offset={`${t * 100}%`} stopColor={colorScale(t * 100)} />
          ))}
        </linearGradient>
      </defs>
      <rect stroke="#888888" strokeWidth={0.5} width={width} height={height} fill={`url(#${gradientId})`} />
      <text fill="#888" x="0" y={height + 15} fontSize="12">
        0%
      </text>
      <text fill="#888" x={width} y={height + 15} fontSize="12" textAnchor="end">
        100%
      </text>
    </g>
  );
};

export const AvanceMapa = ({ baseColor = '#fff' }: { baseColor?: string }) => {
  const [tooltipContent, setTooltipContent] = useState('');

  const colorScale = useMemo(() => generateColorRange(baseColor, 10), [baseColor]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa</CardTitle>
        <CardDescription>Número de denuncias por entidad federativa</CardDescription>
      </CardHeader>
      <CardContent>
        <ComposableMap
          className="w-full max-h-[600px] h-[60vh] overflow-hidden"
          projection="geoMercator"
          projectionConfig={{
            center: [-102, 24],
            scale: 1450,
          }}>
          <Geographies geography={dataMex}>
            {({ geographies }: any) =>
              geographies.map((geo: any) => {
                const porcentajeAvance = data.find((s: any) => s.entidad == geo.properties.clave);
                const percentage = porcentajeAvance ? porcentajeAvance.count : 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={(percentage && porcentajeAvance) || Number(percentage) ? colorScale(percentage) : '#fff'}
                    stroke="#888888"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none',
                      },
                      hover: {
                        fill:
                          (percentage && porcentajeAvance) || Number(percentage)
                            ? interpolateRgb(colorScale(percentage), '#000000')(0.3)
                            : interpolateRgb('#fff', '#000000')(0.3),
                        strokeWidth: 1,
                        outline: 'none',
                        transition: 'all 250ms',
                      },
                    }}
                    onMouseEnter={() => {
                      setTooltipContent(
                        `${porcentajeAvance?.nombreEntidad}: ${Number(percentage) ? percentage + '%' : '0%'}`,
                      );
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    data-tooltip-id="my-tooltip"
                  />
                );
              })
            }
          </Geographies>
          <ColorLegend colorScale={colorScale} width={150} height={15} x={620} y={40} />
        </ComposableMap>
        <Tooltip id="my-tooltip" content={tooltipContent} />
      </CardContent>
    </Card>
  );
};

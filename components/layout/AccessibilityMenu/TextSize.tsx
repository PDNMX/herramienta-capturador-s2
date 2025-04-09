'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Type, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TextSizeProps {
  isActive: boolean;
  isPanelVisible: boolean;
  initialFontSize?: number;
  onTogglePanel?: () => void;
}

export default function TextSize({ 
  isActive, 
  isPanelVisible, 
  initialFontSize = 16, 
  onTogglePanel 
}: TextSizeProps) {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [defaultSize] = useState(initialFontSize);
  
  // Rangos de tamaños para diferentes elementos
  const fontSizes = {
    base: fontSize,
    h1: fontSize * 2,
    h2: fontSize * 1.5,
    h3: fontSize * 1.25,
    small: Math.max(fontSize * 0.875, 10),
  };

  useEffect(() => {
    if (isActive) {
      // Aplicar los estilos cuando el componente está activo
      document.documentElement.style.setProperty('--font-size-base', `${fontSizes.base}px`);
      document.documentElement.style.setProperty('--font-size-h1', `${fontSizes.h1}px`);
      document.documentElement.style.setProperty('--font-size-h2', `${fontSizes.h2}px`);
      document.documentElement.style.setProperty('--font-size-h3', `${fontSizes.h3}px`);
      document.documentElement.style.setProperty('--font-size-small', `${fontSizes.small}px`);
      
      // Aplicar estilos a elementos específicos
      const style = document.createElement('style');
      style.id = 'text-size-styles';
      style.innerHTML = `
        html {
          font-size: var(--font-size-base) !important;
        }
        p, div, span, li, a, button, input, textarea, select {
          font-size: var(--font-size-base) !important;
        }
        h1, .text-h1 {
          font-size: var(--font-size-h1) !important;
        }
        h2, .text-h2 {
          font-size: var(--font-size-h2) !important;
        }
        h3, .text-h3 {
          font-size: var(--font-size-h3) !important;
        }
        small, .text-small {
          font-size: var(--font-size-small) !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Eliminar los estilos cuando el componente está inactivo
      const existingStyle = document.getElementById('text-size-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      // Restaurar el tamaño de fuente predeterminado
      document.documentElement.style.fontSize = `${initialFontSize}px`;
    }

    return () => {
      // Limpieza al desmontar el componente
      const existingStyle = document.getElementById('text-size-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      // Restaurar el tamaño de fuente predeterminado
      document.documentElement.style.fontSize = `${initialFontSize}px`;
    };
  }, [isActive, fontSizes, initialFontSize]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 1, 32));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 1, 12));
  const resetFontSize = () => setFontSize(defaultSize);

  // Si el componente no está activo, no renderizamos nada
  if (!isActive) return null;
  
  // Si el panel no debe ser visible, no renderizamos el panel pero seguimos
  // aplicando los estilos (ya que el componente está activo)
  if (!isPanelVisible) return null;

  const sizePercentage = Math.round((fontSize / defaultSize) * 100);

  return (
    <div className="fixed bottom-[30rem] right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-72">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <Type className="mr-2 h-5 w-5 text-amber-500" />
          Ajuste de tamaño de texto
        </h3>
        <button 
          onClick={onTogglePanel}
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
          aria-label="Ocultar panel de tamaño de texto"
          title="Ocultar panel de tamaño de texto"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span>Tamaño de texto</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={decreaseFontSize}
                aria-label="Disminuir tamaño de texto"
                disabled={fontSize <= 12}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-14 text-center">{fontSize}px ({sizePercentage}%)</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={increaseFontSize}
                aria-label="Aumentar tamaño de texto"
                disabled={fontSize >= 32}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Slider
            value={[fontSize]}
            min={12}
            max={32}
            step={1}
            onValueChange={(value) => setFontSize(value[0])}
            aria-label="Control de tamaño de texto"
          />
        </div>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFontSize}
            className="w-full text-xs sm:text-sm"
            aria-label="Restablecer tamaño de texto"
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Restablecer
          </Button>
        </div>
      </div>
    </div>
  );
}
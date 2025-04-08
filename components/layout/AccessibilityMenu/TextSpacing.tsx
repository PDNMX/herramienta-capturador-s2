'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TextSpacingProps {
  isActive: boolean;
}

export default function TextSpacing({ isActive }: TextSpacingProps) {
  const [lineSpacing, setLineSpacing] = useState(1.5);  // Valor predeterminado para line-height
  const [letterSpacing, setLetterSpacing] = useState(0); // Valor predeterminado para letter-spacing (en px)

  useEffect(() => {
    if (isActive) {
      // Aplicar los estilos cuando el componente está activo
      document.documentElement.style.setProperty('--line-spacing', `${lineSpacing}`);
      document.documentElement.style.setProperty('--letter-spacing', `${letterSpacing}px`);
      
      // Aplicar estos estilos a elementos específicos
      const style = document.createElement('style');
      style.id = 'text-spacing-styles';
      style.innerHTML = `
        p, h1, h2, h3, h4, h5, h6, span, div, li, a, button {
          line-height: var(--line-spacing) !important;
          letter-spacing: var(--letter-spacing) !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Eliminar los estilos cuando el componente está inactivo
      const existingStyle = document.getElementById('text-spacing-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    }

    return () => {
      // Limpieza al desmontar el componente
      const existingStyle = document.getElementById('text-spacing-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isActive, lineSpacing, letterSpacing]);

  const increaseLineSpacing = () => setLineSpacing(prev => Math.min(prev + 0.2, 3));
  const decreaseLineSpacing = () => setLineSpacing(prev => Math.max(prev - 0.2, 1));
  
  const increaseLetterSpacing = () => setLetterSpacing(prev => Math.min(prev + 0.5, 10));
  const decreaseLetterSpacing = () => setLetterSpacing(prev => Math.max(prev - 0.5, -1));

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-72">
      <h3 className="text-lg font-medium mb-3">Ajuste de espaciado</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span>Espaciado de líneas</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={decreaseLineSpacing}
                aria-label="Disminuir espaciado de líneas"
                disabled={lineSpacing <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{lineSpacing.toFixed(1)}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={increaseLineSpacing}
                aria-label="Aumentar espaciado de líneas"
                disabled={lineSpacing >= 3}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Slider
            value={[lineSpacing]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(value) => setLineSpacing(value[0])}
            aria-label="Control de espaciado de líneas"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span>Espaciado entre letras</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={decreaseLetterSpacing}
                aria-label="Disminuir espaciado entre letras"
                disabled={letterSpacing <= -1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{letterSpacing.toFixed(1)}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={increaseLetterSpacing}
                aria-label="Aumentar espaciado entre letras"
                disabled={letterSpacing >= 10}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Slider
            value={[letterSpacing]}
            min={-1}
            max={10}
            step={0.5}
            onValueChange={(value) => setLetterSpacing(value[0])}
            aria-label="Control de espaciado entre letras"
          />
        </div>
      </div>
    </div>
  );
}
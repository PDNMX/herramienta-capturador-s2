'use client';

import { useState, useEffect } from 'react';
import { Accessibility, ZoomIn, ZoomOut, RotateCcw, Contrast, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  const resetFontSize = () => setFontSize(16);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="relative text-xs md:text-sm rounded-full"
          size="icon"
          aria-label="Opciones de accesibilidad">
          <Accessibility className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={increaseFontSize}>
          <ZoomIn className="mr-2 h-4 w-4" />
          <span>Aumentar texto</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={decreaseFontSize}>
          <ZoomOut className="mr-2 h-4 w-4" />
          <span>Disminuir texto</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={resetFontSize}>
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Restablecer tamaño</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleHighContrast}>
          <Contrast className="mr-2 h-4 w-4" />
          <span>{highContrast ? 'Desactivar' : 'Activar'} alto contraste</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleReducedMotion}>
          <MousePointer2 className="mr-2 h-4 w-4" />
          <span>{reducedMotion ? 'Desactivar' : 'Activar'} movimiento reducido</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

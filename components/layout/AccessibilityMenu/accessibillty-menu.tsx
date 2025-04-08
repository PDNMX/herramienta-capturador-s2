'use client';

import { useState, useEffect } from 'react';
import { 
  Accessibility, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Contrast, 
  MousePointer2,
  Volume2,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import SpeakText from './SpeakText';
import TextSpacing from './TextSpacing';
import { useToast } from '@/hooks/use-toast';

export default function AccessibilityMenu() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textToSpeechActive, setTextToSpeechActive] = useState(false);
  const [textSpacingActive, setTextSpacingActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

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

  const toggleHighContrast = () => {
    if (theme === 'high-contrast') {
      setTheme('light'); // Cambia al tema claro por defecto al desactivar
    } else {
      setTheme('high-contrast'); // Activa el tema de alto contraste
    }
  };

  const toggleReducedMotion = () => setReducedMotion(prev => !prev);

  const toggleTextToSpeech = () => {
    setTextToSpeechActive(prev => !prev);
    
    if (!textToSpeechActive) {
      toast({
        title: "Lector de texto activado",
        description: "Selecciona cualquier texto en la página para escucharlo.",
        duration: 3000,
      });
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Cancela cualquier lectura en curso
      }
    }
  };

  const toggleTextSpacing = () => {
    setTextSpacingActive(prev => !prev);
    
    if (!textSpacingActive) {
      toast({
        title: "Ajuste de espaciado activado",
        description: "Puedes modificar el espaciado entre líneas y letras.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {textToSpeechActive && <SpeakText />}
      <TextSpacing isActive={textSpacingActive} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="relative text-xs md:text-sm rounded-full"
            size="icon"
            aria-label="Opciones de accesibilidad"
          >
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
            <span>{theme === 'high-contrast' ? 'Desactivar' : 'Activar'} alto contraste</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleReducedMotion}>
            <MousePointer2 className="mr-2 h-4 w-4" />
            <span>{reducedMotion ? 'Desactivar' : 'Activar'} movimiento reducido</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTextSpacing}>
            <Type className="mr-2 h-4 w-4" />
            <span>{textSpacingActive ? 'Desactivar' : 'Activar'} ajuste de espaciado</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTextToSpeech}>
            <Volume2 className="mr-2 h-4 w-4" />
            <span>{textToSpeechActive ? 'Desactivar' : 'Activar'} lector de texto</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
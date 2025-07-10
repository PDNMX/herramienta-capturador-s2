'use client';

import { useState, useEffect } from 'react';
import { 
  PersonStanding, 
  Contrast, 
  Volume2,
  Type,
  Text,
  Keyboard,
  Heart
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
import TextSize from './TextSize';
import KeyboardNavigation from './KeyboardNavigation';


export default function AccessibilityMenu() {
  // Agregar estado para verificar si estamos en el navegador
  const [isBrowser, setIsBrowser] = useState(false);
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textToSpeechActive, setTextToSpeechActive] = useState(false);
  const [textSpacingActive, setTextSpacingActive] = useState(false);
  const [textSizeActive, setTextSizeActive] = useState(false);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [textSpacingPanelVisible, setTextSpacingPanelVisible] = useState(false);
  const [textSizePanelVisible, setTextSizePanelVisible] = useState(false);
  const [keyboardNavPanelVisible, setKeyboardNavPanelVisible] = useState(false);

  useEffect(() => {
    // Marcamos que estamos en el navegador
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    
    if (!textSizeActive) {
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize, textSizeActive, isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion, isBrowser]);

  // Funciones simplificadas para el menú básico
  const increaseFontSize = () => {
    if (!textSizeActive) {
      setFontSize(prev => Math.min(prev + 2, 24));
    }
  };
  
  const decreaseFontSize = () => {
    if (!textSizeActive) {
      setFontSize(prev => Math.max(prev - 2, 12));
    }
  };
  
  const resetFontSize = () => {
    if (!textSizeActive) {
      setFontSize(16);
    }
  };

  const toggleHighContrast = () => {
    if (theme === 'high-contrast') {
      setTheme('light'); // Cambia al tema claro por defecto al desactivar
    } else {
      setTheme('high-contrast'); // Activa el tema de alto contraste
    }
  };

  const toggleTextToSpeech = () => {
    setTextToSpeechActive(prev => !prev);
    
    if (!isBrowser) return;
    
    if (textToSpeechActive && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Cancela cualquier lectura en curso
    }
  };

  const toggleTextSpacing = () => {
    const newState = !textSpacingActive;
    setTextSpacingActive(newState);
    
    if (!isBrowser) return;
    
    // Al activar la función, también activamos la visibilidad del panel
    if (newState) {
      setTextSpacingPanelVisible(true);
    } else {
      // Al desactivar la función, ocultamos el panel
      setTextSpacingPanelVisible(false);
    }
  };

  const toggleTextSize = () => {
    const newState = !textSizeActive;
    setTextSizeActive(newState);
    
    if (!isBrowser) return;
    
    // Al activar la función, también activamos la visibilidad del panel
    if (newState) {
      setTextSizePanelVisible(true);
    } else {
      // Al desactivar la función, ocultamos el panel
      setTextSizePanelVisible(false);
    }
  };

  const toggleTextSizePanel = () => {
    setTextSizePanelVisible(prev => !prev);
  };
  
  const toggleTextSpacingPanel = () => {
    setTextSpacingPanelVisible(prev => !prev);
  };
  
  const toggleKeyboardNav = () => {
    const newState = !keyboardNavActive;
    setKeyboardNavActive(newState);
    
    if (!isBrowser) return;
    
    // Al activar la función, también activamos la visibilidad del panel
    if (newState) {
      setKeyboardNavPanelVisible(true);
    } else {
      // Al desactivar la función, ocultamos el panel
      setKeyboardNavPanelVisible(false);
    }
  };
  
  const toggleKeyboardNavPanel = () => {
    setKeyboardNavPanelVisible(prev => !prev);
  };

  // Desactiva opciones simples si el control avanzado está activo
  const isSimpleTextSizeDisabled = textSizeActive;
  
  // Verifica si alguna característica de accesibilidad está activa
  const anyFeatureActive = textSizeActive || textSpacingActive || textToSpeechActive || 
                          keyboardNavActive || reducedMotion || theme === 'high-contrast';

  // Si no estamos en el navegador, mostrar un elemento simple para evitar errores de hidratación
  if (!isBrowser) {
    return (
      <div className="flex items-center">
        <Button
          variant="secondary"
          className="relative text-xs md:text-sm rounded-xl px-4 py-2 h-auto"
          aria-label="Opciones de accesibilidad"
        >
          <PersonStanding className="h-5 w-5 mr-2" />
          <span className="font-medium">Accesibilidad</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {textToSpeechActive && <SpeakText />}
      
      {/* Sólo renderizamos los componentes si la función está activa */}
      {textSpacingActive && (
        <TextSpacing 
          isActive={textSpacingActive} 
          isPanelVisible={textSpacingPanelVisible}
          onTogglePanel={toggleTextSpacingPanel}
        />
      )}
      
      {textSizeActive && (
        <TextSize 
          isActive={textSizeActive} 
          isPanelVisible={textSizePanelVisible}
          initialFontSize={fontSize} 
          onTogglePanel={toggleTextSizePanel}
        />
      )}
      
      {keyboardNavActive && (
        <KeyboardNavigation 
          isActive={keyboardNavActive} 
          isPanelVisible={keyboardNavPanelVisible}
          onTogglePanel={toggleKeyboardNavPanel}
        />
      )}
      
      <div className="flex items-center gap-2">
        {/* Botones para mostrar/ocultar los paneles - siempre visibles si la función está activa */}
        {textSizeActive && (
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full transition-colors duration-200 ${textSizePanelVisible ? "bg-blue-600 text-white border-blue-600" : ""}`}
            onClick={toggleTextSizePanel}
            aria-label={textSizePanelVisible ? "Ocultar ajustes de tamaño de texto" : "Mostrar ajustes de tamaño de texto"}
            title={textSizePanelVisible ? "Ocultar ajustes de tamaño de texto" : "Mostrar ajustes de tamaño de texto"}
          >
            <Type className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        )}
        
        {textSpacingActive && (
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full transition-colors duration-200 ${textSpacingPanelVisible ? "bg-blue-600 text-white border-blue-600" : ""}`}
            onClick={toggleTextSpacingPanel}
            aria-label={textSpacingPanelVisible ? "Ocultar ajustes de espaciado" : "Mostrar ajustes de espaciado"}
            title={textSpacingPanelVisible ? "Ocultar ajustes de espaciado" : "Mostrar ajustes de espaciado"}
          >
            <Text className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        )}
        
        {keyboardNavActive && (
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full transition-colors duration-200 ${keyboardNavPanelVisible ? "bg-blue-600 text-white border-blue-600" : ""}`}
            onClick={toggleKeyboardNavPanel}
            aria-label={keyboardNavPanelVisible ? "Ocultar guía de navegación por teclado" : "Mostrar guía de navegación por teclado"}
            title={keyboardNavPanelVisible ? "Ocultar guía de navegación por teclado" : "Mostrar guía de navegación por teclado"}
          >
            <Keyboard className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={anyFeatureActive ? "default" : "secondary"}
              className={`
                relative px-4 py-2 h-auto text-sm font-semibold rounded-xl
                transition-colors duration-200
                ${anyFeatureActive 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : ""
                }
              `}
              aria-label="Opciones de accesibilidad"
            >
              <div className="flex items-center gap-2">
                <PersonStanding className="h-5 w-5" />
                <span className="hidden sm:inline font-semibold tracking-wide">Accesibilidad</span>
              </div>
              {anyFeatureActive && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                  {[textSizeActive, textSpacingActive, textToSpeechActive, keyboardNavActive, theme === 'high-contrast'].filter(Boolean).length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2">
            
            <DropdownMenuItem 
              onClick={toggleHighContrast}
              className={theme === 'high-contrast' ? "bg-blue-600 text-white font-medium" : ""}
            >
              <Contrast className="mr-3 h-4 w-4" />
              <span>Alto contraste</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={toggleTextSize}
              className={textSizeActive ? "bg-blue-600 text-white font-medium" : ""}
            >
              <Type className="mr-3 h-4 w-4" />
              <span>Control avanzado de texto</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={toggleTextSpacing}
              className={textSpacingActive ? "bg-blue-600 text-white font-medium" : ""}
            >
              <Text className="mr-3 h-4 w-4" />
              <span>Ajuste de espaciado</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={toggleTextToSpeech}
              className={textToSpeechActive ? "bg-blue-600 text-white font-medium" : ""}
            >
              <Volume2 className="mr-3 h-4 w-4" />
              <span>Lector de texto</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={toggleKeyboardNav}
              className={keyboardNavActive ? "bg-blue-600 text-white font-medium" : ""}
            >
              <Keyboard className="mr-3 h-4 w-4" />
              <span>Guía de navegación por teclado</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

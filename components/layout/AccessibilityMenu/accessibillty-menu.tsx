'use client';

import { useState, useEffect } from 'react';
import { 
  PersonStanding, 
  Contrast, 
  Volume2,
  Type,
  Text,
  Keyboard,
  Heart,
  Sparkles
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
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  const toggleReducedMotion = () => setReducedMotion(prev => !prev);

  const toggleTextToSpeech = () => {
    setTextToSpeechActive(prev => !prev);
    
    if (!isBrowser) return;
    
    if (!textToSpeechActive) {
      toast({
        title: "Lector de texto activado",
        description: "Selecciona cualquier texto en la página para escucharlo.",
        duration: 3000,
      });
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Cancela cualquier lectura en curso
      }
    }
  };

  const toggleTextSpacing = () => {
    const newState = !textSpacingActive;
    setTextSpacingActive(newState);
    
    if (!isBrowser) return;
    
    // Al activar la función, también activamos la visibilidad del panel
    if (newState) {
      setTextSpacingPanelVisible(true);
      toast({
        title: "Ajuste de espaciado activado",
        description: "Puedes modificar el espaciado entre líneas y letras.",
        duration: 3000,
      });
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
      toast({
        title: "Ajuste de tamaño de texto activado",
        description: "Puedes modificar el tamaño del texto con controles avanzados.",
        duration: 3000,
      });
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
      toast({
        title: "Navegación por teclado activada",
        description: "Se muestra una guía de atajos de teclado útiles.",
        duration: 3000,
      });
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
            className={`relative rounded-full transition-all duration-300 ${textSizePanelVisible ? "bg-amber-100 text-amber-700 border-amber-300 shadow-lg" : "hover:scale-105"}`}
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
            className={`relative rounded-full transition-all duration-300 ${textSpacingPanelVisible ? "bg-amber-100 text-amber-700 border-amber-300 shadow-lg" : "hover:scale-105"}`}
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
            className={`relative rounded-full transition-all duration-300 ${keyboardNavPanelVisible ? "bg-amber-100 text-amber-700 border-amber-300 shadow-lg" : "hover:scale-105"}`}
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
                transition-all duration-300 ease-in-out
                transform hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                ${anyFeatureActive 
                  ? "bg-amber-500 hover:bg-amber-600 text-white" 
                  : ""
                }
                focus:ring-4 focus:ring-offset-2 focus:ring-amber-300
                group
              `}
              aria-label="Opciones de accesibilidad"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <PersonStanding className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  {anyFeatureActive && (
                    <>
                      <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-200 animate-bounce" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-300 border-2 border-white animate-ping"></div>
                    </>
                  )}
                </div>
                <span className="font-semibold tracking-wide">Accesibilidad</span>
              </div>
              
              {/* Efecto de brillo */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2 font-medium">
              Herramientas de Accesibilidad
            </div>
            
            <DropdownMenuItem 
              onClick={toggleHighContrast}
              className={`rounded-lg transition-colors ${theme === 'high-contrast' ? "bg-amber-100 dark:bg-amber-900 font-medium" : ""}`}
            >
              <Contrast className="mr-3 h-4 w-4" />
              <span>{theme === 'high-contrast' ? ' Desactivar' : 'Activar'} alto contraste</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={toggleTextSize}
              className={`rounded-lg transition-colors ${textSizeActive ? "bg-amber-100 dark:bg-amber-900 font-medium" : ""}`}
            >
              <Type className="mr-3 h-4 w-4" />
              <span>{textSizeActive ? ' Desactivar' : 'Activar'} control avanzado de texto</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={toggleTextSpacing}
              className={`rounded-lg transition-colors ${textSpacingActive ? "bg-amber-100 dark:bg-amber-900 font-medium" : ""}`}
            >
              <Text className="mr-3 h-4 w-4" />
              <span>{textSpacingActive ? ' Desactivar' : 'Activar'} ajuste de espaciado</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={toggleTextToSpeech}
              className={`rounded-lg transition-colors ${textToSpeechActive ? "bg-amber-100 dark:bg-amber-900 font-medium" : ""}`}
            >
              <Volume2 className="mr-3 h-4 w-4" />
              <span>{textToSpeechActive ? ' Desactivar' : 'Activar'} lector de texto</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={toggleKeyboardNav}
              className={`rounded-lg transition-colors ${keyboardNavActive ? "bg-amber-100 dark:bg-amber-900 font-medium" : ""}`}
            >
              <Keyboard className="mr-3 h-4 w-4" />
              <span>{keyboardNavActive ? ' Ocultar' : 'Mostrar'} guía de navegación por teclado</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
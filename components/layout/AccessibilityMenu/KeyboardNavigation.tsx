'use client';

import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardNavigationProps {
  isActive: boolean;
  isPanelVisible: boolean;
  onTogglePanel?: () => void;
}

export default function KeyboardNavigation({ isActive, isPanelVisible, onTogglePanel }: KeyboardNavigationProps) {
  // Agregar estado para verificar si estamos en el navegador
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    // Marcamos que estamos en el navegador
    setIsBrowser(true);
  }, []);
  
  // Si el componente no está activo, no estamos en el navegador o el panel no es visible, no renderizamos nada
  if (!isActive || !isBrowser || !isPanelVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-80 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <Keyboard className="mr-2 h-5 w-5 text-amber-500" />
          Navegación por teclado
        </h3>
        <button 
          onClick={onTogglePanel}
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
          aria-label="Ocultar guía de navegación por teclado"
          title="Ocultar guía de navegación por teclado"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-amber-600 mb-2">Navegación general</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Mover entre enlaces</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Tab</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Activar enlace/botón seleccionado</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Enter</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Volver a elemento anterior</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Shift + Tab</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Desplazarse hacia abajo</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">↓ / PgDn</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Desplazarse hacia arriba</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">↑ / PgUp</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Inicio de página</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Home</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Fin de página</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">End</kbd>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-amber-600 mb-2">Formularios</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Marcar/desmarcar casilla</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Espacio</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Seleccionar opción en desplegable</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">↑ / ↓</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Mover entre opciones de radio</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">↑ / ↓ / ← / →</kbd>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-amber-600 mb-2">Lectores de pantalla</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Iniciar/detener lectura (NVDA)</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Insert + ↓</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Leer elemento actual (JAWS)</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Insert + Tab</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Leer página completa (VoiceOver)</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">VO + A</kbd>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-amber-600 mb-2">Navegación por encabezados</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Estos atajos funcionan con la mayoría de lectores de pantalla (NVDA, JAWS, VoiceOver):
          </p>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Ir al siguiente encabezado</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">H</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Ir al encabezado nivel 1</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">1</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Ir al encabezado nivel 2</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">2</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Ir al encabezado nivel 3</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">3</kbd>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-amber-600 mb-2">Atajos de navegador</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Buscar en página</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Ctrl + F</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Recargar página</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">F5 / Ctrl + R</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Acercar (zoom in)</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Ctrl + +</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Alejar (zoom out)</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Ctrl + -</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Restablecer zoom</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Ctrl + 0</kbd>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
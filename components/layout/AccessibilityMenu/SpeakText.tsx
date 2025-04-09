'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SpeakText() {
  // Agregamos un estado para verificar si estamos en el navegador
  const [isBrowser, setIsBrowser] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Marcamos que estamos en el navegador una vez que el componente se monte
    setIsBrowser(true);
    
    // Cleanup function to cancel speech when component unmounts
    return () => {
      if (isBrowser && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isBrowser]);

  const speakSelectedText = () => {
    if (!isBrowser || !window.speechSynthesis) {
      toast({
        title: "Error",
        description: "Tu navegador no soporta la síntesis de voz.",
        variant: "destructive",
      });
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText) {
      toast({
        title: "Ningún texto seleccionado",
        description: "Por favor, selecciona el texto que deseas escuchar.",
        variant: "default",
      });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const newUtterance = new SpeechSynthesisUtterance(selectedText);
    
    // Get available voices (preferably Spanish)
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es'));
    if (spanishVoice) {
      newUtterance.voice = spanishVoice;
    }

    newUtterance.rate = 1;
    newUtterance.pitch = 1;

    // Event handlers
    newUtterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setUtterance(null);
    };

    newUtterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      setUtterance(null);
      
      toast({
        title: "Aviso",
        description: "Se detuvo la reproducción del audio. Para iniciar de nuevo, selecciona el texto a escuchar y presiona el botón de lectura.",
        variant: "destructive",
      });
    };

    // Store the utterance to control it later
    setUtterance(newUtterance);
    
    // Start speaking
    window.speechSynthesis.speak(newUtterance);
    
    toast({
      title: "Reproduciendo texto",
      description: `"${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}"`,
    });
  };

  const togglePause = () => {
    if (!isBrowser || !window.speechSynthesis || !isSpeaking) return;
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopSpeaking = () => {
    if (!isBrowser || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setUtterance(null);
  };

  // Si no estamos en el navegador, no renderizamos los botones
  if (!isBrowser) return null;

  return (
    <div className="flex items-center gap-2">
      {!isSpeaking ? (
        <Button
          variant="outline"
          size="icon"
          onClick={speakSelectedText}
          title="Leer texto seleccionado"
          className="relative rounded-full"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={togglePause}
            title={isPaused ? "Reanudar lectura" : "Pausar lectura"}
            className="relative rounded-full"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={stopSpeaking}
            title="Detener lectura"
            className="relative rounded-full"
          >
            <VolumeX className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
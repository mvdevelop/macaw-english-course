import { useState, useCallback, useRef } from "react";
import type { SpeechSynthesisReturn, SpeechOptions } from "../types";

/**
 * Hook para síntese de fala (Text-to-Speech) usando Web Speech API.
 * Permite falar textos em vários idiomas com controle de velocidade.
 */
export function useSpeechSynthesis(): SpeechSynthesisReturn {
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(
    typeof window !== "undefined" && !!window.speechSynthesis
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    const { lang = "en-US", rate = 0.9, pitch = 1, voice = null } = options;

    if (!window.speechSynthesis) {
      console.warn("SpeechSynthesis não suportado neste navegador.");
      return;
    }

    // Cancela qualquer fala anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Se um voice específico foi solicitado, tenta encontrar
    if (voice) {
      utterance.voice = voice;
    } else {
      // Tenta encontrar uma voz do idioma solicitado
      const voices = window.speechSynthesis.getVoices();
      const langVoice = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
      if (langVoice) utterance.voice = langVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis && speaking) {
      window.speechSynthesis.pause();
      setSpeaking(false);
    }
  }, [speaking]);

  const resume = useCallback(() => {
    if (window.speechSynthesis && !speaking) {
      window.speechSynthesis.resume();
      setSpeaking(true);
    }
  }, [speaking]);

  const getVoices = useCallback((lang?: string): SpeechSynthesisVoice[] => {
    if (!window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    if (lang) return voices.filter((v) => v.lang.startsWith(lang));
    return voices;
  }, []);

  return {
    speaking,
    supported,
    speak,
    stop,
    pause,
    resume,
    getVoices,
  };
}

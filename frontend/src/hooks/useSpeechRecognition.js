import { useState, useCallback, useRef } from "react";

/**
 * Hook para reconhecimento de fala (Speech-to-Text) usando Web Speech API.
 * Suporta português e inglês.
 */
export function useSpeechRecognition() {
  const [status, setStatus] = useState("idle"); // idle | listening | processing | done | error
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  const startListening = useCallback(
    (lang = "en-US") => {
      if (!isSupported) {
        setError("Seu navegador não suporta reconhecimento de fala. Tente Chrome ou Edge.");
        setStatus("error");
        return;
      }

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setStatus("listening");
        setError(null);
        setTranscript("");
        setInterimTranscript("");
      };

      recognition.onresult = (event) => {
        let final = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) setTranscript((prev) => prev + final);
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        setError(`Erro: ${event.error}`);
        setStatus("error");
      };

      recognition.onend = () => {
        if (status !== "error") {
          setStatus("done");
        }
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isSupported, status]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus("done");
    setInterimTranscript("");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  return {
    status,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    reset,
  };
}

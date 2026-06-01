import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

const DEFAULT_LANG = "pt";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("macaw-lang") || DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("macaw-lang", lang);
    } catch {
      // localStorage not available
    }
    const langMap = { pt: "pt-BR", en: "en-US", es: "es-ES" };
    document.documentElement.lang = langMap[lang] || "pt-BR";
  }, [lang]);

  function t(key) {
    return translations[lang]?.[key] ?? translations.pt?.[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within a LanguageProvider");
  return ctx;
}

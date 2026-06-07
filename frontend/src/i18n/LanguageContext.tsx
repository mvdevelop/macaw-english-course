import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";
import type { Lang, LanguageContextType, TranslationDict } from "../types";

const LanguageContext = createContext<LanguageContextType | null>(null);

const DEFAULT_LANG: Lang = "pt";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("macaw-lang") as Lang) || DEFAULT_LANG;
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
    const langMap: Record<Lang, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };
    document.documentElement.lang = langMap[lang] || "pt-BR";
  }, [lang]);

  function t(key: string): string {
    return translations[lang]?.[key] ?? translations.pt?.[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within a LanguageProvider");
  return ctx;
}

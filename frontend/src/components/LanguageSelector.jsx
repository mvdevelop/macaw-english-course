import { useState } from "react";
import { Languages, CheckIcon, ChevronDownIcon } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

const languages = [
  { code: "pt", flag: "🇧🇷" },
  { code: "en", flag: "🇬🇧" },
  { code: "es", flag: "🇪🇸" },
];

export default function LanguageSelector({ variant = "desktop" }) {
  const { lang, setLang, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === lang);

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-3">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              l.code === lang
                ? "bg-primary text-white"
                : "bg-white/50 dark:bg-black/30 text-slate-700 dark:text-slate-200"
            }`}
          >
            <span className="text-lg">{l.flag}</span>
            <span>{t(`lang.${l.code}`)}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition text-sm font-medium"
      >
        <Languages className="size-4" />
        <span className="text-lg leading-none">{currentLang?.flag}</span>
        <ChevronDownIcon className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1.5">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition ${
                  l.code === lang
                    ? "bg-primary/10 dark:bg-primary/20 text-primary"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span className="text-lg">{l.flag}</span>
                <span className="font-medium">{t(`lang.${l.code}`)}</span>
                {l.code === lang && <CheckIcon className="size-4 ml-auto text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

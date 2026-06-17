import React, { createContext, useContext, useState, useCallback } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

const STORAGE_KEY = "portfolio-lang";

function readStoredLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch {
    /* ignore */
  }
  return "pt-BR";
}

export function LanguageProvider({ children }) {
  const [lang] = useState(readStoredLang);

  const setLang = useCallback((next) => {
    if (next === lang || !translations[next]) return;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.location.reload();
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(lang === "pt-BR" ? "en" : "pt-BR");
  }, [lang, setLang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

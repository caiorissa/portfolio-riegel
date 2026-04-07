import React, { createContext, useContext, useState, useCallback } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

const STORAGE_KEY = "portfolio-lang";

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch {}
  return "pt-BR";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "pt-BR" ? "en" : "pt-BR";
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

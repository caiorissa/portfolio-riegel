import React from "react";
import { Languages } from "lucide-react";
import { useLang } from "../i18n/LanguageContext.jsx";

const OPTIONS = [
  { code: "pt-BR", label: "PT", title: "Português (Brasil)" },
  { code: "en", label: "EN", title: "English" },
];

export default function LangSwitcher({ compact = false }) {
  const { lang, setLang } = useLang();

  return (
    <div
      translate="no"
      className="notranslate inline-flex items-center gap-1.5 rounded-pill border border-border-strong bg-surface/60 p-1 backdrop-blur-sm"
      role="group"
      aria-label="Idioma / Language"
    >
      {!compact && (
        <Languages
          size={14}
          className="ml-1.5 shrink-0 text-subtle"
          aria-hidden
        />
      )}

      {OPTIONS.map(({ code, label, title }) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            title={title}
            aria-pressed={active}
            aria-label={title}
            onClick={() => setLang(code)}
            className={
              "min-w-[2.25rem] rounded-pill px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.06em] transition-all duration-200 touch-manipulation " +
              (active
                ? "bg-content text-bg shadow-sm"
                : "text-muted hover:text-content")
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

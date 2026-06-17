import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-space-4 text-center">
      <p className="eyebrow mb-space-4">{t.notFound.label}</p>
      <h1 className="font-display uppercase text-fluid-5 leading-[0.95] text-content mb-space-3">
        {t.notFound.title}
      </h1>
      <p className="text-fluid-0 text-muted mb-space-6 max-w-md">
        {t.notFound.description}
      </p>
      <Link
        to="/"
        className="text-fluid--1 uppercase tracking-[0.16em] px-space-6 py-space-3 rounded-pill bg-white text-black hover:bg-accent hover:shadow-glow transition-all"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}

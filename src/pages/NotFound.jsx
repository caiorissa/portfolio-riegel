import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[0.75rem] tracking-[0.25em] uppercase text-neutral-500 mb-3">
        {t.notFound.label}
      </p>
      <h1 className="text-3xl font-semibold mb-2">
        {t.notFound.title}
      </h1>
      <p className="text-sm text-neutral-400 mb-6 max-w-md">
        {t.notFound.description}
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="text-xs px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-100 transition"
        >
          {t.notFound.back}
        </Link>
      </div>
    </div>
  );
}

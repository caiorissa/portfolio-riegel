import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[0.75rem] tracking-[0.25em] uppercase text-neutral-500 mb-3">
        Erro 404
      </p>
      <h1 className="text-3xl font-semibold mb-2">
        Página não encontrada
      </h1>
      <p className="text-sm text-neutral-400 mb-6 max-w-md">
        A rota que você tentou acessar não existe. Volte para a página inicial.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="text-xs px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-100 transition"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}

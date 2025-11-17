import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { ADMIN_EMAIL } from "../lib/adminUser";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (result.user.email !== ADMIN_EMAIL) {
        setError("Acesso não autorizado.");
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Email ou senha incorretos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-10 pt-48 pb-10">
      <div className="w-full max-w-sm bg-neutral-950 border border-white/10 rounded-2xl px-5 py-6 shadow-xl">
        <p className="text-[0.7rem] tracking-[0.25em] uppercase text-neutral-500 mb-3 text-center">
          Login do administrador
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-neutral-400">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-400">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-md px-3 py-2 mt-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 text-sm font-medium bg-white text-black rounded-lg py-2.5 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-neutral-100 transition"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

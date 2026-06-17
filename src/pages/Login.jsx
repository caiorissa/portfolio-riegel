import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { ADMIN_EMAIL } from "../lib/adminUser";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLang();
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
        setError(t.login.unauthorized);
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(t.login.invalidCredentials);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-space-4 pt-space-10 pb-space-8">
      <div className="w-full max-w-sm glass-panel rounded-lg px-space-5 py-space-6 shadow-md">
        <p className="eyebrow mb-space-5 text-center">{t.login.label}</p>

        <form onSubmit={handleSubmit} className="space-y-space-4">
          <div className="space-y-space-1">
            <label className="text-fluid--1 text-muted">{t.login.emailLabel}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-space-1">
            <label className="text-fluid--1 text-muted">{t.login.passwordLabel}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-fluid--1 text-red-400 bg-red-950/40 border border-red-900/50 rounded-md px-space-3 py-space-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-space-2 text-fluid--1 uppercase tracking-[0.16em] font-medium bg-white text-black rounded-pill py-space-3 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent hover:shadow-glow transition-all"
          >
            {submitting ? t.login.submitting : t.login.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

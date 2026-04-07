import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { ADMIN_EMAIL } from "../lib/adminUser";
import { useLang } from "../i18n/LanguageContext.jsx";
import logo from "../assets/logoriegelsemfundo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang();

  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";

  const [shrink, setShrink] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShrink(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  function logout() {
    signOut(auth);
    navigate("/", { replace: true });
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <header
      className={
        "fixed w-full top-0 z-50 transition-all duration-300 " +
        (shrink
          ? "py-2 rounded-3xl transition hover:shadow-[0_0_60px_rgba(255,255,255,0.08)] backdrop-blur-xl border-b border-white/5"
          : "py-4  backdrop-blur-lg border-b border-white/10")
      }
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Riegel logo"
            className={
              "transition-all duration-300 " +
              (shrink ? "h-10 opacity-90" : "h-16 opacity-100")
            }
          />
        </Link>

        <nav className="flex items-center gap-8 text-sm font-light">

          <PremiumLink to="/" active={isHome}>
            {t.nav.home}
          </PremiumLink>
          {isAdmin && (
            <PremiumLink to="/dashboard" active={isDashboard}>
              {t.nav.dashboard}
            </PremiumLink>
          )}

          {!user && (
            <PremiumLink to="/login" active={false}>
              {t.nav.login}
            </PremiumLink>
          )}

          {user && (
            <button
              onClick={logout}
              className="text-neutral-400 hover:text-white transition pb-1 relative group"
            >
              {t.nav.logout}
              <span className="absolute left-0 -bottom-[2px] h-[1.5px] w-0 opacity-0 bg-white transition-all duration-300 group-hover:w-full group-hover:opacity-100" />
            </button>
          )}

          <PremiumLink to="/contato" active={location.pathname === "/contato"}>
            {t.nav.contact}
          </PremiumLink>

          <button
            onClick={toggleLang}
            className="px-2.5 py-1 text-xs font-medium rounded-full border border-white/20 text-neutral-300 hover:bg-white hover:text-black transition"
            title={lang === "pt-BR" ? "Switch to English" : "Mudar para Português"}
          >
            {lang === "pt-BR" ? "EN" : "PT"}
          </button>

        </nav>
      </div>
    </header>
  );
}

function PremiumLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={
        "relative pb-1 transition text-neutral-400 hover:text-white group " +
        (active ? "text-white" : "")
      }
    >
      {children}
      <span
        className={
          "absolute left-0 -bottom-[2px] h-[1.5px] bg-white block transition-all duration-300 " +
          (active
            ? "w-full opacity-100"
            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100")
        }
      />
    </Link>
  );
}

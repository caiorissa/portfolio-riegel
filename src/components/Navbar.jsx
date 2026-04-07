import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Menu, X } from "lucide-react";
import { auth } from "../lib/firebaseConfig";
import { ADMIN_EMAIL } from "../lib/adminUser";
import { useLang } from "../i18n/LanguageContext.jsx";
import logo from "../assets/logoriegelsemfundo.png";
import GlassSurface from "./reactbits/GlassSurface.jsx";

const MOBILE_NAV_MQ = "(max-width: 767.98px)";

function useIsMobileNav() {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_NAV_MQ).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return matches;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang();
  const isMobileNav = useIsMobileNav();

  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";

  const [shrink, setShrink] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

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

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileNav) setMenuOpen(false);
  }, [isMobileNav]);

  useEffect(() => {
    if (menuOpen && isMobileNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, isMobileNav]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function logout() {
    signOut(auth);
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        translate="no"
        className={
          "notranslate fixed w-full max-w-[100vw] left-0 right-0 top-0 z-[60] overflow-x-hidden transition-all duration-300 px-3 sm:px-4 " +
          (shrink ? "py-2" : "py-3 md:py-4")
        }
      >
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={shrink ? 22 : 26}
          borderWidth={0.06}
          blur={12}
          backgroundOpacity={0.4}
          saturation={0.5}
          brightness={50}
          opacity={0.8}
          darkMode
          className={
            "max-w-6xl mx-auto w-full min-h-0 !items-stretch " +
            (shrink ? "transition hover:shadow-[0_0_48px_rgba(255,255,255,0.06)]" : "")
          }
          contentClassName="!items-center !justify-between w-full min-h-[48px] md:min-h-[56px] px-2 sm:px-3 py-1.5 md:py-2"
        >
        <div
          className="
            w-full min-w-0
            flex md:grid md:grid-cols-[auto_minmax(0,1fr)_auto]
            items-center gap-2 md:gap-4
            justify-between
          "
        >
          <Link
            to="/"
            className="flex items-center shrink-0 min-w-0 touch-manipulation justify-self-start"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="Riegel logo"
              className={
                "transition-all duration-300 max-h-[44px] w-auto md:max-h-none " +
                (shrink ? "h-9 md:h-10 opacity-90" : "h-11 md:h-16 opacity-100")
              }
            />
          </Link>

          <nav
            className="hidden md:flex flex-row flex-wrap justify-end items-center gap-x-4 lg:gap-x-6 gap-y-1 min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-1"
            aria-label="Main"
          >
            <PremiumLink to="/" active={isHome}>
              {t.nav.home}
            </PremiumLink>
            {isAdmin && (
              <PremiumLink to="/dashboard" active={isDashboard}>
                {t.nav.dashboard}
              </PremiumLink>
            )}
            {!user && (
              <PremiumLink to="/login" active={location.pathname === "/login"}>
                {t.nav.login}
              </PremiumLink>
            )}
            {user && (
              <button
                type="button"
                onClick={logout}
                className="text-neutral-400 hover:text-white transition pb-1 relative group whitespace-nowrap shrink-0"
              >
                {t.nav.logout}
                <span className="absolute left-0 -bottom-[2px] h-[1.5px] w-0 opacity-0 bg-white transition-all duration-300 group-hover:w-full group-hover:opacity-100" />
              </button>
            )}
            <PremiumLink to="/contato" active={location.pathname === "/contato"}>
              {t.nav.contact}
            </PremiumLink>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-self-end relative z-[61] py-0.5 md:py-0 pl-1 md:pl-0 -mr-0.5 md:mr-0">
            <button
              type="button"
              translate="no"
              onClick={toggleLang}
              className="notranslate px-2.5 py-1.5 text-xs font-medium rounded-full border border-white/20 text-neutral-300 hover:bg-white hover:text-black transition touch-manipulation [text-decoration:none]"
              title={lang === "pt-BR" ? "Switch to English" : "Mudar para Português"}
            >
              {lang === "pt-BR" ? "EN" : "PT"}
            </button>

            {isMobileNav && (
              <button
                type="button"
                className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition touch-manipulation"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            )}
          </div>
        </div>
        </GlassSurface>
      </header>

      {isMobileNav && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menuTitle}
          className={
            "fixed inset-0 z-[55] bg-black/95 backdrop-blur-xl transition-opacity duration-200 md:hidden " +
            (menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
          }
          aria-hidden={!menuOpen}
          onClick={closeMenu}
        >
          <nav
            className="flex flex-col gap-1 pt-[4.75rem] px-5 pb-10 max-h-[100dvh] overflow-y-auto overscroll-contain"
            aria-label="Mobile"
            onClick={(e) => e.stopPropagation()}
          >
            <MobileNavLink to="/" active={isHome} onNavigate={closeMenu}>
              {t.nav.home}
            </MobileNavLink>
            {isAdmin && (
              <MobileNavLink to="/dashboard" active={isDashboard} onNavigate={closeMenu}>
                {t.nav.dashboard}
              </MobileNavLink>
            )}
            {!user && (
              <MobileNavLink to="/login" active={location.pathname === "/login"} onNavigate={closeMenu}>
                {t.nav.login}
              </MobileNavLink>
            )}
            {user && (
              <button
                type="button"
                onClick={logout}
                className="text-left py-3.5 text-base text-neutral-300 hover:text-white border-b border-white/10 transition"
              >
                {t.nav.logout}
              </button>
            )}
            <MobileNavLink to="/contato" active={location.pathname === "/contato"} onNavigate={closeMenu}>
              {t.nav.contact}
            </MobileNavLink>
          </nav>
        </div>
      )}
    </>
  );
}

function PremiumLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={
        "relative pb-1 transition text-neutral-400 hover:text-white group whitespace-nowrap shrink-0 [text-decoration:none] " +
        (active ? "text-white" : "")
      }
    >
      {children}
      <span
        className={
          "pointer-events-none absolute left-0 -bottom-[2px] h-[1.5px] bg-white block transition-all duration-300 " +
          (active
            ? "w-full opacity-100"
            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100")
        }
      />
    </Link>
  );
}

function MobileNavLink({ to, active, onNavigate, children }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={
        "block py-3.5 text-base border-b border-white/10 transition [text-decoration:none] " +
        (active ? "text-white font-medium" : "text-neutral-300 hover:text-white")
      }
    >
      {children}
    </Link>
  );
}

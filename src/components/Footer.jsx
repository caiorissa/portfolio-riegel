import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";
import { useLang } from "../i18n/LanguageContext.jsx";
import { scrollPageToTop } from "./ScrollToTop.jsx";
import Dock from "./reactbits/Dock.jsx";

export default function Footer() {
  const { t } = useLang();

  const dockItems = [
    {
      icon: <Instagram size={18} className="text-content" />,
      label: "Instagram",
      onClick: () => window.open("https://instagram.com/riegelfilms", "_blank")
    },
    {
      icon: <Youtube size={18} className="text-content" />,
      label: "YouTube",
      onClick: () =>
        window.open("https://youtube.com/@riegelfilmss?si=XFGb7W6iy8E5QxCY", "_blank")
    },
    {
      icon: <Mail size={18} className="text-content" />,
      label: "Email",
      onClick: () =>
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com",
          "_blank"
        )
    }
  ];

  return (
    <footer className="relative mt-space-9 border-t border-border">
      <div className="max-w-6xl mx-auto px-space-4 py-space-8">
        <div className="grid gap-space-7 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <p className="font-display text-fluid-2 text-content">
              RIEGEL
            </p>
            <p className="mt-space-3 max-w-xs text-fluid--1 leading-relaxed text-muted">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navegação */}
          <div>
            <p className="eyebrow mb-space-4">{t.footer.studio}</p>
            <ul className="space-y-space-2">
              <li>
                <Link
                  to="/"
                  className="text-fluid--1 text-muted hover:text-content transition"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  onClick={scrollPageToTop}
                  className="text-fluid--1 text-muted hover:text-content transition"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p className="eyebrow mb-space-4">{t.footer.contact}</p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="text-fluid--1 text-accent hover:text-content transition"
            >
              arturriegelph@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-space-7 pt-space-5 border-t border-border flex flex-col md:flex-row items-center justify-between gap-space-4">
          <p className="text-fluid--1 text-subtle text-center md:text-left">
            © {new Date().getFullYear()} —{" "}
            <span className="text-content">Artur Riegel</span>. {t.footer.rights}
          </p>

          <Dock items={dockItems} baseItemSize={42} magnification={54} distance={110} />
        </div>
      </div>
    </footer>
  );
}

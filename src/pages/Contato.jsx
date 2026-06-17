import React from "react";
import { Mail, Instagram, ExternalLink, Youtube } from "lucide-react";
import { useLang } from "../i18n/LanguageContext.jsx";
import logo from "../assets/logoriegelsemfundo.png";

export default function Contato() {
  const { t } = useLang();

  return (
    <div className="relative min-h-[100dvh] px-space-5 pt-32 md:pt-36 pb-space-9">
      <img
        src={logo}
        alt="Riegel"
        className="absolute opacity-[0.05] w-[60vw] max-w-[550px] select-none pointer-events-none"
        style={{ top: "18%", left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-space-8 items-center min-h-[calc(100dvh-10rem)]">
        <div className="space-y-space-4">
          <p className="eyebrow">{t.contact.tagline}</p>
          <h1 className="font-display uppercase text-fluid-5 leading-[0.95] text-content">
            {t.contact.title}
          </h1>
          <p className="max-w-sm text-fluid-0 leading-relaxed text-muted">
            {t.contact.description}
          </p>
        </div>

        <div className="glass-panel rounded-lg shadow-md p-space-5 space-y-space-4">
          <ContactButton
            icon={<Instagram size={20} />}
            label={t.contact.instagram}
            href="https://instagram.com/riegelfilms"
          />
          <ContactButton
            icon={<Mail size={20} />}
            label={t.contact.email}
            href="https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com"
          />
          <ContactButton
            icon={<Youtube size={20} />}
            label={t.contact.youtube}
            href="https://youtube.com/@riegelfilmss?si=XFGb7W6iy8E5QxCY"
          />
        </div>
      </div>
    </div>
  );
}

function ContactButton({ icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between w-full bg-bg-elevated border border-border py-space-3 px-space-4
                 rounded-md text-content hover:bg-accent hover:text-black hover:border-accent transition-all duration-200"
    >
      <div className="flex items-center gap-space-3">
        {icon}
        <span className="text-fluid--1 uppercase tracking-[0.14em]">{label}</span>
      </div>
      <ExternalLink size={18} className="opacity-60 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

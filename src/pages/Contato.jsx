import React from "react";
import { Mail, Instagram, ExternalLink, Youtube } from "lucide-react";
import logo from "../assets/logoriegelsemfundo.png";

export default function Contato() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-20">
      
      <img
        src={logo}
        alt="Riegel"
        className="absolute opacity-[0.06] w-[60vw] max-w-[550px] select-none pointer-events-none"
        style={{ top: "12%", left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="relative max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            Entre em Contato
          </h1>

          <p className="text-neutral-400 max-w-sm leading-relaxed">
            Para orçamentos, parcerias e trabalhos audiovisuais, fale conosco diretamente.
          </p>

          <p className="text-neutral-500 text-sm uppercase tracking-[0.25em] mt-4">
            Roteirização • Produção • Edição • Resultado
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 space-y-5">

          <ContactButton
            icon={<Instagram size={20} />}
            label="Instagram"
            href="https://instagram.com/riegelfilms"
          />

          <ContactButton
            icon={<Mail size={20} />}
            label="Enviar Email"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com"
          />
         
          <ContactButton
            icon={<Youtube size={20} />}
            label="Youtube"
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
      className="flex items-center justify-between w-full bg-black border border-white/10 py-3 px-4
                 rounded-xl text-white hover:bg-white hover:text-black transition group"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <ExternalLink size={18} className="opacity-60 group-hover:opacity-100" />
    </a>
  );
}


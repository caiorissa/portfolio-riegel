import React from "react";
import { Instagram, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        mt-20 mb-10 mx-auto max-w-5xl
        p-6 rounded-3xl
        bg-white/5 border border-white/10
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(255,255,255,0.05)]
      "
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* ESQUERDA */}
        <p className="text-neutral-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} — <span className="text-white">Artur Riegel</span>.  
          Todos os direitos reservados.
        </p>

        {/* DIREITA */}
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/riegelfilms"
            target="_blank"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10"
          >
            <Instagram size={18} className="text-white" />
          </a>

          <a
            href="https://youtube.com/@riegelfilmss?si=XFGb7W6iy8E5QxCY"
            target="_blank"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10"
          >
            <Youtube size={18} className="text-white" />
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10"
          >
            <Mail size={18} className="text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
}

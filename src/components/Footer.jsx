import React from "react";
import { Instagram, Youtube, Mail } from "lucide-react";
import { useLang } from "../i18n/LanguageContext.jsx";
import Dock from "./reactbits/Dock.jsx";

export default function Footer() {
  const { t } = useLang();

  const dockItems = [
    {
      icon: <Instagram size={18} className="text-white" />,
      label: "Instagram",
      onClick: () => window.open("https://instagram.com/riegelfilms", "_blank")
    },
    {
      icon: <Youtube size={18} className="text-white" />,
      label: "YouTube",
      onClick: () => window.open("https://youtube.com/@riegelfilmss?si=XFGb7W6iy8E5QxCY", "_blank")
    },
    {
      icon: <Mail size={18} className="text-white" />,
      label: "Email",
      onClick: () => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com", "_blank")
    }
  ];

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

        <p className="text-neutral-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} — <span className="text-white">Artur Riegel</span>.{" "}
          {t.footer.rights}
        </p>

        <Dock
          items={dockItems}
          baseItemSize={42}
          magnification={54}
          distance={110}
        />
      </div>
    </footer>
  );
}

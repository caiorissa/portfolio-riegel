import React, { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function VideoModal({ video, onClose }) {
  const { t } = useLang();
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  useEffect(() => {
    if (!video) return;

    const img = new Image();
    img.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

    img.onload = () => {
      const vertical = img.height > img.width;
      setIsVertical(vertical);
    };
  }, [video]);

  if (!video) return null;

  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md px-space-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-bg-elevated border border-border rounded-lg overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-space-4 py-space-3 border-b border-border">
          <h2 className="eyebrow">{t.videoModal.header}</h2>
          <button
            onClick={onClose}
            className="text-fluid--1 text-muted hover:text-content transition"
          >
            {t.videoModal.close}
          </button>
        </div>

        <div
          className={
            isVertical
              ? "bg-black w-full mx-auto"
              : "aspect-video bg-black"
          }
          style={
            isVertical
              ? { aspectRatio: "9 / 16", maxHeight: "80vh" }
              : {}
          }
        >
          <iframe
            src={embedUrl}
            title={video.title}
            className={
              isVertical
                ? "w-full h-full object-cover"
                : "w-full h-full"
            }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="px-space-4 py-space-4 flex flex-col gap-space-2">
          <p className="eyebrow text-accent/90">
            {video.category?.trim() || t.portfolio.defaultCategory}
          </p>
          <h3 className="font-display uppercase text-fluid-1 text-content">
            {video.title}
          </h3>
          <p className="text-fluid--1 text-muted whitespace-pre-line">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
}

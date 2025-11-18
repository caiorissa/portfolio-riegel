import React, { useEffect, useState } from "react";

export default function VideoModal({ video, onClose }) {
  const [isVertical, setIsVertical] = useState(false);

  // ESC para fechar
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // Detectar proporção real da thumb
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-neutral-400">
            Detalhes do vídeo
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white transition"
          >
            Fechar ✕
          </button>
        </div>

        {/* PLAYER — AQUI ESTÁ A MÁGICA */}
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

        {/* Info */}
        <div className="px-4 py-4 flex flex-col gap-2">
          <h3 className="text-base font-semibold text-white">
            {video.title}
          </h3>
          <p className="text-sm text-neutral-300 whitespace-pre-line">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
}

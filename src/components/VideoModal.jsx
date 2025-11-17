import React, { useEffect } from "react";

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

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

        <div className="aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

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

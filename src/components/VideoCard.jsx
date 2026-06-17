import React from "react";
import { Play } from "lucide-react";
import TiltedCard from "./reactbits/TiltedCard.jsx";

export default function VideoCard({ video, onClick }) {
  if (!video || !video.youtubeId) {
    console.warn("Video sem youtubeId:", video);
    return null;
  }

  const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/0.jpg`;

  return (
    <TiltedCard
      containerHeight="auto"
      containerWidth="100%"
      scaleOnHover={1.03}
      rotateAmplitude={8}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div
        className="group glass-panel rounded-lg overflow-hidden
                   shadow-glow-soft transition-all duration-300
                   hover:border-border-strong hover:shadow-glow"
      >
        <div className="relative w-full aspect-video bg-bg overflow-hidden">
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            onError={() => {
              console.error("Erro ao carregar thumbnail de", video.youtubeId);
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent
                       opacity-70 transition-opacity duration-300 group-hover:opacity-90"
            aria-hidden
          />
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 scale-90
                       transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
            aria-hidden
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-accent text-black shadow-glow">
              <Play size={20} className="ml-0.5" fill="currentColor" />
            </span>
          </div>
        </div>

        <div className="p-space-4">
          <h3 className="font-display uppercase text-fluid-1 leading-tight text-content mb-space-1">
            {video.title}
          </h3>
          <p className="text-fluid--1 text-muted line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </TiltedCard>
  );
}

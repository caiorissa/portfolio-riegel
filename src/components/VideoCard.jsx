import React from "react";
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
      scaleOnHover={1.04}
      rotateAmplitude={10}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div
        className="rounded-2xl overflow-hidden
                   bg-white/5 border border-white/10
                   backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.05)]
                   hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]
                   transition-all"
      >
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => {
              console.error("Erro ao carregar thumbnail de", video.youtubeId);
            }}
          />
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-sm md:text-base mb-1">
            {video.title}
          </h3>
          <p className="text-neutral-400 text-xs line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </TiltedCard>
  );
}

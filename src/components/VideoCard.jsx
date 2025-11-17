import React from "react";

export default function VideoCard({ video, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-neutral-950 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden bg-neutral-900">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[0.65rem] text-neutral-500">
            Sem thumbnail
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <h3 className="text-sm font-medium text-white line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-neutral-400 line-clamp-2">
          {video.description}
        </p>
      </div>
    </button>
  );
}

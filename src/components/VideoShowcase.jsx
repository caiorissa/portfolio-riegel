import React, { useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";

function thumbUrl(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function fallbackThumb(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
}

export default function VideoShowcase({ videos, onSelect }) {
  const [activeId, setActiveId] = useState(null);
  const { t } = useLang();

  if (!videos.length) return null;

  const categoryFallback = t.portfolio.defaultCategory;

  return (
    <>
      {/* Desktop — faixa vertical estilo accordion */}
      <div
        className="hidden md:flex h-[min(72vh,640px)] w-full overflow-hidden rounded-lg border border-border"
        onMouseLeave={() => setActiveId(null)}
      >
        {videos.map((video) => (
          <DesktopStrip
            key={video.id}
            video={video}
            active={activeId === video.id}
            categoryLabel={formatCategory(video, categoryFallback)}
            onActivate={() => setActiveId(video.id)}
            onSelect={() => onSelect(video)}
          />
        ))}
      </div>

      {/* Mobile — cards empilhados com texto fixo */}
      <div className="md:hidden flex flex-col gap-space-4">
        {videos.map((video) => (
          <MobileCard
            key={video.id}
            video={video}
            categoryLabel={formatCategory(video, categoryFallback)}
            onSelect={() => onSelect(video)}
          />
        ))}
      </div>
    </>
  );
}

function formatCategory(video, fallback) {
  const value = video.category?.trim();
  return value || fallback;
}

function DesktopStrip({ video, active, onActivate, onSelect, categoryLabel }) {
  const [imgSrc, setImgSrc] = useState(thumbUrl(video.youtubeId));

  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onSelect}
      className="relative h-full min-w-0 border-r border-border/40 last:border-r-0 overflow-hidden
        bg-bg text-left cursor-pointer transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      style={{ flex: active ? "5 1 0%" : "1 1 0%" }}
      aria-label={video.title}
    >
      <img
        src={imgSrc}
        alt=""
        className={
          "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out " +
          (active ? "scale-110" : "scale-100")
        }
        onError={() => setImgSrc(fallbackThumb(video.youtubeId))}
      />

      <div
        className={
          "absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-opacity duration-500 " +
          (active ? "opacity-100" : "opacity-40")
        }
        aria-hidden
      />

      <div
        className={
          "absolute bottom-0 left-0 right-0 p-space-5 transition-all duration-500 ease-out " +
          (active
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none")
        }
      >
        <p className="eyebrow mb-space-2 text-accent/90 uppercase">{categoryLabel}</p>
        <h3 className="font-display uppercase text-fluid-3 leading-[0.95] text-content">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-space-2 max-w-md text-fluid--1 leading-relaxed text-muted line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </button>
  );
}

function MobileCard({ video, onSelect, categoryLabel }) {
  const [imgSrc, setImgSrc] = useState(thumbUrl(video.youtubeId));

  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative w-full min-h-[300px] overflow-hidden rounded-lg border border-border text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={video.title}
    >
      <img
        src={imgSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => setImgSrc(fallbackThumb(video.youtubeId))}
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
        aria-hidden
      />

      <div className="absolute bottom-0 left-0 right-0 p-space-5">
        <p className="eyebrow mb-space-2 text-accent/90 uppercase">{categoryLabel}</p>
        <h3 className="font-display uppercase text-fluid-3 leading-[0.95] text-content">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-space-2 text-fluid--1 leading-relaxed text-muted/90 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </button>
  );
}

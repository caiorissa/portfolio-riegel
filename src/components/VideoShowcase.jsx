import React, { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

      {/* Mobile — carrossel horizontal */}
      <MobileCarousel
        videos={videos}
        categoryFallback={categoryFallback}
        onSelect={onSelect}
      />
    </>
  );
}

function formatCategory(video, fallback) {
  const value = video.category?.trim();
  return value || fallback;
}

function MobileCarousel({ videos, categoryFallback, onSelect }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback(
    (index) => {
      const container = scrollRef.current;
      if (!container) return;

      const next = Math.max(0, Math.min(index, videos.length - 1));
      const slide = container.children[next];
      if (!slide) return;

      slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setActiveIndex(next);
    },
    [videos.length]
  );

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !container.children.length) return;

    const { left, width } = container.getBoundingClientRect();
    const center = left + width / 2;

    let closest = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const distance = Math.abs(childCenter - center);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  return (
    <div className="md:hidden relative -mx-space-4">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-space-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-space-4 pb-1
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video) => (
          <div key={video.id} className="snap-center shrink-0 w-[86vw] max-w-[22rem]">
            <MobileCard
              video={video}
              categoryLabel={formatCategory(video, categoryFallback)}
              onSelect={() => onSelect(video)}
            />
          </div>
        ))}
      </div>

      {videos.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Vídeo anterior"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-pill
              bg-black/55 text-white backdrop-blur-sm border border-white/10
              transition-opacity disabled:opacity-0"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === videos.length - 1}
            aria-label="Próximo vídeo"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-pill
              bg-black/55 text-white backdrop-blur-sm border border-white/10
              transition-opacity disabled:opacity-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {videos.length > 1 && (
        <div className="mt-space-3 flex justify-center gap-1.5">
          {videos.map((video, index) => (
            <button
              key={video.id}
              type="button"
              aria-label={`Ir para vídeo ${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className={
                "h-1.5 rounded-pill transition-all duration-300 " +
                (index === activeIndex ? "w-6 bg-accent" : "w-1.5 bg-border-strong")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
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
      className="relative w-full min-h-[min(58vh,420px)] overflow-hidden rounded-lg border border-border text-left
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

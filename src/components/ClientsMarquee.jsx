import React, { useCallback, useEffect, useRef } from "react";
import { clientLogos } from "../data/clientLogos.js";

const SCROLL_SPEED = 1.35;
const RESUME_DELAY_MS = 2200;
const TOUCH_SETTLE_MS = 450;

export default function ClientsMarquee({ label, subtitle }) {
  const scrollRef = useRef(null);
  const isPausedRef = useRef(false);
  const isMouseDraggingRef = useRef(false);
  const isTouchingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const resumeTimerRef = useRef(null);
  const settleTimerRef = useRef(null);

  const track = [...clientLogos, ...clientLogos];

  const clearTimers = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  };

  const normalizeScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const loopWidth = el.scrollWidth / 2;
    if (loopWidth <= 0) return;

    if (el.scrollLeft >= loopWidth) {
      el.scrollLeft -= loopWidth;
    }
  }, []);

  const pauseAutoScroll = useCallback((resumeAfter = true) => {
    isPausedRef.current = true;
    clearTimers();

    if (resumeAfter) {
      resumeTimerRef.current = setTimeout(() => {
        if (!isTouchingRef.current && !isMouseDraggingRef.current) {
          isPausedRef.current = false;
        }
      }, RESUME_DELAY_MS);
    }
  }, []);

  const finishUserInteraction = useCallback(() => {
    clearTimers();
    settleTimerRef.current = setTimeout(() => {
      normalizeScroll();
      pauseAutoScroll();
    }, TOUCH_SETTLE_MS);
  }, [normalizeScroll, pauseAutoScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return undefined;

    const onScrollEnd = () => {
      if (isTouchingRef.current || isMouseDraggingRef.current) return;
      normalizeScroll();
    };

    el.addEventListener("scrollend", onScrollEnd);

    let frameId = 0;

    const tick = () => {
      if (
        !isPausedRef.current &&
        !isMouseDraggingRef.current &&
        !isTouchingRef.current
      ) {
        el.scrollLeft += SCROLL_SPEED;
        normalizeScroll();
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      el.removeEventListener("scrollend", onScrollEnd);
      clearTimers();
    };
  }, [normalizeScroll]);

  const handlePointerDown = (event) => {
    const el = scrollRef.current;
    if (!el || event.button !== 0) return;

    // No mobile: só scroll nativo — pointer drag quebra o gesto e causa “pulo”
    if (event.pointerType === "touch") return;

    isMouseDraggingRef.current = true;
    pauseAutoScroll(false);
    dragStartRef.current = {
      x: event.clientX,
      scrollLeft: el.scrollLeft
    };
    el.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isMouseDraggingRef.current) return;

    const el = scrollRef.current;
    if (!el) return;

    const delta = event.clientX - dragStartRef.current.x;
    el.scrollLeft = dragStartRef.current.scrollLeft - delta;

    const loopWidth = el.scrollWidth / 2;
    if (loopWidth > 0 && el.scrollLeft >= loopWidth) {
      el.scrollLeft -= loopWidth;
      dragStartRef.current.scrollLeft -= loopWidth;
    }
  };

  const handlePointerUp = (event) => {
    const el = scrollRef.current;
    if (!el || !isMouseDraggingRef.current) return;

    isMouseDraggingRef.current = false;
    normalizeScroll();

    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    finishUserInteraction();
  };

  const handleTouchStart = () => {
    isTouchingRef.current = true;
    pauseAutoScroll(false);
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    finishUserInteraction();
  };

  const handleWheel = (event) => {
    const el = scrollRef.current;
    if (!el) return;

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
      el.scrollLeft += event.deltaX;
      normalizeScroll();
      pauseAutoScroll();
    }
  };

  return (
    <section className="relative w-full border-y border-border bg-bg py-space-9 md:py-space-11">
      <div className="text-center mb-space-7 px-space-4">
        <p className="eyebrow">{label}</p>
        <p className="mt-space-3 text-fluid-0 text-muted">{subtitle}</p>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28 bg-gradient-to-r from-bg to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28 bg-gradient-to-l from-bg to-transparent"
          aria-hidden
        />

        <div
          ref={scrollRef}
          className="clients-marquee-scroll overflow-x-auto cursor-grab active:cursor-grabbing
            touch-pan-x overscroll-x-contain select-none
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onWheel={handleWheel}
          aria-label={label}
          role="region"
        >
          <div className="flex w-max items-center gap-space-12 sm:gap-space-16 md:gap-space-20 lg:gap-28 px-space-8">
            {track.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex h-16 sm:h-[4.5rem] md:h-20 lg:h-24 shrink-0 items-center justify-center"
                style={{ width: logo.width }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-full w-auto max-w-full object-contain object-center opacity-80 pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

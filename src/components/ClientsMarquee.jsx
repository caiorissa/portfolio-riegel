import React from "react";
import { clientLogos } from "../data/clientLogos.js";

export default function ClientsMarquee({ label, subtitle }) {
  const track = [...clientLogos, ...clientLogos];

  return (
    <section className="relative w-full border-y border-border bg-bg py-space-9 md:py-space-11">
      <div className="text-center mb-space-7 px-space-4">
        <p className="eyebrow">{label}</p>
        <p className="mt-space-3 text-fluid-0 text-muted">{subtitle}</p>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28 bg-gradient-to-r from-bg to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28 bg-gradient-to-l from-bg to-transparent"
          aria-hidden
        />

        <div className="clients-marquee-track flex w-max items-center gap-space-12 sm:gap-space-16 md:gap-space-20 lg:gap-28 px-space-8">
          {track.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex h-16 sm:h-[4.5rem] md:h-20 lg:h-24 shrink-0 items-center justify-center"
              style={{ width: logo.width }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-full w-auto max-w-full object-contain object-center opacity-80"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

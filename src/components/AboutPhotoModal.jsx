import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLang } from "../i18n/LanguageContext.jsx";
import TiltedCard from "./reactbits/TiltedCard.jsx";

const PHOTO_SRC = "/foto-riegel.png";

export function PhotoNameOverlay({ name, compact = false }) {
  return (
    <div
      className={`flex h-full w-full flex-col justify-end items-start bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none ${
        compact ? "p-space-4" : "p-space-5"
      }`}
    >
      <p
        className={`font-display uppercase leading-none text-content ${
          compact ? "text-fluid-2" : "text-fluid-3"
        }`}
      >
        {name}
      </p>
    </div>
  );
}

export default function AboutPhotoModal({ open, onClose }) {
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-space-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[min(92vw,400px)]"
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <TiltedCard
              imageSrc={PHOTO_SRC}
              altText={t.about.name}
              containerHeight="min(82vh, 620px)"
              containerWidth="100%"
              imageHeight="min(82vh, 620px)"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.04}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent
              rounded
              objectFit="contain"
              overlayContent={<PhotoNameOverlay name={t.about.name} />}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-space-3 right-space-3 z-10 flex h-9 w-9 items-center justify-center rounded-pill
                bg-black/50 text-content text-xl backdrop-blur-sm transition-colors hover:bg-accent hover:text-black"
              aria-label={t.videoModal.close}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

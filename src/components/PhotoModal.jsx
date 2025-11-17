"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoModal({ photo, onClose }) {
  if (!photo) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-4xl w-full max-h-[90vh] rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={photo.imageUrl}
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-contain bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white font-medium text-lg">{photo.title}</p>

            {photo.description && (
              <p className="text-neutral-300 text-sm mt-1">{photo.description}</p>
            )}

            {photo.project && (
              <p className="text-neutral-400 text-xs mt-1">
                Projeto: {photo.project}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl"
          >
            ×
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

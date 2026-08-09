"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { AlbumPhoto } from "@/lib/mock-data";

interface LightboxProps {
  photo: AlbumPhoto | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: LightboxProps) {
  // Scroll lock when open
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [photo]);

  // Keyboard navigation
  useEffect(() => {
    if (!photo) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photo, onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Đóng"
      >
        <X className="size-6" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Ảnh sau"
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Photo display */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] mx-4 flex flex-col items-center gap-4">
        {/* Photo */}
        <div className="relative aspect-[4/3] w-full max-w-2xl rounded-xl overflow-hidden bg-goda-navy/50">
          {photo.fullUrl ? (
            <Image
              src={photo.fullUrl}
              alt={photo.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-goda-navy/50 to-goda-green/50 flex items-center justify-center">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <ImageIcon className="size-24 text-white/30" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="font-display font-semibold text-lg text-white">
            {photo.title}
          </h3>
          <p className="text-sm text-gray-300">{photo.date}</p>
        </div>
      </div>
    </div>
  );
}

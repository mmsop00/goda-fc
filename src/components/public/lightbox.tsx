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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/90"
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
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Ảnh sau"
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Photo — large, fills screen */}
      <div className="relative z-10 w-full max-w-6xl max-h-[85vh] aspect-video">
        {photo.videoUrl ? (
          <iframe
            src={photo.videoUrl
              .replace("youtube.com/watch?v=", "youtube-nocookie.com/embed/")
              .replace("youtube.com/embed/", "youtube-nocookie.com/embed/")
              .replace("youtu.be/", "youtube-nocookie.com/embed/")
              + "?rel=0"}
            className="absolute inset-0 w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={photo.title}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : photo.fullUrl ? (
          <Image
            src={photo.fullUrl}
            alt={photo.title}
            fill
            className="object-contain"
            sizes="(max-width: 1280px) 100vw, 1152px"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-goda-navy/50 to-goda-green/50 flex items-center justify-center rounded-xl">
            <ImageIcon className="size-24 text-white/30" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Caption at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur rounded-lg px-6 py-3 text-white text-center max-w-lg">
        <p className="font-medium">{photo.title}</p>
        <p className="text-sm text-white/60 mt-1">{photo.date}</p>
      </div>
    </div>
  );
}

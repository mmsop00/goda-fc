"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface ArticleContentProps {
  html: string;
  className?: string;
}

/**
 * Renders article HTML and lets users click images to view them enlarged
 * in a lightbox (click backdrop / X / Esc to close).
 */
export function ArticleContent({ html, className }: ArticleContentProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  // Scroll lock + Esc to close while lightbox is open
  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const src = target.getAttribute("src");
      if (src) {
        setLightbox({ src, alt: target.getAttribute("alt") ?? "" });
      }
    }
  };

  return (
    <>
      <div
        className={`${className ?? ""} [&_img]:cursor-zoom-in`}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop — click to close */}
          <div
            className="absolute inset-0 bg-black/90"
            onClick={close}
            aria-hidden="true"
          />

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Đóng ảnh"
          >
            <X className="size-6" />
          </button>

          {/* Enlarged image */}
          <figure className="relative z-10 max-w-6xl flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            {lightbox.alt && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {lightbox.alt}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}

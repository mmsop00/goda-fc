"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { AlbumPhoto } from "@/lib/mock-data";

interface GallerySectionProps {
  items: AlbumPhoto[];
  isLoading?: boolean;
}

export function GallerySection({ items, isLoading }: GallerySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [lightbox, setLightbox] = useState<AlbumPhoto | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => { if (el) el.removeEventListener("scroll", checkScroll); };
  }, [items, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <section className="py-16 md:py-20 bg-goda-soft-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
              <span className="mr-2" aria-hidden="true">🖼️</span>
              Ảnh & Video
            </h2>
            <p className="text-gray-500">Khoảnh khắc đáng nhớ của GODA FC — kéo để xem tất cả</p>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="shrink-0 w-72">
                  <Skeleton className="aspect-video rounded-lg" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300 bg-white mx-auto max-w-lg">
              <CardContent className="flex flex-col items-center py-12 gap-4">
                <p className="text-gray-500">Chưa có ảnh/video nào.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative group">
              {/* Left arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Cuộn trái"
                >
                  <ChevronLeft className="size-5 text-goda-navy" />
                </button>
              )}
              {/* Right arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Cuộn phải"
                >
                  <ChevronRight className="size-5 text-goda-navy" />
                </button>
              )}

              {/* Slider */}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="shrink-0 w-72 snap-start"
                  >
                    <div
                      onClick={() => setLightbox(item)}
                      className="group/card relative aspect-video rounded-lg overflow-hidden bg-goda-navy/10 cursor-pointer"
                    >
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        sizes="288px"
                        className="object-cover transition-transform group-hover/card:scale-105"
                        loading="lazy"
                      />

                      {/* Hover overlay with info */}
                      <div className="absolute inset-0 bg-goda-navy/0 group-hover/card:bg-goda-navy/60 transition-all flex flex-col justify-end p-4">
                        <div className="translate-y-4 group-hover/card:translate-y-0 transition-transform">
                          <span className="text-xs text-white/70">{item.date}</span>
                          <p className="text-sm text-white font-medium line-clamp-2 mt-1">
                            {item.title}
                          </p>
                          <span className="inline-block mt-2 text-xs bg-goda-yellow/90 text-goda-navy px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hide scrollbar style */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Đóng"
          >
            <X className="size-6 text-white" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.fullUrl}
              alt={lightbox.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain"
              priority
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur rounded-lg px-6 py-3 text-white text-center max-w-lg">
            <p className="font-medium">{lightbox.title}</p>
            <p className="text-sm text-white/60 mt-1">
              {lightbox.date} · {lightbox.category}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

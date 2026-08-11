"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Lightbox } from "./lightbox";
import type { AlbumPhoto } from "@/lib/mock-data";

interface GallerySectionProps {
  items: AlbumPhoto[];
  isLoading?: boolean;
}

export function GallerySection({ items, isLoading }: GallerySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sort by date descending (newest first) — timeline order
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const parse = (d: string) => {
        const parts = d.split("/");
        return new Date(+parts[2], +parts[1] - 1, +parts[0]).getTime();
      };
      return parse(b.date) - parse(a.date);
    });
  }, [items]);

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
  }, [sorted, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const lightboxPhoto = lightboxIndex !== null ? sorted[lightboxIndex] : null;

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
                  <Skeleton className="h-48 rounded-lg" />
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300 bg-white mx-auto max-w-lg">
              <CardContent className="flex flex-col items-center py-12 gap-4">
                <p className="text-gray-500">Chưa có ảnh/video nào.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative group">
              {canScrollLeft && (
                <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-all opacity-0 group-hover:opacity-100" aria-label="Cuộn trái">
                  <ChevronLeft className="size-5 text-goda-navy" />
                </button>
              )}
              {canScrollRight && (
                <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-all opacity-0 group-hover:opacity-100" aria-label="Cuộn phải">
                  <ChevronRight className="size-5 text-goda-navy" />
                </button>
              )}

              <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {sorted.map((item, i) => (
                  <div key={item.id} className="shrink-0 w-72 snap-start">
                    <div onClick={() => setLightboxIndex(i)} className="group/card relative h-48 rounded-lg overflow-hidden bg-goda-navy/10 cursor-pointer">
                      <Image src={item.thumbnailUrl} alt={item.title} fill sizes="288px" className="object-cover transition-transform group-hover/card:scale-105" loading="lazy" />
                      {/* Video play icon */}
                      {item.category === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-goda-navy/30">
                          <Play className="size-12 text-white fill-white opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-goda-navy/0 group-hover/card:bg-goda-navy/60 transition-all flex flex-col justify-end p-4">
                        <div className="translate-y-4 group-hover/card:translate-y-0 transition-transform">
                          <span className="text-xs text-white/70">{item.date}</span>
                          <p className="text-sm text-white font-medium line-clamp-2 mt-1">{item.title}</p>
                          <span className="inline-block mt-2 text-xs bg-goda-yellow/90 text-goda-navy px-2 py-0.5 rounded-full">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
      </section>

      {/* Shared Lightbox — click outside to close, large display, prev/next */}
      <Lightbox
        photo={lightboxPhoto}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(p => p !== null ? Math.max(0, p - 1) : null)}
        onNext={() => setLightboxIndex(p => p !== null ? Math.min(sorted.length - 1, p + 1) : null)}
        hasPrev={lightboxIndex !== null && lightboxIndex > 0}
        hasNext={lightboxIndex !== null && lightboxIndex < sorted.length - 1}
      />
    </>
  );
}

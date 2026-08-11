"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const HERO_PHOTOS = [
  "/photos/z8053179673964_efe7a825564ab004cb6a5e9da363fdbf.jpg",
  "/photos/z8053179697866_efa74f44b4ae184bae2444d5653b8645.jpg",
  "/photos/z8053179704898_9b48ae1d79226549cde6028623245c67.jpg",
  "/photos/z8053179712048_402eef6bb32ad1d49a0bdad50faa31da.jpg",
  "/photos/z8053179727466_71c881f001208e04899c96a328bd075c.jpg",
];

const INTERVAL_MS = 5000;

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent((index + HERO_PHOTOS.length) % HERO_PHOTOS.length);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % HERO_PHOTOS.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="bg-goda-navy overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Text Block (above image, no overlap) ── */}
      <div className="bg-goda-navy px-6 py-10 md:py-14 text-center">
        <div className="flex flex-col gap-5 max-w-xl mx-auto">
          <div>
            <Badge className="bg-goda-yellow text-goda-navy text-sm px-4 py-1 font-semibold border-0">
              <Trophy className="size-3.5" />
              Est. 1994
            </Badge>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight">
            Câu lạc bộ bóng đá
            <br />
            <span className="text-goda-yellow">GODA FC</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300">
            Hơn 30 năm gắn kết đam mê — Nơi bóng đá là gia đình.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <Button
              size="lg"
              className="bg-goda-yellow text-goda-navy hover:bg-goda-yellow/90 font-semibold text-base px-8"
            >
              Khám phá GODA FC
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white text-base px-8"
            >
              Liên hệ với chúng tôi
            </Button>
          </div>
        </div>
      </div>

      {/* ── Image Slider (below text) ── */}
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[500px] lg:h-[580px]">
        {HERO_PHOTOS.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`GODA FC ${i + 1}`}
            fill
            className={`object-cover object-center transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
            sizes="100vw"
            quality={85}
          />
        ))}

        {/* Light overlay for arrow/dot visibility */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Arrow buttons */}
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors z-10"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="size-5 text-white" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors z-10"
          aria-label="Ảnh tiếp"
        >
          <ChevronRight className="size-5 text-white" />
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`size-2.5 rounded-full transition-all ${
                i === current
                  ? "bg-goda-yellow w-6"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Ảnh ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}

"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Lightbox } from "./lightbox";
import type { AlbumPhoto, AlbumCategory } from "@/lib/mock-data";

interface AlbumGridProps {
  photos: AlbumPhoto[];
  isLoading?: boolean;
}

const CATEGORIES: { label: string; value: AlbumCategory | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Trận đấu", value: "Trận đấu" },
  { label: "Sự kiện", value: "Sự kiện" },
  { label: "Sinh hoạt", value: "Sinh hoạt" },
  { label: "Kỷ niệm", value: "Kỷ niệm" },
  { label: "🎬 Video", value: "Video" },
];

export function AlbumGrid({ photos, isLoading }: AlbumGridProps) {
  const [category, setCategory] = useState<AlbumCategory | "all">("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered =
    category === "all" ? photos : photos.filter((p) => p.category === category);

  const selectedPhoto =
    selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <section className="py-12 md:py-16 bg-goda-warm-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setSelectedIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-goda-navy text-white"
                  : "bg-white text-goda-navy border border-gray-200 hover:bg-goda-soft-gray"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            Không có ảnh nào trong danh mục này.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => setSelectedIndex(i)}
                className="group relative aspect-square rounded-lg overflow-hidden bg-goda-navy/10 cursor-pointer"
              >
                {/* Thumbnail image */}
                {photo.thumbnailUrl ? (
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-goda-navy/30 to-goda-green/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <ImageIcon className="size-12 text-white/40" aria-hidden="true" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-goda-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="text-left">
                    <p className="text-xs text-white font-medium line-clamp-2">
                      {photo.title}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-1">{photo.date}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedIndex(null)}
        onPrev={() =>
          setSelectedIndex((prev) =>
            prev !== null ? Math.max(0, prev - 1) : null
          )
        }
        onNext={() =>
          setSelectedIndex((prev) =>
            prev !== null ? Math.min(filtered.length - 1, prev + 1) : null
          )
        }
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        hasNext={
          selectedIndex !== null && selectedIndex < filtered.length - 1
        }
      />
    </section>
  );
}

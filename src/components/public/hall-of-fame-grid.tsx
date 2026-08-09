"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HallOfFameCard } from "./hall-of-fame-card";
import type { HallOfFameEntry, HallOfFameCategory } from "@/lib/mock-data";

interface HallOfFameGridProps {
  entries: HallOfFameEntry[];
  isLoading?: boolean;
}

const CATEGORIES: { label: string; value: HallOfFameCategory | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Sáng lập", value: "Sáng lập" },
  { label: "Ban quản lý", value: "Ban quản lý" },
  { label: "Đội trưởng", value: "Đội trưởng" },
  { label: "Cầu thủ nổi bật", value: "Cầu thủ nổi bật" },
  { label: "Kỷ lục", value: "Kỷ lục" },
  { label: "Khoảnh khắc", value: "Khoảnh khắc" },
];

export function HallOfFameGrid({ entries, isLoading }: HallOfFameGridProps) {
  const [activeCategory, setActiveCategory] = useState<
    HallOfFameCategory | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? entries
      : entries.filter((e) => e.categories.includes(activeCategory as HallOfFameCategory));

  return (
    <section className="py-16 md:py-20 bg-goda-warm-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-goda-navy text-white"
                  : "bg-white text-goda-navy border border-gray-200 hover:bg-goda-soft-gray"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <HallOfFameCard
                key={i}
                isLoading
                entry={{} as HallOfFameEntry}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <p className="text-gray-500">
                Chưa có dữ liệu Hall of Fame cho hạng mục này.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((entry) => (
              <HallOfFameCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

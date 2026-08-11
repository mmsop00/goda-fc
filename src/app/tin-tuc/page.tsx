"use client";

import { useState } from "react";
import { NewsListHero } from "@/components/public/news-list-hero";
import { NewsCard } from "@/components/public/news-card";
import { AlbumGrid } from "@/components/public/album-grid";
import { MOCK_NEWS, MOCK_ALBUM, type NewsCategory } from "@/lib/mock-data";

const CATEGORIES: { label: string; value: NewsCategory | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Tin CLB", value: "Tin CLB" },
  { label: "Trận đấu", value: "Trận đấu" },
  { label: "Sinh nhật", value: "Sinh nhật" },
  { label: "Giải đấu", value: "Giải đấu" },
  { label: "Kỷ niệm", value: "Kỷ niệm" },
  { label: "Thông báo", value: "Thông báo" },
];

const ITEMS_PER_PAGE = 6;

export default function TinTucPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">("all");
  const [page, setPage] = useState(1);

  const filtered =
    activeCategory === "all"
      ? MOCK_NEWS
      : MOCK_NEWS.filter((n) => n.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: NewsCategory | "all") => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <>
      <NewsListHero />

      {/* ── Section: Tin tức ── */}
      <section className="py-12 md:py-16 bg-goda-warm-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Title */}
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-2 text-center">
            📰 Tin tức
          </h2>
          <p className="text-gray-500 text-center mb-8">Cập nhật tin tức mới nhất về câu lạc bộ</p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
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

          {/* News Grid */}
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">
                Chưa có tin tức nào trong danh mục này.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-goda-navy hover:bg-goda-soft-gray transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Trước
              </button>
              <span className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-goda-navy hover:bg-goda-soft-gray transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Section: Hình ảnh & Video ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-2 text-center">
            🖼️ Hình ảnh & Video
          </h2>
          <p className="text-gray-500 text-center mb-8">Khoảnh khắc đáng nhớ của GODA FC</p>
          <AlbumGrid photos={MOCK_ALBUM} />
        </div>
      </section>
    </>
  );
}

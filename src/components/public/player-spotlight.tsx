"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { MemberCard } from "./member-card";
import type { MemberPublic } from "@/lib/mock-data";

interface PlayerSpotlightProps {
  members: MemberPublic[];
  isLoading?: boolean;
}

export function PlayerSpotlight({ members, isLoading }: PlayerSpotlightProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => { if (el) el.removeEventListener("scroll", checkScroll); };
  }, [members]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-20 bg-goda-soft-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
            <Users className="size-5 md:size-6 inline-block mr-2 align-middle" aria-hidden="true" />
            Danh sách cầu thủ
          </h2>
          <p className="text-gray-500">Đội hình GODA FC — kéo để xem tất cả</p>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shrink-0 w-[230px]">
                <MemberCard isLoading />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-white mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <p className="text-gray-500">Chưa có dữ liệu cầu thủ.</p>
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

            {/* Slider — cùng một MemberCard như trang /thanh-vien, cho đồng bộ giao diện */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {members.map((member) => (
                <div key={member.id} className="shrink-0 w-[230px] snap-start">
                  <MemberCard member={member} />
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
  );
}

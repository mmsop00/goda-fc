"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, ChevronLeft, ChevronRight, Users } from "lucide-react";
import type { MemberPublic } from "@/lib/mock-data";

function getPositionBg(position: string): string {
  switch (position) {
    case "Tiền đạo": return "bg-orange-50/60";
    case "Tiền vệ": return "bg-emerald-50/60";
    case "Hậu vệ": return "bg-sky-50/60";
    case "Thủ môn": return "bg-amber-50/60";
    default: return "";
  }
}

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
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
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
              <div key={i} className="shrink-0 w-56">
                <Card className="p-4 space-y-3 items-center">
                  <Skeleton className="size-16 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                  <Skeleton className="h-6 w-full" />
                </Card>
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

            {/* Slider */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {members.map((member) => (
                <div
                  key={member.id}
                  className="shrink-0 w-56 snap-start"
                >
                  <Card className={`h-full hover:shadow-md transition-shadow ${getPositionBg(member.position)}`}>
                    <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                      {/* Avatar */}
                      <div className="size-16 rounded-full bg-goda-navy flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
                        {member.nickname.slice(0, 2).toUpperCase()}
                      </div>

                      {/* Name & Nickname */}
                      <div>
                        <h3 className="font-display font-semibold text-sm text-goda-navy leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          &ldquo;{member.nickname}&rdquo;
                        </p>
                      </div>

                      {/* Position & Number */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {member.position}
                        </Badge>
                        {member.number > 0 && (
                          <span className="text-lg font-bold text-goda-yellow">
                            #{member.number}
                          </span>
                        )}
                      </div>

                      {/* Chức vụ — only show for Đội trưởng / Đội phó */}
                      {member.status && member.status !== "Đang thi đấu" && (
                        <Badge
                          className={`text-xs border-0 ${
                            member.status === "Đội trưởng"
                              ? "bg-goda-yellow text-goda-navy"
                              : "bg-goda-navy text-white"
                          }`}
                        >
                          {member.status}
                        </Badge>
                      )}

                      {/* Join Year */}
                      <span className="text-xs text-gray-400">
                        Tham gia: {member.joinDate ? member.joinDate : (member.joinYear && member.joinYear > 0 ? member.joinYear : "xx")}
                      </span>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-1 w-full text-center pt-2 border-t border-gray-100">
                        <div>
                          <span className="block text-sm font-bold text-goda-navy">
                            {member.matches}
                          </span>
                          <span className="text-xs text-gray-400">Trận</span>
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-goda-navy">
                            {member.goals}
                          </span>
                          <span className="text-xs text-gray-400">Bàn</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-0.5">
                            <Award className="size-3 text-goda-yellow" />
                            <span className="text-sm font-bold text-goda-yellow">
                              {member.mvp}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">MVP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

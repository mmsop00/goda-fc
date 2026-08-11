"use client";

import { useState, useMemo } from "react";
import { MemberCard } from "@/components/public/member-card";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, Goal, BadgeCheck } from "lucide-react";
import { MOCK_MEMBERS, type MemberPosition } from "@/lib/mock-data";

const POSITIONS: { label: string; value: MemberPosition | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Thủ môn", value: "Thủ môn" },
  { label: "Hậu vệ", value: "Hậu vệ" },
  { label: "Tiền vệ", value: "Tiền vệ" },
  { label: "Tiền đạo", value: "Tiền đạo" },
];

export default function ThanhVienPage() {
  const [position, setPosition] = useState<MemberPosition | "all">("all");

  const filtered =
    position === "all"
      ? MOCK_MEMBERS
      : MOCK_MEMBERS.filter((m) => m.position === position);

  // Top stats
  const topGoals = useMemo(() => [...MOCK_MEMBERS].sort((a, b) => b.goals - a.goals).slice(0, 5), []);
  const topAssists = useMemo(() => [...MOCK_MEMBERS].sort((a, b) => b.assists - a.assists).slice(0, 5), []);
  const topMVP = useMemo(() => [...MOCK_MEMBERS].sort((a, b) => b.mvp - a.mvp).slice(0, 5), []);

  return (
    <>
      {/* Hero */}
      <section className="bg-goda-navy py-20 md:py-28 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            <Users className="size-7 md:size-8 inline-block mr-3 align-middle" aria-hidden="true" />
            Thành viên GODA FC
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Danh sách thành viên — những con người làm nên GODA FC
          </p>
        </div>
        <div className="h-1.5 bg-goda-yellow mt-20 md:mt-28" />
      </section>

      <section className="py-12 md:py-16 bg-goda-warm-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Leaderboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Top ghi bàn */}
            <Card className="bg-white overflow-hidden">
              <div className="bg-goda-green px-5 py-3 flex items-center gap-2">
                <Goal className="size-5 text-white" />
                <span className="font-display font-bold text-white text-sm">TOP GHI BÀN</span>
              </div>
              <CardContent className="p-0">
                {topGoals.map((m, i) => (
                  <div key={m.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < topGoals.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className={`font-bold text-sm w-6 text-center ${i === 0 ? "text-goda-yellow" : "text-gray-400"}`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-goda-navy truncate">{m.name}</span>
                    <span className="text-sm font-bold text-goda-green">{m.goals}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top kiến tạo */}
            <Card className="bg-white overflow-hidden">
              <div className="bg-goda-navy px-5 py-3 flex items-center gap-2">
                <BadgeCheck className="size-5 text-goda-yellow" />
                <span className="font-display font-bold text-white text-sm">TOP KIẾN TẠO</span>
              </div>
              <CardContent className="p-0">
                {topAssists.map((m, i) => (
                  <div key={m.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < topAssists.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className={`font-bold text-sm w-6 text-center ${i === 0 ? "text-goda-yellow" : "text-gray-400"}`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-goda-navy truncate">{m.name}</span>
                    <span className="text-sm font-bold text-goda-navy">{m.assists}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top MVP */}
            <Card className="bg-white overflow-hidden">
              <div className="bg-goda-yellow px-5 py-3 flex items-center gap-2">
                <Trophy className="size-5 text-goda-navy" />
                <span className="font-display font-bold text-goda-navy text-sm">TOP MVP</span>
              </div>
              <CardContent className="p-0">
                {topMVP.map((m, i) => (
                  <div key={m.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < topMVP.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className={`font-bold text-sm w-6 text-center ${i === 0 ? "text-goda-yellow" : "text-gray-400"}`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-goda-navy truncate">{m.name}</span>
                    <span className="text-sm font-bold text-goda-yellow">{m.mvp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Position Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {POSITIONS.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  position === pos.value
                    ? "bg-goda-navy text-white"
                    : "bg-white text-goda-navy border border-gray-200 hover:bg-goda-soft-gray"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>

          {/* Member Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-20">
              Không có thành viên nào ở vị trí này.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

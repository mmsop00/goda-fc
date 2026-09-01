"use client";

import { useMemo } from "react";
import { MatchCard } from "@/components/public/match-card";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Minus, X } from "lucide-react";
import { MOCK_MATCH_RESULTS } from "@/lib/mock-data";

export default function TranDauPage() {
  const sorted = useMemo(
    () => [...MOCK_MATCH_RESULTS].sort((a, b) => {
      const da = a.date.split("/").reverse().join("");
      const db = b.date.split("/").reverse().join("");
      if (da !== db) return db.localeCompare(da);
      return (a.time ?? "99:99").localeCompare(b.time ?? "99:99");
    }),
    []
  );

  // Stats
  const stats = useMemo(() => {
    const completed = sorted.filter((m) => !(m.godaScore === 0 && m.opponentScore === 0));
    const total = { w: 0, d: 0, l: 0 };
    completed.forEach((m) => {
      if (m.godaScore > m.opponentScore) total.w++;
      else if (m.godaScore === m.opponentScore) total.d++;
      else total.l++;
    });

    const last10 = completed.slice(0, 10);
    const recent = { w: 0, d: 0, l: 0 };
    last10.forEach((m) => {
      if (m.godaScore > m.opponentScore) recent.w++;
      else if (m.godaScore === m.opponentScore) recent.d++;
      else recent.l++;
    });

    return { total, recent, last10Count: last10.length };
  }, [sorted]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-goda-navy py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Kết quả trận đấu
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Lịch sử đối đầu và kết quả các trận đấu của GODA FC
          </p>
        </div>
        <div className="h-1.5 bg-goda-yellow mt-20 md:mt-28" />
      </section>

      <section className="py-12 md:py-16 bg-goda-warm-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Stats Summary */}
          <div className="mb-10 space-y-3">
            <h2 className="font-display font-bold text-xl text-goda-navy text-center mb-4">📊 Thống kê GODA FC</h2>
            {/* Tổng */}
            <Card className="bg-white">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-goda-navy mb-3">Tổng tất cả các trận</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-goda-green/10 rounded-xl py-4">
                    <p className="text-4xl font-black text-goda-green">{stats.total.w}</p>
                    <p className="text-sm font-bold text-goda-green">🏆 Thắng</p>
                  </div>
                  <div className="bg-goda-yellow/10 rounded-xl py-4">
                    <p className="text-4xl font-black text-goda-yellow">{stats.total.d}</p>
                    <p className="text-sm font-bold text-amber-600">🤝 Hòa</p>
                  </div>
                  <div className="bg-red-50 rounded-xl py-4">
                    <p className="text-4xl font-black text-red-500">{stats.total.l}</p>
                    <p className="text-sm font-bold text-red-500">❌ Thua</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* 10 trận gần nhất */}
            <Card className="bg-white">
              <CardContent className="p-5">
                <p className="text-sm font-bold text-goda-navy mb-3">10 trận gần nhất</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-goda-green/10 rounded-xl py-4">
                    <p className="text-4xl font-black text-goda-green">{stats.recent.w}</p>
                    <p className="text-sm font-bold text-goda-green">🏆 Thắng</p>
                  </div>
                  <div className="bg-goda-yellow/10 rounded-xl py-4">
                    <p className="text-3xl font-extrabold text-goda-yellow">{stats.recent.d}</p>
                    <p className="text-sm font-semibold text-amber-600">🤝 Hòa</p>
                  </div>
                  <div className="bg-red-50 rounded-xl py-4">
                    <p className="text-3xl font-extrabold text-red-500">{stats.recent.l}</p>
                    <p className="text-sm font-semibold text-red-500">❌ Thua</p>
                  </div>
                </div>
                {stats.last10Count < 10 && (
                  <p className="text-xs text-gray-400 text-center mt-3">* Mới có {stats.last10Count} trận đã đấu</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Match Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sorted.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

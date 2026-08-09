"use client";

import { useMemo } from "react";
import { MatchCard } from "@/components/public/match-card";
import { MOCK_MATCH_RESULTS } from "@/lib/mock-data";

export default function TranDauPage() {
  const sorted = useMemo(
    () => [...MOCK_MATCH_RESULTS].sort((a, b) => {
      // Sort by date descending (newest first)
      const da = a.date.split("/").reverse().join("");
      const db = b.date.split("/").reverse().join("");
      return db.localeCompare(da);
    }),
    []
  );

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

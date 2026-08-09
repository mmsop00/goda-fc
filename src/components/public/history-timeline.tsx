"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin } from "lucide-react";
import type { HistoryEntry } from "@/lib/mock-data";

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  isLoading?: boolean;
}

const DECADES = [
  { label: "Tất cả", value: "all" },
  { label: "1990s", value: "1990s" },
  { label: "2000s", value: "2000s" },
  { label: "2010s", value: "2010s" },
  { label: "2020s", value: "2020s" },
];

export function HistoryTimeline({ entries, isLoading }: HistoryTimelineProps) {
  const [activeDecade, setActiveDecade] = useState("all");

  const filtered =
    activeDecade === "all"
      ? entries
      : entries.filter((e) => e.decade === activeDecade);

  return (
    <section className="py-16 md:py-20 bg-goda-warm-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Decade Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {DECADES.map((d) => (
            <button
              key={d.value}
              onClick={() => setActiveDecade(d.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeDecade === d.value
                  ? "bg-goda-navy text-white"
                  : "bg-white text-goda-navy border border-gray-200 hover:bg-goda-soft-gray"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          /* Skeleton */
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-goda-yellow/10" />
            <div className="space-y-8 pl-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[47px] top-1.5 size-3 rounded-full bg-goda-yellow/20" />
                  <Skeleton className="h-6 w-16 mb-2" />
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-white mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <p className="text-gray-500">
                Chưa có dữ liệu lịch sử cho thập kỷ này.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Timeline */
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-goda-yellow/30" />

            <div className="space-y-0">
              {filtered.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`relative pl-16 pb-12 last:pb-0 ${
                    index % 2 === 0
                      ? "md:pr-[50%] md:pl-16"
                      : "md:pl-[50%] md:pr-16"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[12px] md:left-auto top-1.5 size-4 rounded-full bg-goda-yellow border-2 border-white shadow z-10" />

                  {/* Card */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-goda-navy text-white border-0 text-xs">
                        {entry.decade}
                      </Badge>
                      <span className="font-display font-extrabold text-xl text-goda-yellow">
                        {entry.year}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-lg text-goda-navy mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {entry.description}
                    </p>

                    {/* Related people */}
                    {entry.relatedPeople.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <Users className="size-3" />
                        {entry.relatedPeople.join(", ")}
                      </div>
                    )}

                    {/* Tournament */}
                    {entry.tournament && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="size-3" />
                        {entry.tournament}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

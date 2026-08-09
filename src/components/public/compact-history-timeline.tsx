"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, User, Flag } from "lucide-react";
import type { FullHistoryItem } from "@/lib/mock-data";

interface CompactHistoryTimelineProps {
  items: FullHistoryItem[];
  isLoading?: boolean;
}

function getIcon(type: FullHistoryItem["type"]) {
  switch (type) {
    case "founding": return Flag;
    case "achievement": return Trophy;
    case "president": return User;
  }
}

function getBorderColor(type: FullHistoryItem["type"]) {
  switch (type) {
    case "founding": return "border-l-goda-green";
    case "achievement": return "border-l-goda-yellow";
    case "president": return "border-l-goda-navy";
  }
}

function getIconBg(type: FullHistoryItem["type"]) {
  switch (type) {
    case "founding": return "bg-goda-green/10 text-goda-green";
    case "achievement": return "bg-goda-yellow/10 text-goda-yellow";
    case "president": return "bg-goda-navy/10 text-goda-navy";
  }
}

export function CompactHistoryTimeline({ items, isLoading }: CompactHistoryTimelineProps) {
  return (
    <section className="py-12 md:py-16 bg-goda-warm-white">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        {isLoading ? (
          <div className="relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-goda-yellow/10" />
            <div className="space-y-6 pl-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[37px] top-2 size-3 rounded-full bg-goda-yellow/20" />
                  <Skeleton className="h-5 w-12 mb-1" />
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-goda-yellow/20" />

            <div className="space-y-6">
              {items.map((item) => {
                const Icon = getIcon(item.type);
                const borderColor = getBorderColor(item.type);
                const iconBg = getIconBg(item.type);

                return (
                  <div key={`${item.year}-${item.title}`} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className={`absolute left-[9px] top-2 size-3.5 rounded-full border-2 border-white ${iconBg} shadow-sm z-10`} />

                    {/* Card */}
                    <Card className={`border-l-4 ${borderColor} shadow-sm`}>
                      <CardContent className="p-4 flex gap-3">
                        <div className={`size-8 rounded-full ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-display font-extrabold text-sm text-goda-navy">
                              {item.year}
                            </span>
                            <h3 className="font-semibold text-sm text-goda-navy leading-tight">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.subtitle}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

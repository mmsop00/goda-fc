import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ScrollText } from "lucide-react";
import Link from "next/link";
import type { HistoryMilestone } from "@/lib/mock-data";

interface HistoryTeaserProps {
  milestones: HistoryMilestone[];
  isLoading?: boolean;
}

export function HistoryTeaser({ milestones, isLoading }: HistoryTeaserProps) {
  return (
    <section className="py-16 md:py-20 bg-goda-navy">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            <ScrollText className="size-5 md:size-6 inline-block mr-2 align-middle" aria-hidden="true" />
            Lịch sử & Hall of Fame
          </h2>
          <p className="text-gray-300">
            Hành trình hơn 30 năm của GODA FC
          </p>
        </div>

        {isLoading ? (
          /* Skeleton state (C-009) */
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-goda-yellow/10 md:-translate-x-px" />
            <div className="space-y-10">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`relative pl-12 md:pl-0 md:w-1/2 ${
                    i % 2 !== 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
                  }`}
                >
                  <div className="absolute left-[13px] md:left-auto top-1 size-3 rounded-full bg-goda-yellow/20" />
                  <Skeleton className="h-7 w-16 bg-white/10 mb-2" />
                  <Skeleton className="h-5 w-48 bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        ) : milestones.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            Lịch sử CLB đang được cập nhật.
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-goda-yellow/30 md:-translate-x-px" />

            <div className="space-y-10">
              {milestones.map((milestone, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={milestone.year}
                    className={`relative pl-12 md:pl-0 md:w-1/2 ${
                      isLeft ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-[13px] md:left-auto top-1 size-3 rounded-full bg-goda-yellow border-2 border-goda-navy z-10" />

                    {/* Year badge */}
                    <span className="inline-block font-display font-extrabold text-2xl text-goda-yellow mb-2">
                      {milestone.year}
                    </span>
                    <h3 className="font-display font-semibold text-lg text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-goda-yellow/50 text-goda-yellow hover:bg-goda-yellow/10 hover:text-goda-yellow transition-colors text-sm font-medium"
          >
            Xem toàn bộ lịch sử
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, Trophy, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { MatchInfo } from "@/lib/mock-data";

interface MatchSpotlightProps {
  matches: MatchInfo[];
  isLoading?: boolean;
}

export function MatchSpotlight({ matches, isLoading }: MatchSpotlightProps) {
  const router = useRouter();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
            <Trophy className="size-5 md:size-6 inline-block mr-2 align-middle" aria-hidden="true" />
            Trận đấu
          </h2>
          <p className="text-gray-500">Lịch thi đấu & kết quả gần nhất</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-goda-soft-gray/50 mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <Trophy className="size-12 text-gray-300" />
              <p className="text-gray-500 text-center">
                Chưa có trận đấu nào. Hãy quay lại sau!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                onClick={() => router.push(match.detailId ? `/tran-dau/${match.detailId}` : "/tran-dau")}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") router.push(match.detailId ? `/tran-dau/${match.detailId}` : "/tran-dau"); }}
              >
                <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={match.type === "upcoming" ? "default" : "secondary"}
                        className={match.type === "upcoming" ? "bg-goda-yellow text-goda-navy border-0" : ""}
                      >
                        {match.type === "upcoming" ? "Sắp diễn ra" : "Kết quả"}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {match.date}
                        </span>
                        {match.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {match.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">
                      GODA FC{" "}
                      <span className="text-gray-400 font-normal">vs</span>{" "}
                      {match.opponent}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {match.score ? (
                      <div className="space-y-3">
                        {/* Score display with scorers — GODA always left */}
                        <div className="py-4 bg-goda-soft-gray/50 rounded-lg">
                          <div className="flex items-center justify-center gap-6">
                            <div className="text-right min-w-[60px]">
                              <span className="text-3xl font-bold text-goda-navy">
                                {match.score.goda}
                              </span>
                              {match.goalScorers && (
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {match.goalScorers}
                                </p>
                              )}
                            </div>
                            <span className="text-xl text-gray-400">-</span>
                            <div className="text-left min-w-[60px]">
                              <span className="text-3xl font-bold text-gray-500">
                                {match.score.opponent}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Win/Draw/Loss badge */}
                        <div className="flex justify-center">
                          {match.score.goda > match.score.opponent ? (
                            <Badge className="bg-goda-green text-white text-sm px-4 py-1 border-0">🏆 Thắng</Badge>
                          ) : match.score.goda < match.score.opponent ? (
                            <Badge className="bg-red-500 text-white text-sm px-4 py-1 border-0">😞 Thua</Badge>
                          ) : (
                            <Badge className="bg-goda-yellow text-goda-navy text-sm px-4 py-1 border-0">🤝 Hòa</Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-goda-green font-medium">
                        <Clock className="size-4" />
                        {match.time}
                      </div>
                    )}
                    {/* Venue — separate click zone for Google Maps */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="size-4 shrink-0" />
                      {match.googleMapsUrl ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(match.googleMapsUrl, "_blank", "noopener,noreferrer");
                          }}
                          className="text-goda-green hover:underline flex items-center gap-1 text-left"
                        >
                          {match.venue}
                          <ExternalLink className="size-2.5" />
                        </button>
                      ) : (
                        <span>{match.venue}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            href="/tran-dau"
            className="inline-flex items-center gap-1 text-sm text-goda-navy hover:text-goda-green transition-colors font-medium"
          >
            Xem tất cả kết quả <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

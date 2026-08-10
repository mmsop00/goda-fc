"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Award, ExternalLink } from "lucide-react";
import type { MatchResult } from "@/lib/mock-data";

interface MatchCardProps {
  match?: MatchResult;
  isLoading?: boolean;
}

function getResultColor(goda: number, opp: number) {
  if (goda > opp) return "border-l-goda-green";
  if (goda < opp) return "border-l-red-400";
  return "border-l-goda-yellow";
}

function getResultBg(goda: number, opp: number) {
  if (goda > opp) return "bg-goda-green/5";
  if (goda < opp) return "bg-red-50";
  return "bg-goda-yellow/5";
}

export function MatchCard({ match, isLoading }: MatchCardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="p-5 space-y-3">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center justify-center gap-4">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-28" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  if (!match) return null;

  const resultColor = getResultColor(match.godaScore, match.opponentScore);
  const resultBg = getResultBg(match.godaScore, match.opponentScore);
  const result =
    match.godaScore > match.opponentScore
      ? "W"
      : match.godaScore < match.opponentScore
        ? "L"
        : "D";

  const isUpcoming = match.godaScore === 0 && match.opponentScore === 0 && match.goals.length === 0;

  return (
    <div
      onClick={() => router.push(`/tran-dau/${match.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") router.push(`/tran-dau/${match.id}`); }}
    >
      <Card
        className={`p-0 overflow-hidden border-l-4 ${resultColor} ${resultBg} hover:shadow-md transition-shadow cursor-pointer`}
      >
        <CardContent className="p-5 space-y-4">
          {/* Type Badge + Date + Time */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {match.type}
            </Badge>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="size-3" />
                {match.date}
              </span>
              {match.time && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="size-3" />
                  {match.time}
                </span>
              )}
            </div>
          </div>

          {/* Teams Row — always show */}
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="text-right flex-1">
              <p className="font-display font-bold text-sm text-goda-navy">
                {match.isHome ? "GODA FC" : match.opponent}
              </p>
            </div>
            {isUpcoming ? (
              <Badge className="bg-goda-navy text-white text-xs px-3 py-1">
                ⏳ Chưa diễn ra
              </Badge>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-goda-navy">
                  {match.isHome ? match.godaScore : match.opponentScore}
                </span>
                <span className="text-lg text-gray-400">-</span>
                <span className="text-2xl font-extrabold text-gray-500">
                  {match.isHome ? match.opponentScore : match.godaScore}
                </span>
              </div>
            )}
            <div className="text-left flex-1">
              <p className="font-display font-bold text-sm text-gray-500">
                {match.isHome ? match.opponent : "GODA FC"}
              </p>
            </div>
          </div>

          {/* Result Badge — only for completed matches */}
          {!isUpcoming && (
            <div className="flex justify-center">
              <Badge
                className={`text-xs ${
                  result === "W"
                    ? "bg-goda-green text-white border-0"
                    : result === "L"
                      ? "bg-red-500 text-white border-0"
                      : "bg-goda-yellow text-goda-navy border-0"
                }`}
              >
                {result === "W" ? "Thắng" : result === "L" ? "Thua" : "Hòa"}
              </Badge>
            </div>
          )}

          {/* Venue + MVP */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MapPin className="size-3 text-gray-400 shrink-0" />
              {match.googleMapsUrl ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(match.googleMapsUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="text-xs text-goda-green hover:underline flex items-center gap-1 text-left"
                >
                  {match.venue}
                  <ExternalLink className="size-2.5" />
                </button>
              ) : (
                <span className="text-xs text-gray-400">{match.venue}</span>
              )}
            </div>
            {match.mvp && (
              <p className="text-xs text-goda-yellow font-medium flex items-center gap-1">
                <Award className="size-3" />
                MVP: {match.mvp}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

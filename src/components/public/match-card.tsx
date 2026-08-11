"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Award, ExternalLink } from "lucide-react";
import { CountdownTimer } from "./countdown-timer";
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

function formatGoalPlayer(name: string): string {
  // Remove "Cầu thủ " prefix for opponent goals
  if (name.startsWith("Cầu thủ ")) {
    return name.replace("Cầu thủ ", "");
  }
  // For player names, take last 2 parts (drop first name)
  const parts = name.split(" ");
  if (parts.length <= 2) return name;
  return parts.slice(-2).join(" ");
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

  // Dynamic team name colors based on result
  const leftIsGoda = match.isHome;
  const godaColor = isUpcoming || result === "D" ? "text-goda-navy" : result === "W" ? "text-goda-navy" : "text-gray-400";
  const oppColor = isUpcoming || result === "D" ? "text-goda-navy" : result === "W" ? "text-gray-400" : "text-goda-navy";
  const godaWeight = isUpcoming || result === "D" || result === "W" ? "font-semibold" : "font-normal";
  const oppWeight = isUpcoming || result === "D" || result === "L" ? "font-semibold" : "font-normal";
  const godaScoreColor = isUpcoming || result === "D" || result === "W" ? "text-goda-navy" : "text-gray-400";
  const oppScoreColor = isUpcoming || result === "D" || result === "L" ? "text-goda-navy" : "text-gray-400";

  return (
    <div
      onClick={() => router.push(`/tran-dau/${match.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") router.push(`/tran-dau/${match.id}`); }}
      className="h-full"
    >
      <Card
        className={`p-0 overflow-hidden border-l-4 ${resultColor} ${resultBg} hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col`}
      >
        <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
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

          {/* Teams Row — always show team names */}
          <div className="flex items-center justify-center gap-3 py-3">
            {/* Left team name */}
            <span className={`flex-1 text-right font-display text-sm truncate ${leftIsGoda ? godaColor : oppColor} ${leftIsGoda ? godaWeight : oppWeight}`}>
              {match.isHome ? "GODA FC" : match.opponent}
            </span>
            {/* Score or upcoming badge */}
            {isUpcoming ? (
              <Badge className="bg-goda-navy text-white text-xs px-3 py-1 shrink-0">
                ⏳ Chưa diễn ra
              </Badge>
            ) : (
              <>
                <span className={`text-2xl font-extrabold shrink-0 ${leftIsGoda ? godaScoreColor : oppScoreColor}`}>
                  {match.isHome ? match.godaScore : match.opponentScore}
                </span>
                <span className="text-lg text-gray-400 shrink-0">-</span>
                <span className={`text-2xl font-extrabold shrink-0 ${leftIsGoda ? oppScoreColor : godaScoreColor}`}>
                  {match.isHome ? match.opponentScore : match.godaScore}
                </span>
              </>
            )}
            {/* Right team name */}
            <span className={`flex-1 text-left font-display text-sm truncate ${leftIsGoda ? oppColor : godaColor} ${leftIsGoda ? oppWeight : godaWeight}`}>
              {match.isHome ? match.opponent : "GODA FC"}
            </span>
          </div>

          {/* Countdown for upcoming matches */}
          {isUpcoming && match.time && (
            <CountdownTimer date={match.date} time={match.time} />
          )}

          {/* Goal Scorers — under each team (completed matches only) */}
          {!isUpcoming && match.goals.length > 0 && (
                <div className="flex justify-center gap-3">
                  {/* Left goals */}
                  <div className="flex-1 text-right space-y-0.5">
                    {match.goals
                      .filter((g) => (match.isHome ? g.side === "GODA" : g.side !== "GODA"))
                      .map((g, i) => {
                        const playerDisplay = formatGoalPlayer(g.player);
                        const assistDisplay = g.assist ? ` (${formatGoalPlayer(g.assist)})` : "";
                        return (
                          <p key={`lg-${i}`} className="text-xs text-gray-500 leading-tight font-normal">
                            {g.minute}&apos; {playerDisplay}{assistDisplay}
                          </p>
                        );
                      })}
                  </div>
                  {/* Score spacer */}
                  <div className="shrink-0 w-[72px]" />
                  {/* Right goals */}
                  <div className="flex-1 text-left space-y-0.5">
                    {match.goals
                      .filter((g) => (match.isHome ? g.side !== "GODA" : g.side === "GODA"))
                      .map((g, i) => {
                        const playerDisplay = formatGoalPlayer(g.player);
                        const assistDisplay = g.assist ? ` (${formatGoalPlayer(g.assist)})` : "";
                        return (
                          <p key={`rg-${i}`} className="text-xs text-gray-600 leading-tight font-normal">
                            {g.minute}&apos; {playerDisplay}{assistDisplay}
                          </p>
                        );
                      })}
                  </div>
                </div>
              )}

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

          {/* Venue + MVP — pushed to bottom for consistent card heights */}
          <div className="space-y-1 mt-auto pt-2 border-t border-gray-100">
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

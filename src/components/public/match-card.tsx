"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Award, ExternalLink } from "lucide-react";
import { CountdownTimer } from "./countdown-timer";
import { isGodaMatch, type MatchResult } from "@/lib/mock-data";

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

function jerseyBadgeClass(color: string): string {
  if (color.startsWith("Vàng")) return "bg-yellow-200 text-yellow-800";
  if (color.startsWith("Xanh")) return "bg-blue-200 text-blue-800";
  if (color.startsWith("Đỏ")) return "bg-red-200 text-red-800";
  if (color.startsWith("Trắng")) return "bg-gray-200 text-gray-800";
  return "bg-gray-100 text-gray-700";
}

// Màu icon áo — cùng cách phân loại với jerseyBadgeClass, để icon và nền
// badge luôn khớp màu nhau.
function jerseyIconColor(color: string): string {
  if (color.startsWith("Vàng")) return "text-yellow-500";
  if (color.startsWith("Xanh")) return "text-blue-500";
  if (color.startsWith("Đỏ")) return "text-red-500";
  if (color.startsWith("Trắng")) return "text-gray-400";
  return "text-gray-500";
}

/** Icon bộ trang phục (áo + quần) — rõ ràng hơn icon áo đơn, tô màu theo currentColor. */
function KitIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {/* Áo — cổ tròn hơi khoét, tay ngắn buông xuống */}
      <path d="M7.5 3 Q12 4.3 16.5 3 L19 4 L18 8 L15.5 6.5 L15.5 11 L8.5 11 L8.5 6.5 L6 8 L5 4 Z" />
      {/* Quần short — có rãnh giữa 2 ống */}
      <path d="M6 13 L18 13 L18 22 L13.5 22 L12 17.5 L10.5 22 L6 22 Z" />
    </svg>
  );
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

  // Trận không có GODA tham gia → không ghi Thắng/Hòa/Thua để tránh nhầm lẫn
  const isNeutral = !isGodaMatch(match);

  const resultColor = isNeutral
    ? "border-l-gray-300"
    : getResultColor(match.godaScore, match.opponentScore);
  const resultBg = isNeutral ? "" : getResultBg(match.godaScore, match.opponentScore);
  const result =
    match.godaScore > match.opponentScore
      ? "W"
      : match.godaScore < match.opponentScore
        ? "L"
        : "D";

  const isUpcoming = match.godaScore === 0 && match.opponentScore === 0 && match.goals.length === 0;
  const isPostponed = match.postponed === true;
  const homeName = match.homeTeam ?? (match.isHome ? "GODA FC" : match.opponent);
  const awayName = match.awayTeam ?? (match.isHome ? match.opponent : "GODA FC");

  // Dynamic team name colors based on result
  const leftIsGoda = match.isHome;

  // Jersey colors, attached directly under each side's name (left = home
  // team, right = away team) instead of a separate list below.
  const showJerseys = isUpcoming && !isPostponed && !match.eventTitle;
  const leftJersey = leftIsGoda ? match.godaJerseyColor : match.opponentJerseyColor;
  const rightJersey = leftIsGoda ? match.opponentJerseyColor : match.godaJerseyColor;
  const godaColor = isNeutral || isUpcoming || result === "D" ? "text-goda-navy" : result === "W" ? "text-goda-navy" : "text-gray-400";
  const oppColor = isNeutral || isUpcoming || result === "D" ? "text-goda-navy" : result === "W" ? "text-gray-400" : "text-goda-navy";
  const godaWeight = isNeutral || isUpcoming || result === "D" || result === "W" ? "font-semibold" : "font-normal";
  const oppWeight = isNeutral || isUpcoming || result === "D" || result === "L" ? "font-semibold" : "font-normal";
  const godaScoreColor = isNeutral || isUpcoming || result === "D" || result === "W" ? "text-goda-navy" : "text-gray-400";
  const oppScoreColor = isNeutral || isUpcoming || result === "D" || result === "L" ? "text-goda-navy" : "text-gray-400";

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

          {/* Teams Row — always show team names (sự kiện thì hiển thị tiêu đề) */}
          {match.eventTitle ? (
            <div className="flex flex-col items-center gap-1 py-3 text-center">
              <p className="font-display text-base font-extrabold text-goda-navy">
                {match.eventTitle}
              </p>
              {match.eventDescription && (
                <p className="text-xs leading-relaxed text-gray-500">
                  {match.eventDescription}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-3">
              {/* Left team: name + (upcoming) jersey color right underneath */}
              <div className="flex flex-1 flex-col items-end gap-1 min-w-0">
                <span className={`text-right font-display text-sm truncate ${leftIsGoda ? godaColor : oppColor} ${leftIsGoda ? godaWeight : oppWeight}`}>
                  {homeName}
                </span>
                {showJerseys && leftJersey && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${jerseyBadgeClass(leftJersey)}`}>
                    <KitIcon className={`size-4 shrink-0 ${jerseyIconColor(leftJersey)}`} />
                    {leftJersey}
                  </span>
                )}
              </div>
              {/* Score or upcoming badge */}
              {isPostponed ? (
                <Badge className="bg-amber-500 text-white text-xs px-3 py-1 shrink-0">
                  ⚠️ Hoãn
                </Badge>
              ) : isUpcoming ? (
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
              {/* Right team: name + (upcoming) jersey color right underneath */}
              <div className="flex flex-1 flex-col items-start gap-1 min-w-0">
                <span className={`text-left font-display text-sm truncate ${leftIsGoda ? oppColor : godaColor} ${leftIsGoda ? oppWeight : godaWeight}`}>
                  {awayName}
                </span>
                {showJerseys && rightJersey && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${jerseyBadgeClass(rightJersey)}`}>
                    <KitIcon className={`size-4 shrink-0 ${jerseyIconColor(rightJersey)}`} />
                    {rightJersey}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Lý do hoãn */}
          {isPostponed && match.postponedReason && (
            <p className="rounded bg-amber-50 px-2 py-1 text-center text-xs font-medium text-amber-700">
              ⚠️ {match.postponedReason}
            </p>
          )}

          {/* Countdown for upcoming matches */}
          {isUpcoming && !isPostponed && match.time && (
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

          {/* Result Badge — only for completed GODA matches */}
          {!isUpcoming && !isNeutral && (
            <div className="flex justify-center">
              <Badge
                className={`text-xs ${result === "W"
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

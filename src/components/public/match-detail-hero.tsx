import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { MatchResult } from "@/lib/mock-data";

interface MatchDetailHeroProps {
  match: MatchResult;
}

export function MatchDetailHero({ match }: MatchDetailHeroProps) {
  const isUpcoming =
    match.godaScore === 0 &&
    match.opponentScore === 0 &&
    match.goals.length === 0;

  const result = isUpcoming
    ? "Chưa diễn ra"
    : match.godaScore > match.opponentScore
      ? "Thắng"
      : match.godaScore < match.opponentScore
        ? "Thua"
        : "Hòa";

  return (
    <section className="bg-goda-navy">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Match Type + Tournament */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Badge className="bg-goda-yellow text-goda-navy border-0 text-sm px-3">
            {match.type}
          </Badge>
          {match.tournament && (
            <Badge variant="outline" className="border-white/30 text-white text-sm">
              {match.tournament}
            </Badge>
          )}
          <Badge
            className={`text-sm ${result === "Thắng"
                ? "bg-goda-green text-white border-0"
                : result === "Thua"
                  ? "bg-red-500 text-white border-0"
                  : "bg-goda-yellow text-goda-navy border-0"
              }`}
          >
            {result}
          </Badge>
        </div>

        {/* Score Row */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
          {/* Home/Away Team */}
          <div className="text-center flex-1">
            <p className="font-display font-bold text-xl md:text-3xl text-white">
              {match.isHome ? "GODA FC" : match.opponent}
            </p>
          </div>

          {/* Score */}
          <div className="text-center">
            {isUpcoming ? (
              <span className="text-4xl md:text-5xl font-extrabold text-goda-yellow">
                VS
              </span>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-5xl md:text-7xl font-extrabold text-white">
                  {match.isHome ? match.godaScore : match.opponentScore}
                </span>
                <span className="text-3xl md:text-5xl text-gray-500">-</span>
                <span className="text-5xl md:text-7xl font-extrabold text-gray-400">
                  {match.isHome ? match.opponentScore : match.godaScore}
                </span>
              </div>
            )}
          </div>

          {/* Away/Home Team */}
          <div className="text-center flex-1">
            <p className="font-display font-bold text-xl md:text-3xl text-gray-400">
              {match.isHome ? match.opponent : "GODA FC"}
            </p>
          </div>
        </div>

        {/* Match Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            {match.date}
          </span>
          {match.time && (
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {match.time}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {match.venue}
          </span>
        </div>
      </div>

      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}

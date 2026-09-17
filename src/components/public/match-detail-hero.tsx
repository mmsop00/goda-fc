import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Shirt, ExternalLink } from "lucide-react";
import { isGodaMatch, getWeekdayLabel, type MatchResult } from "@/lib/mock-data";
import { jerseyBadgeClass, jerseyIconColor } from "@/lib/jersey";
import { WeatherForecast } from "./weather-forecast";

interface MatchDetailHeroProps {
  match: MatchResult;
}

export function MatchDetailHero({ match }: MatchDetailHeroProps) {
  const isUpcoming =
    match.godaScore === 0 &&
    match.opponentScore === 0 &&
    match.goals.length === 0;
  const isPostponed = match.postponed === true;
  const isNeutral = !isGodaMatch(match);
  const homeName = match.homeTeam ?? (match.isHome ? "GODA FC" : match.opponent);
  const awayName = match.awayTeam ?? (match.isHome ? match.opponent : "GODA FC");

  // Chỉ trận sắp tới mới cần biết là thứ mấy để tiện sắp xếp lịch.
  const weekday = isUpcoming ? getWeekdayLabel(match.date) : null;

  const result = isPostponed
    ? "Hoãn"
    : isUpcoming
      ? "Chưa diễn ra"
      : match.godaScore > match.opponentScore
        ? "Thắng"
        : match.godaScore < match.opponentScore
          ? "Thua"
          : "Hòa";

  // Highlight the side that actually WON — not just "home team = brighter".
  // Draw / upcoming / postponed / non-GODA matches: both names stay equally bright.
  const hasClearResult = !isNeutral && !isUpcoming && !isPostponed && result !== "Hòa";
  const homeWon = match.isHome ? match.godaScore > match.opponentScore : match.opponentScore > match.godaScore;
  const homeNameColor = hasClearResult ? (homeWon ? "text-white" : "text-gray-400") : "text-white";
  const awayNameColor = hasClearResult ? (homeWon ? "text-gray-400" : "text-white") : "text-white";

  // Same left(home)/right(away) order as everything else on this page.
  const homeJerseyColor = match.isHome ? match.godaJerseyColor : match.opponentJerseyColor;
  const awayJerseyColor = match.isHome ? match.opponentJerseyColor : match.godaJerseyColor;

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
          {!isNeutral && (
            <Badge
              className={`text-sm ${result === "Thắng"
                ? "bg-goda-green text-white border-0"
                : result === "Thua"
                  ? "bg-red-500 text-white border-0"
                  : result === "Hoãn"
                    ? "bg-amber-500 text-white border-0"
                    : "bg-goda-yellow text-goda-navy border-0"
                }`}
            >
              {result}
            </Badge>
          )}
        </div>

        {/* Score Row */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
          {match.eventTitle ? (
            <div className="text-center">
              <p className="font-display font-extrabold text-2xl md:text-3xl text-white">
                {match.eventTitle}
              </p>
              {match.eventDescription && (
                <p className="mt-2 text-sm text-gray-300">{match.eventDescription}</p>
              )}
            </div>
          ) : (
            <>
              {/* Home/Away Team */}
              <div className="text-center flex-1">
                <p className={`font-display font-bold text-xl md:text-3xl ${homeNameColor}`}>
                  {homeName}
                </p>
              </div>

              {/* Score */}
              <div className="text-center">
                {isUpcoming || isPostponed ? (
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
                <p className={`font-display font-bold text-xl md:text-3xl ${awayNameColor}`}>
                  {awayName}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Match Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>
              {weekday && <span className="font-semibold text-goda-yellow">{weekday}, </span>}
              {match.date}
            </span>
          </span>
          {match.time && (
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {match.time}
            </span>
          )}
          {match.googleMapsUrl ? (
            <a
              href={match.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-goda-yellow hover:underline"
            >
              <MapPin className="size-4" />
              {match.venue}
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {match.venue}
            </span>
          )}
        </div>

        {/* Dự kiến thời tiết — chỉ hiện cho trận chưa diễn ra, và chỉ khi lấy
            được dự báo (Open-Meteo tối đa 16 ngày tới); tự ẩn nếu quá xa. */}
        {isUpcoming && !isPostponed && (
          <WeatherForecast date={match.date} time={match.time} />
        )}

        {/* Trang phục thi đấu cho trận chưa diễn ra — đội nhà hiện trước, đội
            khách hiện sau (giống thứ tự đội ở trên), badge áo đồng bộ với
            thẻ trận đấu ở trang danh sách. */}
        {isUpcoming && !isPostponed && !match.eventTitle && (homeJerseyColor || awayJerseyColor) && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {homeJerseyColor && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-300">
                {homeName} mặc
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${jerseyBadgeClass(homeJerseyColor)}`}>
                  <Shirt className={`size-3.5 shrink-0 ${jerseyIconColor(homeJerseyColor)}`} fill="currentColor" strokeWidth={2.5} />
                  {homeJerseyColor}
                </span>
              </span>
            )}
            {awayJerseyColor && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-300">
                {awayName} mặc
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${jerseyBadgeClass(awayJerseyColor)}`}>
                  <Shirt className={`size-3.5 shrink-0 ${jerseyIconColor(awayJerseyColor)}`} fill="currentColor" strokeWidth={2.5} />
                  {awayJerseyColor}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Lý do hoãn */}
        {isPostponed && match.postponedReason && (
          <p className="mt-3 text-center text-sm font-medium text-amber-300">
            ⚠️ {match.postponedReason}
          </p>
        )}
      </div>

      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}

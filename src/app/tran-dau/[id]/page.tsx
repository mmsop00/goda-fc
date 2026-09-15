import { notFound } from "next/navigation";
import Link from "next/link";
import { MatchDetailHero } from "@/components/public/match-detail-hero";
import { MatchLineup } from "@/components/public/match-lineup";
import { MatchTimeline } from "@/components/public/match-timeline";
import { MatchMVP } from "@/components/public/match-mvp";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin } from "lucide-react";
import { MOCK_MATCH_RESULTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_MATCH_RESULTS.map((m) => ({ id: m.id }));
}

export default async function TranDauDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = MOCK_MATCH_RESULTS.find((m) => m.id === id);

  if (!match) notFound();

  // Cùng cách tính tên đội nhà/khách như MatchDetailHero — dùng cho cả trận
  // trung lập (GODA không thi đấu), thay vì mặc định coi 1 bên luôn là GODA.
  const homeName = match.homeTeam ?? (match.isHome ? "GODA FC" : match.opponent);
  const awayName = match.awayTeam ?? (match.isHome ? match.opponent : "GODA FC");
  const godaLabel = match.isHome ? homeName : awayName;
  const opponentLabel = match.isHome ? awayName : homeName;

  return (
    <>
      <MatchDetailHero match={match} />

      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          href="/tran-dau"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-goda-navy transition-colors"
        >
          <ArrowLeft className="size-4" />
          Tất cả trận đấu
        </Link>
      </div>

      {!match.eventTitle && (
        <>
          <MatchLineup
            godaLineup={match.godaLineup}
            opponentLineup={match.opponentLineup}
            homeName={homeName}
            awayName={awayName}
            isHome={match.isHome}
          />

          <Separator />

          <MatchTimeline
            goals={match.goals}
            cards={match.cards}
            godaLabel={godaLabel}
            opponentLabel={opponentLabel}
          />

          {match.mvp && <MatchMVP playerName={match.mvp} />}
        </>
      )}

      {match.googleMapsUrl && (
        <section className="max-w-5xl mx-auto px-4 py-8 text-center">
          <a
            href={match.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-goda-navy text-white hover:bg-goda-navy/90 transition-colors text-sm font-medium"
          >
            <MapPin className="size-4" />
            Xem sân {match.venue} trên Google Maps
          </a>
        </section>
      )}
    </>
  );
}

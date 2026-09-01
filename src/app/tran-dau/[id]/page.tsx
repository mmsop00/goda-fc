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
            opponentName={match.opponent}
          />

          <Separator />

          <MatchTimeline goals={match.goals} cards={match.cards} />

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

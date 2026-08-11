"use client";

import { useMemo } from "react";
import { HeroSection } from "@/components/public/hero-section";
import { BirthdayBanner } from "@/components/public/birthday-banner";
import { MatchCard } from "@/components/public/match-card";
import { AboutSection } from "@/components/public/about-section";
import { PlayerSpotlight } from "@/components/public/player-spotlight";
import { HistoryTeaser } from "@/components/public/history-teaser";
import { EventsDonateSection } from "@/components/public/events-donate-section";
import { NewsSection } from "@/components/public/news-section";
import { GallerySection } from "@/components/public/gallery-section";
import { CTASection } from "@/components/public/cta-section";
import { FooterSection } from "@/components/public/footer-section";
import { Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  MOCK_MATCH_RESULTS,
  MOCK_MEMBERS,
  MOCK_HISTORY,
  MOCK_EVENTS,
  MOCK_DONORS,
  MOCK_RECENT_DONATIONS,
  MOCK_NEWS,
  MOCK_ALBUM,
} from "@/lib/mock-data";

export default function PublicHomePage() {
  const sortedMatches = useMemo(
    () => [...MOCK_MATCH_RESULTS].sort((a, b) => {
      const da = a.date.split("/").reverse().join("");
      const db = b.date.split("/").reverse().join("");
      return db.localeCompare(da);
    }),
    []
  );

  // Show latest 4 matches on homepage
  const latestMatches = sortedMatches.slice(0, 4);

  return (
    <>
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Birthday & Event Banner — shows when within 7 days */}
      <BirthdayBanner members={MOCK_MEMBERS} events={MOCK_EVENTS} recentDonations={MOCK_RECENT_DONATIONS} />

      {/* Section 2: Match Results — synced from /tran-dau */}
      <section className="py-16 md:py-20 bg-goda-warm-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
                <Trophy className="size-5 md:size-6 inline-block mr-2 align-middle" aria-hidden="true" />
                Trận đấu
              </h2>
              <p className="text-gray-500">Kết quả gần nhất của GODA FC</p>
            </div>
            <Link
              href="/tran-dau"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-goda-navy hover:bg-goda-soft-gray transition-colors"
            >
              Xem tất cả <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Link
              href="/tran-dau"
              className="inline-flex items-center gap-1 text-sm text-goda-navy hover:text-goda-green transition-colors"
            >
              Xem tất cả trận đấu <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: About */}
      <AboutSection />

      {/* Section 4: Player Slider */}
      <PlayerSpotlight members={MOCK_MEMBERS} />

      {/* Section 5: History Teaser */}
      <HistoryTeaser milestones={MOCK_HISTORY} />

      {/* Section 6: Events + Top Donate */}
      <EventsDonateSection events={MOCK_EVENTS} donors={MOCK_DONORS} recentDonations={MOCK_RECENT_DONATIONS} members={MOCK_MEMBERS} />

      {/* Section 7: News */}
      <NewsSection news={MOCK_NEWS} />

      {/* Section 8: Gallery */}
      <GallerySection items={MOCK_ALBUM} />

      {/* Section 9: CTA */}
      <CTASection />

      {/* Section 10: Footer */}
      <FooterSection />
    </>
  );
}

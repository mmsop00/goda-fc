import { HeroSection } from "@/components/public/hero-section";
import { MatchSpotlight } from "@/components/public/match-spotlight";
import { AboutSection } from "@/components/public/about-section";
import { PlayerSpotlight } from "@/components/public/player-spotlight";
import { HistoryTeaser } from "@/components/public/history-teaser";
import { EventsDonateSection } from "@/components/public/events-donate-section";
import { NewsSection } from "@/components/public/news-section";
import { GallerySection } from "@/components/public/gallery-section";
import { CTASection } from "@/components/public/cta-section";
import { FooterSection } from "@/components/public/footer-section";

import {
  MOCK_MATCHES,
  MOCK_PLAYERS,
  MOCK_HISTORY,
  MOCK_EVENTS,
  MOCK_DONORS,
  MOCK_NEWS,
  MOCK_GALLERY,
} from "@/lib/mock-data";

export default function PublicHomePage() {
  return (
    <>
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Match Spotlight */}
      <MatchSpotlight matches={MOCK_MATCHES} />

      {/* Section 3: About */}
      <AboutSection />

      {/* Section 4: Player Spotlight */}
      <PlayerSpotlight players={MOCK_PLAYERS} />

      {/* Section 5: History Teaser */}
      <HistoryTeaser milestones={MOCK_HISTORY} />

      {/* Section 6: Events + Top Donate */}
      <EventsDonateSection events={MOCK_EVENTS} donors={MOCK_DONORS} />

      {/* Section 7: News */}
      <NewsSection news={MOCK_NEWS} />

      {/* Section 8: Gallery */}
      <GallerySection items={MOCK_GALLERY} />

      {/* Section 9: CTA */}
      <CTASection />

      {/* Section 10: Footer */}
      <FooterSection />
    </>
  );
}

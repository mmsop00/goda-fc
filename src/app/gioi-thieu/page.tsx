import { AboutHero } from "@/components/public/about-hero";
import { AboutStory } from "@/components/public/about-story";
import { AboutValues } from "@/components/public/about-values";
import { CompactHistoryTimeline } from "@/components/public/compact-history-timeline";
import { CTASection } from "@/components/public/cta-section";
import { MOCK_CORE_VALUES, MOCK_FULL_HISTORY } from "@/lib/mock-data";

export default function GioiThieuPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues values={MOCK_CORE_VALUES} />

      {/* Section heading for History */}
      <section className="py-8 bg-goda-warm-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
            📜 Lịch sử GODA FC
          </h2>
          <p className="text-gray-500">
            Hành trình hơn 30 năm — từ sân đất đến những chức vô địch
          </p>
        </div>
      </section>

      <CompactHistoryTimeline items={MOCK_FULL_HISTORY} />
      <CTASection />
    </>
  );
}

import { Button } from "@/components/ui/button";
import { CTA_DATA } from "@/lib/mock-data";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-goda-navy to-goda-green relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 size-64 rounded-full bg-goda-yellow/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 size-96 rounded-full bg-goda-yellow/5 blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4">
          {CTA_DATA.title}
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          {CTA_DATA.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-goda-yellow text-goda-navy hover:bg-goda-yellow/90 font-semibold text-base px-8"
          >
            {CTA_DATA.primaryButton}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 hover:text-white text-base px-8"
          >
            {CTA_DATA.secondaryButton}
          </Button>
        </div>
      </div>
    </section>
  );
}

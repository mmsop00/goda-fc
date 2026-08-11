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
        <div className="flex justify-center">
          <a href="tel:0974617962">
            <Button
              size="lg"
              className="bg-goda-yellow text-goda-navy hover:bg-goda-yellow/90 font-semibold text-base px-8"
            >
              {CTA_DATA.secondaryButton}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

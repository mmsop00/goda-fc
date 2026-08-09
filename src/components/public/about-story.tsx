import { ABOUT_STORY } from "@/lib/mock-data";

export function AboutStory() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-6">
              {ABOUT_STORY.title}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {ABOUT_STORY.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[3/2] rounded-2xl bg-goda-navy/10 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <span className="text-6xl font-extrabold text-goda-navy/20">
                  1994
                </span>
                <p className="text-sm text-goda-navy/50 mt-2">
                  Sân C500, Hà Nội
                </p>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-3 -right-3 size-24 rounded-xl bg-goda-yellow/20 -z-10" />
            <div className="absolute -top-3 -left-3 size-16 rounded-xl bg-goda-green/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

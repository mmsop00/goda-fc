import type { AboutTimelineItem } from "@/lib/mock-data";

interface AboutTimelineProps {
  items: AboutTimelineItem[];
}

export function AboutTimeline({ items }: AboutTimelineProps) {
  return (
    <section className="py-16 md:py-20 bg-goda-warm-white">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
            Các mốc quan trọng
          </h2>
          <p className="text-gray-500">
            Những dấu mốc đáng nhớ trong hành trình GODA FC
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-goda-yellow/30" />

          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.year} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-[11px] top-1.5 size-3 rounded-full bg-goda-yellow border-2 border-white shadow" />

                {/* Content */}
                <span className="font-display font-extrabold text-2xl text-goda-yellow">
                  {item.year}
                </span>
                <h3 className="font-display font-semibold text-lg text-goda-navy mt-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

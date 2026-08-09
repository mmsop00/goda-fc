import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { NEWS_CATEGORY_COLORS } from "@/lib/mock-data";
import type { NewsItem } from "@/lib/mock-data";

interface NewsDetailHeroProps {
  item: NewsItem;
}

export function NewsDetailHero({ item }: NewsDetailHeroProps) {
  return (
    <section className="bg-goda-navy">
      {/* Image placeholder */}
      <div className="h-64 md:h-96 bg-goda-navy/80 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 size-96 rounded-full bg-goda-yellow blur-3xl" />
        </div>
        <span className="text-6xl font-extrabold text-white/10">
          {item.category.slice(0, 2)}
        </span>
      </div>

      {/* Title + Meta */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge
            variant="outline"
            className={`text-sm px-3 py-1 ${NEWS_CATEGORY_COLORS[item.category] || ""}`}
          >
            {item.category}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-gray-300">
            <Calendar className="size-4" />
            {item.date}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-300">
            <User className="size-4" />
            {item.author}
          </span>
        </div>

        <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
          {item.title}
        </h1>
      </div>

      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}

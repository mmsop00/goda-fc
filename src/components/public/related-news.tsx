import { NewsCard } from "./news-card";
import type { NewsItem } from "@/lib/mock-data";

interface RelatedNewsProps {
  currentSlug: string;
  news: NewsItem[];
}

export function RelatedNews({ currentSlug, news }: RelatedNewsProps) {
  // Get related: same category, exclude current, max 3
  const currentArticle = news.find((n) => n.slug === currentSlug);
  const related = news
    .filter(
      (n) =>
        n.slug !== currentSlug &&
        (!currentArticle || n.category === currentArticle.category)
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-goda-soft-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-goda-navy mb-6">
          Bài viết liên quan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

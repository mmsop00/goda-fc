import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import type { NewsItem } from "@/lib/mock-data";

interface NewsSectionProps {
  news: NewsItem[];
  isLoading?: boolean;
}

export function NewsSection({ news, isLoading }: NewsSectionProps) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
                          <Newspaper className="size-5 md:size-6 inline-block mr-2 align-middle" aria-hidden="true" />
            Tin tức
            </h2>
            <p className="text-gray-500">Tin mới nhất từ GODA FC</p>
          </div>
          <Link
            href="/tin-tuc"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-goda-navy hover:bg-goda-soft-gray transition-colors"
          >
            Xem tất cả <ArrowRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-0 overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : news.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-goda-soft-gray/50 mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <p className="text-gray-500">Chưa có tin tức nào.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card key={item.id} className="p-0 overflow-hidden group cursor-pointer">
                {/* Thumbnail */}
                <div className="h-48 bg-goda-soft-gray flex items-center justify-center overflow-hidden">
                  <span className="text-4xl text-goda-navy/20 font-extrabold">
                    {item.category.slice(0, 2)}
                  </span>
                </div>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-goda-navy leading-snug group-hover:text-goda-green transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Mobile "View All" */}
        <div className="text-center mt-6 sm:hidden">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-1 text-sm text-goda-navy hover:text-goda-green transition-colors"
          >
            Xem tất cả tin tức <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

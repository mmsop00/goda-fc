import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { NEWS_CATEGORY_COLORS } from "@/lib/mock-data";
import type { NewsItem } from "@/lib/mock-data";

interface NewsCardProps {
  item?: NewsItem;
  isLoading?: boolean;
}

export function NewsCard({ item, isLoading }: NewsCardProps) {
  if (isLoading) {
    return (
      <Card className="p-0 overflow-hidden">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-20" />
        </div>
      </Card>
    );
  }

  if (!item) return null;

  return (
    <Link href={`/tin-tuc/${item.slug}`}>
      <Card className="p-0 overflow-hidden group cursor-pointer h-full hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        <div className="h-48 bg-goda-navy/10 flex items-center justify-center overflow-hidden">
          <span className="text-4xl font-extrabold text-goda-navy/20">
            {item.category.slice(0, 2)}
          </span>
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${NEWS_CATEGORY_COLORS[item.category] || ""}`}
            >
              {item.category}
            </Badge>
            <span className="text-xs text-gray-400">{item.date}</span>
          </div>

          <h3 className="font-display font-semibold text-goda-navy leading-snug group-hover:text-goda-green transition-colors line-clamp-2">
            {item.title}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

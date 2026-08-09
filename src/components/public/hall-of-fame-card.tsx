import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";
import Image from "next/image";
import type { HallOfFameEntry } from "@/lib/mock-data";

interface HallOfFameCardProps {
  entry: HallOfFameEntry;
  isLoading?: boolean;
}

export function HallOfFameCard({ entry, isLoading }: HallOfFameCardProps) {
  if (isLoading) {
    return (
      <Card className="p-5 items-center text-center gap-3">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  return (
    <Card
      className={`p-5 items-center text-center gap-3 ${
        entry.highlight ? "ring-2 ring-goda-yellow shadow-lg" : ""
      }`}
    >
      <CardContent className="flex flex-col items-center gap-3 p-0">
        {/* Avatar */}
        <div
          className={`size-20 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden relative ${
            entry.highlight ? "ring-2 ring-goda-yellow" : ""
          }`}
        >
          {entry.avatarUrl ? (
            <Image
              src={entry.avatarUrl}
              alt={entry.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span
              className={
                entry.highlight
                  ? "bg-goda-yellow text-goda-navy size-full flex items-center justify-center"
                  : "bg-goda-navy size-full flex items-center justify-center"
              }
            >
              {entry.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Highlight badge */}
        {entry.highlight && (
          <Badge className="bg-goda-yellow text-goda-navy border-0 gap-1">
            <Trophy className="size-3" />
            Nổi bật
          </Badge>
        )}

        {/* Name */}
        <h3 className="font-display font-semibold text-goda-navy leading-tight">
          {entry.name}
        </h3>

        {/* Title */}
        <p className="text-sm font-medium text-goda-green">{entry.title}</p>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-1">
          {entry.categories.map((cat) => (
            <Badge key={cat} variant="outline" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>

        {/* Year */}
        <span className="text-xs text-gray-400">{entry.year}</span>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {entry.description}
        </p>
      </CardContent>
    </Card>
  );
}

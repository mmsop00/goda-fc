import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Image } from "lucide-react";
import type { GalleryItem } from "@/lib/mock-data";

interface GallerySectionProps {
  items: GalleryItem[];
  isLoading?: boolean;
}

export function GallerySection({ items, isLoading }: GallerySectionProps) {
  return (
    <section className="py-16 md:py-20 bg-goda-soft-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="size-5 md:size-6 inline-block mr-2 align-middle" aria-hidden="true" />
            Ảnh & Video
          </h2>
          <p className="text-gray-500">Khoảnh khắc đáng nhớ của GODA FC</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-white mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <p className="text-gray-500">Chưa có ảnh/video nào.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-video rounded-lg overflow-hidden bg-goda-navy/10 cursor-pointer"
              >
                {/* Placeholder background */}
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    item.type === "video" ? "bg-goda-navy/80" : "bg-goda-navy/20"
                  }`}
                >
                  {item.type === "video" ? (
                    <div className="flex flex-col items-center gap-2">
                      <Play className="size-10 text-white fill-white" />
                      <span className="text-xs text-white font-medium">
                        Xem video
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl opacity-30">📷</span>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-goda-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-xs text-white line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

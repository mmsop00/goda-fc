import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";
import type { PlayerSpotlight as PlayerType } from "@/lib/mock-data";

interface PlayerSpotlightProps {
  players: PlayerType[];
  isLoading?: boolean;
}

export function PlayerSpotlight({ players, isLoading }: PlayerSpotlightProps) {
  return (
    <section className="py-16 md:py-20 bg-goda-soft-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
            ⭐ Cầu thủ nổi bật
          </h2>
          <p className="text-gray-500">Những gương mặt tiêu biểu của GODA FC</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4 space-y-3 items-center">
                <Skeleton className="size-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-full" />
              </Card>
            ))}
          </div>
        ) : players.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-white mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <p className="text-gray-500">Chưa có dữ liệu cầu thủ.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {players.map((player) => (
              <Card key={player.id} className="p-4 items-center text-center gap-0">
                <CardContent className="flex flex-col items-center gap-3 p-0">
                  {/* Avatar */}
                  <div className="size-20 rounded-full bg-goda-navy flex items-center justify-center text-white font-bold text-lg overflow-hidden mb-1">
                    {player.nickname.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Name & Nickname */}
                  <div>
                    <h3 className="font-display font-semibold text-goda-navy leading-tight">
                      {player.name}
                    </h3>
                    <p className="text-xs text-gray-400">&ldquo;{player.nickname}&rdquo;</p>
                  </div>

                  {/* Position & Number */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {player.position}
                    </Badge>
                    <span className="text-xl font-bold text-goda-yellow">
                      #{player.number}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 w-full text-center pt-2 border-t border-gray-100">
                    <div>
                      <span className="block text-sm font-bold text-goda-navy">
                        {player.matches}
                      </span>
                      <span className="text-xs text-gray-400">Trận</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-goda-navy">
                        {player.goals}
                      </span>
                      <span className="text-xs text-gray-400">Bàn</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-0.5">
                        <Award className="size-3 text-goda-yellow" />
                        <span className="text-sm font-bold text-goda-yellow">
                          {player.mvp}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">MVP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

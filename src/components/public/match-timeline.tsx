import { Card } from "@/components/ui/card";
import { Crosshair } from "lucide-react";
import type { MatchGoal, MatchCard as MatchCardType } from "@/lib/mock-data";

interface MatchTimelineProps {
  goals: MatchGoal[];
  cards: MatchCardType[];
}

interface TimelineEvent {
  type: "goal" | "yellow" | "red";
  minute: number;
  side: "GODA" | "opponent";
  player: string;
  assist?: string;
}

export function MatchTimeline({ goals, cards }: MatchTimelineProps) {
  const events: TimelineEvent[] = [
    ...goals.map((g) => ({ type: "goal" as const, minute: g.minute, side: g.side, player: g.player, assist: g.assist })),
    ...cards.map((c) => ({ type: c.type, minute: c.minute, side: c.side, player: c.player })),
  ].sort((a, b) => a.minute - b.minute);

  if (events.length === 0) {
    return (
      <section className="py-12 bg-goda-warm-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-400">Không có sự kiện nào trong trận đấu.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-goda-warm-white">
      <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-goda-navy text-center mb-8">
          Diễn biến trận đấu
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-goda-yellow/20 md:-translate-x-px" />

          <div className="space-y-4">
            {events.map((event, i) => {
              const isGoda = event.side === "GODA";
              const isGoal = event.type === "goal";

              return (
                <div
                  key={i}
                  className={`relative pl-10 md:pl-0 md:w-1/2 ${
                    isGoda ? "md:pr-8 md:ml-0" : "md:pl-8 md:ml-auto"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`absolute left-2 md:left-auto top-0 size-4 rounded-full flex items-center justify-center ${
                      isGoal
                        ? "bg-goda-yellow text-goda-navy"
                        : event.type === "red"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-400 text-white"
                    }`}
                  >
                    {isGoal ? (
                      <Crosshair className="size-2.5" />
                    ) : (
                      <span className="text-[8px] font-bold leading-none">
                        {event.type === "red" ? "R" : "Y"}
                      </span>
                    )}
                  </div>

                  {/* Event Card */}
                  <Card
                    className={`p-3 ${
                      isGoda ? "border-l-2 border-l-goda-navy" : "border-l-2 border-l-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{event.minute}&apos;</span>
                      <span className="text-xs font-medium text-goda-navy">
                        {isGoda ? "GODA" : "Đối thủ"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-goda-navy">
                      {event.player}
                    </p>
                    {isGoal && event.assist && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Kiến tạo: {event.assist}
                      </p>
                    )}
                    {!isGoal && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Thẻ {event.type === "red" ? "đỏ" : "vàng"}
                      </p>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

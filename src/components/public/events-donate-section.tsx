import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Calendar, Trophy, Beer, Cake, Users, Star } from "lucide-react";
import type { UpcomingEvent, TopDonor } from "@/lib/mock-data";

interface EventsDonateSectionProps {
  events: UpcomingEvent[];
  donors: TopDonor[];
  isLoading?: boolean;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  match: <Trophy className="size-4" />,
  club_event: <Users className="size-4" />,
  social: <Beer className="size-4" />,
  birthday: <Cake className="size-4" />,
};

const LEVEL_STYLES: Record<string, string> = {
  MAJOR: "bg-red-100 text-red-700 border-red-200",
  NORMAL: "bg-goda-yellow/20 text-goda-navy border-goda-yellow/30",
  MINOR: "bg-gray-100 text-gray-600 border-gray-200",
};

function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + " ₫";
}

export function EventsDonateSection({
  events,
  donors,
  isLoading,
}: EventsDonateSectionProps) {
  return (
    <section className="py-16 md:py-20 bg-goda-warm-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
            <Calendar className="size-5 md:size-6 inline-block mr-2 align-middle" aria-hidden="true" />
            Sự kiện & Đóng góp
          </h2>
          <p className="text-gray-500">
            Những gì đang diễn ra tại GODA FC
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
            <div className="lg:w-1/3">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Events Column (2/3) */}
            <div className="lg:w-2/3 space-y-4">
              <h3 className="font-display font-semibold text-xl text-goda-navy mb-4">
                Sự kiện sắp tới
              </h3>
              {events.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300 bg-goda-soft-gray/50">
                  <CardContent className="flex flex-col items-center py-12 gap-3">
                    <Calendar className="size-10 text-gray-300" />
                    <p className="text-gray-500">Chưa có sự kiện nào.</p>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="p-0 flex flex-col sm:flex-row">
                    <div className="flex-1 p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={LEVEL_STYLES[event.level]}
                        >
                          {event.level === "MAJOR"
                            ? "Quan trọng"
                            : event.level === "NORMAL"
                              ? "Thường kỳ"
                              : "Nhỏ"}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          {EVENT_ICONS[event.type]}
                          {event.type === "match"
                            ? "Trận đấu"
                            : event.type === "club_event"
                              ? "Sự kiện CLB"
                              : event.type === "social"
                                ? "Giao lưu"
                                : "Sinh nhật"}
                        </span>
                      </div>
                      <CardTitle className="text-base mb-1">
                        {event.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <div className="sm:w-28 bg-goda-soft-gray/50 flex sm:flex-col items-center justify-center gap-1 p-3 sm:p-4 text-center">
                      <Calendar className="size-4 text-goda-navy sm:mb-1" />
                      <span className="text-sm font-semibold text-goda-navy whitespace-nowrap">
                        {event.date}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Donate Column (1/3) */}
            <div className="lg:w-1/3">
              <h3 className="font-display font-semibold text-xl text-goda-navy mb-4 flex items-center gap-2">
                <Star className="size-5 text-goda-yellow" />
                Top Donate tháng
              </h3>
              <Card className="p-0 overflow-hidden">
                <CardHeader className="bg-goda-navy text-white pb-3">
                  <CardTitle className="text-sm font-medium text-center">
                    Bảng xếp hạng tháng 08/2026
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {donors.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm">
                      Chưa có donor nào.
                    </div>
                  ) : (
                    <div>
                      {donors.map((donor, index) => (
                        <div key={donor.id}>
                          <div className="flex items-center gap-3 px-4 py-3">
                            {/* Rank */}
                            <span
                              className={`font-bold text-lg w-8 text-center ${
                                index === 0
                                  ? "text-goda-yellow"
                                  : index === 1
                                    ? "text-gray-400"
                                    : index === 2
                                      ? "text-amber-600"
                                      : "text-gray-400"
                              }`}
                            >
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                            </span>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-goda-navy truncate block">
                                {donor.anonymous ? "Ẩn danh" : donor.name}
                              </span>
                            </div>

                            {/* Amount */}
                            <span
                              className={`text-sm font-semibold whitespace-nowrap ${
                                index === 0 ? "text-goda-yellow" : "text-goda-green"
                              }`}
                            >
                              {formatVND(donor.amount)}
                            </span>
                          </div>
                          {index < donors.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

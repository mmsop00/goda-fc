import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Calendar, Trophy, Beer, Cake, Users, Star, Clock, Gift } from "lucide-react";
import { CountdownTimer } from "./countdown-timer";
import type { UpcomingEvent, TopDonor, RecentDonation, MemberPublic } from "@/lib/mock-data";

interface EventsDonateSectionProps {
  events: UpcomingEvent[];
  donors: TopDonor[];
  recentDonations?: RecentDonation[];
  members?: MemberPublic[];
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

function bdayKey(bday: string): number {
  const parts = bday.split("/");
  if (parts.length === 2) return parseInt(parts[1]) * 100 + parseInt(parts[0]);
  return 9999;
}

function sortMembersByUpcomingBirthday(members: MemberPublic[]): MemberPublic[] {
  const today = new Date();
  const todayKey = (today.getMonth() + 1) * 100 + today.getDate();
  return [...members]
    .filter((m) => m.birthday && m.birthday.includes("/"))
    .map((m) => ({ ...m, _bdayKey: bdayKey(m.birthday!) }))
    .sort((a: any, b: any) => {
      // Upcoming from today
      const aAdj = a._bdayKey >= todayKey ? a._bdayKey : a._bdayKey + 1300;
      const bAdj = b._bdayKey >= todayKey ? b._bdayKey : b._bdayKey + 1300;
      if (aAdj !== bAdj) return aAdj - bAdj;
      // Same date: older first (by joinYear - earlier = older)
      return (a.joinYear || 9999) - (b.joinYear || 9999);
    });
}

function formatVND(index: number): string {
  const amounts = ["xxx.xxx.xxx ₫", "xxx.xxx.xxx ₫", "xx.xxx.xxx ₫", "xx.xxx.xxx ₫", "x.xxx.xxx ₫"];
  return amounts[Math.min(index, amounts.length - 1)];
}

export function EventsDonateSection({
  events,
  donors,
  recentDonations = [],
  members = [],
  isLoading,
}: EventsDonateSectionProps) {
  const sortedBirthdays = sortMembersByUpcomingBirthday(members);
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
                    <div className="sm:w-36 bg-goda-soft-gray/50 flex sm:flex-col items-center justify-center gap-1 p-3 sm:p-4 text-center">
                      <Calendar className="size-4 text-goda-navy sm:mb-1" />
                      <span className="text-sm font-semibold text-goda-navy whitespace-nowrap">
                        {event.date}
                      </span>
                      {/* Countdown for events with time */}
                      {event.time && (
                        <CountdownTimer date={event.date} time={event.time} />
                      )}
                    </div>
                  </Card>
                ))
              )}

              {/* Sinh nhật thành viên */}
              {sortedBirthdays.length > 0 && (
                <div className="pt-4">
                  <h3 className="font-display font-semibold text-xl text-goda-navy mb-4 flex items-center gap-2">
                    <Gift className="size-5 text-goda-yellow" />
                    Sinh nhật thành viên
                  </h3>
                  <Card className="p-0 overflow-hidden">
                    <CardContent className="p-0 max-h-64 overflow-y-auto">
                      {sortedBirthdays.map((m, i) => {
                        // Color fade: closest = yellow tint, farthest = white
                        const total = sortedBirthdays.length;
                        const ratio = total > 1 ? i / (total - 1) : 0;
                        const bg = ratio < 0.1
                          ? "bg-goda-yellow/15"
                          : ratio < 0.25
                          ? "bg-goda-yellow/8"
                          : ratio < 0.5
                          ? "bg-goda-green/5"
                          : "bg-white";
                        return (
                        <div key={m.id}>
                          <div className={`flex items-center gap-3 px-4 py-2.5 ${bg}`}>
                            <span className="text-sm font-medium text-goda-navy w-20 shrink-0">
                              {m.birthday}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-goda-navy truncate block">
                                {m.name}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {m.position}
                            </Badge>
                          </div>
                          {i < sortedBirthdays.length - 1 && <Separator />}
                        </div>
                      )})}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Right Column: Tài trợ */}
            <div className="lg:w-1/3 space-y-6">
              {/* Top tài trợ */}
              <div>
                <h3 className="font-display font-semibold text-xl text-goda-navy mb-4 flex items-center gap-2">
                  <Star className="size-5 text-goda-yellow" />
                  Top tài trợ
                </h3>
                <Card className="p-0 overflow-hidden">
                  <CardHeader className="bg-goda-navy text-white pb-3">
                    <CardTitle className="text-sm font-medium text-center">
                      Bảng xếp hạng tháng 08/2026
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 max-h-80 overflow-y-auto">
                    {donors.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 text-sm">
                        Chưa có nhà tài trợ nào.
                      </div>
                    ) : (
                      <div>
                        {donors.map((donor, index) => (
                          <div key={donor.id}>
                            <div className="flex items-center gap-3 px-4 py-2.5">
                              <span className={`font-bold text-base w-8 text-center shrink-0 ${
                                index === 0 ? "text-goda-yellow" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-gray-400"
                              }`}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-goda-navy truncate block">
                                  {donor.anonymous ? "Ẩn danh" : donor.name}
                                </span>
                              </div>
                              <span className={`text-xs whitespace-nowrap shrink-0 ${index === 0 ? "text-goda-yellow font-semibold" : "text-goda-green"}`}>
                                {formatVND(index)}
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

              {/* Tài trợ gần đây */}
              <div>
                <h3 className="font-display font-semibold text-xl text-goda-navy mb-4 flex items-center gap-2">
                  <Clock className="size-5 text-goda-yellow" />
                  Tài trợ gần đây
                </h3>
                <Card className="p-0 overflow-hidden">
                  <CardContent className="p-0 max-h-80 overflow-y-auto">
                    {recentDonations.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 text-sm">
                        Chưa có giao dịch nào.
                      </div>
                    ) : (
                      <div>
                        {recentDonations.map((tx, index) => (
                          <div key={tx.id}>
                            <div className="flex items-center gap-3 px-4 py-2.5">
                              <span className="text-xs text-gray-400 w-8 text-right shrink-0">
                                #{String(index + 1).padStart(2, "0")}
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-goda-navy truncate block">
                                  {tx.name}
                                </span>
                                {tx.message && (
                                  <span className="text-xs text-gray-400 truncate block">
                                    {tx.message}
                                  </span>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs text-goda-green block">
                                  {formatVND(index)}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {tx.date}
                                </span>
                              </div>
                            </div>
                            {index < recentDonations.length - 1 && <Separator />}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

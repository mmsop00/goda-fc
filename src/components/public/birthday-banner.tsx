"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, PartyPopper, Heart } from "lucide-react";
import { type MemberPublic, type UpcomingEvent, type RecentDonation } from "@/lib/mock-data";

// Tạm ẩn mục "5 nhà tài trợ gần đây nhất" khỏi bảng tin chạy — bật lại bằng
// cách đổi giá trị này thành true khi cần.
const SHOW_DONORS = false;

interface BirthdayBannerProps {
  members: MemberPublic[];
  /** Chỉ nên truyền sự kiện SẮP TỚI — sự kiện đã qua có mục riêng ở "Sự kiện & Đóng góp". */
  events: UpcomingEvent[];
  recentDonations?: RecentDonation[];
}

function isWithinNextDays(dateStr: string, days: number): boolean {
  if (!dateStr || !dateStr.includes("/")) return false;
  const parts = dateStr.split("/");
  if (parts.length < 2) return false;
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  if (isNaN(day) || isNaN(month)) return false;

  const today = new Date();
  const bdayKey = month * 100 + day;
  for (let offset = 0; offset <= days; offset++) {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    const checkKey = (d.getMonth() + 1) * 100 + d.getDate();
    if (bdayKey === checkKey) return true;
  }
  return false;
}

// "DD/MM/YYYY" → "YYYYMMDD" so events sort chronologically as plain strings.
function dateSortKey(dateStr: string): string {
  const [d, m, y] = dateStr.split("/");
  if (!d || !m || !y) return "00000000";
  return `${y.padStart(4, "0")}${m.padStart(2, "0")}${d.padStart(2, "0")}`;
}

function formatShortDate(dateStr: string): string {
  const parts = dateStr.split("/");
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : dateStr;
}

type Section = "upcoming" | "birthday" | "donor";

interface TickerChip {
  key: string;
  section: Section;
  label: string;
  date?: string;
  highlight?: boolean;
}

interface TickerGroup {
  title: string;
  icon: React.ReactNode;
  items: TickerChip[];
}

const SECTION_STYLE: Record<Section, string> = {
  upcoming: "bg-red-500/15 text-red-200 ring-1 ring-inset ring-red-400/30",
  birthday: "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  donor: "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-400/30",
};

export function BirthdayBanner({ members, events, recentDonations = [] }: BirthdayBannerProps) {
  const groups = useMemo<TickerGroup[]>(() => {
    const result: TickerGroup[] = [];

    // `events` is expected to already be upcoming-only (the page ticks a
    // live clock and re-filters it every second), so just sort here.
    const upcoming = [...events].sort((a, b) => dateSortKey(a.date).localeCompare(dateSortKey(b.date)));
    if (upcoming.length > 0) {
      result.push({
        title: "Sự kiện sắp tới",
        icon: <Calendar className="size-3.5" />,
        items: upcoming.map((e) => ({
          key: e.id,
          section: "upcoming",
          label: e.title,
          date: e.date,
          highlight: e.title.includes("Sinh nhật CLB"),
        })),
      });
    }

    const bdays = members.filter((m) => m.birthday && isWithinNextDays(m.birthday, 7));
    if (bdays.length > 0) {
      result.push({
        title: "Sinh nhật thành viên sắp tới",
        icon: <PartyPopper className="size-3.5" />,
        items: bdays.map((m) => ({ key: m.id, section: "birthday", label: m.name, date: m.birthday! })),
      });
    }

    if (SHOW_DONORS && recentDonations.length > 0) {
      const top5 = recentDonations.slice(0, 5);
      result.push({
        title: "5 nhà tài trợ gần đây nhất",
        icon: <Heart className="size-3.5" />,
        items: top5.map((d) => ({ key: d.id, section: "donor", label: d.name, date: d.date })),
      });
    }

    return result;
  }, [members, events, recentDonations]);

  // Measure the track once rendered so the scroll speed stays constant
  // (~70px/s) regardless of how much content is in it, instead of a fixed
  // duration that crawls when there's little content or races when there's a lot.
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(28);
  useEffect(() => {
    if (trackRef.current) {
      const width = trackRef.current.scrollWidth;
      setDuration(Math.max(18, Math.round(width / 70)));
    }
  }, [groups]);

  if (groups.length === 0) return null;

  const renderChips = (copyKey: string) =>
    groups.flatMap((group, gi) => [
      <span
        key={`${copyKey}-title-${gi}`}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-goda-yellow text-goda-navy text-[11px] font-extrabold uppercase tracking-wider shrink-0"
      >
        {group.icon}
        {group.title}
      </span>,
      ...group.items.map((item, ii) => (
        <span
          key={`${copyKey}-item-${gi}-${ii}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold shrink-0 transition-transform hover:scale-105 ${
            item.highlight
              ? "bg-gradient-to-r from-goda-yellow to-amber-400 text-goda-navy ring-1 ring-inset ring-goda-yellow/60 animate-pulse"
              : SECTION_STYLE[item.section]
          }`}
        >
          {item.label}
          {item.date && <span className="opacity-70 font-normal">{formatShortDate(item.date)}</span>}
        </span>
      )),
    ]);

  return (
    <div className="gd-ticker relative bg-goda-navy border-y border-goda-yellow/40 overflow-hidden">
      {/* Edge fades so chips don't hard-cut at the viewport edge */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-goda-navy to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-goda-navy to-transparent z-10" />

      <div className="flex py-2.5">
        <div ref={trackRef} className="gd-ticker-track flex items-center gap-2.5 shrink-0" style={{ animationDuration: `${duration}s` }}>
          {renderChips("a")}
          <span className="w-8 shrink-0" />
        </div>
        <div aria-hidden className="gd-ticker-track flex items-center gap-2.5 shrink-0" style={{ animationDuration: `${duration}s` }}>
          {renderChips("b")}
          <span className="w-8 shrink-0" />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .gd-ticker-track {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .gd-ticker:hover .gd-ticker-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .gd-ticker-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

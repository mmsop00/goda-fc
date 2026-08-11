"use client";

import { useMemo } from "react";
import type { MemberPublic, UpcomingEvent, RecentDonation } from "@/lib/mock-data";

interface BirthdayBannerProps {
  members: MemberPublic[];
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

export function BirthdayBanner({ members, events, recentDonations = [] }: BirthdayBannerProps) {
  const tickerItems = useMemo(() => {
    const items: { label: string; date: string; section: "event" | "birthday" | "donor" | "header" }[] = [];

    // All club events
    if (events.length > 0) {
      items.push({ label: "── SỰ KIỆN SẮP TỚI ──", date: "", section: "header" });
      events.forEach((e) => {
        items.push({ label: `📅 ${e.title}`, date: e.date, section: "event" });
      });
    }

    // Birthdays within 7 days
    const bdays = members.filter((m) => m.birthday && isWithinNextDays(m.birthday, 7));
    if (bdays.length > 0) {
      items.push({ label: "── SINH NHẬT THÀNH VIÊN SẮP TỚI ──", date: "", section: "header" });
      bdays.forEach((m) => {
        items.push({ label: `🎂 ${m.name}`, date: m.birthday!, section: "birthday" });
      });
    }

    // Top 5 recent donations
    const top5 = recentDonations.slice(0, 5);
    if (top5.length > 0) {
      items.push({ label: "── 5 NGƯỜI TÀI TRỢ GẦN ĐÂY NHẤT ──", date: "", section: "header" });
      top5.forEach((d) => {
        items.push({ label: `💛 ${d.name}`, date: d.date, section: "donor" });
      });
    }

    return items;
  }, [members, events, recentDonations]);

  if (tickerItems.length === 0) return null;

  // Color by section
  const sectionColor: Record<string, string> = {
    header: "text-goda-navy font-extrabold",
    event: "text-red-600 font-bold",
    birthday: "text-goda-green",
    donor: "text-amber-600",
  };

  // Check if an event title contains "Sinh nhật CLB"
  const isClubBirthday = (label: string) => label.includes("Sinh nhật CLB");

  // Build JSX segments
  const renderTicker = () => {
    const result: React.ReactNode[] = [];
    tickerItems.forEach((item, i) => {
      if (i > 0) {
        // Add gap before headers
        if (item.section === "header") {
          result.push(<span key={`gap-${i}`} className="px-8" />);
        } else {
          result.push(<span key={`dot-${i}`} className="px-1.5">•</span>);
        }
      }
      const dateStr = item.date
        ? (() => {
            const parts = item.date.split("/");
            return parts.length >= 2 ? `(${parts[0]}/${parts[1]})` : `(${item.date})`;
          })()
        : "";
      result.push(
        <span key={i} className={isClubBirthday(item.label) ? "text-red-600 font-extrabold text-base" : (sectionColor[item.section] || "text-goda-navy")}>
          {item.label} <span className="text-xs opacity-70">{dateStr}</span>
        </span>
      );
    });
    return result;
  };

  const tickerContent = renderTicker();

  return (
    <div className="bg-gradient-to-r from-goda-yellow/25 via-goda-yellow/15 to-goda-yellow/25 border-b-2 border-goda-yellow overflow-hidden">
      <div className="py-2.5 flex">
        <div className="animate-marquee whitespace-nowrap text-sm md:text-base font-bold flex shrink-0">
          {tickerContent}
          <span className="px-10" />
        </div>
        <div className="animate-marquee whitespace-nowrap text-sm md:text-base font-bold flex shrink-0">
          {tickerContent}
          <span className="px-10" />
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}


"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MemberPublic } from "@/lib/mock-data";

interface MemberCardProps {
  member?: MemberPublic;
  isLoading?: boolean;
}

const POSITION_CODE: Record<string, string> = {
  "Thủ môn": "TM",
  "Hậu vệ": "HV",
  "Tiền vệ": "TV",
  "Tiền đạo": "TĐ",
};

/** Hue (màu chủ đạo) theo vị trí: TM vàng, HV xanh dương, TV xanh lục, TĐ cam. */
const POSITION_HUE: Record<string, number> = {
  "Thủ môn": 45,
  "Hậu vệ": 210,
  "Tiền vệ": 150,
  "Tiền đạo": 20,
};

/** Càng OVR cao, màu thẻ càng sáng và glow càng mạnh. */
function brightnessByOvr(ovr: number) {
  if (ovr >= 70) {
    return { stripL: [84, 66, 54], bodyL: 88, glowA: 0.6, shineA: 0.3 };
  }
  if (ovr >= 55) {
    return { stripL: [76, 58, 46], bodyL: 80, glowA: 0.35, shineA: 0.18 };
  }
  return { stripL: [66, 50, 40], bodyL: 72, glowA: 0.2, shineA: 0.1 };
}

/** Cờ Việt Nam (SVG nội tuyến — không cần tải từ mạng). */
function VnFlag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 600"
      className={`shrink-0 rounded-[2px] ring-1 ring-black/10 ${className}`}
      aria-label="Quốc tịch Việt Nam"
    >
      <rect width="900" height="600" fill="#DA251D" />
      <path
        fill="#FFFF00"
        d="M450 140 L482.5 246 L594 246 L502.5 310 L536.5 416 L450 352 L363.5 416 L397.5 310 L306 246 L417.5 246 Z"
      />
    </svg>
  );
}

function clamp(n: number, min = 0, max = 99): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/**
 * Chỉ số (thang 0–99) dựa trên dữ liệu thật:
 * - TẤN CÔNG: nền theo vị trí + bàn thắng + kiến tạo
 * - PHÒNG THỦ: nền theo vị trí + kinh nghiệm (số trận)
 * - BIA: chỉ số vui — thâm niên (số trận) + MVP
 * OVR = trung bình cộng 3 chỉ số.
 */
function computeStats(member: MemberPublic) {
  const posAtk =
    member.position === "Tiền đạo"
      ? 70
      : member.position === "Tiền vệ"
        ? 60
        : member.position === "Hậu vệ"
          ? 50
          : 32;
  const posDef =
    member.position === "Hậu vệ"
      ? 75
      : member.position === "Thủ môn"
        ? 72
        : member.position === "Tiền vệ"
          ? 56
          : 42;

  const atk = clamp(
    Math.round(posAtk + Math.min(28, member.goals * 0.4) + Math.min(8, member.assists * 0.15))
  );
  const def = clamp(Math.round(posDef + Math.min(22, member.matches * 0.05)));
  const bia = clamp(
    Math.round(40 + Math.min(25, member.matches * 0.05) + Math.min(18, member.mvp * 1.5))
  );
  const ovr = Math.round((atk + def + bia) / 3);

  return { atk, def, bia, ovr };
}

/** Tag riêng cho từng thẻ — ai cũng có một tag. */
function getTag(
  member: MemberPublic,
  stats: { atk: number; def: number; bia: number; ovr: number }
): string {
  if (member.status === "Đội trưởng") return "Captain";
  if (member.status === "Đội phó") return "Deputy";
  if (stats.ovr >= 70) return "★ Rare";
  if (member.goals >= 50) return "🔥 Hot";
  if (member.assists >= 40) return "Playmaker";
  if (member.mvp >= 40) return "Star";
  if (stats.def >= 80) return "🧱 Wall";
  if (stats.atk >= 85) return "⚡ Sharp";
  if (stats.bia >= 65) return "🍺 Beer King";
  if (member.matches >= 180) return "Legend";
  if ((member.joinYear ?? 0) >= 2024) return "Rising Star";
  if (member.matches <= 10) return "Rookie";
  return "Reliable";
}

export function MemberCard({ member, isLoading }: MemberCardProps) {
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[230px]">
        <Skeleton className="h-[380px] w-full" />
      </div>
    );
  }

  if (!member) return null;

  const { atk, def, bia, ovr } = computeStats(member);
  const tag = getTag(member, { atk, def, bia, ovr });
  const hue = POSITION_HUE[member.position] ?? 210;
  const b = brightnessByOvr(ovr);
  const posCode = POSITION_CODE[member.position] ?? "";
  const isCaptain = member.status === "Đội trưởng";
  const isViceCaptain = member.status === "Đội phó";
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="group relative mx-auto w-full max-w-[230px] select-none">
      <div
        className="relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-1.5"
        style={{
          clipPath: "polygon(0 0, 90% 0, 100% 7%, 100% 100%, 0 100%)",
          boxShadow: `0 12px 32px -12px hsla(${hue}, 70%, 40%, ${b.glowA})`,
        }}
      >
        {/* ── Top strip: OVR + vị trí + cờ VN | club crest + tag ── */}
        <div
          className="flex min-h-[78px] items-start justify-between px-3 pt-3 pb-2.5"
          style={{
            background: `linear-gradient(180deg, hsl(${hue} 90% ${b.stripL[0]}%) 0%, hsl(${hue} 65% ${b.stripL[1]}%) 55%, hsl(${hue} 55% ${b.stripL[2]}%) 100%)`,
          }}
        >
          <div>
            <p
              className="text-4xl font-black leading-none tracking-tight"
              style={{ color: `hsl(${hue} 50% 26%)` }}
            >
              {ovr}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/90 drop-shadow">
                {posCode}
              </p>
              <VnFlag className="size-3.5" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-end gap-1.5 self-stretch pb-0.5">
            {/* Club crest */}
            <div className="flex size-9 items-center justify-center rounded-full border-2 border-white/70 bg-goda-navy shadow-md">
              <span className="text-[9px] font-black tracking-tight text-goda-yellow">
                GODA
              </span>
            </div>
            {/* Tag riêng cho từng thẻ */}
            <span className="rounded bg-black/25 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-sm">
              {tag}
            </span>
          </div>
        </div>

        {/* ── Photo area ── */}
        <div className="relative h-52 overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#1e3a5f_0%,#0B1E3A_70%)]">
          {member.avatarUrl && !imageFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.avatarUrl}
              alt={member.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover object-top opacity-95"
            />
          )}
          {/* Shine — càng OVR cao càng bóng */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(115deg, transparent 35%, hsla(0 0% 100% / ${b.shineA}) 50%, transparent 65%)`,
            }}
          />
          {/* Captain armband */}
          {(isCaptain || isViceCaptain) && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-goda-yellow px-1.5 py-0.5 text-[10px] font-black text-goda-navy shadow">
              C
            </div>
          )}
        </div>

        {/* ── Name + shirt number ── */}
        <div className="flex items-end justify-between gap-2 bg-white/85 px-3 py-2 backdrop-blur-sm">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-extrabold leading-tight text-goda-navy">
              {member.name}
            </p>
            {member.nickname && (
              <p className="truncate text-[10px] text-gray-500">
                &ldquo;{member.nickname}&rdquo;
              </p>
            )}
          </div>
          <span className="shrink-0 text-2xl font-black text-goda-navy/85">
            {member.number > 0 ? member.number : "–"}
          </span>
        </div>

        {/* ── Chỉ số FIFA: Tấn công / Phòng thủ / Bia ── */}
        <div
          className="grid grid-cols-3 divide-x divide-black/10 border-t border-black/10"
          style={{
            background: `linear-gradient(180deg, hsl(${hue} 70% 96%) 0%, hsl(${hue} 45% ${b.bodyL}%) 100%)`,
          }}
        >
          {(
            [
              ["Tấn công", atk],
              ["Phòng thủ", def],
              ["Bia", bia],
            ] as [string, number][]
          ).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center gap-0.5 py-2">
              <span
                className="text-xl font-black leading-none"
                style={{ color: `hsl(${hue} 50% 28%)` }}
              >
                {value}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Thống kê (giữ nguyên như thẻ cũ) ── */}
        <div
          className="px-3 pb-3 pt-2.5"
          style={{
            background: `linear-gradient(180deg, hsl(${hue} 70% 96%) 0%, hsl(${hue} 45% ${b.bodyL}%) 100%)`,
          }}
        >
          <div className="grid grid-cols-4 gap-1 border-t border-black/10 pt-2 text-center">
            <div>
              <span className="block text-sm font-black text-goda-navy">{member.matches}</span>
              <span className="text-[10px] font-semibold text-gray-500">Trận</span>
            </div>
            <div>
              <span className="block text-sm font-black text-goda-navy">{member.goals}</span>
              <span className="text-[10px] font-semibold text-gray-500">Bàn</span>
            </div>
            <div>
              <span className="block text-sm font-black text-goda-navy">{member.assists}</span>
              <span className="text-[10px] font-semibold text-gray-500">K.tạo</span>
            </div>
            <div>
              <span className="block text-sm font-black text-goda-yellow">{member.mvp}</span>
              <span className="text-[10px] font-semibold text-gray-500">MVP</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[10px] font-medium text-gray-500">
            {member.birthday && <span>🎂 {member.birthday}</span>}
            <span>
              Tham gia:{" "}
              {member.joinDate
                ? member.joinDate
                : member.joinYear && member.joinYear > 0
                  ? member.joinYear
                  : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Role badge below card ── */}
      {member.status && member.status !== "Đang thi đấu" && (
        <div className="mt-2 flex justify-center">
          <span
            className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${isCaptain
              ? "bg-goda-yellow text-goda-navy"
              : "bg-goda-navy text-white"
              }`}
          >
            {member.status}
          </span>
        </div>
      )}
    </div>
  );
}

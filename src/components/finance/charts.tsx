"use client";

// Biểu đồ báo cáo tài chính — SVG tự vẽ, không thêm thư viện.
// Quy ước (theo hướng dẫn dataviz): Thu = xanh, Chi = cam ở MỌI biểu đồ; cột
// ≤ 24px, bo 4px đầu cột, vuông ở gốc; lưới 1px nhạt; có legend + tooltip;
// chữ luôn dùng màu chữ, không dùng màu dữ liệu.

import { useEffect, useRef, useState } from "react";
import { formatCompactVnd, formatVnd } from "@/lib/finance/format";

export const COLORS = {
  thu: "#2a78d6",
  chi: "#eb6834",
  pending: "#86b6ef",
  track: "#e3eefc",
  grid: "#e1e0d9",
  axis: "#c3c2b7",
  muted: "#898781",
  surface: "#ffffff",
};

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceStep(raw: number) {
  if (raw <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
}

/** Vạch chia trục tròn số, luôn gồm 0. */
function niceTicks(lo: number, hi: number, count = 4) {
  lo = Math.min(0, lo);
  hi = Math.max(0, hi);
  if (hi === lo) hi = lo + 1_000_000;
  const step = niceStep((hi - lo) / count);
  const start = Math.floor(lo / step) * step;
  const end = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v));
  return ticks;
}

/** Cột bo 4px ở đầu (xa gốc), vuông ở gốc 0. */
function barPath(x: number, yTop: number, w: number, yBase: number) {
  const h = yBase - yTop;
  if (Math.abs(h) < 0.5) return "";
  const r = Math.min(4, w / 2, Math.abs(h));
  if (h > 0) {
    return `M${x},${yBase}V${yTop + r}Q${x},${yTop} ${x + r},${yTop}H${x + w - r}Q${x + w},${yTop} ${x + w},${yTop + r}V${yBase}Z`;
  }
  return `M${x},${yBase}V${yTop - r}Q${x},${yTop} ${x + r},${yTop}H${x + w - r}Q${x + w},${yTop} ${x + w},${yTop - r}V${yBase}Z`;
}

export function Legend({ items }: { items: { label: string; color: string; shape?: "rect" | "line" }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          {it.shape === "line" ? (
            <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: it.color }} />
          ) : (
            <span className="inline-block size-2.5 rounded-[3px]" style={{ background: it.color }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}

interface TooltipRow {
  label: string;
  value: string;
  color?: string;
}

/** Số liệu đậm đứng trước, tên chuỗi nhạt đứng sau; khoá màu là 1 vạch ngắn. */
function Tooltip({ x, width, title, rows }: { x: number; width: number; title: string; rows: TooltipRow[] }) {
  const w = 176;
  const left = Math.max(0, Math.min(width - w, x - w / 2));
  return (
    <div
      className="pointer-events-none absolute top-0 z-10 rounded-lg bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-black/10"
      style={{ left, width: w }}
      role="status"
    >
      <p className="mb-1 text-gray-500">{title}</p>
      {rows.map((r) => (
        <p key={r.label} className="flex items-center gap-2">
          {r.color ? (
            <span className="inline-block h-0.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} />
          ) : (
            <span className="inline-block w-2.5 shrink-0" />
          )}
          <strong className="font-semibold text-gray-900 tabular-nums">{r.value}</strong>
          <span className="text-gray-500">{r.label}</span>
        </p>
      ))}
    </div>
  );
}

export interface MonthPoint {
  key: string; // YYYY-MM
  label: string; // "T10"
  title: string; // "Tháng 10/2026"
  thu: number;
  chi: number;
  balance: number; // số dư cuối tháng
}

const PAD = { top: 12, right: 12, bottom: 24, left: 46 };
const PLOT_H = 190;

function YAxis({ ticks, y, width }: { ticks: number[]; y: (v: number) => number; width: number }) {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={PAD.left}
            x2={width - PAD.right}
            y1={y(t)}
            y2={y(t)}
            stroke={t === 0 ? COLORS.axis : COLORS.grid}
            strokeWidth={1}
            shapeRendering="crispEdges"
          />
          <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={COLORS.muted} className="tabular-nums">
            {formatCompactVnd(t)}
          </text>
        </g>
      ))}
    </g>
  );
}

function XLabels({ data, cx, active }: { data: MonthPoint[]; cx: (i: number) => number; active: number | null }) {
  const every = data.length > 12 ? Math.ceil(data.length / 12) : 1;
  return (
    <g>
      {data.map((d, i) =>
        i % every === 0 || i === active ? (
          <text
            key={d.key}
            x={cx(i)}
            y={PAD.top + PLOT_H + 17}
            textAnchor="middle"
            fontSize={11}
            fill={i === active ? "#0b0b0b" : COLORS.muted}
            fontWeight={i === active ? 600 : 400}
          >
            {d.label}
          </text>
        ) : null
      )}
    </g>
  );
}

/** Cột đôi Thu/Chi theo tháng. Rê chuột (hoặc Tab) vào cả cột tháng để xem số. */
export function MonthlyCashflowChart({ data }: { data: MonthPoint[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const height = PAD.top + PLOT_H + PAD.bottom;
  const ticks = niceTicks(0, Math.max(...data.map((d) => Math.max(d.thu, d.chi)), 0));
  const [lo, hi] = [ticks[0], ticks[ticks.length - 1]];
  const y = (v: number) => PAD.top + PLOT_H - ((v - lo) / (hi - lo)) * PLOT_H;
  const band = width > 0 ? (width - PAD.left - PAD.right) / data.length : 0;
  const barW = Math.max(3, Math.min(24, (band - 8) / 2));
  const cx = (i: number) => PAD.left + band * i + band / 2;

  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Biểu đồ thu chi theo tháng">
          <YAxis ticks={ticks} y={y} width={width} />
          {active !== null && (
            <rect x={PAD.left + band * active} y={PAD.top} width={band} height={PLOT_H} fill="#0b0b0b" opacity={0.04} rx={4} />
          )}
          {data.map((d, i) => (
            <g key={d.key}>
              <path d={barPath(cx(i) - barW - 1, y(d.thu), barW, y(0))} fill={COLORS.thu} />
              <path d={barPath(cx(i) + 1, y(d.chi), barW, y(0))} fill={COLORS.chi} />
              <rect
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={PLOT_H}
                fill="transparent"
                tabIndex={0}
                aria-label={`${d.title}: thu ${formatVnd(d.thu)}, chi ${formatVnd(d.chi)}`}
                className="outline-none"
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            </g>
          ))}
          <XLabels data={data} cx={cx} active={active} />
        </svg>
      )}
      {active !== null && (
        <Tooltip
          x={cx(active)}
          width={width}
          title={data[active].title}
          rows={[
            { label: "Thu", value: formatVnd(data[active].thu), color: COLORS.thu },
            { label: "Chi", value: formatVnd(data[active].chi), color: COLORS.chi },
            { label: "Chênh lệch", value: formatVnd(data[active].thu - data[active].chi) },
          ]}
        />
      )}
    </div>
  );
}

/** Đường số dư cuối mỗi tháng, có vạch dò theo tháng (crosshair). */
export function BalanceChart({ data }: { data: MonthPoint[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const height = PAD.top + PLOT_H + PAD.bottom;
  const values = data.map((d) => d.balance);
  const ticks = niceTicks(Math.min(...values, 0), Math.max(...values, 0));
  const [lo, hi] = [ticks[0], ticks[ticks.length - 1]];
  const y = (v: number) => PAD.top + PLOT_H - ((v - lo) / (hi - lo)) * PLOT_H;
  const band = width > 0 ? (width - PAD.left - PAD.right) / data.length : 0;
  const cx = (i: number) => PAD.left + band * i + band / 2;

  const line = data.map((d, i) => `${i ? "L" : "M"}${cx(i)},${y(d.balance)}`).join("");
  const area = data.length ? `${line}L${cx(data.length - 1)},${y(0)}L${cx(0)},${y(0)}Z` : "";
  const last = data.length - 1;
  const shown = active ?? last;

  function pick(clientX: number, rect: DOMRect) {
    const i = Math.round((clientX - rect.left - PAD.left - band / 2) / band);
    setActive(Math.max(0, Math.min(last, i)));
  }

  return (
    <div ref={ref} className="relative">
      {width > 0 && data.length > 0 && (
        <svg width={width} height={height} role="img" aria-label="Biểu đồ số dư quỹ cuối mỗi tháng">
          <YAxis ticks={ticks} y={y} width={width} />
          <path d={area} fill={COLORS.thu} opacity={0.1} />
          <path d={line} fill="none" stroke={COLORS.thu} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {active !== null && (
            <line x1={cx(active)} x2={cx(active)} y1={PAD.top} y2={PAD.top + PLOT_H} stroke={COLORS.axis} strokeWidth={1} />
          )}
          <circle cx={cx(shown)} cy={y(data[shown].balance)} r={4} fill={COLORS.thu} stroke={COLORS.surface} strokeWidth={2} />
          {active === null && (
            <text
              x={cx(last) - 8}
              // Đường đi xuống tới điểm cuối → đặt nhãn phía dưới để không đè lên đường
              y={y(data[last].balance) + (last > 0 && data[last - 1].balance > data[last].balance ? 18 : -10)}
              textAnchor="end"
              fontSize={12}
              fontWeight={600}
              fill="#0b0b0b"
            >
              {formatCompactVnd(data[last].balance)}
            </text>
          )}
          <XLabels data={data} cx={cx} active={active} />
          <rect
            x={PAD.left}
            y={PAD.top}
            width={Math.max(0, width - PAD.left - PAD.right)}
            height={PLOT_H}
            fill="transparent"
            tabIndex={0}
            aria-label="Số dư theo tháng — dùng phím mũi tên để xem từng tháng"
            className="outline-none"
            onPointerMove={(e) => pick(e.clientX, e.currentTarget.ownerSVGElement!.getBoundingClientRect())}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(last)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? last) - 1));
              if (e.key === "ArrowRight") setActive((a) => Math.min(last, (a ?? last) + 1));
            }}
          />
        </svg>
      )}
      {active !== null && (
        <Tooltip
          x={cx(active)}
          width={width}
          title={`Cuối ${data[active].title.toLowerCase()}`}
          rows={[{ label: "Số dư", value: formatVnd(data[active].balance), color: COLORS.thu }]}
        />
      )}
    </div>
  );
}

/** Cột ngang theo hạng mục, 1 màu (màu của Thu hoặc Chi), số ở đầu cột. */
export function CategoryBars({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = Math.max(...data.map((d) => d.value), 1);
  if (data.length === 0) return <p className="py-6 text-center text-sm text-gray-400">Chưa có số liệu</p>;
  return (
    <ul className="space-y-2.5">
      {data.map((d, i) => (
        <li
          key={d.label}
          tabIndex={0}
          className="relative grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-goda-navy/30"
          onPointerEnter={() => setActive(i)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
        >
          <span className="truncate text-xs text-gray-600" title={d.label}>
            {d.label}
          </span>
          <span className="flex items-center gap-2">
            <span
              className="h-3.5 rounded-r-[4px] transition-opacity"
              style={{
                width: `max(3px, calc((100% - 4.5rem) * ${d.value / max}))`,
                background: color,
                opacity: active === null || active === i ? 1 : 0.55,
              }}
            />
            <span className="text-xs font-medium text-gray-800 tabular-nums whitespace-nowrap">{formatCompactVnd(d.value)}</span>
          </span>
          {active === i && (
            <span className="pointer-events-none absolute -top-9 right-0 z-10 rounded-lg bg-white px-3 py-1.5 text-xs shadow-lg ring-1 ring-black/10 whitespace-nowrap">
              <strong className="font-semibold text-gray-900">{formatVnd(d.value)}</strong>{" "}
              <span className="text-gray-500">· {Math.round((d.value / total) * 100)}%</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Thanh tiến độ thu: đã thu (xanh đậm) + chờ duyệt (xanh nhạt) trên nền cùng tông. */
export function ProgressMeter({ expected, collected, pending }: { expected: number; collected: number; pending: number }) {
  const pct = (v: number) => (expected > 0 ? (v / expected) * 100 : 0);
  return (
    <div
      className="flex h-2.5 w-full overflow-hidden rounded-full"
      style={{ background: COLORS.track }}
      role="img"
      aria-label={`Đã thu ${formatVnd(collected)}, chờ duyệt ${formatVnd(pending)}, trên tổng ${formatVnd(expected)}`}
    >
      {collected > 0 && (
        <span
          className="h-full"
          style={{
            width: `${pct(collected)}%`,
            background: COLORS.thu,
            // Khe 2px màu nền giữa 2 đoạn liền nhau
            borderRight: pending > 0 || collected < expected ? `2px solid ${COLORS.surface}` : undefined,
          }}
        />
      )}
      {pending > 0 && (
        <span
          className="h-full"
          style={{
            width: `${pct(pending)}%`,
            background: COLORS.pending,
            borderRight: collected + pending < expected ? `2px solid ${COLORS.surface}` : undefined,
          }}
        />
      )}
    </div>
  );
}

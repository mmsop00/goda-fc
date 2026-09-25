"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIsoDate, formatVnd } from "@/lib/finance/format";
import {
  BalanceChart,
  CategoryBars,
  COLORS,
  Legend,
  MonthlyCashflowChart,
  ProgressMeter,
  type MonthPoint,
} from "@/components/finance/charts";
import type { FinanceReport, LedgerRow } from "@/lib/finance/report";


const selectClass =
  "h-8 rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const currentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

function nextMonth(key: string) {
  const [y, m] = key.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}

/** Các tháng của kỳ đang xem, kèm thu/chi trong tháng và số dư cuối tháng (tính từ đầu). */
function buildMonths(ledger: LedgerRow[], year: string): MonthPoint[] {
  const nowKey = currentMonthKey();
  let from: string;
  let to: string;
  if (year === "all") {
    const first = ledger.reduce((min, r) => (r.date.slice(0, 7) < min ? r.date.slice(0, 7) : min), nowKey);
    from = first;
    to = nowKey;
  } else {
    from = `${year}-01`;
    to = year === nowKey.slice(0, 4) ? nowKey : `${year}-12`;
  }
  const byMonth = new Map<string, { thu: number; chi: number }>();
  for (const r of ledger) {
    const k = r.date.slice(0, 7);
    const m = byMonth.get(k) ?? { thu: 0, chi: 0 };
    m[r.direction] += r.amount;
    byMonth.set(k, m);
  }
  let running = 0;
  for (const [k, m] of byMonth) if (k < from) running += m.thu - m.chi;

  const out: MonthPoint[] = [];
  for (let k = from; k <= to; k = nextMonth(k)) {
    const m = byMonth.get(k) ?? { thu: 0, chi: 0 };
    running += m.thu - m.chi;
    const [y, mm] = k.split("-");
    out.push({ key: k, label: `T${Number(mm)}`, title: `Tháng ${Number(mm)}/${y}`, thu: m.thu, chi: m.chi, balance: running });
  }
  return out;
}

function groupBy(rows: LedgerRow[]) {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.categoryLabel, (map.get(r.categoryLabel) ?? 0) + r.amount);
  return [...map].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card size="sm">
      <CardContent>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="inline-flex rounded-lg bg-white p-0.5 ring-1 ring-black/10">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === v ? "bg-goda-navy text-white" : "text-gray-600 hover:text-goda-navy"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Tổng quan ─────────────────────────────────────────
export function Overview({ report }: { report: FinanceReport }) {
  const years = useMemo(() => {
    const set = new Set([currentMonthKey().slice(0, 4)]);
    for (const r of report.ledger) set.add(r.date.slice(0, 4));
    for (const b of report.bills) set.add(b.createdAt.slice(0, 4));
    return [...set].sort().reverse();
  }, [report]);
  const [year, setYear] = useState(years[0]);
  const [showTable, setShowTable] = useState(false);
  const [showAllBills, setShowAllBills] = useState(false);

  const inPeriod = (date: string) => year === "all" || date.startsWith(year);
  const rows = report.ledger.filter((r) => inPeriod(r.date));
  const thu = rows.filter((r) => r.direction === "thu");
  const chi = rows.filter((r) => r.direction === "chi");
  const totalThu = thu.reduce((s, r) => s + r.amount, 0);
  const totalChi = chi.reduce((s, r) => s + r.amount, 0);
  const months = buildMonths(report.ledger, year);
  const bills = report.bills.filter((b) => inPeriod(b.createdAt));
  const periodLabel = year === "all" ? "từ trước tới nay" : `năm ${year}`;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Số dư quỹ hiện tại</p>
            <p className="mt-1 text-5xl font-semibold tracking-tight text-goda-navy">{formatVnd(report.balance)}</p>
          </div>
          <div className="text-sm text-gray-600 space-y-0.5 sm:text-right">
            <p>
              Còn phải thu: <strong className="text-gray-900">{formatVnd(report.outstanding.chuaDong)}</strong>
            </p>
            <p>
              Đang chờ duyệt: <strong className="text-gray-900">{formatVnd(report.outstanding.choDuyet)}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bộ lọc kỳ — áp dụng cho mọi số liệu & biểu đồ bên dưới */}
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="period" className="text-sm text-gray-600">
          Kỳ báo cáo
        </label>
        <select id="period" value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
          {years.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
          <option value="all">Tất cả thời gian</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile label={`Tổng thu ${periodLabel}`} value={formatVnd(totalThu)} hint={`${thu.length} lượt thu`} />
        <StatTile label={`Tổng chi ${periodLabel}`} value={formatVnd(totalChi)} hint={`${chi.length} khoản chi`} />
        <StatTile label="Chênh lệch thu − chi" value={formatVnd(totalThu - totalChi)} />
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>Thu chi theo tháng</CardTitle>
          <Legend
            items={[
              { label: "Thu", color: COLORS.thu },
              { label: "Chi", color: COLORS.chi },
            ]}
          />
        </CardHeader>
        <CardContent>
          <MonthlyCashflowChart data={months} />
          <button type="button" onClick={() => setShowTable((v) => !v)} className="mt-2 text-xs text-goda-navy underline">
            {showTable ? "Ẩn bảng số liệu" : "Xem dạng bảng"}
          </button>
          {showTable && (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-border text-left text-gray-500">
                    <th className="py-1.5 pr-2 font-medium">Tháng</th>
                    <th className="py-1.5 px-2 text-right font-medium">Thu</th>
                    <th className="py-1.5 px-2 text-right font-medium">Chi</th>
                    <th className="py-1.5 pl-2 text-right font-medium">Số dư cuối tháng</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((m) => (
                    <tr key={m.key} className="border-b border-border/50">
                      <td className="py-1.5 pr-2">{m.title}</td>
                      <td className="py-1.5 px-2 text-right">{formatVnd(m.thu)}</td>
                      <td className="py-1.5 px-2 text-right">{formatVnd(m.chi)}</td>
                      <td className="py-1.5 pl-2 text-right">{formatVnd(m.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Số dư quỹ cuối mỗi tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <BalanceChart data={months} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Chi theo hạng mục</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <CategoryBars data={groupBy(chi)} color={COLORS.chi} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thu theo nguồn</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <CategoryBars data={groupBy(thu)} color={COLORS.thu} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>Tiến độ thu các khoản</CardTitle>
          <Legend
            items={[
              { label: "Đã thu", color: COLORS.thu },
              { label: "Chờ duyệt", color: COLORS.pending },
              { label: "Chưa đóng", color: COLORS.track },
            ]}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {bills.length === 0 && <p className="text-sm text-gray-400">Chưa có khoản thu nào trong kỳ này.</p>}
          {(showAllBills ? bills : bills.slice(0, 5)).map((b) => (
            <div key={b.id} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                <p className="font-medium text-gray-900">{b.title}</p>
                <p className="text-gray-600 tabular-nums">
                  <strong className="text-gray-900">{formatVnd(b.collected)}</strong> / {formatVnd(b.expected)}
                </p>
              </div>
              <ProgressMeter expected={b.expected} collected={b.collected} pending={b.pending} />
              <p className="text-xs text-gray-500">
                {b.paidCount}/{b.memberCount} người đã đóng
                {b.dueDate && ` · Hạn ${b.dueDate}`}
              </p>
            </div>
          ))}
          {bills.length > 5 && (
            <button type="button" onClick={() => setShowAllBills((v) => !v)} className="text-xs text-goda-navy underline">
              {showAllBills ? "Thu gọn" : `Xem tất cả ${bills.length} khoản`}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sổ thu chi ────────────────────────────────────────
export function Ledger({ report, isChairman, onDeleted }: { report: FinanceReport; isChairman: boolean; onDeleted: () => void }) {
  const [q, setQ] = useState("");
  const [direction, setDirection] = useState<"all" | "thu" | "chi">("all");
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState("all");
  const [grouped, setGrouped] = useState(true);
  const [limit, setLimit] = useState(40);

  const months = useMemo(() => [...new Set(report.ledger.map((r) => r.date.slice(0, 7)))].sort().reverse(), [report]);
  const categories = useMemo(
    () =>
      [...new Set(report.ledger.filter((r) => direction === "all" || r.direction === direction).map((r) => r.categoryLabel))].sort(),
    [report, direction]
  );

  const needle = q.trim().toLowerCase();
  const rows = report.ledger.filter(
    (r) =>
      (direction === "all" || r.direction === direction) &&
      (category === "all" || r.categoryLabel === category) &&
      (month === "all" || r.date.startsWith(month)) &&
      (!needle || [r.title, r.memberName, r.note, r.categoryLabel].some((s) => s?.toLowerCase().includes(needle)))
  );
  const sumThu = rows.filter((r) => r.direction === "thu").reduce((s, r) => s + r.amount, 0);
  const sumChi = rows.filter((r) => r.direction === "chi").reduce((s, r) => s + r.amount, 0);

  // Gộp tiền thành viên đóng thành 1 dòng mỗi khoản thu (mỗi tháng 20+ dòng giống nhau).
  // Đang tìm theo tên thì bỏ gộp để thấy được từng người.
  const isGrouped = grouped && !needle;
  const display = (() => {
    if (!isGrouped) return rows;
    const groups = new Map<string, LedgerRow & { count: number }>();
    const out: LedgerRow[] = [];
    for (const r of rows) {
      const billId = r.billId;
      if (!billId) {
        out.push(r);
        continue;
      }
      const g = groups.get(billId);
      if (g) {
        g.amount += r.amount;
        g.count++;
        if (r.date > g.date) g.date = r.date;
      } else {
        const ng = { ...r, id: `g:${billId}`, count: 1 };
        groups.set(billId, ng);
        out.push(ng);
      }
    }
    for (const g of groups.values()) g.memberName = `${g.count} người đóng`;
    return out.sort((a, b) => b.date.localeCompare(a.date));
  })();

  async function remove(r: LedgerRow) {
    if (!confirm(`Xoá "${r.title}" (${formatVnd(r.amount)}) khỏi sổ quỹ?`)) return;
    const res = await fetch(`/api/finance/entries/${r.id}`, { method: "DELETE" });
    if (res.ok) onDeleted();
    else alert("Không xoá được, vui lòng thử lại");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm tên, nội dung..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${selectClass} w-full pl-8`}
          />
        </div>
        <select
          aria-label="Loại"
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value as typeof direction);
            setCategory("all");
          }}
          className={selectClass}
        >
          <option value="all">Thu & chi</option>
          <option value="thu">Chỉ thu</option>
          <option value="chi">Chỉ chi</option>
        </select>
        <select aria-label="Hạng mục" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="all">Mọi hạng mục</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select aria-label="Tháng" value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
          <option value="all">Mọi tháng</option>
          {months.map((m) => (
            <option key={m} value={m}>
              Tháng {Number(m.slice(5))}/{m.slice(0, 4)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600">
          {rows.length} giao dịch · Thu <strong className="text-gray-900">{formatVnd(sumThu)}</strong> · Chi{" "}
          <strong className="text-gray-900">{formatVnd(sumChi)}</strong>
        </p>
        <label className={`flex items-center gap-2 text-sm text-gray-600 ${needle ? "opacity-50" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            className="size-4"
            checked={isGrouped}
            disabled={!!needle}
            onChange={(e) => setGrouped(e.target.checked)}
          />
          Gộp theo khoản thu
        </label>
      </div>

      <Card>
        <CardContent className="px-0">
          {display.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-400">Không có giao dịch phù hợp.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {display.slice(0, limit).map((r) => (
                <li key={r.id} className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-x-3 px-4 py-2.5">
                  <span
                    className={`row-span-2 mt-0.5 flex size-7 items-center justify-center rounded-full ${
                      r.direction === "thu" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                    }`}
                    aria-label={r.direction === "thu" ? "Thu" : "Chi"}
                  >
                    {r.direction === "thu" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                  </span>
                  <p className="text-sm font-medium text-gray-900">
                    {r.title}
                    {r.memberName && <span className="font-normal text-gray-600"> — {r.memberName}</span>}
                  </p>
                  <div className="flex items-start gap-1">
                    <span
                      className={`whitespace-nowrap text-sm font-semibold tabular-nums ${
                        r.direction === "thu" ? "text-[#006300]" : "text-gray-900"
                      }`}
                    >
                      {r.direction === "thu" ? "+" : "−"}
                      {formatVnd(r.amount)}
                    </span>
                    {isChairman &&
                      (r.source === "so_quy" ? (
                        <button
                          type="button"
                          onClick={() => remove(r)}
                          title="Xoá dòng này"
                          className="-mt-0.5 p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : (
                        // Giữ chỗ để cột số tiền thẳng hàng với các dòng có nút xoá
                        <span className="w-6 shrink-0" aria-hidden />
                      ))}
                  </div>
                  {/* Dòng phụ trải qua cả phần dưới số tiền cho đỡ chật trên điện thoại */}
                  <p className="col-span-2 text-xs text-gray-500">
                    {isGrouped && r.source === "dong_quy" ? "Gần nhất " : ""}
                    {formatIsoDate(r.date)} · {r.categoryLabel}
                    {r.note && ` · ${r.note}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      {display.length > limit && (
        <button type="button" onClick={() => setLimit((l) => l + 40)} className="w-full text-sm text-goda-navy underline">
          Xem thêm {Math.min(40, display.length - limit)} dòng
        </button>
      )}
    </div>
  );
}

// ─── Thành viên ────────────────────────────────────────
type MemberFilter = "all" | "no" | "cho" | "du";

export function Members({ report }: { report: FinanceReport }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<MemberFilter>("all");
  const statusOf = (m: FinanceReport["members"][number]): Exclude<MemberFilter, "all"> =>
    m.chuaDong > 0 ? "no" : m.choDuyet > 0 ? "cho" : "du";
  const counts = { no: 0, cho: 0, du: 0 };
  for (const m of report.members) counts[statusOf(m)]++;

  const needle = q.trim().toLowerCase();
  const rows = report.members.filter(
    (m) => (filter === "all" || statusOf(m) === filter) && (!needle || m.name.toLowerCase().includes(needle))
  );
  const total = rows.reduce(
    (s, m) => ({ daDong: s.daDong + m.daDong, choDuyet: s.choDuyet + m.choDuyet, chuaDong: s.chuaDong + m.chuaDong }),
    { daDong: 0, choDuyet: 0, chuaDong: 0 }
  );

  const STATUS = {
    no: { label: "Còn nợ", icon: AlertCircle, cls: "text-[#b42318]" },
    cho: { label: "Chờ duyệt", icon: Clock, cls: "text-[#9a6700]" },
    du: { label: "Đã đủ", icon: CheckCircle2, cls: "text-[#006300]" },
  } as const;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm thành viên..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${selectClass} w-full pl-8`}
          />
        </div>
        <Segmented<MemberFilter>
          value={filter}
          onChange={setFilter}
          options={[
            ["all", `Tất cả ${report.members.length}`],
            ["no", `Còn nợ ${counts.no}`],
            ["cho", `Chờ duyệt ${counts.cho}`],
            ["du", `Đã đủ ${counts.du}`],
          ]}
        />
      </div>

      <Card>
        <CardContent className="overflow-x-auto px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-gray-500">
                <th className="px-4 py-2 font-medium">Thành viên</th>
                <th className="px-3 py-2 text-right font-medium">Đã đóng</th>
                <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">Chờ duyệt</th>
                <th className="px-4 py-2 text-right font-medium">Còn nợ</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((m) => {
                const s = STATUS[statusOf(m)];
                const Icon = s.icon;
                return (
                  <tr key={m.memberId} className="border-b border-border/50">
                    <td className="px-4 py-2">
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className={`flex flex-wrap items-center gap-1 text-xs ${s.cls}`}>
                        <Icon className="size-3.5" />
                        {s.label}
                        {/* Điện thoại ẩn cột "Chờ duyệt" nên hiện số tiền ngay đây */}
                        {statusOf(m) === "cho" && <span className="sm:hidden">· {formatVnd(m.choDuyet)}</span>}
                      </p>
                      {statusOf(m) === "no" && m.choDuyet > 0 && (
                        <p className="text-xs text-gray-500 sm:hidden">Chờ duyệt {formatVnd(m.choDuyet)}</p>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">{m.daDong ? formatVnd(m.daDong) : "—"}</td>
                    <td className="hidden px-3 py-2 text-right sm:table-cell">{m.choDuyet ? formatVnd(m.choDuyet) : "—"}</td>
                    <td className="px-4 py-2 text-right font-medium">{m.chuaDong ? formatVnd(m.chuaDong) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="tabular-nums">
              <tr className="text-gray-900">
                <td className="px-4 py-2 font-semibold">Tổng ({rows.length} người)</td>
                <td className="px-3 py-2 text-right font-semibold">{formatVnd(total.daDong)}</td>
                <td className="hidden px-3 py-2 text-right font-semibold sm:table-cell">{formatVnd(total.choDuyet)}</td>
                <td className="px-4 py-2 text-right font-semibold">{formatVnd(total.chuaDong)}</td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}


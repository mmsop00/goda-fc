"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Search,
  Trash2,
  X,
} from "lucide-react";
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
import type { BillProgress, FinanceReport, ItemStatus, LedgerRow } from "@/lib/finance/report-core";

// ─── Chi tiết khi bấm vào 1 mục ────────────────────────
export type Detail =
  | { kind: "rows"; title: string; rows: LedgerRow[] }
  | { kind: "bill"; billId: string }
  | { kind: "member"; memberId: string };

type OpenDetail = (d: Detail) => void;

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
    from = ledger.reduce((min, r) => (r.date.slice(0, 7) < min ? r.date.slice(0, 7) : min), nowKey);
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

function groupByCategory(rows: LedgerRow[]) {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.categoryLabel, (map.get(r.categoryLabel) ?? 0) + r.amount);
  return [...map].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

type DisplayRow = LedgerRow & { count?: number };

/** Gộp tiền thành viên đóng thành 1 dòng mỗi khoản thu (mỗi tháng 20+ dòng giống nhau). */
function groupMemberPayments(rows: LedgerRow[]): DisplayRow[] {
  const groups = new Map<string, DisplayRow>();
  const out: DisplayRow[] = [];
  for (const r of rows) {
    if (!r.billId) {
      out.push(r);
      continue;
    }
    const g = groups.get(r.billId);
    if (g) {
      g.amount += r.amount;
      g.count = (g.count ?? 1) + 1;
      if (r.date > g.date) g.date = r.date;
    } else {
      const ng: DisplayRow = { ...r, id: `g:${r.billId}`, count: 1 };
      groups.set(r.billId, ng);
      out.push(ng);
    }
  }
  for (const g of groups.values()) g.memberName = `${g.count} người đóng`;
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

const sumOf = (rows: LedgerRow[], dir: "thu" | "chi") => rows.filter((r) => r.direction === dir).reduce((s, r) => s + r.amount, 0);

// ─── Các mảnh giao diện dùng chung ─────────────────────
function Clickable({ onClick, className = "", children }: { onClick?: () => void; className?: string; children: React.ReactNode }) {
  if (!onClick) return <div className={className}>{children}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left transition-colors hover:bg-goda-navy/[0.03] focus-visible:bg-goda-navy/[0.05] outline-none ${className}`}
    >
      {children}
    </button>
  );
}

function StatTile({ label, value, hint, onClick }: { label: string; value: string; hint?: string; onClick?: () => void }) {
  return (
    <Card size="sm" className="py-0">
      <Clickable onClick={onClick} className="px-3 py-3 rounded-xl">
        <p className="flex items-center justify-between text-xs text-gray-500">
          {label}
          {onClick && <ChevronRight className="size-3.5 text-gray-400" />}
        </p>
        <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      </Clickable>
    </Card>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="inline-flex flex-wrap rounded-lg bg-white p-0.5 ring-1 ring-black/10">
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

function LedgerItem({
  row,
  grouped,
  onOpen,
  onDelete,
  reserveDeleteSlot,
}: {
  row: DisplayRow;
  grouped: boolean;
  onOpen?: OpenDetail;
  onDelete?: (r: LedgerRow) => void;
  reserveDeleteSlot?: boolean;
}) {
  const openBill = grouped && row.billId && onOpen ? () => onOpen({ kind: "bill", billId: row.billId! }) : undefined;
  return (
    <li className="relative">
      <Clickable onClick={openBill} className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-x-3 px-4 py-2.5">
        <span
          className={`row-span-2 mt-0.5 flex size-7 items-center justify-center rounded-full ${
            row.direction === "thu" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
          }`}
          aria-label={row.direction === "thu" ? "Thu" : "Chi"}
        >
          {row.direction === "thu" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
        </span>
        <p className="text-sm font-medium text-gray-900">
          {row.title}
          {row.memberName && <span className="font-normal text-gray-600"> — {row.memberName}</span>}
        </p>
        <span className="flex items-start gap-1">
          <span
            className={`whitespace-nowrap text-sm font-semibold tabular-nums ${
              row.direction === "thu" ? "text-[#006300]" : "text-gray-900"
            }`}
          >
            {row.direction === "thu" ? "+" : "−"}
            {formatVnd(row.amount)}
          </span>
          {openBill && <ChevronRight className="mt-0.5 size-4 text-gray-400" />}
          {/* Chừa chỗ nút xoá (đặt tuyệt đối bên ngoài nút bấm) để số tiền thẳng cột */}
          {reserveDeleteSlot && !openBill && <span className="w-6 shrink-0" aria-hidden />}
        </span>
        <p className="col-span-2 text-xs text-gray-500">
          {grouped && row.billId ? "Gần nhất " : ""}
          {formatIsoDate(row.date)} · {row.categoryLabel}
          {row.note && ` · ${row.note}`}
        </p>
      </Clickable>
      {onDelete && row.source === "so_quy" && (
        <button
          type="button"
          onClick={() => onDelete(row)}
          title="Xoá dòng này"
          className="absolute right-3 top-2 p-1 text-gray-400 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </li>
  );
}

const STATUS = {
  chua_dong: { label: "Chưa đóng", icon: AlertCircle, cls: "text-[#b42318]" },
  cho_duyet: { label: "Chờ duyệt", icon: Clock, cls: "text-[#9a6700]" },
  da_dong: { label: "Đã đóng", icon: CheckCircle2, cls: "text-[#006300]" },
} as const;

function StatusLabel({ status, text }: { status: ItemStatus; text?: string }) {
  const s = STATUS[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${s.cls}`}>
      <Icon className="size-3.5" />
      {text ?? s.label}
    </span>
  );
}

// ─── Bảng chi tiết (trượt lên trên điện thoại, giữa màn hình trên máy tính) ───
export function DetailSheet({
  report,
  stack,
  onOpen,
  onBack,
  onClose,
}: {
  report: FinanceReport;
  stack: Detail[];
  onOpen: OpenDetail;
  onBack: () => void;
  onClose: () => void;
}) {
  const detail = stack[stack.length - 1];

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [detail, onClose]);

  if (!detail) return null;

  let title = "";
  let body: React.ReactNode = null;

  if (detail.kind === "rows") {
    title = detail.title;
    const thu = sumOf(detail.rows, "thu");
    const chi = sumOf(detail.rows, "chi");
    const display = groupMemberPayments(detail.rows);
    body = (
      <>
        <div className="grid grid-cols-3 gap-2 px-4 pb-3 text-center">
          {[
            ["Thu", formatVnd(thu)],
            ["Chi", formatVnd(chi)],
            ["Chênh lệch", formatVnd(thu - chi)],
          ].map(([l, v]) => (
            <div key={l} className="rounded-lg bg-goda-soft-gray px-2 py-2">
              <p className="text-[11px] text-gray-500">{l}</p>
              <p className="text-sm font-semibold text-gray-900 tabular-nums">{v}</p>
            </div>
          ))}
        </div>
        {display.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-400">Không có khoản nào.</p>
        ) : (
          <ul className="divide-y divide-border/60 border-t border-border/60">
            {display.map((r) => (
              <LedgerItem key={r.id} row={r} grouped onOpen={onOpen} />
            ))}
          </ul>
        )}
      </>
    );
  } else if (detail.kind === "bill") {
    const bill = report.bills.find((b) => b.id === detail.billId);
    title = bill?.title ?? "Khoản thu";
    body = bill ? <BillDetail bill={bill} onOpen={onOpen} /> : <p className="p-4 text-sm text-gray-500">Không tìm thấy khoản thu.</p>;
  } else {
    const member = report.members.find((m) => m.memberId === detail.memberId);
    title = member?.name ?? "Thành viên";
    const items = report.bills.flatMap((b) =>
      b.items.filter((it) => it.memberId === detail.memberId).map((it) => ({ ...it, bill: b }))
    );
    body = (
      <>
        {member && (
          <div className="grid grid-cols-3 gap-2 px-4 pb-3 text-center">
            {[
              ["Đã đóng", formatVnd(member.daDong)],
              ["Chờ duyệt", formatVnd(member.choDuyet)],
              ["Còn nợ", formatVnd(member.chuaDong)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-goda-soft-gray px-2 py-2">
                <p className="text-[11px] text-gray-500">{l}</p>
                <p className="text-sm font-semibold text-gray-900 tabular-nums">{v}</p>
              </div>
            ))}
          </div>
        )}
        {items.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-400">Chưa có khoản thu nào.</p>
        ) : (
          <ul className="divide-y divide-border/60 border-t border-border/60">
            {items.map((it) => (
              <li key={it.bill.id}>
                <Clickable onClick={() => onOpen({ kind: "bill", billId: it.bill.id })} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{it.bill.title}</p>
                    <StatusLabel
                      status={it.status}
                      text={it.status === "da_dong" && it.paidDate ? `Đã đóng ${formatIsoDate(it.paidDate)}` : undefined}
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-gray-900">{formatVnd(it.amount)}</span>
                  <ChevronRight className="size-4 text-gray-400" />
                </Clickable>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Đóng" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          {stack.length > 1 && (
            <button type="button" onClick={onBack} className="-ml-1 rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="Quay lại">
              <ArrowLeft className="size-5" />
            </button>
          )}
          <h2 className="min-w-0 flex-1 truncate font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="Đóng">
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto pb-4">{body}</div>
      </div>
    </div>
  );
}

function BillDetail({ bill, onOpen }: { bill: BillProgress; onOpen: OpenDetail }) {
  const groups: [ItemStatus, string][] = [
    ["da_dong", "Đã đóng"],
    ["cho_duyet", "Chờ duyệt"],
    ["chua_dong", "Chưa đóng"],
  ];
  return (
    <div className="space-y-4">
      <div className="space-y-1.5 px-4">
        <p className="text-sm text-gray-600 tabular-nums">
          Đã thu <strong className="text-gray-900">{formatVnd(bill.collected)}</strong> / {formatVnd(bill.expected)}
        </p>
        <ProgressMeter expected={bill.expected} collected={bill.collected} pending={bill.pending} />
        <p className="text-xs text-gray-500">
          {bill.paidCount}/{bill.memberCount} người đã đóng · Tạo {formatIsoDate(bill.createdAt)}
          {bill.dueDate && ` · Hạn ${bill.dueDate}`}
        </p>
      </div>
      {groups.map(([status, label]) => {
        const items = bill.items.filter((it) => it.status === status);
        if (items.length === 0) return null;
        return (
          <section key={status}>
            <h3 className="flex items-center justify-between border-y border-border/60 bg-goda-soft-gray/60 px-4 py-1.5 text-xs font-medium text-gray-600">
              <StatusLabel status={status} text={`${label} (${items.length})`} />
              <span className="tabular-nums">{formatVnd(items.reduce((s, it) => s + it.amount, 0))}</span>
            </h3>
            <ul className="divide-y divide-border/60">
              {items.map((it) => (
                <li key={it.memberId}>
                  <Clickable onClick={() => onOpen({ kind: "member", memberId: it.memberId })} className="flex items-center gap-3 px-4 py-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-900">{it.memberName}</span>
                    {it.paidDate && <span className="text-xs text-gray-500">{formatIsoDate(it.paidDate)}</span>}
                    <span className="text-sm tabular-nums text-gray-900">{formatVnd(it.amount)}</span>
                    <ChevronRight className="size-4 text-gray-400" />
                  </Clickable>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// ─── Tổng quan ─────────────────────────────────────────
export function Overview({ report, onOpen }: { report: FinanceReport; onOpen: OpenDetail }) {
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
  const totalThu = sumOf(rows, "thu");
  const totalChi = sumOf(rows, "chi");
  const months = buildMonths(report.ledger, year);
  const bills = report.bills.filter((b) => inPeriod(b.createdAt));
  const periodLabel = year === "all" ? "từ trước tới nay" : `năm ${year}`;

  const openMonth = (i: number) =>
    onOpen({ kind: "rows", title: `Thu chi ${months[i].title.toLowerCase()}`, rows: report.ledger.filter((r) => r.date.startsWith(months[i].key)) });

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
        <span className="text-xs text-gray-400">Bấm vào số liệu, cột hoặc hạng mục để xem chi tiết</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile
          label={`Tổng thu ${periodLabel}`}
          value={formatVnd(totalThu)}
          hint={`${thu.length} lượt thu`}
          onClick={() => onOpen({ kind: "rows", title: `Các khoản thu ${periodLabel}`, rows: thu })}
        />
        <StatTile
          label={`Tổng chi ${periodLabel}`}
          value={formatVnd(totalChi)}
          hint={`${chi.length} khoản chi`}
          onClick={() => onOpen({ kind: "rows", title: `Các khoản chi ${periodLabel}`, rows: chi })}
        />
        <StatTile
          label="Chênh lệch thu − chi"
          value={formatVnd(totalThu - totalChi)}
          onClick={() => onOpen({ kind: "rows", title: `Thu chi ${periodLabel}`, rows })}
        />
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
          <MonthlyCashflowChart data={months} onSelect={openMonth} />
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
                  {months.map((m, i) => (
                    <tr key={m.key} className="cursor-pointer border-b border-border/50 hover:bg-goda-navy/[0.03]" onClick={() => openMonth(i)}>
                      <td className="py-1.5 pr-2 text-goda-navy underline-offset-2 hover:underline">{m.title}</td>
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
          <BalanceChart data={months} onSelect={openMonth} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Chi theo hạng mục</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <CategoryBars
              data={groupByCategory(chi)}
              color={COLORS.chi}
              onSelect={(label) => onOpen({ kind: "rows", title: `Chi: ${label}`, rows: chi.filter((r) => r.categoryLabel === label) })}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thu theo nguồn</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <CategoryBars
              data={groupByCategory(thu)}
              color={COLORS.thu}
              onSelect={(label) => onOpen({ kind: "rows", title: `Thu: ${label}`, rows: thu.filter((r) => r.categoryLabel === label) })}
            />
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
        <CardContent className="px-0">
          {bills.length === 0 && <p className="px-4 text-sm text-gray-400">Chưa có khoản thu nào trong kỳ này.</p>}
          <ul>
            {(showAllBills ? bills : bills.slice(0, 5)).map((b) => (
              <li key={b.id}>
                <Clickable onClick={() => onOpen({ kind: "bill", billId: b.id })} className="space-y-1.5 px-4 py-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                    <p className="font-medium text-gray-900">{b.title}</p>
                    <p className="flex items-center gap-1 text-gray-600 tabular-nums">
                      <strong className="text-gray-900">{formatVnd(b.collected)}</strong> / {formatVnd(b.expected)}
                      <ChevronRight className="size-4 text-gray-400" />
                    </p>
                  </div>
                  <ProgressMeter expected={b.expected} collected={b.collected} pending={b.pending} />
                  <p className="text-xs text-gray-500">
                    {b.paidCount}/{b.memberCount} người đã đóng
                    {b.dueDate && ` · Hạn ${b.dueDate}`}
                  </p>
                </Clickable>
              </li>
            ))}
          </ul>
          {bills.length > 5 && (
            <button type="button" onClick={() => setShowAllBills((v) => !v)} className="mx-4 mt-1 text-xs text-goda-navy underline">
              {showAllBills ? "Thu gọn" : `Xem tất cả ${bills.length} khoản`}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sổ thu chi ────────────────────────────────────────
export function Ledger({
  report,
  onOpen,
  onDelete,
}: {
  report: FinanceReport;
  onOpen: OpenDetail;
  /** Chỉ truyền khi là chủ tịch và đang xem dữ liệu thật */
  onDelete?: (r: LedgerRow) => void;
}) {
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
  // Đang tìm theo tên thì bỏ gộp để thấy được từng người.
  const isGrouped = grouped && !needle;
  const display: DisplayRow[] = isGrouped ? groupMemberPayments(rows) : rows;

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
          {rows.length} giao dịch · Thu <strong className="text-gray-900">{formatVnd(sumOf(rows, "thu"))}</strong> · Chi{" "}
          <strong className="text-gray-900">{formatVnd(sumOf(rows, "chi"))}</strong>
        </p>
        <label className={`flex items-center gap-2 text-sm text-gray-600 ${needle ? "opacity-50" : "cursor-pointer"}`}>
          <input type="checkbox" className="size-4" checked={isGrouped} disabled={!!needle} onChange={(e) => setGrouped(e.target.checked)} />
          Gộp theo khoản thu
        </label>
      </div>

      <Card className="py-0">
        {display.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-400">Không có giao dịch phù hợp.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {display.slice(0, limit).map((r) => (
              <LedgerItem key={r.id} row={r} grouped={isGrouped} onOpen={onOpen} onDelete={onDelete} reserveDeleteSlot={!!onDelete} />
            ))}
          </ul>
        )}
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

export function Members({ report, onOpen }: { report: FinanceReport; onOpen: OpenDetail }) {
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
  const STANDING = {
    no: { status: "chua_dong", label: "Còn nợ" },
    cho: { status: "cho_duyet", label: "Chờ duyệt" },
    du: { status: "da_dong", label: "Đã đủ" },
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

      <Card className="py-0">
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
                const st = statusOf(m);
                return (
                  <tr
                    key={m.memberId}
                    className="cursor-pointer border-b border-border/50 hover:bg-goda-navy/[0.03]"
                    onClick={() => onOpen({ kind: "member", memberId: m.memberId })}
                  >
                    <td className="px-4 py-2">
                      {/* Nút thật để bấm bằng bàn phím; cả hàng cũng bấm được */}
                      <button type="button" className="text-left font-medium text-gray-900 outline-none focus-visible:underline">
                        {m.name}
                      </button>
                      <p className="flex flex-wrap items-center gap-1">
                        <StatusLabel status={STANDING[st].status} text={STANDING[st].label} />
                        {/* Điện thoại ẩn cột "Chờ duyệt" nên hiện số tiền ngay đây */}
                        {st === "cho" && <span className="text-xs text-[#9a6700] sm:hidden">· {formatVnd(m.choDuyet)}</span>}
                      </p>
                      {st === "no" && m.choDuyet > 0 && (
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

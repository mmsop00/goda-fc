"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatVnd } from "@/lib/finance/format";
import { MoneyInput } from "@/components/finance/money-input";
import { monthlyFundExemption } from "@/lib/finance/age";

type Kind = "quy_thang" | "khac";

interface FinanceMember {
  id: string;
  name: string;
  birthday: string | null;
}

interface RowState {
  checked: boolean;
  /** Số tiền riêng (chữ số) — undefined = dùng số tiền chung. */
  amount?: string;
}

const now = new Date();
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CreateBillForm() {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("quy_thang");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD từ ô chọn ngày
  const [members, setMembers] = useState<FinanceMember[] | null>(null);
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/finance/members")
      .then((r) => r.json())
      .then((list: FinanceMember[]) => {
        setMembers(list);
        setRows(Object.fromEntries(list.map((m) => [m.id, { checked: true }])));
      });
  }, []);

  // id → lý do được miễn (chỉ áp dụng cho quỹ tháng)
  const exempt = useMemo(() => {
    const map = new Map<string, string>();
    if (kind === "quy_thang") {
      for (const m of members ?? []) {
        const reason = monthlyFundExemption(m, year, month);
        if (reason) map.set(m.id, reason);
      }
    }
    return map;
  }, [kind, members, year, month]);

  const isChecked = (id: string) => !exempt.has(id) && (rows[id]?.checked ?? false);
  const amountOf = (id: string) => rows[id]?.amount ?? amount;

  const selected = (members ?? []).filter((m) => isChecked(m.id));
  const total = selected.reduce((s, m) => s + (Number(amountOf(m.id)) || 0), 0);
  const selectable = (members ?? []).filter((m) => !exempt.has(m.id));

  function updateRow(id: string, patch: Partial<RowState>) {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function setAll(checked: boolean) {
    setRows((prev) => Object.fromEntries(Object.entries(prev).map(([id, r]) => [id, { ...r, checked }])));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (kind === "khac" && !title.trim()) return setError("Vui lòng nhập tên khoản thu");
    if (!Number(amount)) return setError("Vui lòng nhập số tiền");
    if (selected.length === 0) return setError("Chọn ít nhất 1 thành viên");
    const missing = selected.find((m) => !Number(amountOf(m.id)));
    if (missing) {
      setExpanded(true);
      return setError(`Chưa nhập số tiền cho ${missing.name}`);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/finance/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          month,
          year,
          title,
          amountPerMember: Number(amount),
          dueDate: dueDate ? dueDate.split("-").reverse().join("/") : undefined,
          items: selected.map((m) => ({ memberId: m.id, amount: Number(amountOf(m.id)) })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Không tạo được khoản thu");
        setLoading(false);
        return;
      }
      router.push("/member/quy/bao-cao");
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
      setLoading(false);
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Tạo khoản thu thành viên</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Loại thu</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["quy_thang", "Quỹ tháng"],
                    ["khac", "Khác"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setKind(value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      kind === value
                        ? "border-goda-navy bg-goda-navy text-white"
                        : "border-border bg-white text-goda-navy hover:bg-goda-navy/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {kind === "quy_thang" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="month">Tháng</Label>
                  <select id="month" value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectClass}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Năm</Label>
                  <select id="year" value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectClass}>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="title">Tên khoản thu</Label>
                <Input
                  id="title"
                  placeholder="Vd: Ủng hộ sinh nhật CLB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền mỗi người</Label>
                <MoneyInput id="amount" placeholder="200.000" value={amount} onChange={setAmount} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Hạn đóng (không bắt buộc)</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>

            <div className="rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
              >
                <div>
                  <p className="text-sm font-medium">
                    Áp dụng cho {selected.length}/{members?.length ?? 0} thành viên
                  </p>
                  <p className="text-xs text-gray-500">
                    Tổng dự kiến: <strong>{formatVnd(total)}</strong>
                    {exempt.size > 0 && ` · ${exempt.size} người được miễn quỹ tháng`}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-goda-navy whitespace-nowrap">
                  {expanded ? "Thu gọn" : "Chọn / sửa tiền"}
                  <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </span>
              </button>

              {expanded && (
                <div className="border-t border-border">
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/40">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        className="size-4"
                        checked={selectable.length > 0 && selected.length === selectable.length}
                        ref={(el) => {
                          if (el) el.indeterminate = selected.length > 0 && selected.length < selectable.length;
                        }}
                        onChange={(e) => setAll(e.target.checked)}
                      />
                      Tất cả thành viên
                    </label>
                    <span className="text-xs text-gray-500">Sửa ô tiền nếu ai đóng khác</span>
                  </div>
                  {members === null ? (
                    <p className="p-3 text-sm text-gray-500">Đang tải...</p>
                  ) : (
                    <ul className="max-h-96 overflow-y-auto divide-y divide-border/60">
                      {members.map((m) => {
                        const isExempt = exempt.has(m.id);
                        const checked = isChecked(m.id);
                        const custom = rows[m.id]?.amount !== undefined;
                        return (
                          <li key={m.id} className={`flex items-center gap-3 px-3 py-2 ${isExempt ? "opacity-60" : ""}`}>
                            <label className="flex flex-1 min-w-0 items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="size-4 shrink-0"
                                checked={checked}
                                disabled={isExempt}
                                onChange={(e) => updateRow(m.id, { checked: e.target.checked })}
                              />
                              <span className="truncate text-sm">{m.name}</span>
                              {isExempt && (
                                <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                                  Miễn · {exempt.get(m.id)}
                                </span>
                              )}
                            </label>
                            {!isExempt && (
                              <div className="flex items-center gap-1">
                                <MoneyInput
                                  aria-label={`Số tiền của ${m.name}`}
                                  value={amountOf(m.id)}
                                  onChange={(v) => updateRow(m.id, { amount: v })}
                                  disabled={!checked}
                                  className={`h-7 w-32 ${custom ? "border-amber-400 bg-amber-50" : ""}`}
                                />
                                <button
                                  type="button"
                                  title="Về số tiền chung"
                                  onClick={() => updateRow(m.id, { amount: undefined })}
                                  className={`p-1 text-gray-400 hover:text-goda-navy ${custom ? "" : "invisible"}`}
                                >
                                  <RotateCcw className="size-3.5" />
                                </button>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading || members === null} className="w-full bg-goda-navy hover:bg-goda-navy/90">
              {loading ? "Đang tạo..." : `Tạo khoản thu · ${formatVnd(total)}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

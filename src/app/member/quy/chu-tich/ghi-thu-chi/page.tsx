"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MoneyInput } from "@/components/finance/money-input";
import { formatIsoDate, formatVnd } from "@/lib/finance/format";
import { categoryLabel, EXPENSE_CATEGORIES, INCOME_CATEGORIES, type Direction } from "@/lib/finance/categories";

interface Entry {
  id: string;
  direction: Direction;
  category: string;
  title: string;
  amount: number;
  date: string;
  note: string | null;
}

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function FundEntryPage() {
  const [direction, setDirection] = useState<Direction>("chi");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  const categories = direction === "chi" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function loadEntries() {
    fetch("/api/finance/entries")
      .then((r) => r.json())
      .then((d) => setEntries(Array.isArray(d) ? d : []));
  }
  useEffect(loadEntries, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved("");
    if (!category) return setError("Vui lòng chọn hạng mục");
    if (!title.trim()) return setError("Vui lòng nhập nội dung");
    if (!Number(amount)) return setError("Vui lòng nhập số tiền");

    setLoading(true);
    try {
      const res = await fetch("/api/finance/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, category, title, amount: Number(amount), date, note }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Không lưu được");
        return;
      }
      setSaved(`Đã ghi ${direction === "chi" ? "khoản chi" : "khoản thu"} "${title.trim()}" · ${formatVnd(Number(amount))}`);
      setTitle("");
      setAmount("");
      setNote("");
      loadEntries();
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  async function remove(entry: Entry) {
    if (!confirm(`Xoá "${entry.title}" (${formatVnd(entry.amount)}) khỏi sổ quỹ?`)) return;
    const res = await fetch(`/api/finance/entries/${entry.id}`, { method: "DELETE" });
    if (res.ok) loadEntries();
    else alert("Không xoá được, vui lòng thử lại");
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ghi thu chi</CardTitle>
          <p className="text-sm text-gray-500">
            Tiền thành viên đóng quỹ đã tự vào sổ khi được duyệt — ở đây chỉ ghi khoản chi và các khoản thu ngoài.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {saved && (
              <Alert>
                <AlertDescription>{saved}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["chi", "Khoản chi"],
                  ["thu", "Thu ngoài (tài trợ, số dư…)"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setDirection(value);
                    setCategory("");
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    direction === value
                      ? "border-goda-navy bg-goda-navy text-white"
                      : "border-border bg-white text-goda-navy hover:bg-goda-navy/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Hạng mục</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categories).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      category === key
                        ? "bg-goda-navy text-white"
                        : "bg-white text-gray-700 ring-1 ring-black/10 hover:bg-goda-navy/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Nội dung</Label>
              <Input
                id="title"
                placeholder={direction === "chi" ? "Vd: Tiền sân C500 tháng 10" : "Vd: Anh X tài trợ giải"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền</Label>
                <MoneyInput id="amount" placeholder="500.000" value={amount} onChange={setAmount} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Ngày</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-goda-navy hover:bg-goda-navy/90">
              {loading ? "Đang lưu..." : direction === "chi" ? "Ghi khoản chi" : "Ghi khoản thu"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vừa ghi gần đây</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y divide-border/60">
              {entries.map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatIsoDate(e.date)} · {categoryLabel(e.direction, e.category)}
                    </p>
                  </div>
                  <span
                    className={`whitespace-nowrap text-sm font-semibold tabular-nums ${
                      e.direction === "thu" ? "text-[#006300]" : "text-gray-900"
                    }`}
                  >
                    {e.direction === "thu" ? "+" : "−"}
                    {formatVnd(e.amount)}
                  </span>
                  <button type="button" onClick={() => remove(e)} title="Xoá" className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

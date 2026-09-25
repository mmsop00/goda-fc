"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MoneyInput } from "@/components/finance/money-input";
import { formatIsoDate, formatPeriod, formatVnd } from "@/lib/finance/format";
import { categoryLabel, EXPENSE_CATEGORIES, INCOME_CATEGORIES, type Direction } from "@/lib/finance/categories";

interface Entry {
  id: string;
  direction: Direction;
  category: string;
  title: string;
  amount: number;
  date: string;
  period: string | null;
  note: string | null;
}

const monthOf = (isoDate: string) => isoDate.slice(0, 7);
const prevMonth = (p: string) => {
  const [y, m] = p.split("-").map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
};

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Ghi 1 dòng sổ quỹ (khoản chi, hoặc thu ngoài). Đổi `direction` thì truyền `key` để form mới.
 * `editId`: mở sẵn dòng đó để sửa (vd bấm "Sửa" từ sổ thu chi). */
export function FundEntryForm({ direction, editId }: { direction: Direction; editId?: string }) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso);
  /** null = theo tháng của ngày nhập, cho tới khi người dùng tự chọn */
  const [period, setPeriod] = useState<string | null>(null);
  const effectivePeriod = period ?? monthOf(date);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = direction === "chi" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const recent = entries.filter((e) => e.direction === direction);

  function loadEntries() {
    fetch("/api/finance/entries")
      .then((r) => r.json())
      .then((d) => setEntries(Array.isArray(d) ? d : []));
  }
  useEffect(loadEntries, []);

  function startEdit(entry: Entry) {
    setEditingId(entry.id);
    setCategory(entry.category);
    setTitle(entry.title);
    setAmount(String(entry.amount));
    setDate(entry.date);
    setPeriod(entry.period ?? monthOf(entry.date));
    setNote(entry.note ?? "");
    setError("");
    setSaved("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function stopEdit() {
    setEditingId(null);
    setCategory("");
    setTitle("");
    setAmount("");
    setDate(todayIso());
    setPeriod(null);
    setNote("");
  }

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/finance/entries/${editId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((entry: Entry | null) => (entry ? startEdit(entry) : setError("Không tìm thấy dòng cần sửa")));
  }, [editId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved("");
    if (!category) return setError("Vui lòng chọn hạng mục");
    if (!title.trim()) return setError("Vui lòng nhập nội dung");
    if (!Number(amount)) return setError("Vui lòng nhập số tiền");

    setLoading(true);
    try {
      const res = await fetch(editingId ? `/api/finance/entries/${editingId}` : "/api/finance/entries", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, category, title, amount: Number(amount), date, period: effectivePeriod, note }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Không lưu được");
        return;
      }
      setSaved(
        `${editingId ? "Đã lưu thay đổi" : `Đã ghi ${direction === "chi" ? "khoản chi" : "khoản thu"}`} "${title.trim()}" · ${formatVnd(Number(amount))}`
      );
      if (editingId) {
        stopEdit();
      } else {
        setTitle("");
        setAmount("");
        setNote("");
      }
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
    if (entry.id === editingId) stopEdit();
    if (res.ok) loadEntries();
    else alert("Không xoá được, vui lòng thử lại");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId
              ? direction === "chi"
                ? "Sửa khoản chi"
                : "Sửa khoản thu ngoài"
              : direction === "chi"
                ? "Ghi khoản chi"
                : "Ghi khoản thu ngoài"}
          </CardTitle>
          {direction === "thu" && (
            <p className="text-sm text-gray-500">
              Tiền không qua thành viên đóng quỹ: tài trợ, khách mời, số dư chuyển sang...
            </p>
          )}
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
                <Label htmlFor="date">{direction === "chi" ? "Ngày chi tiền" : "Ngày nhận tiền"}</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Tháng áp dụng</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  id="period"
                  type="month"
                  value={effectivePeriod}
                  onChange={(e) => setPeriod(e.target.value || null)}
                  className="w-44"
                  required
                />
                {[
                  ["Tháng này", monthOf(todayIso())],
                  ["Tháng trước", prevMonth(monthOf(todayIso()))],
                ].map(([label, p]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`rounded-full px-3 py-1 text-xs ring-1 ${
                      effectivePeriod === p ? "bg-goda-navy text-white ring-goda-navy" : "bg-white text-gray-700 ring-black/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Khoản này thuộc về tháng nào (báo cáo chuẩn tính theo tháng này). Vd: tiền sân tháng 9 trả ngày 02/10 → chọn tháng 9.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-goda-navy hover:bg-goda-navy/90">
              {loading ? "Đang lưu..." : editingId ? "Lưu thay đổi" : direction === "chi" ? "Ghi khoản chi" : "Ghi khoản thu"}
            </Button>
            {editingId && (
              <button type="button" onClick={stopEdit} className="text-sm text-gray-600 underline">
                Huỷ, không sửa nữa
              </button>
            )}
          </form>
        </CardContent>
      </Card>

      {recent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vừa ghi gần đây</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y divide-border/60">
              {recent.map((e) => (
                <li key={e.id} className={`flex items-center gap-3 px-4 py-2.5 ${e.id === editingId ? "bg-amber-50" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatIsoDate(e.date)} · Kỳ {formatPeriod(e.period ?? monthOf(e.date))} · {categoryLabel(e.direction, e.category)}
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
                  <button type="button" onClick={() => startEdit(e)} title="Sửa" className="p-1 text-gray-400 hover:text-goda-navy">
                    <Pencil className="size-4" />
                  </button>
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

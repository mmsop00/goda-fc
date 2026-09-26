"use client";

// Chủ tịch bật/tắt tự động tạo "Quỹ tháng" lúc 00:00 ngày 1 hằng tháng.

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MoneyInput } from "@/components/finance/money-input";
import { formatVnd } from "@/lib/finance/format";

interface SettingsResponse {
  settings: { autoMonthly: boolean; monthlyAmount: number; dueDay: number | null };
  thisMonth: { title: string; created: boolean };
  nextRun: string;
}

export function AutoMonthlyCard() {
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [editing, setEditing] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function apply(d: SettingsResponse) {
    setData(d);
    setEnabled(d.settings.autoMonthly);
    setAmount(String(d.settings.monthlyAmount));
    setDueDay(d.settings.dueDay ? String(d.settings.dueDay) : "");
  }

  function load() {
    return fetch("/api/finance/settings")
      .then((r) => r.json())
      .then((d) => d.settings && apply(d));
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    setError("");
    if (!Number(amount)) return setError("Nhập số tiền mỗi người");
    setSaving(true);
    const res = await fetch("/api/finance/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoMonthly: enabled, monthlyAmount: Number(amount), dueDay: dueDay ? Number(dueDay) : null }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(json.error || "Không lưu được");
    setEditing(false);
    load();
  }

  if (!data) return null;
  const s = data.settings;

  return (
    <Card className={s.autoMonthly ? "ring-2 ring-green-600/30" : ""}>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <CalendarClock className={`mt-0.5 size-5 shrink-0 ${s.autoMonthly ? "text-green-600" : "text-gray-400"}`} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">
              Tự động tạo quỹ tháng:{" "}
              <span className={s.autoMonthly ? "text-green-700" : "text-gray-500"}>{s.autoMonthly ? "Đang bật" : "Đang tắt"}</span>
            </p>
            {s.autoMonthly ? (
              <p className="text-sm text-gray-600">
                {formatVnd(s.monthlyAmount)}/người{s.dueDay ? ` · hạn đóng ngày ${s.dueDay}` : ""} · lần tới: <strong>{data.nextRun}</strong>
              </p>
            ) : (
              <p className="text-sm text-gray-600">Bật để hệ thống tự tạo “Quỹ tháng” lúc 00:00 ngày 1 hằng tháng.</p>
            )}
            <p className="mt-0.5 text-xs text-gray-500">
              {data.thisMonth.title}: {data.thisMonth.created ? "đã có ✓" : "chưa tạo"} · Tự miễn người từ 70 tuổi / CLB miễn · ai có số dư
              đủ thì tự trừ
            </p>
          </div>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="shrink-0 text-sm text-goda-navy underline">
              Cài đặt
            </button>
          )}
        </div>

        {editing && (
          <div className="space-y-3 rounded-lg bg-goda-soft-gray/60 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <input type="checkbox" className="size-4" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
              Bật tự động tạo quỹ tháng
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-600" htmlFor="auto-amount">
                  Số tiền mỗi người
                </label>
                <MoneyInput id="auto-amount" value={amount} onChange={setAmount} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600" htmlFor="auto-due">
                  Hạn đóng ngày (không bắt buộc)
                </label>
                <input
                  id="auto-due"
                  inputMode="numeric"
                  placeholder="Vd: 10"
                  maxLength={2}
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value.replace(/\D/g, ""))}
                  className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-md bg-goda-navy px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu cài đặt"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  apply(data);
                }}
                className="text-sm text-gray-600 underline"
              >
                Huỷ
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

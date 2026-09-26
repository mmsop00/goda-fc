"use client";

// Chủ tịch duyệt các lượt ủng hộ từ trang chủ — xác nhận số tiền thực nhận.

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoneyInput } from "@/components/finance/money-input";
import { formatVnd } from "@/lib/finance/format";

interface PendingDonation {
  id: string;
  code: string;
  amount: number;
  donorName: string;
  anonymous: boolean;
  message: string | null;
  ocrHint: string | null;
  receiptId: string | null;
}

export function DonationQueue() {
  const [list, setList] = useState<PendingDonation[] | null>(null);
  const [received, setReceived] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function load() {
    return fetch("/api/donations/pending")
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : []));
  }
  useEffect(() => {
    load();
  }, []);

  async function act(d: PendingDonation, action: "approve" | "reject") {
    const got = Number(received[d.id] ?? d.amount);
    if (action === "approve" && !got) return setMessage("Nhập số tiền thực nhận");
    if (action === "reject" && !confirm(`Từ chối lượt ủng hộ của ${d.donorName}? (vd không thấy tiền về tài khoản)`)) return;
    setBusy(d.id);
    setMessage("");
    const res = await fetch(`/api/donations/${d.id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action === "approve" ? { receivedAmount: got } : {}),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) return setMessage(json.error || "Không xử lý được");
    setMessage(
      action === "approve"
        ? `Đã xác nhận ${formatVnd(got)} của ${d.donorName} — đã hiện trên trang chủ và cộng vào quỹ`
        : `Đã từ chối lượt ủng hộ của ${d.donorName}`
    );
    load();
  }

  if (!list || list.length === 0) return null;

  return (
    <section className="space-y-3 pt-4">
      <h2 className="flex items-center gap-2 font-display font-bold text-xl text-goda-navy">
        <Heart className="size-5 text-goda-yellow" />
        Ủng hộ chờ duyệt ({list.length})
      </h2>
      {message && <p className="rounded-lg bg-white px-4 py-2.5 text-sm text-gray-700 ring-1 ring-black/10">{message}</p>}
      {list.map((d) => {
        const diff = Number(received[d.id] ?? d.amount) - d.amount;
        return (
          <Card key={d.id}>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">
                {d.donorName}
                {d.anonymous && <span className="ml-1 text-xs font-normal text-gray-500">(hiện “Ẩn danh” trên trang chủ)</span>}
              </CardTitle>
              <Badge variant={d.ocrHint === "likely_match" ? "default" : "secondary"}>
                {d.ocrHint === "likely_match" ? "Khớp tự động" : d.ocrHint ? "Cần xem lại" : "Đang đọc ảnh…"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p>
                  Số tiền khai: <strong>{formatVnd(d.amount)}</strong>
                </p>
                <p>
                  Nội dung CK: <strong>{d.code}</strong>
                </p>
                {d.message && <p className="text-gray-600">Lời nhắn: “{d.message}”</p>}
              </div>
              {d.receiptId && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/donations/receipts/${d.receiptId}/image`}
                  alt="Ảnh bill ủng hộ"
                  className="max-h-80 rounded-lg border border-border mx-auto"
                />
              )}
              <div className="space-y-1">
                <label className="text-xs text-gray-600" htmlFor={`don-${d.id}`}>
                  Số tiền thực nhận (xem trong tài khoản ngân hàng) — số này được cộng vào quỹ
                </label>
                <MoneyInput id={`don-${d.id}`} value={received[d.id] ?? String(d.amount)} onChange={(v) => setReceived((r) => ({ ...r, [d.id]: v }))} />
                {diff !== 0 && (
                  <p className="text-xs text-amber-700">
                    Khác số tiền khai {formatVnd(Math.abs(diff))} — trang chủ và quỹ sẽ ghi đúng số thực nhận
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => act(d, "approve")} disabled={busy === d.id} className="flex-1 bg-green-600 hover:bg-green-700">
                  Xác nhận
                </Button>
                <Button onClick={() => act(d, "reject")} disabled={busy === d.id} variant="destructive" className="flex-1">
                  Từ chối
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

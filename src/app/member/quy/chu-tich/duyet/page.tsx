"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/finance/format";
import { MoneyInput } from "@/components/finance/money-input";

interface QueueItem {
  id: string;
  code: string;
  amount: number;
  memberName: string;
  ocrHint: string | null;
  billTitles: string[];
  receiptId: string | null;
}

export default function ApprovalQueuePage() {
  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  /** id → số tiền thực nhận (chữ số); chưa sửa = đúng số tiền của mã QR */
  const [received, setReceived] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  function load() {
    fetch("/api/finance/payment-intents")
      .then((r) => r.json())
      .then(setQueue);
  }

  useEffect(load, []);

  async function handleAction(item: QueueItem, action: "approve" | "reject") {
    const got = Number(received[item.id] ?? item.amount);
    if (action === "approve" && !got) return setMessage("Nhập số tiền thực nhận");
    setBusyId(item.id);
    setMessage("");
    try {
      const res = await fetch(`/api/finance/payment-intents/${item.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "approve" ? { receivedAmount: got } : {}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setMessage(json.error || "Không xử lý được");
      else if (action === "approve") {
        const parts = [`Đã xác nhận ${item.memberName}: đóng ${json.paid} khoản`];
        if (json.unpaid) parts.push(`${json.unpaid} khoản chưa đủ tiền, vẫn chưa đóng`);
        if (json.creditAfter) parts.push(`số dư của thành viên: ${formatVnd(json.creditAfter)}`);
        setMessage(parts.join(" · "));
      }
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (!queue) {
    return <div className="p-8 text-center text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
      <h1 className="font-display font-bold text-xl text-goda-navy">
        Hàng đợi chờ duyệt ({queue.length})
      </h1>

      {message && <p className="rounded-lg bg-white px-4 py-2.5 text-sm text-gray-700 ring-1 ring-black/10">{message}</p>}

      {queue.length === 0 ? (
        <p className="text-sm text-gray-500">Không có khoản nào đang chờ duyệt.</p>
      ) : (
        queue.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">{item.memberName}</CardTitle>
              <Badge variant={item.ocrHint === "likely_match" ? "default" : "secondary"}>
                {item.ocrHint === "likely_match" ? "Khớp tự động" : "Cần xem lại"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p>Khoản: {item.billTitles.join(", ")}</p>
                <p>
                  Số tiền: <strong>{formatVnd(item.amount)}</strong>
                </p>
                <p>
                  Nội dung CK: <strong>{item.code}</strong>
                </p>
              </div>
              {item.receiptId && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/finance/receipts/${item.receiptId}/image`}
                  alt="Ảnh bill"
                  className="max-h-80 rounded-lg border border-border mx-auto"
                />
              )}
              <div className="space-y-1">
                <label className="text-xs text-gray-600" htmlFor={`got-${item.id}`}>
                  Số tiền thực nhận (xem trong tài khoản ngân hàng)
                </label>
                <MoneyInput
                  id={`got-${item.id}`}
                  value={received[item.id] ?? String(item.amount)}
                  onChange={(v) => setReceived((r) => ({ ...r, [item.id]: v }))}
                />
                {(() => {
                  const diff = Number(received[item.id] ?? item.amount) - item.amount;
                  if (!diff) return null;
                  return (
                    <p className="text-xs text-amber-700">
                      {diff > 0
                        ? `Nộp thừa ${formatVnd(diff)} → cộng vào số dư của thành viên`
                        : `Nộp thiếu ${formatVnd(-diff)} → khoản nào không đủ trọn sẽ vẫn chưa đóng, tiền đã nộp giữ trong số dư`}
                    </p>
                  );
                })()}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAction(item, "approve")}
                  disabled={busyId === item.id}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Xác nhận
                </Button>
                <Button
                  onClick={() => handleAction(item, "reject")}
                  disabled={busyId === item.id}
                  variant="destructive"
                  className="flex-1"
                >
                  Từ chối
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

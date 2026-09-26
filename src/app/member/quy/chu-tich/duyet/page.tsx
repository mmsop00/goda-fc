"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/finance/format";
import { MoneyInput } from "@/components/finance/money-input";
import { DonationQueue } from "@/components/finance/donation-queue";

interface QueueItem {
  id: string;
  code: string;
  amount: number;
  memberName: string;
  ocrHint: string | null;
  billTitles: string[];
  receiptId: string | null;
  /** Chỉ có ở dữ liệu mẫu: ảnh bill minh hoạ trong /public */
  receiptUrl?: string;
}

// Dữ liệu mẫu để chủ tịch tập duyệt — không gọi API, không đụng tiền thật.
const SAMPLE_QUEUE: QueueItem[] = [
  { id: "mau-1", code: "GODAMAU001", amount: 200000, memberName: "Thành viên mẫu 1", ocrHint: "likely_match", billTitles: ["Quỹ tháng (mẫu)"], receiptId: null, receiptUrl: "/mau/bill-200k.jpg" },
  { id: "mau-2", code: "GODAMAU002", amount: 200000, memberName: "Thành viên mẫu 2", ocrHint: "needs_review", billTitles: ["Quỹ tháng (mẫu)"], receiptId: null, receiptUrl: "/mau/bill-300k.jpg" },
  { id: "mau-3", code: "GODAMAU003", amount: 200000, memberName: "Thành viên mẫu 3", ocrHint: "needs_review", billTitles: ["Quỹ tháng (mẫu)"], receiptId: null, receiptUrl: "/mau/bill-150k.jpg" },
];

export default function ApprovalQueuePage() {
  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  /** id → số tiền thực nhận (chữ số); chưa sửa = đúng số tiền của mã QR */
  const [received, setReceived] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [sample, setSample] = useState<QueueItem[] | null>(null);

  function load() {
    fetch("/api/finance/payment-intents")
      .then((r) => r.json())
      .then(setQueue);
  }

  useEffect(load, []);

  function resultMessage(item: QueueItem, r: { paid: number; unpaid: number; creditAfter: number }) {
    const parts = [`Đã xác nhận ${item.memberName}: đóng ${r.paid} khoản`];
    if (r.unpaid) parts.push(`${r.unpaid} khoản chưa đủ tiền, vẫn chưa đóng`);
    if (r.creditAfter) parts.push(`số dư của thành viên: ${formatVnd(r.creditAfter)}`);
    return parts.join(" · ");
  }

  function startSample() {
    setSample(SAMPLE_QUEUE);
    setReceived({});
    setMessage("");
  }

  async function handleAction(item: QueueItem, action: "approve" | "reject") {
    const got = Number(received[item.id] ?? item.amount);
    if (action === "approve" && !got) return setMessage("Nhập số tiền thực nhận");
    // Dữ liệu mẫu: tính kết quả ngay trên máy, giống hệt cách server tính (số dư ban đầu 0)
    if (sample) {
      const paid = got >= item.amount ? 1 : 0;
      setMessage(
        action === "approve"
          ? `(Mẫu) ${resultMessage(item, { paid, unpaid: 1 - paid, creditAfter: got - paid * item.amount })}`
          : `(Mẫu) Đã từ chối ${item.memberName} — khoản trở về "chưa đóng" để thành viên đóng lại`
      );
      setSample(sample.filter((x) => x.id !== item.id));
      return;
    }
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
      else if (action === "approve") setMessage(resultMessage(item, json));
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (!queue) {
    return <div className="p-8 text-center text-gray-500">Đang tải...</div>;
  }

  const shown = sample ?? queue;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display font-bold text-xl text-goda-navy">
          Hàng đợi chờ duyệt ({shown.length})
        </h1>
        {!sample && queue.length > 0 && (
          <button type="button" onClick={startSample} className="text-xs text-gray-500 underline">
            Thử với dữ liệu mẫu
          </button>
        )}
      </div>

      {sample && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <span>
            Đang thử với <strong>DỮ LIỆU MẪU</strong> — nhập số tiền trên ảnh bill rồi bấm Xác nhận để xem kết quả. Không ảnh
            hưởng tiền thật.
          </span>
          <button
            type="button"
            onClick={() => {
              setSample(null);
              setMessage("");
            }}
            className="rounded-md bg-amber-900 px-3 py-1 text-xs font-medium text-white"
          >
            Về hàng đợi thật
          </button>
        </div>
      )}

      {message && <p className="rounded-lg bg-white px-4 py-2.5 text-sm text-gray-700 ring-1 ring-black/10">{message}</p>}

      {shown.length === 0 ? (
        sample ? (
          <div className="rounded-xl bg-white px-4 py-3 text-sm text-gray-600 ring-1 ring-black/10">
            Đã thử hết các khoản mẫu.{" "}
            <button type="button" onClick={startSample} className="text-goda-navy underline">
              Thử lại
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm text-gray-600 ring-1 ring-black/10">
            <span>Không có khoản nào đang chờ duyệt. Muốn tập duyệt trước (nộp đúng / thừa / thiếu)?</span>
            <button type="button" onClick={startSample} className="rounded-md bg-goda-navy px-3 py-1 text-xs font-medium text-white">
              Thử với dữ liệu mẫu
            </button>
          </div>
        )
      ) : (
        shown.map((item) => (
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
              {(item.receiptId || item.receiptUrl) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.receiptUrl ?? `/api/finance/receipts/${item.receiptId}/image`}
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
      {!sample && <DonationQueue />}
    </div>
  );
}

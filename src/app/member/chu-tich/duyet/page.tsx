"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/finance/format";

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

  function load() {
    fetch("/api/finance/payment-intents")
      .then((r) => r.json())
      .then(setQueue);
  }

  useEffect(load, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    setBusyId(id);
    try {
      await fetch(`/api/finance/payment-intents/${id}/${action}`, { method: "POST" });
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
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAction(item.id, "approve")}
                  disabled={busyId === item.id}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Xác nhận
                </Button>
                <Button
                  onClick={() => handleAction(item.id, "reject")}
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

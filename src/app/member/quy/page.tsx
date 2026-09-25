"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatVnd } from "@/lib/finance/format";

interface PaymentItemRow {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  bill: { title: string; dueDate: string | null };
}

interface ItemsResponse {
  items: PaymentItemRow[];
  summary: { chuaDong: number; choDuyet: number; daDong: number };
}

const STATUS_LABEL: Record<string, string> = {
  chua_dong: "Chưa đóng",
  cho_duyet: "Chờ duyệt",
  da_dong: "Đã đóng",
};

const STATUS_VARIANT: Record<string, "secondary" | "default" | "outline"> = {
  chua_dong: "outline",
  cho_duyet: "secondary",
  da_dong: "default",
};

export default function MemberDashboardPage() {
  const router = useRouter();
  const [totalFund, setTotalFund] = useState<number | null>(null);
  const [data, setData] = useState<ItemsResponse | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/finance/summary").then((r) => r.json()),
      fetch("/api/finance/payment-items").then((r) => r.json()),
    ]).then(([summary, items]) => {
      setTotalFund(summary.totalFund ?? 0);
      setData(items);
    });
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handlePay() {
    if (selected.size === 0) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/finance/payment-intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds: Array.from(selected) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Không tạo được mã thanh toán");
        setCreating(false);
        return;
      }
      router.push(`/member/quy/thanh-toan?id=${json.id}&code=${json.code}&amount=${json.amount}`);
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
      setCreating(false);
    }
  }

  if (!data || totalFund === null) {
    return <div className="p-8 text-center text-gray-500">Đang tải...</div>;
  }

  const payableItems = data.items.filter((i) => i.status === "chua_dong");
  const otherItems = data.items.filter((i) => i.status !== "chua_dong");
  const selectedTotal = data.items
    .filter((i) => selected.has(i.id))
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-500">Số dư quỹ CLB</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-bold text-goda-navy">
            {formatVnd(totalFund)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-500">Chưa đóng</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-bold text-red-600">
            {formatVnd(data.summary.chuaDong)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-500">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-bold text-amber-600">
            {formatVnd(data.summary.choDuyet)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-500">Đã đóng</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-bold text-green-600">
            {formatVnd(data.summary.daDong)}
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Khoản cần đóng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {payableItems.length === 0 ? (
            <p className="text-sm text-gray-500">Không có khoản nào cần đóng.</p>
          ) : (
            payableItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="size-4"
                  />
                  <div>
                    <p className="font-medium text-sm">{item.bill.title}</p>
                    {item.bill.dueDate && (
                      <p className="text-xs text-gray-500">Hạn đóng: {item.bill.dueDate}</p>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-sm whitespace-nowrap">
                  {formatVnd(item.amount)}
                </span>
              </label>
            ))
          )}
        </CardContent>
        {payableItems.length > 0 && (
          <div className="px-4 pb-4 flex items-center justify-between gap-3">
            <span className="text-sm text-gray-500">
              Đã chọn: <strong>{formatVnd(selectedTotal)}</strong>
            </span>
            <Button
              onClick={handlePay}
              disabled={selected.size === 0 || creating}
              className="bg-goda-navy hover:bg-goda-navy/90"
            >
              {creating ? "Đang tạo mã..." : "Tạo mã QR & Thanh toán"}
            </Button>
          </div>
        )}
      </Card>

      {otherItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử đóng góp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {otherItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium text-sm">{item.bill.title}</p>
                  <Badge variant={STATUS_VARIANT[item.status]}>
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </div>
                <span className="font-semibold text-sm whitespace-nowrap">
                  {formatVnd(item.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

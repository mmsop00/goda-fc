"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateBillPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amountPerMember, setAmountPerMember] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/finance/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amountPerMember: Number(amountPerMember),
          dueDate: dueDate || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Không tạo được khoản thu");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/member/quy/chu-tich"), 1000);
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tạo khoản thu mới</CardTitle>
          <p className="text-sm text-gray-500">
            Áp dụng cho toàn bộ 26 thành viên, kể cả chủ tịch.
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert>
              <AlertDescription>Đã tạo khoản thu! Đang chuyển trang...</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  placeholder="Vd: Quỹ đội tháng 10"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền mỗi người (VNĐ)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="Vd: 200000"
                  value={amountPerMember}
                  onChange={(e) => setAmountPerMember(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Hạn đóng (không bắt buộc)</Label>
                <Input
                  id="dueDate"
                  placeholder="DD/MM/YYYY"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-goda-navy hover:bg-goda-navy/90">
                {loading ? "Đang tạo..." : "Tạo khoản thu"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resizeImageFile } from "@/lib/image-resize";
import { PayAndUpload } from "@/components/finance/pay-and-upload";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const code = searchParams.get("code") ?? "";
  const amount = Number(searchParams.get("amount") ?? "0");

  const [result, setResult] = useState<{ status: string; ocrHint: string | null } | null>(null);

  if (!id || !code || !amount) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>Thiếu thông tin mã thanh toán. Vui lòng quay lại trang tổng quan.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/member/quy")}>
          Quay lại
        </Button>
      </div>
    );
  }

  async function handleUpload(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", await resizeImageFile(file));
    const res = await fetch(`/api/finance/payment-intents/${id}/receipt`, { method: "POST", body: formData });
    const json = await res.json();
    if (!res.ok) return json.error || "Không tải lên được ảnh bill";
    setResult(json);
    return null;
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Đã gửi bill thành công ✅</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Trạng thái: <strong>Chờ chủ tịch duyệt</strong></p>
            {result.ocrHint === "needs_review" && (
              <Alert>
                <AlertDescription>
                  Hệ thống chưa nhận diện rõ nội dung/số tiền trong ảnh — không sao, chủ tịch
                  sẽ đối chiếu trực tiếp với tài khoản ngân hàng khi duyệt.
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={() => router.push("/member/quy")} className="w-full bg-goda-navy hover:bg-goda-navy/90">
              Về trang tổng quan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <PayAndUpload amount={amount} code={code} onSubmit={handleUpload} />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Đang tải...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

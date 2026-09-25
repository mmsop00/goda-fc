"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buildVietQrUrl, BANK_ACCOUNT_NO, BANK_ACCOUNT_NAME } from "@/lib/finance/config";
import { formatVnd } from "@/lib/finance/format";
import { resizeImageFile } from "@/lib/image-resize";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const code = searchParams.get("code") ?? "";
  const amount = Number(searchParams.get("amount") ?? "0");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ status: string; ocrHint: string | null } | null>(null);

  if (!id || !code || !amount) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>Thiếu thông tin mã thanh toán. Vui lòng quay lại trang tổng quan.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/member")}>
          Quay lại
        </Button>
      </div>
    );
  }

  const qrUrl = buildVietQrUrl(amount, code);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const resized = await resizeImageFile(file);
      const formData = new FormData();
      formData.append("file", resized);
      const res = await fetch(`/api/finance/payment-intents/${id}/receipt`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Không tải lên được ảnh bill");
        setUploading(false);
        return;
      }
      setResult(json);
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setUploading(false);
    }
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
            <Button onClick={() => router.push("/member")} className="w-full bg-goda-navy hover:bg-goda-navy/90">
              Về trang tổng quan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quét mã để chuyển khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="Mã QR chuyển khoản" className="mx-auto rounded-lg border border-border" />
          <div className="text-sm space-y-1 text-center">
            <p>
              Số tài khoản: <strong>{BANK_ACCOUNT_NO}</strong> ({BANK_ACCOUNT_NAME} — BIDV)
            </p>
            <p>
              Số tiền: <strong>{formatVnd(amount)}</strong>
            </p>
            <p>
              Nội dung: <strong>{code}</strong>
            </p>
            <p className="text-xs text-gray-500">
              Quét mã bằng app ngân hàng — số tiền và nội dung sẽ tự điền sẵn.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sau khi chuyển khoản, tải ảnh bill lên</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-goda-navy hover:bg-goda-navy/90"
          >
            {uploading ? "Đang tải lên..." : "Gửi ảnh bill"}
          </Button>
        </CardContent>
      </Card>
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

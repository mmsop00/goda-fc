"use client";

// Các bước sau khi có mã QR: ① chuyển khoản → ② tải ảnh bill → ③ bấm Hoàn tất.
// Dùng chung cho thành viên đóng quỹ và người ủng hộ từ trang chủ.
// Làm rõ bước tải bill & nút Hoàn tất vì hay có người chuyển khoản xong rồi thoát luôn.

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Copy, ImagePlus, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BANK_ACCOUNT_NAME, BANK_ACCOUNT_NO, buildVietQrUrl } from "@/lib/finance/config";
import { formatVnd } from "@/lib/finance/format";

function StepTitle({ n, title, done }: { n: number; title: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          done ? "bg-green-600 text-white" : "bg-goda-navy text-white"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <h2 className="font-display text-lg font-bold text-goda-navy">{title}</h2>
    </div>
  );
}

function CopyRow({ label, value, display }: { label: string; value: string; display?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="flex items-center gap-2">
        <strong className="text-sm text-gray-900 tabular-nums">{display ?? value}</strong>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(value).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-goda-navy ring-1 ring-goda-navy/20 hover:bg-goda-navy/5"
        >
          <Copy className="size-3" />
          {copied ? "Đã chép" : "Chép"}
        </button>
      </span>
    </div>
  );
}

export function PayAndUpload({
  amount,
  code,
  onSubmit,
  footer,
}: {
  amount: number;
  code: string;
  /** Gửi ảnh bill; trả về thông báo lỗi, hoặc null nếu thành công (trang cha tự chuyển sang màn cảm ơn) */
  onSubmit: (file: File) => Promise<string | null>;
  footer?: React.ReactNode;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  // Có mã QR mà chưa bấm Hoàn tất → hỏi lại trước khi đóng / tải lại trang
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(f: File | null) {
    setError("");
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function openPicker() {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    inputRef.current?.click();
  }

  async function submit() {
    if (!file) return openPicker();
    setBusy(true);
    setError("");
    const err = await onSubmit(file).catch(() => "Lỗi kết nối, vui lòng thử lại");
    if (err) {
      setError(err);
      setBusy(false);
    }
  }

  const finishLabel = busy ? "Đang gửi..." : "Hoàn tất — gửi ảnh bill";

  return (
    <div className="space-y-5 pb-24 sm:pb-0">
      {/* ① Chuyển khoản */}
      <section className="space-y-3">
        <StepTitle n={1} title="Quét mã QR và chuyển khoản" />
        <Card>
          <CardContent className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={buildVietQrUrl(amount, code)} alt="Mã QR chuyển khoản" className="mx-auto rounded-lg border border-border" />
            <p className="text-center text-xs text-gray-500">Quét bằng app ngân hàng — số tiền và nội dung tự điền sẵn.</p>
            <div className="divide-y divide-border/60 rounded-lg bg-goda-soft-gray/60 px-3">
              <CopyRow label="Số tài khoản" value={BANK_ACCOUNT_NO} />
              <div className="flex items-center justify-between gap-3 py-1.5">
                <span className="text-sm text-gray-500">Chủ tài khoản</span>
                <strong className="text-sm text-gray-900">{BANK_ACCOUNT_NAME} — BIDV</strong>
              </div>
              <CopyRow label="Số tiền" value={String(amount)} display={formatVnd(amount)} />
              <CopyRow label="Nội dung" value={code} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ② Tải ảnh bill */}
      <section ref={uploadRef} className="space-y-3">
        <StepTitle n={2} title="Tải ảnh bill lên" done={!!file} />
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-goda-navy/40 bg-white px-4 py-8 text-center transition-colors hover:border-goda-navy hover:bg-goda-navy/[0.03]"
          >
            <ImagePlus className="size-10 text-goda-navy" />
            <span className="text-base font-bold text-goda-navy">Bấm vào đây để chọn ảnh bill</span>
            <span className="text-sm text-gray-500">Ảnh chụp màn hình “chuyển khoản thành công” trong app ngân hàng</span>
          </button>
        ) : (
          <div className="space-y-2 rounded-2xl bg-white p-3 ring-1 ring-green-600/40">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Ảnh bill đã chọn" className="mx-auto max-h-72 rounded-lg" />
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5 text-sm text-green-700">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="truncate">Đã chọn ảnh bill</span>
              </span>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-goda-navy ring-1 ring-goda-navy/20"
              >
                <RefreshCw className="size-3.5" />
                Đổi ảnh
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ③ Hoàn tất */}
      <section className="space-y-3">
        <StepTitle n={3} title="Bấm Hoàn tất" />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-white shadow-sm transition-colors disabled:opacity-60 ${
            file ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
          }`}
        >
          <CheckCircle2 className="size-5" />
          {file ? finishLabel : "Chọn ảnh bill ở bước 2 trước"}
        </button>
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
          <strong>Quan trọng:</strong> chuyển khoản xong nhớ tải ảnh bill và bấm <strong>Hoàn tất</strong>. Nếu không, CLB
          sẽ không biết bạn đã chuyển.
        </p>
        {footer}
      </section>

      {/* Thanh nhắc dính cuối màn hình điện thoại */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden">
        {file ? (
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-base font-bold text-white disabled:opacity-60"
          >
            <CheckCircle2 className="size-5" />
            {finishLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-goda-navy text-base font-bold text-white"
          >
            <ImagePlus className="size-5" />
            Đã chuyển khoản? Tải ảnh bill
          </button>
        )}
      </div>
    </div>
  );
}

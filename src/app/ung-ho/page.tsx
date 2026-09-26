"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MoneyInput } from "@/components/finance/money-input";
import { formatVnd } from "@/lib/finance/format";
import { resizeImageFile } from "@/lib/image-resize";
import { PayAndUpload } from "@/components/finance/pay-and-upload";

interface Pending {
  id: string;
  token: string;
  code: string;
  amount: number;
  name: string;
}

const STORE_KEY = "goda-ung-ho";
const QUICK = [100_000, 200_000, 500_000, 1_000_000];

// Giữ lượt ủng hộ đang làm dở khi tải lại trang (chỉ trên máy người ủng hộ)
function loadPending(): Pending | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Pending) : null;
  } catch {
    return null;
  }
}
function savePending(p: Pending | null) {
  try {
    if (p) localStorage.setItem(STORE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORE_KEY);
  } catch {
    /* trình duyệt chặn lưu — vẫn dùng được, chỉ không nhớ khi tải lại */
  }
}

export default function DonatePage() {
  const [step, setStep] = useState<"form" | "pay" | "done">("form");
  const [pending, setPending] = useState<Pending | null>(null);
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [showAmount, setShowAmount] = useState(true);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Đọc localStorage sau khi hiển thị (lúc render trên server chưa có) để không lệch HTML
  useEffect(() => {
    const p = loadPending();
    if (!p) return;
    queueMicrotask(() => {
      setPending(p);
      setStep("pay");
    });
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!anonymous && !name.trim()) return setError("Vui lòng nhập tên (hoặc chọn Ẩn danh)");
    if (Number(amount) < 10_000) return setError("Số tiền từ 10.000đ");
    setBusy(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName: name, anonymous, showAmount, message, amount: Number(amount) }),
      });
      const json = await res.json();
      if (!res.ok) return setError(json.error || "Không tạo được mã ủng hộ");
      const p = { id: json.id, token: json.token, code: json.code, amount: json.amount, name: anonymous ? "Ẩn danh" : name.trim() };
      setPending(p);
      savePending(p);
      setStep("pay");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setBusy(false);
    }
  }

  async function upload(file: File): Promise<string | null> {
    if (!pending) return "Không tìm thấy lượt ủng hộ";
    const form = new FormData();
    form.append("file", await resizeImageFile(file));
    form.append("token", pending.token);
    const res = await fetch(`/api/donations/${pending.id}/receipt`, { method: "POST", body: form });
    const json = await res.json();
    if (!res.ok) return json.error || "Không gửi được ảnh bill";
    savePending(null);
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return null;
  }

  function restart() {
    savePending(null);
    setPending(null);
    setError("");
    setStep("form");
  }

  return (
    <>
      <section className="bg-goda-navy py-12 md:py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-3">
            <Heart className="size-7 md:size-9 inline-block mr-2 align-middle text-goda-yellow" aria-hidden="true" />
            Ủng hộ GODA FC
          </h1>
          <p className="text-gray-300">Mọi đóng góp đều vào quỹ đội và được công khai minh bạch. Cảm ơn bạn!</p>
        </div>
        <div className="h-1.5 bg-goda-yellow mt-12 md:mt-16" />
      </section>

      <section className="py-8 md:py-12 bg-goda-warm-white">
        <div className="max-w-lg mx-auto px-4 space-y-4">
          <ol className="flex items-center justify-between gap-2 text-xs font-medium text-gray-500">
            {["Nhập số tiền", "Chuyển khoản & gửi bill", "Chờ xác nhận"].map((label, i) => {
              const active = (step === "form" && i === 0) || (step === "pay" && i === 1) || (step === "done" && i === 2);
              const done = (step === "pay" && i < 1) || (step === "done" && i < 2);
              return (
                <li key={label} className={`flex flex-1 items-center gap-1.5 ${active ? "text-goda-navy" : ""}`}>
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      active ? "bg-goda-navy text-white" : done ? "bg-goda-yellow text-goda-navy" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="leading-tight">{label}</span>
                </li>
              );
            })}
          </ol>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "form" && (
            <Card>
              <CardContent>
                <form onSubmit={create} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên hiển thị</Label>
                    <Input
                      id="name"
                      placeholder="Vd: Anh Tuấn — FC Thanh Xuân"
                      maxLength={60}
                      value={name}
                      disabled={anonymous}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="size-4" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                      Ủng hộ ẩn danh
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Số tiền</Label>
                    <MoneyInput id="amount" placeholder="200.000" value={amount} onChange={setAmount} />
                    <div className="flex flex-wrap gap-2">
                      {QUICK.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAmount(String(v))}
                          className={`rounded-full px-3 py-1 text-sm ring-1 ${
                            Number(amount) === v ? "bg-goda-navy text-white ring-goda-navy" : "bg-white text-gray-700 ring-black/10 hover:bg-goda-navy/5"
                          }`}
                        >
                          {formatVnd(v)}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="size-4" checked={showAmount} onChange={(e) => setShowAmount(e.target.checked)} />
                      Hiện số tiền trên trang chủ
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Lời nhắn (không bắt buộc)</Label>
                    <Input id="message" placeholder="Vd: Chúc GODA FC đá hay!" maxLength={120} value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>

                  <Button type="submit" disabled={busy} className="w-full bg-goda-navy hover:bg-goda-navy/90">
                    {busy ? "Đang tạo mã..." : `Tạo mã QR ủng hộ${Number(amount) ? ` · ${formatVnd(Number(amount))}` : ""}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "pay" && pending && (
            <PayAndUpload
              amount={pending.amount}
              code={pending.code}
              onSubmit={upload}
              footer={
                <button type="button" onClick={restart} className="w-full text-xs text-gray-500 underline">
                  Nhập lại số tiền khác
                </button>
              }
            />
          )}

          {step === "done" && (
            <Card>
              <CardContent className="space-y-3 py-4 text-center">
                <p className="text-4xl">💛</p>
                <p className="font-display text-xl font-bold text-goda-navy">Cảm ơn {pending?.name ?? "bạn"}!</p>
                <p className="text-sm text-gray-600">
                  Chủ tịch CLB sẽ đối chiếu tài khoản và xác nhận. Sau khi xác nhận, lời cảm ơn sẽ hiện trên trang chủ GODA FC.
                </p>
                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
                  <Link href="/" className="rounded-lg bg-goda-navy px-4 py-2 text-sm font-medium text-white">
                    Về trang chủ
                  </Link>
                  <button type="button" onClick={restart} className="rounded-lg px-4 py-2 text-sm text-goda-navy ring-1 ring-goda-navy/30">
                    Ủng hộ thêm
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════
// GODA FC — Member Login Page (số điện thoại + mật khẩu)
// ═══════════════════════════════════════

"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function LoginForm() {
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  // Chỉ nhận đường dẫn nội bộ — tránh bị lợi dụng chuyển hướng sang web khác.
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/member";
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("member-phone", {
      phone,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Số điện thoại hoặc mật khẩu không đúng. Vui lòng thử lại.");
      setLoading(false);
    } else {
      // Tải lại hẳn trang: router cache của Next còn giữ kết quả prefetch cũ
      // "/member → /member/login" (lúc chưa đăng nhập), router.push sẽ dùng lại
      // nó và kẹt ở trang đăng nhập.
      window.location.replace(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-goda-navy px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-display text-goda-navy">
            ⚽ Đăng nhập GODA FC
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Đăng nhập bằng số điện thoại — mật khẩu mặc định lần đầu: 123456
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-goda-navy hover:bg-goda-navy/90"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-500">
            Quản trị nội dung website?{" "}
            <Link href="/login" className="text-goda-navy underline">
              Đăng nhập bằng email
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const mustChange = session?.user?.mustChangePassword === true;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/member/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Không đổi được mật khẩu");
        setLoading(false);
        return;
      }
      await update();
      setSuccess(true);
      setTimeout(() => router.push("/member"), 1200);
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          {mustChange && (
            <p className="text-sm text-amber-600">
              Bạn đang dùng mật khẩu mặc định — vui lòng đặt mật khẩu mới trước khi tiếp tục.
            </p>
          )}
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert>
              <AlertDescription>Đổi mật khẩu thành công! Đang chuyển trang...</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!mustChange && (
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-goda-navy hover:bg-goda-navy/90">
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
              {mustChange && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: "/member/login" })}
                >
                  Đăng xuất
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

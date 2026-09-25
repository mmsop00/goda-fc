"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function MemberLogoutButton() {
  return (
    <Button
      size="sm"
      variant="outline"
      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
      onClick={async () => {
        // redirect: false — callbackUrl của NextAuth bị đổi sang domain AUTH_URL.
        // Tải lại hẳn trang để xoá router cache còn giữ dữ liệu của người vừa thoát.
        await signOut({ redirect: false });
        window.location.replace("/member/login");
      }}
    >
      Đăng xuất
    </Button>
  );
}

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
        await signOut({ redirect: false });
        window.location.href = "/member/login";
      }}
    >
      Đăng xuất
    </Button>
  );
}

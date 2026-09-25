"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MemberLogoutButton() {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
      onClick={async () => {
        // redirect: false — callbackUrl của NextAuth bị đổi sang domain AUTH_URL.
        await signOut({ redirect: false });
        router.push("/member/login");
        router.refresh();
      }}
    >
      Đăng xuất
    </Button>
  );
}

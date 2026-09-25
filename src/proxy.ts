// ═══════════════════════════════════════
// GODA FC — Proxy (Next.js 16 đổi tên từ middleware.ts)
// Gate lạc quan (chỉ đọc JWT, không chạm DB) cho /admin và /member.
// Mọi route API tài chính vẫn tự kiểm tra lại qua src/lib/finance-auth.ts.
// ═══════════════════════════════════════

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user as
    | { kind?: string; financeRole?: string; mustChangePassword?: boolean }
    | undefined;

  if (pathname.startsWith("/admin")) {
    if (!user || user.kind !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return;
  }

  if (pathname.startsWith("/member") && pathname !== "/member/login") {
    if (!user || user.kind !== "member") {
      return NextResponse.redirect(new URL("/member/login", req.url));
    }
    if (user.mustChangePassword && pathname !== "/member/doi-mat-khau") {
      return NextResponse.redirect(new URL("/member/doi-mat-khau", req.url));
    }
    if (pathname.startsWith("/member/chu-tich") && user.financeRole !== "chairman") {
      return NextResponse.redirect(new URL("/member", req.url));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};

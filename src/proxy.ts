// ═══════════════════════════════════════
// GODA FC — Proxy (Next.js 16 đổi tên từ middleware.ts)
// Gate lạc quan (chỉ đọc JWT, không chạm DB) cho /admin và /member.
// Mọi route API tài chính vẫn tự kiểm tra lại qua src/lib/finance-auth.ts.
// ═══════════════════════════════════════

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // req.url bị NextAuth đổi theo AUTH_URL (goda-fc.vercel.app) — dùng host
  // thật của request để người dùng ở lại clbgoda.vn.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const base = host ? `${proto}://${host}` : req.url;
  const user = req.auth?.user as
    | { kind?: string; financeRole?: string; mustChangePassword?: boolean }
    | undefined;

  if (pathname.startsWith("/admin")) {
    if (!user || user.kind !== "admin") {
      return NextResponse.redirect(new URL("/login", base));
    }
    return;
  }

  if (pathname.startsWith("/member") && pathname !== "/member/login") {
    if (!user || user.kind !== "member") {
      return NextResponse.redirect(new URL("/member/login", base));
    }
    if (user.mustChangePassword && pathname !== "/member/doi-mat-khau") {
      return NextResponse.redirect(new URL("/member/doi-mat-khau", base));
    }
    if (pathname.startsWith("/member/quy/chu-tich") && user.financeRole !== "chairman") {
      return NextResponse.redirect(new URL("/member/quy", base));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};

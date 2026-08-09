// ═══════════════════════════════════════
// GODA FC — Auth Middleware
// ═══════════════════════════════════════

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // Allow access to login page even if not logged in
  if (pathname === "/admin/login") {
    // If already logged in, redirect to dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users from /admin/* to login
  if (pathname.startsWith("/admin") && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};

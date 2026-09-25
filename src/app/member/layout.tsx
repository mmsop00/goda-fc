import Link from "next/link";
import { auth } from "@/auth";
import { MemberLogoutButton } from "./member-logout-button";
import { MemberSessionProvider } from "./member-session-provider";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  const isChairman = user?.kind === "member" && user?.financeRole === "chairman";

  return (
    <MemberSessionProvider session={session}>
    <div className="min-h-screen flex flex-col bg-goda-soft-gray">
      <header className="bg-goda-navy text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/member" className="font-display font-bold text-lg whitespace-nowrap">
            ⚽ Quỹ GODA FC
          </Link>
          {user?.kind === "member" && (
            <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <Link href="/member" className="hover:underline">
                Tổng quan
              </Link>
              {isChairman && (
                <>
                  <Link href="/member/chu-tich" className="hover:underline">
                    Chi tiết CLB
                  </Link>
                  <Link href="/member/chu-tich/duyet" className="hover:underline">
                    Duyệt đóng tiền
                  </Link>
                  <Link href="/member/chu-tich/tao-khoan-thu" className="hover:underline">
                    Tạo khoản thu
                  </Link>
                </>
              )}
              <Link href="/member/doi-mat-khau" className="hover:underline">
                Đổi mật khẩu
              </Link>
            </nav>
          )}
        </div>
        {user?.kind === "member" && (
          <div className="flex items-center gap-3 text-sm">
            <span className="whitespace-nowrap">
              {user.name}
              {isChairman && " (Chủ tịch)"}
            </span>
            <MemberLogoutButton />
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
    </div>
    </MemberSessionProvider>
  );
}

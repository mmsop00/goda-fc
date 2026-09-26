import { auth } from "@/auth";
import { MemberLogoutButton } from "./member-logout-button";
import { MemberSessionProvider } from "./member-session-provider";
import { MemberTabs, type TabItem } from "./member-tabs";

// Các tính năng của khu thành viên — thêm tính năng mới thì thêm 1 tab ở đây.
const TABS: TabItem[] = [
  { label: "Quỹ CLB", href: "/member/quy" },
  { label: "Hồ sơ cầu thủ", href: "/member/ho-so" },
  { label: "Tài khoản", href: "/member/doi-mat-khau" },
];

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user?.kind === "member" ? session.user : null;
  const isChairman = user?.financeRole === "chairman";

  return (
    <MemberSessionProvider session={session}>
      <div className="min-h-screen flex flex-col bg-goda-soft-gray">
        {user && (
          <header className="bg-goda-navy text-white">
            <div className="max-w-5xl mx-auto px-4 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60">Khu thành viên</p>
                <p className="font-display font-bold text-lg">
                  {user.name}
                  {isChairman && (
                    <span className="ml-2 rounded-full bg-goda-yellow px-2 py-0.5 text-xs font-semibold text-goda-navy align-middle">
                      Chủ tịch
                    </span>
                  )}
                </p>
              </div>
              <MemberLogoutButton />
            </div>
            <div className="max-w-5xl mx-auto px-2 mt-2">
              {!user.mustChangePassword && <MemberTabs items={TABS} />}
            </div>
          </header>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </MemberSessionProvider>
  );
}

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-goda-soft-gray">
      {/* Status bar only — NavBar already provides GODA FC branding */}
      <div className="bg-goda-yellow/10 border-b border-goda-yellow/30 px-4 py-2.5 text-center text-sm text-goda-navy font-medium">
        🔒 Khu vực thành viên — yêu cầu đăng nhập
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Status bar only — NavBar already provides GODA FC branding */}
      <div className="bg-goda-navy/5 border-b border-goda-navy/20 px-4 py-2.5 text-center text-sm text-goda-navy font-medium">
        🔒 Khu vực quản trị
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}

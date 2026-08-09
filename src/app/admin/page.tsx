import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, Newspaper, Trophy, Calendar } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  const quickLinks = [
    { icon: Calendar, label: "Trận đấu", href: "/admin/tran-dau", desc: "Quản lý lịch & kết quả" },
    { icon: Users, label: "Thành viên", href: "/admin/thanh-vien", desc: "Quản lý danh sách cầu thủ" },
    { icon: Newspaper, label: "Tin tức", href: "/admin/tin-tuc", desc: "Viết & chỉnh sửa bài viết" },
    { icon: Trophy, label: "Hall of Fame", href: "/admin/hall-of-fame", desc: "Quản lý danh hiệu" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-goda-navy">
            🛡️ Bảng điều khiển
          </h1>
          <p className="text-gray-500 mt-1">
            Xin chào, {session?.user?.name || session?.user?.email || "Admin"}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button
            type="submit"
            variant="outline"
            className="gap-2 text-gray-500 hover:text-red-500"
          >
            <LogOut className="size-4" />
            Đăng xuất
          </Button>
        </form>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-l-4 border-l-goda-yellow">
              <CardHeader className="pb-2">
                <link.icon className="size-8 text-goda-navy mb-1" />
                <CardTitle className="text-lg">{link.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="mt-8 border-dashed border-2 border-gray-200 bg-gray-50/50">
        <CardContent className="flex flex-col items-center py-10 gap-2">
          <p className="text-gray-400 text-sm">
            ⚡ Trang quản trị đang được xây dựng. Các chức năng CRUD sẽ sớm ra mắt.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

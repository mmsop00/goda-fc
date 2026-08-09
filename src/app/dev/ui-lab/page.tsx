import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Trophy, Star, Shield, Award } from "lucide-react";

export default function UiLabPage() {
  const colors = [
    { name: "Primary Yellow", hex: "#F7C600", className: "bg-goda-yellow" },
    { name: "Deep Navy", hex: "#0B1E3A", className: "bg-goda-navy" },
    { name: "GODA Green", hex: "#0F6B4D", className: "bg-goda-green" },
    {
      name: "Warm White",
      hex: "#FFFDF6",
      className: "bg-goda-warm-white border border-gray-200",
    },
    { name: "Soft Gray", hex: "#F2F4F7", className: "bg-goda-soft-gray" },
    { name: "Text Dark", hex: "#152033", className: "bg-goda-text-dark" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl text-goda-navy mb-2">
          UI Lab
        </h1>
        <p className="text-gray-500 text-lg">
          Component catalog — kiểm thử và trưng bày các UI components của GODA FC.
        </p>
      </div>

      {/* ─── Section 1: Color Palette ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          🎨 Bảng màu thương hiệu
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {colors.map((color) => (
            <Card key={color.name} className="items-center gap-3 py-4">
              <div className={`w-20 h-20 rounded-card ${color.className}`} />
              <span className="text-sm font-medium text-center">
                {color.name}
              </span>
              <code className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                {color.hex}
              </code>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Section 2: Typography ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          🔤 Kiểu chữ
        </h2>
        <Card className="p-6 space-y-4">
          <p className="font-display text-5xl font-extrabold text-goda-navy">
            GODA FC — 1994
          </p>
          <p className="font-display text-3xl font-bold text-goda-navy">
            Heading Display — Be Vietnam Pro Bold
          </p>
          <p className="font-display text-xl font-semibold text-goda-navy">
            Section Title — Be Vietnam Pro Semibold
          </p>
          <p className="text-base text-goda-text-dark">
            Body text — Câu lạc bộ bóng đá GODA thành lập năm 1994 tại Hà Nội.
            Sử dụng font Be Vietnam Pro với fallback Manrope, Inter.
          </p>
          <p className="text-sm text-gray-500">
            Caption / Meta text — Smaller supporting information
          </p>
        </Card>
      </section>

      {/* ─── Section 3: Buttons (Fix C-004) ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          🔘 Buttons
        </h2>
        <Card className="p-6">
          {/* Standard variants */}
          <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
            shadcn/ui Variants
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>

          {/* GODA custom variants */}
          <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
            GODA Custom Variants
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button className="bg-goda-yellow text-goda-navy hover:bg-goda-yellow/90 font-semibold">
              GODA Yellow
            </Button>
            <Button className="bg-goda-navy text-white hover:bg-goda-navy/90">
              GODA Navy
            </Button>
            <Button className="bg-goda-green text-white hover:bg-goda-green/90">
              GODA Green
            </Button>
          </div>

          {/* Sizes */}
          <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
            Sizes
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>

          {/* States */}
          <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
            States
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled</Button>
            <Button>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Loading
            </Button>
          </div>
        </Card>
      </section>

      {/* ─── Section 4: Badges ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          🏷️ Badges
        </h2>
        <Card className="p-6">
          {/* Standard variants */}
          <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
            shadcn/ui Variants
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>

          {/* GODA custom badges */}
          <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
            GODA Custom
          </h3>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-goda-yellow/20 text-goda-navy hover:bg-goda-yellow/30">
              <Trophy className="size-3" />
              MVP
            </Badge>
            <Badge className="bg-goda-green/20 text-goda-green hover:bg-goda-green/30">
              <Shield className="size-3" />
              Active
            </Badge>
            <Badge className="bg-goda-navy/20 text-goda-navy hover:bg-goda-navy/30">
              <Star className="size-3" />
              1994
            </Badge>
            <Badge variant="secondary">Inactive</Badge>
            <Badge className="bg-goda-yellow/20 text-goda-navy hover:bg-goda-yellow/30">
              <Award className="size-3" />
              Hall of Fame
            </Badge>
          </div>
        </Card>
      </section>

      {/* ─── Section 5: Cards ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          🃏 Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Card */}
          <Card className="p-0">
            <CardHeader>
              <CardTitle>Thẻ cơ bản</CardTitle>
              <CardDescription>
                Card sử dụng shadcn/ui với title và description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Đây là nội dung bên trong card. Có thể chứa text, buttons,
                images, hoặc bất kỳ component nào.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Xem thêm
              </Button>
            </CardFooter>
          </Card>

          {/* GODA Card utility */}
          <div className="card-goda p-0">
            <CardHeader>
              <CardTitle>Card GODA Style</CardTitle>
              <CardDescription>
                Sử dụng <code>.card-goda</code> utility class.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Card với radius 18px, shadow nhẹ và border GODA Soft Gray.
                Hover để thấy hiệu ứng shadow tăng.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">
                Hành động
              </Button>
            </CardFooter>
          </div>

          {/* Image placeholder card */}
          <Card className="p-0 overflow-hidden">
            <div className="h-40 bg-goda-soft-gray flex items-center justify-center">
              <Trophy className="size-16 text-goda-yellow/40" />
            </div>
            <CardHeader>
              <CardTitle>Card có ảnh</CardTitle>
              <CardDescription>Image placeholder + nội dung.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Ảnh được đặt trong div placeholder. Sẽ thay bằng ảnh thật sau
                khi tích hợp Supabase Storage.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm" className="bg-goda-navy text-white hover:bg-goda-navy/90">
                Chi tiết
              </Button>
              <Button size="sm" variant="outline">
                Chia sẻ
              </Button>
            </CardFooter>
          </Card>

          {/* Action card */}
          <Card className="p-0">
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
              <CardDescription>Card với action buttons ở footer.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Pattern thường dùng cho các section cần người dùng thực hiện
                hành động như tạo mới, import, hoặc cấu hình.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Hủy
              </Button>
              <Button size="sm">Xác nhận</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* ─── Section 6: Form Inputs ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          📝 Form Inputs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
              Input cơ bản
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" type="tel" placeholder="0912345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="example@goda.vn" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
              Trạng thái
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled</Label>
                <Input id="disabled" disabled placeholder="Không thể chỉnh sửa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readonly">Read Only</Label>
                <Input id="readonly" value="Dữ liệu có sẵn" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error" className="text-destructive">
                  Có lỗi
                </Label>
                <Input
                  id="error"
                  placeholder="Nhập sai định dạng"
                  className="border-destructive focus-visible:ring-destructive/20"
                />
                <p className="text-xs text-destructive">
                  Vui lòng nhập đúng định dạng.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-medium text-lg text-goda-navy mb-4">
              Form mẫu
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Biệt danh</Label>
                <Input id="nickname" placeholder="VD: Goda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Vị trí</Label>
                <Input id="position" placeholder="VD: Tiền đạo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Số áo</Label>
                <Input id="number" type="number" placeholder="VD: 10" />
              </div>
              <Button size="sm" className="w-full mt-2">
                Lưu
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── Section 7: Loading States (Skeleton) ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          💀 Trạng thái đang tải
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skeleton Card */}
          <Card className="p-0 overflow-hidden">
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>

          {/* Skeleton Text */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </Card>

          {/* Skeleton List */}
          <Card className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-3 w-[40%]" />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* ─── Section 8: Empty State ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          📭 Trạng thái trống
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-dashed border-2 border-gray-300 bg-goda-soft-gray/50">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="text-6xl">📭</div>
              <h3 className="font-display font-semibold text-xl text-goda-navy">
                Chưa có dữ liệu
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Nội dung sẽ xuất hiện ở đây khi có dữ liệu. Hãy bắt đầu bằng
                cách tạo mới.
              </p>
              <Button variant="outline" className="mt-2">
                Tạo mới
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-gray-300 bg-goda-soft-gray/50">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <Trophy className="size-16 text-goda-yellow/30" />
              <h3 className="font-display font-semibold text-xl text-goda-navy">
                Chưa có trận đấu nào
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Lịch sử trận đấu sẽ hiển thị tại đây sau khi admin thêm trận
                đầu tiên.
              </p>
              <Button variant="ghost" size="sm">
                Tìm hiểu thêm →
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── Section 9: Error State ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          ❌ Trạng thái lỗi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Đã xảy ra lỗi</AlertTitle>
              <AlertDescription>
                Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng và thử
                lại.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="size-4" />
              <AlertTitle>Thông báo</AlertTitle>
              <AlertDescription>
                Dữ liệu đã được cập nhật thành công. Các thay đổi sẽ hiển thị
                trong giây lát.
              </AlertDescription>
            </Alert>
          </div>

          <Card className="border-red-300 bg-red-50">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
              <AlertCircle className="size-12 text-destructive" />
              <h3 className="font-display font-semibold text-xl text-destructive">
                Tải thất bại
              </h3>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Có vấn đề khi tải dữ liệu từ máy chủ. Vui lòng thử lại sau vài
                phút.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── Section 10: Separator ─── */}
      <section className="mb-10 md:mb-14">
        <h2 className="font-display font-semibold text-2xl text-goda-navy mb-6">
          ➖ Separator / Phân cách
        </h2>
        <Card className="p-6 space-y-6">
          {/* Horizontal default */}
          <div>
            <h3 className="font-display font-medium text-goda-navy mb-3">
              Separator ngang (mặc định)
            </h3>
            <p className="text-sm text-gray-500 mb-3">Nội dung phía trên</p>
            <Separator />
            <p className="text-sm text-gray-500 mt-3">Nội dung phía dưới</p>
          </div>

          {/* With label */}
          <div>
            <h3 className="font-display font-medium text-goda-navy mb-3">
              Separator có nhãn
            </h3>
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-sm text-gray-400 font-medium shrink-0">
                HOẶC
              </span>
              <Separator className="flex-1" />
            </div>
          </div>

          {/* GODA colored */}
          <div>
            <h3 className="font-display font-medium text-goda-navy mb-3">
              Separator màu GODA
            </h3>
            <Separator className="bg-goda-yellow" />
            <Separator className="bg-goda-navy my-3" />
            <Separator className="bg-goda-green" />
          </div>

          {/* Vertical separator demo */}
          <div>
            <h3 className="font-display font-medium text-goda-navy mb-3">
              Separator dọc
            </h3>
            <div className="flex h-16 items-center gap-4">
              <span className="text-sm">Cột A</span>
              <Separator orientation="vertical" className="h-8" />
              <span className="text-sm">Cột B</span>
              <Separator orientation="vertical" className="h-8" />
              <span className="text-sm">Cột C</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Page Footer */}
      <Separator className="mb-6" />
      <p className="text-center text-sm text-gray-400">
        GODA FC UI Lab — Design Tokens & Component Catalog
      </p>
    </div>
  );
}

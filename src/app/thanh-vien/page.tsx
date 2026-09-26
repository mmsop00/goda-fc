import { ThanhVienView } from "@/components/public/thanh-vien-view";
import { getPublicMembers } from "@/lib/public-members";

// Làm mới định kỳ; lưu hồ sơ cũng gọi revalidatePath để cập nhật ngay.
export const revalidate = 300;

export default async function ThanhVienPage() {
  return <ThanhVienView members={await getPublicMembers()} />;
}

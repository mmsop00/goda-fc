import { HomeView } from "@/components/public/home-view";
import { getPublicMembers } from "@/lib/public-members";

// Làm mới định kỳ; lưu hồ sơ cầu thủ cũng gọi revalidatePath để cập nhật ngay.
export const revalidate = 300;

export default async function PublicHomePage() {
  return <HomeView members={await getPublicMembers()} />;
}

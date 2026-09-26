import { HomeView } from "@/components/public/home-view";
import { getPublicMembers } from "@/lib/public-members";
import { getPublicDonations } from "@/lib/finance/donations";

// Làm mới định kỳ; lưu hồ sơ cầu thủ / xác nhận ủng hộ cũng gọi revalidatePath để cập nhật ngay.
export const revalidate = 300;

export default async function PublicHomePage() {
  const [members, donations] = await Promise.all([getPublicMembers(), getPublicDonations()]);
  return <HomeView members={members} donations={donations} />;
}

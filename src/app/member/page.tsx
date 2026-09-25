import { redirect } from "next/navigation";

// Khu thành viên hiện mới có tab Quỹ CLB — mở thẳng tab này.
export default function MemberHomePage() {
  redirect("/member/quy");
}

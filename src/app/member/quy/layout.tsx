import { auth } from "@/auth";
import { MemberTabs } from "../member-tabs";

const CHAIRMAN_TABS = [
  { label: "Khoản của tôi", href: "/member/quy" },
  { label: "Chi tiết CLB", href: "/member/quy/chu-tich" },
  { label: "Duyệt đóng tiền", href: "/member/quy/chu-tich/duyet" },
  { label: "Tạo khoản thu", href: "/member/quy/chu-tich/tao-khoan-thu" },
];

export default async function FundLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isChairman = session?.user?.financeRole === "chairman";

  return (
    <>
      {isChairman && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <MemberTabs items={CHAIRMAN_TABS} variant="sub" />
        </div>
      )}
      {children}
    </>
  );
}

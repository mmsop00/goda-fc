import { auth } from "@/auth";
import { MemberTabs } from "../member-tabs";

const MEMBER_TABS = [
  { label: "Khoản của tôi", href: "/member/quy" },
  { label: "Báo cáo tài chính", href: "/member/quy/bao-cao" },
];

const CHAIRMAN_TABS = [
  ...MEMBER_TABS,
  { label: "Duyệt đóng tiền", href: "/member/quy/chu-tich/duyet" },
  { label: "Thu chi", href: "/member/quy/chu-tich/thu-chi" },
];

export default async function FundLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isChairman = session?.user?.financeRole === "chairman";

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <MemberTabs items={isChairman ? CHAIRMAN_TABS : MEMBER_TABS} variant="sub" />
      </div>
      {children}
    </>
  );
}

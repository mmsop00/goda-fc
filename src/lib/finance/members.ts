import { prisma } from "@/lib/prisma";
import { MOCK_MEMBERS } from "@/lib/mock-data";

export interface FinanceMember {
  id: string;
  name: string;
  /** DD/MM/YYYY (ngày/tháng có thể là "xx") */
  birthday: string | null;
}

/** Thành viên có tài khoản quỹ (đã gán SĐT), theo thứ tự danh sách CLB.
 * Ngày sinh lấy từ MOCK_MEMBERS vì dữ liệu seed cũ trong DB chỉ có DD/MM, thiếu năm. */
export async function getFinanceMembers(): Promise<FinanceMember[]> {
  const rows = await prisma.member.findMany({
    where: { phone: { not: null } },
    select: { id: true, name: true, birthday: true },
  });
  const order = new Map(MOCK_MEMBERS.map((m, i) => [m.name, i]));
  const birthdays = new Map(MOCK_MEMBERS.map((m) => [m.name, m.birthday]));
  return rows
    .map((r) => ({ id: r.id, name: r.name, birthday: birthdays.get(r.name) ?? r.birthday ?? null }))
    .sort((a, b) => (order.get(a.name) ?? 999) - (order.get(b.name) ?? 999));
}

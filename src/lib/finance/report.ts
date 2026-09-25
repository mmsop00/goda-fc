// Báo cáo tài chính đội từ DB — mọi thành viên xem được.

import { prisma } from "@/lib/prisma";
import { getFinanceMembers } from "./members";
import { buildReport, type FinanceReport } from "./report-core";

export type { FinanceReport, LedgerRow, BillProgress, MemberStanding } from "./report-core";

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const toVnDate = (d: Date) => new Date(d.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);

/** Số dư quỹ = tiền thành viên đã đóng (đã xác nhận) + thu ngoài − chi. */
export async function getFundBalance(): Promise<number> {
  const [paid, entries] = await Promise.all([
    prisma.paymentItem.aggregate({ where: { status: "da_dong" }, _sum: { amount: true } }),
    prisma.fundEntry.groupBy({ by: ["direction"], _sum: { amount: true } }),
  ]);
  const sum = (dir: string) => entries.find((e) => e.direction === dir)?._sum.amount ?? 0;
  return (paid._sum.amount ?? 0) + sum("thu") - sum("chi");
}

export async function getFinanceReport(): Promise<FinanceReport> {
  const [members, bills, entries] = await Promise.all([
    getFinanceMembers(),
    prisma.bill.findMany({
      include: { items: { select: { memberId: true, amount: true, status: true, confirmedAt: true } } },
    }),
    prisma.fundEntry.findMany(),
  ]);
  return buildReport(
    members,
    bills.map((b) => ({
      id: b.id,
      title: b.title,
      kind: b.kind,
      dueDate: b.dueDate,
      createdAt: toVnDate(b.createdAt),
      items: b.items.map((it) => ({
        memberId: it.memberId,
        amount: it.amount,
        status: it.status,
        paidDate: it.confirmedAt ? toVnDate(it.confirmedAt) : null,
      })),
    })),
    entries
  );
}

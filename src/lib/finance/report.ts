// Báo cáo tài chính đội từ DB — mọi thành viên xem được.

import { prisma } from "@/lib/prisma";
import { getFinanceMembers } from "./members";
import { buildReport, type FinanceReport } from "./report-core";

export type { FinanceReport, LedgerRow, BillProgress, MemberStanding, CreditRow } from "./report-core";

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const toVnDate = (d: Date) => new Date(d.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);

/** Số dư quỹ = tiền thực có: thành viên thực nộp + thu ngoài − chi (tính giống báo cáo). */
export async function getFundBalance(): Promise<number> {
  return (await getFinanceReport()).balance;
}

export async function getFinanceReport(): Promise<FinanceReport> {
  const [members, bills, entries, credits, donations] = await Promise.all([
    getFinanceMembers(),
    prisma.bill.findMany({
      include: { items: { select: { id: true, memberId: true, amount: true, status: true, confirmedAt: true } } },
    }),
    prisma.fundEntry.findMany(),
    prisma.creditEntry.findMany(),
    prisma.donation.findMany({
      where: { status: "da_xac_nhan" },
      select: { id: true, donorName: true, anonymous: true, receivedAmount: true, confirmedAt: true, message: true },
    }),
  ]);
  return buildReport(
    members,
    bills.map((b) => ({
      id: b.id,
      title: b.title,
      kind: b.kind,
      period: b.period,
      dueDate: b.dueDate,
      createdAt: toVnDate(b.createdAt),
      items: b.items.map((it) => ({
        id: it.id,
        memberId: it.memberId,
        amount: it.amount,
        status: it.status,
        paidDate: it.confirmedAt ? toVnDate(it.confirmedAt) : null,
      })),
    })),
    entries,
    credits.map((c) => ({
      id: c.id,
      memberId: c.memberId,
      kind: c.kind,
      amount: c.amount,
      date: toVnDate(c.createdAt),
      paymentIntentId: c.paymentIntentId,
      paymentItemId: c.paymentItemId,
      note: c.note,
    })),
    donations.map((d) => ({
      id: d.id,
      name: d.anonymous ? "Ẩn danh" : d.donorName,
      amount: d.receivedAmount ?? 0,
      date: toVnDate(d.confirmedAt ?? new Date()),
      message: d.message,
    }))
  );
}

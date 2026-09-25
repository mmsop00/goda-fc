// Báo cáo tài chính đội — mọi thành viên xem được.

import { prisma } from "@/lib/prisma";
import { getFinanceMembers } from "./members";
import { categoryLabel, type Direction } from "./categories";

export interface LedgerRow {
  id: string;
  date: string; // YYYY-MM-DD giờ VN
  direction: Direction;
  /** "dong_quy" = thành viên đóng qua cổng; "so_quy" = chủ tịch ghi tay (xoá được) */
  source: "dong_quy" | "so_quy";
  /** Khoản thu (Bill) của lượt đóng quỹ; null với dòng sổ quỹ ghi tay */
  billId: string | null;
  category: string;
  categoryLabel: string;
  title: string;
  memberName: string | null;
  note: string | null;
  amount: number;
}

export interface BillProgress {
  id: string;
  title: string;
  dueDate: string | null;
  createdAt: string;
  expected: number;
  collected: number;
  pending: number;
  memberCount: number;
  paidCount: number;
}

export interface MemberStanding {
  memberId: string;
  name: string;
  daDong: number;
  choDuyet: number;
  chuaDong: number;
}

export interface FinanceReport {
  balance: number;
  outstanding: { chuaDong: number; choDuyet: number };
  ledger: LedgerRow[];
  bills: BillProgress[];
  members: MemberStanding[];
}

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
      orderBy: { createdAt: "desc" },
      include: { items: { select: { memberId: true, amount: true, status: true, confirmedAt: true } } },
    }),
    prisma.fundEntry.findMany(),
  ]);
  const nameOf = new Map(members.map((m) => [m.id, m.name]));
  const standing = new Map(members.map((m) => [m.id, { memberId: m.id, name: m.name, daDong: 0, choDuyet: 0, chuaDong: 0 }]));

  const ledger: LedgerRow[] = [];
  const billProgress: BillProgress[] = [];
  const outstanding = { chuaDong: 0, choDuyet: 0 };

  for (const bill of bills) {
    const p: BillProgress = {
      id: bill.id,
      title: bill.title,
      dueDate: bill.dueDate,
      createdAt: toVnDate(bill.createdAt),
      expected: 0,
      collected: 0,
      pending: 0,
      memberCount: bill.items.length,
      paidCount: 0,
    };
    const category = bill.kind === "quy_thang" ? "quy_thang" : "dong_gop";
    for (const item of bill.items) {
      p.expected += item.amount;
      const s = standing.get(item.memberId);
      if (item.status === "da_dong") {
        p.collected += item.amount;
        p.paidCount++;
        if (s) s.daDong += item.amount;
        ledger.push({
          id: `${bill.id}:${item.memberId}`,
          date: toVnDate(item.confirmedAt ?? bill.createdAt),
          direction: "thu",
          source: "dong_quy",
          billId: bill.id,
          category,
          categoryLabel: categoryLabel("thu", category),
          title: bill.title,
          memberName: nameOf.get(item.memberId) ?? null,
          note: null,
          amount: item.amount,
        });
      } else if (item.status === "cho_duyet") {
        p.pending += item.amount;
        outstanding.choDuyet += item.amount;
        if (s) s.choDuyet += item.amount;
      } else {
        outstanding.chuaDong += item.amount;
        if (s) s.chuaDong += item.amount;
      }
    }
    billProgress.push(p);
  }

  for (const e of entries) {
    const direction = e.direction as Direction;
    ledger.push({
      id: e.id,
      date: e.date,
      direction,
      source: "so_quy",
      billId: null,
      category: e.category,
      categoryLabel: categoryLabel(direction, e.category),
      title: e.title,
      memberName: null,
      note: e.note,
      amount: e.amount,
    });
  }

  ledger.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  const balance = ledger.reduce((s, r) => s + (r.direction === "thu" ? r.amount : -r.amount), 0);

  return { balance, outstanding, ledger, bills: billProgress, members: [...standing.values()] };
}

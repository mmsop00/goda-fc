// ═══════════════════════════════════════
// GODA FC — Tự động tạo "Quỹ tháng" lúc 00:00 ngày 1 hằng tháng (giờ VN)
// Cùng luật với form tạo tay: miễn từ 70 tuổi / CLB miễn, tự trừ số dư đủ trọn
// khoản (createBill), không tạo trùng tháng. Gọi lặp lại nhiều lần vẫn an toàn.
// ═══════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { getFinanceMembers } from "./members";
import { monthlyFundExemption } from "./age";
import { createBill } from "./status";

export interface FundSettings {
  autoMonthly: boolean;
  monthlyAmount: number;
  dueDay: number | null;
}

const DEFAULTS: FundSettings = { autoMonthly: false, monthlyAmount: 200000, dueDay: null };

export async function getFundSettings(): Promise<FundSettings> {
  const s = await prisma.fundSetting.findUnique({ where: { id: "default" } });
  return s ? { autoMonthly: s.autoMonthly, monthlyAmount: s.monthlyAmount, dueDay: s.dueDay } : DEFAULTS;
}

export async function saveFundSettings(input: FundSettings, memberId: string) {
  const data = { ...input, updatedByMemberId: memberId };
  await prisma.fundSetting.upsert({ where: { id: "default" }, update: data, create: { id: "default", ...data } });
}

/** Giờ VN hiện tại → { year, month (1-12), day } */
export function vnToday(now = new Date()) {
  const d = new Date(now.getTime() + 7 * 3600_000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

const pad = (n: number) => String(n).padStart(2, "0");

export type MonthlyResult =
  | { status: "created"; title: string; members: number; exempt: number; paidByCredit: number }
  | { status: "exists"; title: string }
  | { status: "disabled" | "no_members" };

/** Tạo quỹ tháng cho tháng `year/month` nếu chưa có. */
export async function runMonthlyFund(year: number, month: number): Promise<MonthlyResult> {
  const settings = await getFundSettings();
  if (!settings.autoMonthly) return { status: "disabled" };

  const mm = pad(month);
  const title = `Quỹ tháng ${mm}/${year}`;
  const period = `${year}-${mm}`;
  if (await prisma.bill.findFirst({ where: { kind: "quy_thang", period }, select: { id: true } })) {
    return { status: "exists", title };
  }

  const members = await getFinanceMembers();
  const payers = members.filter((m) => !monthlyFundExemption(m, year, month));
  if (payers.length === 0) return { status: "no_members" };

  // Người tạo = chủ tịch (bắt buộc có trong DB để ghi "ai tạo")
  const chairman = await prisma.member.findFirst({ where: { financeRole: "chairman" }, select: { id: true } });
  if (!chairman) return { status: "no_members" };

  let dueDate: string | null = null;
  if (settings.dueDay) {
    const last = new Date(year, month, 0).getDate();
    dueDate = `${pad(Math.min(settings.dueDay, last))}/${mm}/${year}`;
  }

  const bill = await createBill({
    title,
    kind: "quy_thang",
    period,
    amountPerMember: settings.monthlyAmount,
    dueDate,
    createdByMemberId: chairman.id,
    items: payers.map((m) => ({ memberId: m.id, amount: settings.monthlyAmount })),
  });
  const paidByCredit = await prisma.paymentItem.count({ where: { billId: bill.id, status: "da_dong" } });
  return { status: "created", title, members: payers.length, exempt: members.length - payers.length, paidByCredit };
}

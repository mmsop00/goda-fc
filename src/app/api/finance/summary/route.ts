// ═══════════════════════════════════════
// GODA FC — Tổng quỹ CLB
// GET /api/finance/summary
//   Mọi thành viên: chỉ thấy 1 con số tổng quỹ đã xác nhận.
//   Riêng chủ tịch: kèm bảng chi tiết từng thành viên.
// ═══════════════════════════════════════

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/finance-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, error } = await requireMember();
  if (error) return error;

  const confirmedTotal = await prisma.paymentItem.aggregate({
    where: { status: "da_dong" },
    _sum: { amount: true },
  });

  if (session.financeRole !== "chairman") {
    return NextResponse.json({ totalFund: confirmedTotal._sum.amount ?? 0 });
  }

  const members = await prisma.member.findMany({
    select: {
      id: true,
      name: true,
      paymentItems: { select: { amount: true, status: true } },
    },
    orderBy: { name: "asc" },
  });

  const breakdown = members.map((m) => {
    const row = { memberId: m.id, name: m.name, chuaDong: 0, choDuyet: 0, daDong: 0 };
    for (const item of m.paymentItems) {
      if (item.status === "chua_dong") row.chuaDong += item.amount;
      else if (item.status === "cho_duyet") row.choDuyet += item.amount;
      else if (item.status === "da_dong") row.daDong += item.amount;
    }
    return row;
  });

  return NextResponse.json({
    totalFund: confirmedTotal._sum.amount ?? 0,
    breakdown,
  });
}

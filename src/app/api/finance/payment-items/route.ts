// ═══════════════════════════════════════
// GODA FC — Khoản cần đóng của chính thành viên đang đăng nhập
// GET /api/finance/payment-items
// ═══════════════════════════════════════

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/finance-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, error } = await requireMember();
  if (error) return error;

  const items = await prisma.paymentItem.findMany({
    where: { memberId: session.memberId },
    include: { bill: { select: { title: true, dueDate: true } } },
    orderBy: { createdAt: "desc" },
  });

  const summary = { chuaDong: 0, choDuyet: 0, daDong: 0 };
  for (const item of items) {
    if (item.status === "chua_dong") summary.chuaDong += item.amount;
    else if (item.status === "cho_duyet") summary.choDuyet += item.amount;
    else if (item.status === "da_dong") summary.daDong += item.amount;
  }

  return NextResponse.json({ items, summary });
}

// ═══════════════════════════════════════
// GODA FC — Khoản thu (Bill)
// GET  /api/finance/bills  → chủ tịch: danh sách khoản thu đã tạo
// POST /api/finance/bills  → chủ tịch: tạo khoản thu cho các thành viên được chọn
//   { kind: "quy_thang", month, year } | { kind: "khac", title, period: YYYY-MM }
//   + amountPerMember, dueDate? (DD/MM/YYYY), items: [{ memberId, amount }]
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { createBill } from "@/lib/finance/status";
import { parseBillInput } from "@/lib/finance/inputs";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireChairman();
  if (error) return error;

  const bills = await prisma.bill.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });
  return NextResponse.json(bills);
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireChairman();
  if (error) return error;

  try {
    const parsed = await parseBillInput(await request.json());
    if (!parsed.ok) return bad(parsed.error, parsed.status);
    const bill = await createBill({ ...parsed.value, createdByMemberId: session.memberId });
    return NextResponse.json(bill, { status: 201 });
  } catch (e) {
    console.error("POST /api/finance/bills error:", e);
    return bad("Lỗi không xác định", 500);
  }
}

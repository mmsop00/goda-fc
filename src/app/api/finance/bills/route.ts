// ═══════════════════════════════════════
// GODA FC — Khoản thu (Bill)
// GET  /api/finance/bills  → chủ tịch: danh sách khoản thu đã tạo
// POST /api/finance/bills  → chủ tịch: tạo khoản thu mới, fan-out cho mọi thành viên
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { createBill } from "@/lib/finance/status";

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

export async function POST(request: NextRequest) {
  const { session, error } = await requireChairman();
  if (error) return error;

  try {
    const body = await request.json();
    const title = (body.title as string | undefined)?.trim();
    const amountPerMember = Number(body.amountPerMember);
    const dueDate = body.dueDate as string | undefined;

    if (!title) {
      return NextResponse.json({ error: "Vui lòng nhập tiêu đề" }, { status: 400 });
    }
    if (!Number.isFinite(amountPerMember) || amountPerMember <= 0) {
      return NextResponse.json({ error: "Số tiền không hợp lệ" }, { status: 400 });
    }

    const bill = await createBill({
      title,
      amountPerMember,
      dueDate: dueDate || null,
      createdByMemberId: session.memberId,
    });
    return NextResponse.json(bill, { status: 201 });
  } catch (e) {
    console.error("POST /api/finance/bills error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

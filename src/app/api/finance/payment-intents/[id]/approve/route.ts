// ═══════════════════════════════════════
// GODA FC — Chủ tịch xác nhận đã nhận tiền (đối chiếu tài khoản ngân hàng thật)
// POST /api/finance/payment-intents/[id]/approve
// ═══════════════════════════════════════

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { approveIntent } from "@/lib/finance/status";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireChairman();
  if (error) return error;

  const { id } = await params;
  const intent = await prisma.paymentIntent.findUnique({ where: { id } });
  if (!intent) {
    return NextResponse.json({ error: "Không tìm thấy mã thanh toán" }, { status: 404 });
  }
  if (intent.status !== "cho_duyet") {
    return NextResponse.json({ error: "Khoản này không ở trạng thái chờ duyệt" }, { status: 400 });
  }

  try {
    const updated = await approveIntent(id, session.memberId);
    return NextResponse.json({ status: updated.status });
  } catch (e) {
    console.error("POST /api/finance/payment-intents/[id]/approve error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

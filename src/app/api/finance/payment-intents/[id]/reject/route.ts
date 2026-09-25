// ═══════════════════════════════════════
// GODA FC — Chủ tịch từ chối bill (vd ảnh không khớp) — trả khoản về "chưa đóng"
// POST /api/finance/payment-intents/[id]/reject  { note?: string }
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { rejectIntent } from "@/lib/finance/status";

export async function POST(
  request: NextRequest,
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
    const body = await request.json().catch(() => ({}));
    const note = typeof body.note === "string" ? body.note : undefined;
    const updated = await rejectIntent(id, session.memberId, note);
    return NextResponse.json({ status: updated.status });
  } catch (e) {
    console.error("POST /api/finance/payment-intents/[id]/reject error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

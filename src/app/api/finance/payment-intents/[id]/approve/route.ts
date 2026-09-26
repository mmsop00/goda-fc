// ═══════════════════════════════════════
// GODA FC — Chủ tịch xác nhận đã nhận tiền (đối chiếu tài khoản ngân hàng thật)
// POST /api/finance/payment-intents/[id]/approve  { receivedAmount?: số tiền thực nhận }
// ═══════════════════════════════════════

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { approveIntent } from "@/lib/finance/status";

export async function POST(
  request: Request,
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

  // Số tiền thực nhận — thiếu/thừa so với mã QR thì phần chênh vào số dư thành viên
  const body = await request.json().catch(() => ({}));
  let received: number | undefined;
  if (body.receivedAmount !== undefined) {
    received = body.receivedAmount;
    if (typeof received !== "number" || !Number.isInteger(received) || received <= 0 || received > 1_000_000_000) {
      return NextResponse.json({ error: "Số tiền thực nhận không hợp lệ" }, { status: 400 });
    }
  }

  try {
    const result = await approveIntent(id, session.memberId, received);
    return NextResponse.json({ status: "da_xac_nhan", ...result });
  } catch (e) {
    console.error("POST /api/finance/payment-intents/[id]/approve error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

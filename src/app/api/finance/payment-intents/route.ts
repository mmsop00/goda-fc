// ═══════════════════════════════════════
// GODA FC — Mã thanh toán (QR)
// GET  /api/finance/payment-intents  → chủ tịch: hàng đợi chờ duyệt
// POST /api/finance/payment-intents  → tạo mã QR cho 1 hoặc nhiều khoản đã chọn
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMember, requireChairman } from "@/lib/finance-auth";
import { createPaymentIntent } from "@/lib/finance/status";
import { buildVietQrUrl } from "@/lib/finance/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireChairman();
  if (error) return error;

  const intents = await prisma.paymentIntent.findMany({
    where: { status: "cho_duyet" },
    orderBy: { updatedAt: "asc" },
    include: {
      member: { select: { name: true } },
      items: { include: { paymentItem: { include: { bill: { select: { title: true } } } } } },
      receipts: { select: { id: true }, orderBy: { uploadedAt: "desc" }, take: 1 },
    },
  });

  const queue = intents.map((intent) => ({
    id: intent.id,
    code: intent.code,
    amount: intent.totalAmount,
    memberName: intent.member.name,
    ocrHint: intent.ocrHint,
    updatedAt: intent.updatedAt,
    billTitles: intent.items.map((link) => link.paymentItem.bill.title),
    receiptId: intent.receipts[0]?.id ?? null,
  }));

  return NextResponse.json(queue);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireMember();
  if (error) return error;

  try {
    const body = await request.json();
    const itemIds = body.itemIds as string[] | undefined;
    if (!itemIds || itemIds.length === 0) {
      return NextResponse.json({ error: "Vui lòng chọn ít nhất 1 khoản" }, { status: 400 });
    }

    const intent = await createPaymentIntent({ memberId: session.memberId, itemIds });
    return NextResponse.json({
      id: intent.id,
      code: intent.code,
      amount: intent.totalAmount,
      qrUrl: buildVietQrUrl(intent.totalAmount, intent.code),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Lỗi không xác định";
    console.error("POST /api/finance/payment-intents error:", e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

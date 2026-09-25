// ═══════════════════════════════════════
// GODA FC — Trả ảnh bill (chỉ chủ tịch xem, để đối chiếu duyệt)
// GET /api/finance/receipts/[id]/image
// ═══════════════════════════════════════

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireChairman();
  if (error) return error;

  const { id } = await params;
  const receipt = await prisma.paymentReceipt.findUnique({ where: { id } });
  if (!receipt) {
    return NextResponse.json({ error: "Không tìm thấy ảnh" }, { status: 404 });
  }

  if (receipt.expiresAt < new Date()) {
    await prisma.paymentReceipt.delete({ where: { id } });
    return NextResponse.json({ error: "Ảnh đã hết hạn lưu trữ" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(receipt.imageData), {
    headers: {
      "Content-Type": receipt.mimeType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

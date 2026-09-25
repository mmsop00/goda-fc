// ═══════════════════════════════════════
// GODA FC — Vercel Cron: dọn ảnh bill quá hạn lưu (90 ngày)
// GET /api/cron/cleanup-receipts   (header Authorization: Bearer CRON_SECRET)
// Chỉ xoá PaymentReceipt hết hạn — không đụng PaymentIntent/PaymentItem/Bill.
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.paymentReceipt.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return NextResponse.json({ deleted: result.count });
}

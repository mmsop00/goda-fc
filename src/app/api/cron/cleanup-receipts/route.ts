// ═══════════════════════════════════════
// GODA FC — Vercel Cron: dọn ảnh bill quá hạn lưu (90 ngày)
// GET /api/cron/cleanup-receipts   (header Authorization: Bearer CRON_SECRET)
// Chỉ xoá ảnh bill hết hạn (thành viên & ủng hộ) và lượt ủng hộ bỏ dở — không đụng lịch sử thanh toán.
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const [result, donationReceipts, staleDonations] = await Promise.all([
    prisma.paymentReceipt.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.donationReceipt.deleteMany({ where: { expiresAt: { lt: now } } }),
    // Tạo mã QR ủng hộ rồi bỏ dở, không gửi bill sau 3 ngày
    prisma.donation.deleteMany({ where: { status: "cho_bien_lai", createdAt: { lt: new Date(now.getTime() - 3 * 86400_000) } } }),
  ]);

  return NextResponse.json({ deleted: result.count, donationReceipts: donationReceipts.count, staleDonations: staleDonations.count });
}

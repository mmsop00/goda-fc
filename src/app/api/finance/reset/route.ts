// TẠM THỜI — xoá sạch dữ liệu quỹ để chủ tịch nhập số liệu ban đầu. Dùng 1 lần rồi gỡ.
// POST /api/finance/reset { confirm: "XOA HET DU LIEU QUY" } — chỉ chủ tịch.
// Trả về bản sao lưu toàn bộ dữ liệu (trừ ảnh bill) TRƯỚC khi xoá.
// Giữ nguyên: thành viên, mật khẩu, hồ sơ cầu thủ, cài đặt quỹ.

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireChairman();
  if (error) return error;
  const body = await request.json().catch(() => ({}));
  if (body.confirm !== "XOA HET DU LIEU QUY") {
    return NextResponse.json({ error: "Thiếu câu xác nhận" }, { status: 400 });
  }

  const backup = {
    at: new Date().toISOString(),
    bills: await prisma.bill.findMany(),
    paymentItems: await prisma.paymentItem.findMany(),
    paymentIntents: await prisma.paymentIntent.findMany(),
    paymentIntentItems: await prisma.paymentIntentItem.findMany(),
    paymentReceipts: await prisma.paymentReceipt.findMany({ select: { id: true, paymentIntentId: true, mimeType: true, uploadedAt: true, expiresAt: true } }),
    creditEntries: await prisma.creditEntry.findMany(),
    fundEntries: await prisma.fundEntry.findMany(),
    donations: await prisma.donation.findMany(),
    donationReceipts: await prisma.donationReceipt.findMany({ select: { id: true, donationId: true, mimeType: true, uploadedAt: true, expiresAt: true } }),
  };

  const deleted = await prisma.$transaction(async (tx) => ({
    creditEntries: (await tx.creditEntry.deleteMany()).count,
    paymentReceipts: (await tx.paymentReceipt.deleteMany()).count,
    paymentIntentItems: (await tx.paymentIntentItem.deleteMany()).count,
    paymentItems: (await tx.paymentItem.deleteMany()).count,
    paymentIntents: (await tx.paymentIntent.deleteMany()).count,
    bills: (await tx.bill.deleteMany()).count,
    fundEntries: (await tx.fundEntry.deleteMany()).count,
    donationReceipts: (await tx.donationReceipt.deleteMany()).count,
    donations: (await tx.donation.deleteMany()).count,
  }));
  revalidatePath("/");
  return NextResponse.json({ deleted, backup });
}

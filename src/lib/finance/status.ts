// ═══════════════════════════════════════
// GODA FC — Nơi DUY NHẤT được phép đổi trạng thái Bill/PaymentItem/
// PaymentIntent. Mọi thay đổi đều bọc trong $transaction để 2 bảng
// (PaymentIntent & PaymentItem) không bao giờ lệch nhau.
// ═══════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { generatePaymentCode } from "./code";

/** Tạo khoản thu mới + fan-out 1 dòng cho MỌI thành viên (kể cả người tạo). */
export async function createBill(params: {
  title: string;
  amountPerMember: number;
  dueDate?: string | null;
  createdByMemberId: string;
}) {
  const members = await prisma.member.findMany({ select: { id: true } });
  return prisma.$transaction(async (tx) => {
    const bill = await tx.bill.create({
      data: {
        title: params.title,
        amountPerMember: params.amountPerMember,
        dueDate: params.dueDate ?? null,
        createdByMemberId: params.createdByMemberId,
      },
    });
    await tx.paymentItem.createMany({
      data: members.map((m) => ({
        billId: bill.id,
        memberId: m.id,
        amount: params.amountPerMember,
      })),
    });
    return bill;
  });
}

/** Thành viên chọn (các) khoản muốn đóng → tạo 1 mã QR gộp chung. Chưa "khoá"
 * các khoản này ngay (chỉ khoá thật khi có ảnh bill upload — xem submitReceipt),
 * để tránh 1 lần bấm "tạo QR" rồi bỏ dở làm khoản đó kẹt mãi không đóng lại được. */
export async function createPaymentIntent(params: {
  memberId: string;
  itemIds: string[];
}) {
  const items = await prisma.paymentItem.findMany({
    where: { id: { in: params.itemIds }, memberId: params.memberId, status: "chua_dong" },
  });
  if (items.length === 0) {
    throw new Error("Không có khoản hợp lệ để tạo mã thanh toán");
  }
  const totalAmount = items.reduce((sum, it) => sum + it.amount, 0);

  // Thử vài lần phòng khi trùng mã (xác suất cực thấp với 6 ký tự Base32).
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const intent = await tx.paymentIntent.create({
          data: {
            memberId: params.memberId,
            code: generatePaymentCode(),
            totalAmount,
          },
        });
        await tx.paymentIntentItem.createMany({
          data: items.map((it) => ({ paymentIntentId: intent.id, paymentItemId: it.id })),
        });
        return intent;
      });
    } catch (e) {
      const isUniqueViolation =
        typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "P2002";
      if (!isUniqueViolation) throw e;
    }
  }
  throw new Error("Không thể tạo mã thanh toán, vui lòng thử lại");
}

/** Thành viên upload ảnh bill — khoá các khoản liên quan lại, chuyển sang
 * "chờ duyệt". Kết quả OCR chỉ là gợi ý, không quyết định trạng thái. */
export async function submitReceipt(params: {
  intentId: string;
  imageData: Buffer;
  mimeType: string;
  ocrHint: string;
  ocrRawText: string;
}) {
  return prisma.$transaction(async (tx) => {
    const intent = await tx.paymentIntent.findUniqueOrThrow({
      where: { id: params.intentId },
      include: { items: { include: { paymentItem: true } } },
    });

    const itemIds = intent.items.map((link) => link.paymentItemId);
    // Race guard — nếu 1 khoản đã bị 1 intent khác "chiếm" từ lúc tạo QR tới
    // giờ (vd tạo 2 mã QR liên tiếp), chỉ khoá những khoản còn "chưa đóng".
    await tx.paymentItem.updateMany({
      where: { id: { in: itemIds }, status: "chua_dong" },
      data: { status: "cho_duyet", paidIntentId: intent.id },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    await tx.paymentReceipt.create({
      data: {
        paymentIntentId: intent.id,
        imageData: new Uint8Array(params.imageData),
        mimeType: params.mimeType,
        expiresAt,
      },
    });

    return tx.paymentIntent.update({
      where: { id: intent.id },
      data: { status: "cho_duyet", ocrHint: params.ocrHint, ocrRawText: params.ocrRawText },
    });
  });
}

/** Chủ tịch xác nhận — đã tự đối chiếu tài khoản ngân hàng thật. */
export async function approveIntent(intentId: string, chairmanMemberId: string) {
  return prisma.$transaction(async (tx) => {
    const intent = await tx.paymentIntent.findUniqueOrThrow({
      where: { id: intentId },
      include: { items: true },
    });
    const itemIds = intent.items.map((link) => link.paymentItemId);
    const now = new Date();

    await tx.paymentItem.updateMany({
      where: { id: { in: itemIds } },
      data: { status: "da_dong", confirmedAt: now, confirmedByMemberId: chairmanMemberId },
    });

    return tx.paymentIntent.update({
      where: { id: intentId },
      data: { status: "da_xac_nhan", confirmedAt: now, confirmedByMemberId: chairmanMemberId },
    });
  });
}

/** Chủ tịch từ chối — trả các khoản về "chưa đóng" để thành viên đóng lại. */
export async function rejectIntent(intentId: string, chairmanMemberId: string, note?: string) {
  return prisma.$transaction(async (tx) => {
    const intent = await tx.paymentIntent.findUniqueOrThrow({
      where: { id: intentId },
      include: { items: true },
    });
    const itemIds = intent.items.map((link) => link.paymentItemId);

    await tx.paymentItem.updateMany({
      where: { id: { in: itemIds } },
      data: { status: "chua_dong", paidIntentId: null },
    });

    return tx.paymentIntent.update({
      where: { id: intentId },
      data: {
        status: "tu_choi",
        confirmedByMemberId: chairmanMemberId,
        rejectionNote: note ?? null,
      },
    });
  });
}

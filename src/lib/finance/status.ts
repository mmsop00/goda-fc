// ═══════════════════════════════════════
// GODA FC — Nơi DUY NHẤT được phép đổi trạng thái Bill/PaymentItem/
// PaymentIntent. Mọi thay đổi đều bọc trong $transaction để 2 bảng
// (PaymentIntent & PaymentItem) không bao giờ lệch nhau.
// ═══════════════════════════════════════

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generatePaymentCode } from "./code";

/** Tạo khoản thu + 1 dòng cần đóng cho từng thành viên được chọn (số tiền riêng
 * từng người). Danh sách đã được route kiểm tra hợp lệ trước khi gọi. */
export async function createBill(params: {
  title: string;
  kind: string;
  period: string | null;
  amountPerMember: number;
  dueDate: string | null;
  createdByMemberId: string;
  items: { memberId: string; amount: number }[];
}) {
  return prisma.$transaction(async (tx) => {
    const bill = await tx.bill.create({
      data: {
        title: params.title,
        kind: params.kind,
        period: params.period,
        amountPerMember: params.amountPerMember,
        dueDate: params.dueDate,
        createdByMemberId: params.createdByMemberId,
      },
    });
    await tx.paymentItem.createMany({
      data: params.items.map((it) => ({ billId: bill.id, memberId: it.memberId, amount: it.amount })),
    });
    return bill;
  });
}

/** Lỗi nghiệp vụ hiển thị thẳng cho người dùng (vd sửa khoản đã có người đóng). */
export class FinanceRuleError extends Error {}

const LOCKED_STATUSES = new Set(["cho_duyet", "da_dong"]);

/** Huỷ các mã QR chưa gửi bill có chứa những khoản vừa bị sửa/xoá — số tiền trên
 * QR cũ không còn đúng. Thành viên sẽ phải tạo mã mới. */
async function cancelOpenIntents(tx: Prisma.TransactionClient, paymentItemIds: string[]) {
  if (paymentItemIds.length === 0) return;
  const links = await tx.paymentIntentItem.findMany({
    where: { paymentItemId: { in: paymentItemIds }, paymentIntent: { status: "cho_bien_lai" } },
    select: { paymentIntentId: true },
  });
  const ids = [...new Set(links.map((l) => l.paymentIntentId))];
  if (ids.length) {
    await tx.paymentIntent.updateMany({ where: { id: { in: ids }, status: "cho_bien_lai" }, data: { status: "da_huy" } });
  }
}

/** Chủ tịch sửa khoản thu. Người đã đóng / chờ duyệt bị khoá: phải còn trong danh
 * sách với đúng số tiền cũ. Ai bị bỏ ra hoặc đổi tiền thì QR chưa dùng của họ bị huỷ. */
export async function updateBill(
  billId: string,
  input: { title: string; period: string; amountPerMember: number; dueDate: string | null; items: { memberId: string; amount: number }[] }
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.paymentItem.findMany({
      where: { billId },
      include: { member: { select: { name: true } } },
    });
    const desired = new Map(input.items.map((it) => [it.memberId, it.amount]));

    for (const item of existing) {
      if (!LOCKED_STATUSES.has(item.status)) continue;
      const verb = item.status === "da_dong" ? "đã đóng" : "đang chờ duyệt";
      if (!desired.has(item.memberId)) throw new FinanceRuleError(`${item.member.name} ${verb}, không bỏ ra được`);
      if (desired.get(item.memberId) !== item.amount) {
        throw new FinanceRuleError(`${item.member.name} ${verb}, không đổi số tiền được`);
      }
    }

    const byMember = new Map(existing.map((it) => [it.memberId, it]));
    const toDelete = existing.filter((it) => !LOCKED_STATUSES.has(it.status) && !desired.has(it.memberId));
    const toUpdate = existing.filter(
      (it) => !LOCKED_STATUSES.has(it.status) && desired.has(it.memberId) && desired.get(it.memberId) !== it.amount
    );
    const toCreate = input.items.filter((it) => !byMember.has(it.memberId));

    await cancelOpenIntents(tx, [...toDelete, ...toUpdate].map((it) => it.id));
    if (toDelete.length) await tx.paymentItem.deleteMany({ where: { id: { in: toDelete.map((it) => it.id) } } });
    for (const it of toUpdate) {
      await tx.paymentItem.update({ where: { id: it.id }, data: { amount: desired.get(it.memberId)! } });
    }
    if (toCreate.length) {
      await tx.paymentItem.createMany({ data: toCreate.map((it) => ({ billId, memberId: it.memberId, amount: it.amount })) });
    }

    return tx.bill.update({
      where: { id: billId },
      data: { title: input.title, period: input.period, amountPerMember: input.amountPerMember, dueDate: input.dueDate },
    });
  });
}

/** Xoá khoản thu — chỉ khi chưa ai đóng hoặc chờ duyệt. */
export async function deleteBill(billId: string) {
  return prisma.$transaction(async (tx) => {
    const items = await tx.paymentItem.findMany({ where: { billId }, select: { id: true, status: true } });
    if (items.some((it) => LOCKED_STATUSES.has(it.status))) {
      throw new FinanceRuleError("Đã có người đóng hoặc chờ duyệt — không xoá được, chỉ sửa được");
    }
    await cancelOpenIntents(tx, items.map((it) => it.id));
    await tx.bill.delete({ where: { id: billId } });
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

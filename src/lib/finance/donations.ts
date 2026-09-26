// ═══════════════════════════════════════
// GODA FC — Ủng hộ công khai từ trang chủ
// Người ủng hộ không đăng nhập: tạo lượt ủng hộ → nhận mã bí mật (token) → chỉ
// người giữ token mới gửi được ảnh bill. Chủ tịch xác nhận số tiền thực nhận.
// ═══════════════════════════════════════

import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { generatePaymentCode } from "./code";
import { checkReceiptImage } from "./ocr";
import { FinanceRuleError } from "./status";

export const MIN_DONATION = 10_000;
export const MAX_DONATION = 100_000_000;
/** Mỗi địa chỉ mạng tạo tối đa bấy nhiêu lượt ủng hộ trong 1 giờ (chống spam) */
const CREATE_LIMIT_PER_HOUR = 6;
/** Lượt chưa gửi bill quá số ngày này thì xoá */
const STALE_DAYS = 3;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const hashIp = (ip: string) => sha256(`goda-ip:${ip}`);

export interface DonationInput {
  donorName: string;
  anonymous: boolean;
  showAmount: boolean;
  message: string | null;
  amount: number;
}

export function parseDonationInput(body: Record<string, unknown>): { ok: true; value: DonationInput } | { ok: false; error: string } {
  const anonymous = body.anonymous === true;
  const donorName = typeof body.donorName === "string" ? body.donorName.trim().replace(/\s+/g, " ") : "";
  if (!anonymous && !donorName) return { ok: false, error: "Vui lòng nhập tên (hoặc chọn Ẩn danh)" };
  if (donorName.length > 60) return { ok: false, error: "Tên tối đa 60 ký tự" };
  const amount = body.amount;
  if (typeof amount !== "number" || !Number.isInteger(amount) || amount < MIN_DONATION || amount > MAX_DONATION) {
    return { ok: false, error: `Số tiền từ ${MIN_DONATION.toLocaleString("vi-VN")}đ` };
  }
  const message = typeof body.message === "string" && body.message.trim() ? body.message.trim().slice(0, 120) : null;
  return { ok: true, value: { donorName: donorName || "Ẩn danh", anonymous, showAmount: body.showAmount !== false, message, amount } };
}

/** Mã chuyển khoản không trùng với mã thanh toán của thành viên */
async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const code = generatePaymentCode();
    const [a, b] = await Promise.all([
      prisma.paymentIntent.findUnique({ where: { code }, select: { id: true } }),
      prisma.donation.findUnique({ where: { code }, select: { id: true } }),
    ]);
    if (!a && !b) return code;
  }
  throw new Error("Không tạo được mã, vui lòng thử lại");
}

export async function createDonation(input: DonationInput, ip: string) {
  const ipHash = hashIp(ip);
  const recent = await prisma.donation.count({ where: { ipHash, createdAt: { gt: new Date(Date.now() - 3600_000) } } });
  if (recent >= CREATE_LIMIT_PER_HOUR) throw new FinanceRuleError("Bạn tạo quá nhiều lượt ủng hộ, vui lòng thử lại sau ít phút");

  // Dọn lượt tạo QR rồi bỏ dở (không gửi bill)
  await prisma.donation.deleteMany({
    where: { status: "cho_bien_lai", createdAt: { lt: new Date(Date.now() - STALE_DAYS * 86400_000) } },
  });

  const token = randomBytes(24).toString("base64url");
  const donation = await prisma.donation.create({
    data: { ...input, code: await uniqueCode(), tokenHash: sha256(token), ipHash },
  });
  return { donation, token };
}

/** Người ủng hộ gửi ảnh bill (phải kèm đúng token). Lưu ngay; đọc ảnh chạy sau (xem readDonationReceipt). */
export async function submitDonationReceipt(id: string, token: string, image: Buffer, mimeType: string) {
  const donation = await prisma.donation.findUnique({ where: { id } });
  if (!donation || donation.tokenHash !== sha256(token)) throw new FinanceRuleError("Không tìm thấy lượt ủng hộ");
  if (donation.status !== "cho_bien_lai") throw new FinanceRuleError("Lượt ủng hộ này đã gửi ảnh bill rồi");
  const expiresAt = new Date(Date.now() + 90 * 86400_000);
  return prisma.$transaction(async (tx) => {
    await tx.donationReceipt.create({ data: { donationId: id, imageData: new Uint8Array(image), mimeType, expiresAt } });
    return tx.donation.update({ where: { id }, data: { status: "cho_duyet" } });
  });
}

/** Đọc ảnh bill (OCR ~15 giây) — gọi trong after() sau khi đã trả lời người gửi. Chỉ là gợi ý. */
export async function readDonationReceipt(id: string, image: Buffer) {
  const donation = await prisma.donation.findUnique({ where: { id }, select: { code: true, amount: true } });
  if (!donation) return;
  const ocr = await checkReceiptImage(image, donation.code, donation.amount);
  await prisma.donation.update({ where: { id }, data: { ocrHint: ocr.hint, ocrRawText: ocr.rawText } });
}

export async function approveDonation(id: string, chairmanMemberId: string, receivedAmount: number) {
  const { count } = await prisma.donation.updateMany({
    where: { id, status: "cho_duyet" },
    data: { status: "da_xac_nhan", receivedAmount, confirmedAt: new Date(), confirmedByMemberId: chairmanMemberId },
  });
  if (count === 0) throw new FinanceRuleError("Lượt ủng hộ này không ở trạng thái chờ duyệt");
}

export async function rejectDonation(id: string, chairmanMemberId: string) {
  const { count } = await prisma.donation.updateMany({
    where: { id, status: "cho_duyet" },
    data: { status: "tu_choi", confirmedByMemberId: chairmanMemberId },
  });
  if (count === 0) throw new FinanceRuleError("Lượt ủng hộ này không ở trạng thái chờ duyệt");
}

export async function listPendingDonations() {
  const rows = await prisma.donation.findMany({
    where: { status: "cho_duyet" },
    orderBy: { updatedAt: "asc" },
    include: { receipts: { select: { id: true }, orderBy: { uploadedAt: "desc" }, take: 1 } },
  });
  return rows.map((d) => ({
    id: d.id,
    code: d.code,
    amount: d.amount,
    donorName: d.donorName,
    anonymous: d.anonymous,
    message: d.message,
    ocrHint: d.ocrHint,
    receiptId: d.receipts[0]?.id ?? null,
  }));
}

// ─── Dữ liệu hiện trên trang chủ ───

const VN_OFFSET_MS = 7 * 3600_000;
const vnDate = (d: Date) => new Date(d.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);
const ddmmyyyy = (iso: string) => iso.split("-").reverse().join("/");

export interface PublicDonation {
  id: string;
  name: string;
  /** null = người ủng hộ không muốn công khai số tiền */
  amount: number | null;
  date: string; // DD/MM/YYYY
  message?: string;
}

export interface PublicDonationBoard {
  recent: PublicDonation[];
  /** Bảng xếp hạng tháng hiện tại (cộng dồn theo tên; ẩn danh tính riêng từng lượt) */
  top: { id: string; name: string; amount: number | null; anonymous: boolean }[];
  monthLabel: string; // MM/YYYY
}

export async function getPublicDonations(): Promise<PublicDonationBoard> {
  const now = new Date(Date.now() + VN_OFFSET_MS);
  const monthKey = now.toISOString().slice(0, 7);
  const monthLabel = `${monthKey.slice(5)}/${monthKey.slice(0, 4)}`;
  try {
    const rows = await prisma.donation.findMany({
      where: { status: "da_xac_nhan" },
      orderBy: { confirmedAt: "desc" },
      take: 200,
      select: { id: true, donorName: true, anonymous: true, showAmount: true, message: true, receivedAmount: true, confirmedAt: true },
    });
    const recent = rows.slice(0, 30).map((d) => ({
      id: d.id,
      name: d.anonymous ? "Ẩn danh" : d.donorName,
      amount: d.showAmount ? d.receivedAmount : null,
      date: ddmmyyyy(vnDate(d.confirmedAt!)),
      message: d.message ?? undefined,
    }));

    const board = new Map<string, { id: string; name: string; total: number; hidden: boolean; anonymous: boolean }>();
    for (const d of rows.filter((r) => vnDate(r.confirmedAt!).startsWith(monthKey))) {
      const key = d.anonymous ? `an:${d.id}` : `ten:${d.donorName.toLowerCase()}`;
      const cur = board.get(key) ?? { id: d.id, name: d.anonymous ? "Ẩn danh" : d.donorName, total: 0, hidden: false, anonymous: d.anonymous };
      cur.total += d.receivedAmount ?? 0;
      cur.hidden ||= !d.showAmount;
      board.set(key, cur);
    }
    const top = [...board.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 20)
      .map((b) => ({ id: b.id, name: b.name, amount: b.hidden ? null : b.total, anonymous: b.anonymous }));
    return { recent, top, monthLabel };
  } catch (e) {
    console.error("getPublicDonations error (trang chủ hiện danh sách trống):", e);
    return { recent: [], top: [], monthLabel };
  }
}

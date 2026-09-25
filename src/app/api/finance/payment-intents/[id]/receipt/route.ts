// ═══════════════════════════════════════
// GODA FC — Upload ảnh bill chuyển khoản cho 1 mã thanh toán
// POST /api/finance/payment-intents/[id]/receipt  (multipart/form-data, field "file")
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/finance-auth";
import { submitReceipt } from "@/lib/finance/status";
import { checkReceiptImage } from "@/lib/finance/ocr";

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — ảnh đã được thu nhỏ phía trình duyệt
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireMember();
  if (error) return error;

  const { id } = await params;

  const intent = await prisma.paymentIntent.findUnique({ where: { id } });
  if (!intent || intent.memberId !== session.memberId) {
    return NextResponse.json({ error: "Không tìm thấy mã thanh toán" }, { status: 404 });
  }
  if (intent.status !== "cho_bien_lai") {
    return NextResponse.json(
      { error: "Mã thanh toán này đã có ảnh bill hoặc không còn hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Vui lòng chọn ảnh bill" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Chỉ nhận ảnh JPEG/PNG/WebP" }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Ảnh quá lớn (tối đa 8MB)" }, { status: 400 });
    }

    const imageData = Buffer.from(await file.arrayBuffer());
    const ocr = await checkReceiptImage(imageData, intent.code, intent.totalAmount);

    const updated = await submitReceipt({
      intentId: intent.id,
      imageData,
      mimeType: file.type,
      ocrHint: ocr.hint,
      ocrRawText: ocr.rawText,
    });

    return NextResponse.json({
      status: updated.status,
      ocrHint: updated.ocrHint,
    });
  } catch (e) {
    console.error("POST /api/finance/payment-intents/[id]/receipt error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

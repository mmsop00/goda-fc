// POST /api/donations/[id]/receipt → người ủng hộ gửi ảnh bill (multipart: file, token)

import { NextRequest, NextResponse } from "next/server";
import { submitDonationReceipt } from "@/lib/finance/donations";
import { FinanceRuleError } from "@/lib/finance/status";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // ảnh đã được thu nhỏ trên trình duyệt
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const form = await request.formData();
    const file = form.get("file");
    const token = String(form.get("token") ?? "");
    if (!(file instanceof File)) return NextResponse.json({ error: "Vui lòng chọn ảnh bill" }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Chỉ nhận ảnh JPEG/PNG/WebP" }, { status: 400 });
    if (file.size > MAX_SIZE_BYTES) return NextResponse.json({ error: "Ảnh quá lớn (tối đa 5MB)" }, { status: 400 });
    const updated = await submitDonationReceipt(id, token, Buffer.from(await file.arrayBuffer()), file.type);
    return NextResponse.json({ status: updated.status, ocrHint: updated.ocrHint });
  } catch (e) {
    if (e instanceof FinanceRuleError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("POST /api/donations/[id]/receipt error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

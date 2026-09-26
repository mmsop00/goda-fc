// POST /api/donations → ai cũng tạo được 1 lượt ủng hộ { donorName, anonymous, showAmount, message, amount }
// Trả về mã QR + token bí mật (chỉ người giữ token mới gửi được ảnh bill).

import { NextRequest, NextResponse } from "next/server";
import { createDonation, parseDonationInput } from "@/lib/finance/donations";
import { buildVietQrUrl } from "@/lib/finance/config";
import { FinanceRuleError } from "@/lib/finance/status";

export async function POST(request: NextRequest) {
  try {
    const parsed = parseDonationInput(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { donation, token } = await createDonation(parsed.value, ip);
    return NextResponse.json({
      id: donation.id,
      token,
      code: donation.code,
      amount: donation.amount,
      qrUrl: buildVietQrUrl(donation.amount, donation.code),
    });
  } catch (e) {
    if (e instanceof FinanceRuleError) return NextResponse.json({ error: e.message }, { status: 429 });
    console.error("POST /api/donations error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

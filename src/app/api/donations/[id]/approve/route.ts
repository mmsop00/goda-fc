// POST /api/donations/[id]/approve → chủ tịch xác nhận { receivedAmount } — hiện lên trang chủ, cộng vào quỹ

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireChairman } from "@/lib/finance-auth";
import { approveDonation } from "@/lib/finance/donations";
import { FinanceRuleError } from "@/lib/finance/status";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireChairman();
  if (error) return error;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const received = body.receivedAmount;
  if (typeof received !== "number" || !Number.isInteger(received) || received <= 0 || received > 1_000_000_000) {
    return NextResponse.json({ error: "Số tiền thực nhận không hợp lệ" }, { status: 400 });
  }
  try {
    await approveDonation(id, session.memberId, received);
    revalidatePath("/"); // bảng tin chạy + danh sách ủng hộ trên trang chủ
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof FinanceRuleError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("POST /api/donations/[id]/approve error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

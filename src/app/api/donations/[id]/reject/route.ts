// POST /api/donations/[id]/reject → chủ tịch từ chối (vd không thấy tiền về tài khoản)

import { NextResponse } from "next/server";
import { requireChairman } from "@/lib/finance-auth";
import { rejectDonation } from "@/lib/finance/donations";
import { FinanceRuleError } from "@/lib/finance/status";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireChairman();
  if (error) return error;
  const { id } = await params;
  try {
    await rejectDonation(id, session.memberId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof FinanceRuleError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("POST /api/donations/[id]/reject error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

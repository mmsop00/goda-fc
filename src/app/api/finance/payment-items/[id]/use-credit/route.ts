// POST /api/finance/payment-items/[id]/use-credit → thành viên trừ số dư cho trọn 1 khoản của mình

import { NextResponse } from "next/server";
import { requireMember } from "@/lib/finance-auth";
import { FinanceRuleError, payItemWithCredit } from "@/lib/finance/status";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireMember();
  if (error) return error;
  const { id } = await params;
  try {
    const credit = await payItemWithCredit(session.memberId, id);
    return NextResponse.json({ ok: true, credit });
  } catch (e) {
    if (e instanceof FinanceRuleError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("POST /api/finance/payment-items/[id]/use-credit error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

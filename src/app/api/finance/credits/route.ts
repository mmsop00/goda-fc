// POST /api/finance/credits → chủ tịch điều chỉnh số dư 1 thành viên { memberId, amount (+/−), note }

import { NextRequest, NextResponse } from "next/server";
import { requireChairman } from "@/lib/finance-auth";
import { getFinanceMembers } from "@/lib/finance/members";
import { adjustCredit, FinanceRuleError } from "@/lib/finance/status";

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(request: NextRequest) {
  const { session, error } = await requireChairman();
  if (error) return error;
  try {
    const body = await request.json();
    const memberId = String(body.memberId ?? "");
    if (!(await getFinanceMembers()).some((m) => m.id === memberId)) return bad("Không tìm thấy thành viên");
    const amount = body.amount;
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 1_000_000_000) {
      return bad("Số tiền không hợp lệ");
    }
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 200) : "";
    if (!note) return bad("Vui lòng ghi lý do điều chỉnh");
    const credit = await adjustCredit(memberId, amount, note, session.memberId);
    return NextResponse.json({ ok: true, credit });
  } catch (e) {
    if (e instanceof FinanceRuleError) return bad(e.message);
    console.error("POST /api/finance/credits error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

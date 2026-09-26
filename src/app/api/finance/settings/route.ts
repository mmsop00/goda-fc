// ═══════════════════════════════════════
// GODA FC — Cài đặt tự động tạo quỹ tháng (chỉ chủ tịch)
// GET → cài đặt + tình trạng tháng này / lần chạy tới
// PUT → { autoMonthly, monthlyAmount, dueDay }
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { getFundSettings, saveFundSettings, vnToday } from "@/lib/finance/monthly";

export const dynamic = "force-dynamic";

const pad = (n: number) => String(n).padStart(2, "0");

export async function GET() {
  const { error } = await requireChairman();
  if (error) return error;
  const settings = await getFundSettings();
  const { year, month } = vnToday();
  const thisMonth = await prisma.bill.findFirst({
    where: { kind: "quy_thang", period: `${year}-${pad(month)}` },
    select: { title: true },
  });
  const next = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  return NextResponse.json({
    settings,
    thisMonth: { title: `Quỹ tháng ${pad(month)}/${year}`, created: !!thisMonth },
    nextRun: `00:00 ngày 01/${pad(next.month)}/${next.year}`,
  });
}

export async function PUT(request: NextRequest) {
  const { session, error } = await requireChairman();
  if (error) return error;
  const body = await request.json().catch(() => ({}));
  const amount = body.monthlyAmount;
  if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0 || amount > 100_000_000) {
    return NextResponse.json({ error: "Số tiền không hợp lệ" }, { status: 400 });
  }
  const dueDay = body.dueDay === null || body.dueDay === "" || body.dueDay === undefined ? null : Number(body.dueDay);
  if (dueDay !== null && (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31)) {
    return NextResponse.json({ error: "Hạn đóng phải là ngày 1–31" }, { status: 400 });
  }
  await saveFundSettings({ autoMonthly: body.autoMonthly === true, monthlyAmount: amount, dueDay }, session.memberId);
  return NextResponse.json({ ok: true, settings: await getFundSettings() });
}

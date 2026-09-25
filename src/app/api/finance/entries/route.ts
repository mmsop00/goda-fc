// ═══════════════════════════════════════
// GODA FC — Sổ quỹ ghi tay (chủ tịch)
// GET  /api/finance/entries → 20 dòng ghi gần nhất
// POST /api/finance/entries → { direction, category, title, amount, date: YYYY-MM-DD, period?: YYYY-MM, note? }
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { isValidCategory } from "@/lib/finance/categories";
import { isValidPeriod } from "@/lib/finance/format";

export const dynamic = "force-dynamic";

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function GET() {
  const { error } = await requireChairman();
  if (error) return error;
  const entries = await prisma.fundEntry.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireChairman();
  if (error) return error;

  try {
    const body = await request.json();
    const direction = body.direction;
    if (direction !== "thu" && direction !== "chi") return bad("Loại không hợp lệ");
    const category = String(body.category ?? "");
    if (!isValidCategory(direction, category)) return bad("Vui lòng chọn hạng mục");
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return bad("Vui lòng nhập nội dung");
    if (title.length > 120) return bad("Nội dung quá dài");
    const amount = body.amount;
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0 || amount > 1_000_000_000) {
      return bad("Số tiền không hợp lệ");
    }
    const date = String(body.date ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return bad("Ngày không hợp lệ");
    const period = body.period ? String(body.period) : date.slice(0, 7);
    if (!isValidPeriod(period)) return bad("Tháng áp dụng không hợp lệ");
    const note = typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 500) : null;

    const entry = await prisma.fundEntry.create({
      data: { direction, category, title, amount, date, period, note, createdByMemberId: session.memberId },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (e) {
    console.error("POST /api/finance/entries error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

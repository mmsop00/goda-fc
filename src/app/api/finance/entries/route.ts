// ═══════════════════════════════════════
// GODA FC — Sổ quỹ ghi tay (chủ tịch)
// GET  /api/finance/entries → 20 dòng ghi gần nhất
// POST /api/finance/entries → { direction, category, title, amount, date: YYYY-MM-DD, period?: YYYY-MM, note? }
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { parseEntryInput } from "@/lib/finance/inputs";

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
    const parsed = parseEntryInput(await request.json());
    if (!parsed.ok) return bad(parsed.error);
    const entry = await prisma.fundEntry.create({ data: { ...parsed.value, createdByMemberId: session.memberId } });
    return NextResponse.json(entry, { status: 201 });
  } catch (e) {
    console.error("POST /api/finance/entries error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

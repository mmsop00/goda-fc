// ═══════════════════════════════════════
// GODA FC — 1 dòng sổ quỹ ghi tay (chỉ chủ tịch)
// GET    /api/finance/entries/[id] → dữ liệu để mở form sửa
// PATCH  /api/finance/entries/[id] → sửa (cùng dạng body với POST /api/finance/entries)
// DELETE /api/finance/entries/[id] → xoá dòng ghi nhầm
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { parseEntryInput } from "@/lib/finance/inputs";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireChairman();
  if (error) return error;
  const { id } = await params;
  const entry = await prisma.fundEntry.findUnique({ where: { id } });
  return entry ? NextResponse.json(entry) : notFound();
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { error } = await requireChairman();
  if (error) return error;
  const { id } = await params;
  try {
    const parsed = parseEntryInput(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { count } = await prisma.fundEntry.updateMany({ where: { id }, data: parsed.value });
    if (count === 0) return notFound();
    return NextResponse.json(await prisma.fundEntry.findUnique({ where: { id } }));
  } catch (e) {
    console.error("PATCH /api/finance/entries/[id] error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireChairman();
  if (error) return error;
  const { id } = await params;
  const { count } = await prisma.fundEntry.deleteMany({ where: { id } });
  if (count === 0) return notFound();
  return NextResponse.json({ ok: true });
}

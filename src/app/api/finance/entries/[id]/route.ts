// DELETE /api/finance/entries/[id] → chủ tịch xoá 1 dòng sổ quỹ ghi nhầm

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireChairman();
  if (error) return error;
  const { id } = await params;
  const { count } = await prisma.fundEntry.deleteMany({ where: { id } });
  if (count === 0) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

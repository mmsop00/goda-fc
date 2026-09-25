// ═══════════════════════════════════════
// GODA FC — 1 khoản thu (chỉ chủ tịch)
// GET    /api/finance/bills/[id] → dữ liệu để mở form sửa
// PATCH  /api/finance/bills/[id] → sửa (cùng dạng body với POST /api/finance/bills; không đổi loại thu)
// DELETE /api/finance/bills/[id] → xoá, chỉ khi chưa ai đóng / chờ duyệt
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { parseBillInput } from "@/lib/finance/inputs";
import { deleteBill, FinanceRuleError, updateBill } from "@/lib/finance/status";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireChairman();
  if (error) return error;
  const { id } = await params;
  const bill = await prisma.bill.findUnique({
    where: { id },
    include: { items: { select: { memberId: true, amount: true, status: true } } },
  });
  if (!bill) return bad("Không tìm thấy khoản thu", 404);
  return NextResponse.json({
    id: bill.id,
    kind: bill.kind,
    title: bill.title,
    // Dữ liệu cũ chưa có tháng áp dụng → tháng tạo (giờ VN), giống báo cáo
    period: bill.period ?? new Date(bill.createdAt.getTime() + 7 * 3600_000).toISOString().slice(0, 7),
    amountPerMember: bill.amountPerMember,
    dueDate: bill.dueDate,
    items: bill.items,
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { error } = await requireChairman();
  if (error) return error;
  const { id } = await params;

  try {
    const bill = await prisma.bill.findUnique({ where: { id }, include: { items: { select: { memberId: true, status: true } } } });
    if (!bill) return bad("Không tìm thấy khoản thu", 404);
    const locked = new Set(bill.items.filter((it) => it.status !== "chua_dong").map((it) => it.memberId));

    const parsed = await parseBillInput(await request.json(), { kind: bill.kind, billId: id, lockedMemberIds: locked });
    if (!parsed.ok) return bad(parsed.error, parsed.status);

    const updated = await updateBill(id, parsed.value);
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof FinanceRuleError) return bad(e.message);
    console.error("PATCH /api/finance/bills/[id] error:", e);
    return bad("Lỗi không xác định", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireChairman();
  if (error) return error;
  const { id } = await params;

  try {
    const exists = await prisma.bill.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return bad("Không tìm thấy khoản thu", 404);
    await deleteBill(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof FinanceRuleError) return bad(e.message);
    console.error("DELETE /api/finance/bills/[id] error:", e);
    return bad("Lỗi không xác định", 500);
  }
}

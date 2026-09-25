// ═══════════════════════════════════════
// GODA FC — Khoản thu (Bill)
// GET  /api/finance/bills  → chủ tịch: danh sách khoản thu đã tạo
// POST /api/finance/bills  → chủ tịch: tạo khoản thu cho các thành viên được chọn
//   { kind: "quy_thang", month, year } | { kind: "khac", title }
//   + amountPerMember, dueDate? (DD/MM/YYYY), items: [{ memberId, amount }]
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireChairman } from "@/lib/finance-auth";
import { createBill } from "@/lib/finance/status";
import { getFinanceMembers } from "@/lib/finance/members";
import { isMonthlyFundExempt } from "@/lib/finance/age";

export const dynamic = "force-dynamic";

const MAX_AMOUNT = 100_000_000;
const isValidAmount = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n) && n > 0 && n <= MAX_AMOUNT;

export async function GET() {
  const { error } = await requireChairman();
  if (error) return error;

  const bills = await prisma.bill.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });
  return NextResponse.json(bills);
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireChairman();
  if (error) return error;

  try {
    const body = await request.json();
    const kind = body.kind;
    if (kind !== "quy_thang" && kind !== "khac") return bad("Loại thu không hợp lệ");

    let title: string;
    let period: string | null = null;
    let month = 0;
    let year = 0;
    if (kind === "quy_thang") {
      month = Number(body.month);
      year = Number(body.year);
      if (!Number.isInteger(month) || month < 1 || month > 12) return bad("Tháng không hợp lệ");
      if (!Number.isInteger(year) || year < 2020 || year > 2100) return bad("Năm không hợp lệ");
      const mm = String(month).padStart(2, "0");
      title = `Quỹ tháng ${mm}/${year}`;
      period = `${year}-${mm}`;
      const existing = await prisma.bill.findFirst({ where: { kind, period } });
      if (existing) return bad(`Đã tạo ${title} rồi`, 409);
    } else {
      title = typeof body.title === "string" ? body.title.trim() : "";
      if (!title) return bad("Vui lòng nhập tên khoản thu");
      if (title.length > 120) return bad("Tên khoản thu quá dài");
    }

    const amountPerMember = body.amountPerMember;
    if (!isValidAmount(amountPerMember)) return bad("Số tiền không hợp lệ");

    const dueDate = body.dueDate || null;
    if (dueDate !== null && !/^\d{2}\/\d{2}\/\d{4}$/.test(dueDate)) return bad("Hạn đóng không hợp lệ");

    const rawItems: unknown = body.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0) return bad("Chọn ít nhất 1 thành viên");

    const members = new Map((await getFinanceMembers()).map((m) => [m.id, m]));
    const seen = new Set<string>();
    const items: { memberId: string; amount: number }[] = [];
    for (const it of rawItems) {
      const member = members.get(it?.memberId);
      if (!member || seen.has(member.id)) return bad("Danh sách thành viên không hợp lệ");
      if (!isValidAmount(it.amount)) return bad(`Số tiền của ${member.name} không hợp lệ`);
      if (kind === "quy_thang" && isMonthlyFundExempt(member.birthday, year, month)) {
        return bad(`${member.name} từ 70 tuổi trở lên, được miễn quỹ tháng`);
      }
      seen.add(member.id);
      items.push({ memberId: member.id, amount: it.amount });
    }

    const bill = await createBill({
      title,
      kind,
      period,
      amountPerMember,
      dueDate,
      createdByMemberId: session.memberId,
      items,
    });
    return NextResponse.json(bill, { status: 201 });
  } catch (e) {
    console.error("POST /api/finance/bills error:", e);
    return bad("Lỗi không xác định", 500);
  }
}

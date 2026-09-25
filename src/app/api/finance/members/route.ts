// GET /api/finance/members → chủ tịch: danh sách thành viên để chọn khi tạo khoản thu

import { NextResponse } from "next/server";
import { requireChairman } from "@/lib/finance-auth";
import { getFinanceMembers } from "@/lib/finance/members";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireChairman();
  if (error) return error;
  return NextResponse.json(await getFinanceMembers());
}

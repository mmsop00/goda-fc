// GET /api/finance/report → mọi thành viên: báo cáo thu chi, tiến độ thu, tình hình đóng quỹ

import { NextResponse } from "next/server";
import { requireMember } from "@/lib/finance-auth";
import { getFinanceReport } from "@/lib/finance/report";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireMember();
  if (error) return error;
  return NextResponse.json(await getFinanceReport());
}

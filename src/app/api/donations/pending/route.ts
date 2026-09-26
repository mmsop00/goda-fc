// GET /api/donations/pending → chủ tịch: các lượt ủng hộ đã gửi bill, chờ xác nhận

import { NextResponse } from "next/server";
import { requireChairman } from "@/lib/finance-auth";
import { listPendingDonations } from "@/lib/finance/donations";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireChairman();
  if (error) return error;
  return NextResponse.json(await listPendingDonations());
}

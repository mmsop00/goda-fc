// ═══════════════════════════════════════
// GODA FC — Vercel Cron: tự tạo Quỹ tháng lúc 00:00 ngày 1 (giờ VN)
// GET /api/cron/monthly-fund   (header Authorization: Bearer CRON_SECRET)
// Lịch chạy mỗi ngày 17:00 UTC = 00:00 giờ VN. Chỉ làm việc vào ngày 1–3 của
// tháng (ngày 2, 3 để bù nếu lần chạy nửa đêm ngày 1 bị lỡ); không tạo trùng.
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { runMonthlyFund, vnToday } from "@/lib/finance/monthly";

export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { year, month, day } = vnToday();
  if (day > 3) return NextResponse.json({ status: "skip", reason: `Hôm nay ngày ${day}, chỉ chạy ngày 1–3` });
  try {
    return NextResponse.json(await runMonthlyFund(year, month));
  } catch (e) {
    console.error("cron monthly-fund error:", e);
    return NextResponse.json({ error: "Lỗi tạo quỹ tháng" }, { status: 500 });
  }
}

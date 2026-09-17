// ═══════════════════════════════════════
// GODA FC — Weather API
// GET /api/weather → dự báo thời tiết khu vực Hà Nội (Open-Meteo)
//
// Chỉ thực sự gọi Open-Meteo khi cache ở Vercel Edge hết hạn — hết hạn đúng
// vào 8h00 sáng giờ Việt Nam mỗi ngày (tính lại mốc mỗi lần cache miss), nhờ
// header Cache-Control bên dưới. Nhờ vậy cả site chia sẻ chung một lần gọi
// API/ngày thay vì mỗi khách xem lại gọi trực tiếp Open-Meteo.
// ═══════════════════════════════════════

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Toạ độ Hà Nội — tất cả sân thi đấu của GODA FC đều trong khu vực này.
const LAT = 21.0285;
const LON = 105.8542;

// Việt Nam là UTC+7, không có giờ mùa hè (DST) nên offset luôn cố định.
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Số giây còn lại tới mốc 8h00 sáng giờ Việt Nam tiếp theo (hôm nay hoặc mai). */
function secondsUntilNext8amVN(): number {
  const now = Date.now();
  const nowVN = new Date(now + VN_OFFSET_MS);
  const y = nowVN.getUTCFullYear();
  const m = nowVN.getUTCMonth();
  const d = nowVN.getUTCDate();
  const todayAt8amVN = Date.UTC(y, m, d, 8, 0, 0, 0) - VN_OFFSET_MS;
  const next8am = todayAt8amVN > now ? todayAt8amVN : todayAt8amVN + 24 * 60 * 60 * 1000;
  return Math.round((next8am - now) / 1000);
}

export async function GET() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,weathercode,precipitation_probability&timezone=Asia%2FBangkok&forecast_days=16`;
    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json({ error: "upstream_error" }, { status: 502 });
    }
    const data = await upstream.json();
    const maxAge = Math.max(60, secondsUntilNext8amVN());

    return NextResponse.json(data, {
      headers: {
        // Vercel Edge cache dùng chung cho mọi khách, tự làm mới đúng 8h sáng.
        "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=3600`,
      },
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}

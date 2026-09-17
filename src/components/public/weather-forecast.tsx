"use client";

import { useEffect, useState } from "react";
import { CloudSun, Cloud, CloudRain, CloudFog, CloudLightning, Sun, Droplets, type LucideIcon } from "lucide-react";

interface WeatherForecastProps {
  /** "DD/MM/YYYY" */
  date: string;
  /** "16h00" hoặc "16:00" — giờ đá bóng, dùng để lấy đúng mốc dự báo trong ngày */
  time?: string;
  /** "dark" — nền navy (hero chi tiết trận đấu). "light" — nền trắng (card). */
  variant?: "dark" | "light";
}

interface ForecastPoint {
  temp: number;
  code: number;
  precipProb: number;
}

// Mã thời tiết WMO (chuẩn Open-Meteo) → icon + mô tả tiếng Việt.
function describeCode(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "Trời quang", Icon: Sun };
  if (code === 1 || code === 2) return { label: "Ít mây", Icon: CloudSun };
  if (code === 3) return { label: "Nhiều mây", Icon: Cloud };
  if (code === 45 || code === 48) return { label: "Sương mù", Icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Mưa phùn", Icon: CloudRain };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Có mưa", Icon: CloudRain };
  if ([95, 96, 99].includes(code)) return { label: "Dông", Icon: CloudLightning };
  return { label: "Nhiều mây", Icon: Cloud };
}

function parseMatchDateTime(date: string, time?: string): Date | null {
  const parts = date.split("/");
  if (parts.length < 3) return null;
  const [d, m, y] = parts.map((p) => parseInt(p, 10));
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  const dt = new Date(y, m - 1, d);
  if (time) {
    const [hh, mm] = time.replace("h", ":").split(":").map((p) => parseInt(p, 10));
    dt.setHours(isNaN(hh) ? 12 : hh, isNaN(mm) ? 0 : mm, 0, 0);
  } else {
    dt.setHours(12, 0, 0, 0);
  }
  return dt;
}

// Open-Meteo dự báo miễn phí, không cần API key — tối đa 16 ngày tới. Trận
// ngoài khoảng này (đã diễn ra, hoặc còn quá xa) thì không có gì để tải.
function isWithinForecastRange(date: string, time?: string): boolean {
  const target = parseMatchDateTime(date, time);
  if (!target) return false;
  const daysAhead = Math.ceil((target.getTime() - Date.now()) / 86400000);
  return daysAhead >= 0 && daysAhead <= 15;
}

export function WeatherForecast({ date, time, variant = "dark" }: WeatherForecastProps) {
  // Tính trước (đồng bộ, ngay từ lần render đầu) để tránh chớp nháy "Đang
  // tải…" cho các trận/sự kiện ngoài khoảng dự báo (vd. đã diễn ra) — nếu
  // ngoài khoảng thì ẩn thẳng từ đầu, không qua trạng thái loading.
  const [forecast, setForecast] = useState<ForecastPoint | null | undefined>(
    () => (isWithinForecastRange(date, time) ? undefined : null)
  );

  useEffect(() => {
    if (!isWithinForecastRange(date, time)) return;
    const target = parseMatchDateTime(date, time);
    if (!target) return;

    const controller = new AbortController();

    // Gọi API nội bộ (không phải Open-Meteo trực tiếp) — được cache ở Vercel
    // Edge, chỉ thực sự làm mới dữ liệu 1 lần/ngày lúc 8h sáng giờ VN, dùng
    // chung cho mọi khách thay vì mỗi lượt xem đều gọi thẳng ra ngoài.
    fetch("/api/weather", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        const times: string[] = data?.hourly?.time ?? [];
        if (times.length === 0) {
          setForecast(null);
          return;
        }
        // Tìm mốc giờ gần nhất với giờ thi đấu
        let bestIdx = 0;
        let bestDiff = Infinity;
        for (let i = 0; i < times.length; i++) {
          const diff = Math.abs(new Date(times[i]).getTime() - target.getTime());
          if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i;
          }
        }
        setForecast({
          temp: Math.round(data.hourly.temperature_2m[bestIdx]),
          code: data.hourly.weathercode[bestIdx],
          precipProb: data.hourly.precipitation_probability[bestIdx],
        });
      })
      .catch(() => setForecast(null));

    return () => controller.abort();
  }, [date, time]);

  if (forecast === null) return null; // không lấy được dự báo — ẩn hẳn, không hiện lỗi

  const isDark = variant === "dark";

  if (forecast === undefined) {
    return (
      <div className={`flex justify-center ${isDark ? "mt-4" : "pt-1.5"}`}>
        <div
          className={`inline-flex items-center gap-2 text-xs animate-pulse ${
            isDark
              ? "px-4 py-2 rounded-full bg-white/10 text-gray-400"
              : "text-gray-400"
          }`}
        >
          Đang tải dự báo thời tiết…
        </div>
      </div>
    );
  }

  const { label, Icon } = describeCode(forecast.code);

  if (!isDark) {
    // Card nhỏ, nền trắng — gọn theo phong cách CountdownTimer, không viền pill.
    return (
      <div className="flex items-center justify-center gap-1.5 pt-1.5 text-xs text-gray-500">
        <Icon className="size-3.5 text-goda-yellow shrink-0" />
        <span className="font-semibold text-goda-navy">{forecast.temp}°C</span>
        <span>{label}</span>
        <span className="flex items-center gap-0.5 text-gray-400">
          <Droplets className="size-3" />
          {forecast.precipProb}%
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4 flex justify-center">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-sm text-gray-200">
        <Icon className="size-5 text-goda-yellow shrink-0" />
        <span className="font-semibold text-white">{forecast.temp}°C</span>
        <span className="text-gray-300">{label}</span>
        <span className="flex items-center gap-1 text-gray-400 text-xs">
          <Droplets className="size-3.5" />
          {forecast.precipProb}%
        </span>
      </div>
    </div>
  );
}

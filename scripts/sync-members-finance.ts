// ═══════════════════════════════════════
// GODA FC — Đồng bộ 26 thành viên thật (MOCK_MEMBERS) vào Prisma Member,
// gắn số điện thoại + mật khẩu mặc định cho cổng tài chính thành viên.
//
// Chạy tự động mỗi lần build trên Vercel nên PHẢI an toàn khi chạy lặp lại:
// - Thành viên đã có mật khẩu → giữ nguyên mật khẩu & cờ đổi mật khẩu.
// - Không ghi đè tên/số áo/thống kê đã chỉnh qua /admin.
//
// Số điện thoại (dữ liệu cá nhân, repo public) lấy từ biến môi trường
// MEMBER_PHONES_JSON trên Vercel, hoặc file scripts/name_phone_map.json
// (không commit) khi chạy trên máy: npx tsx scripts/sync-members-finance.ts
// ═══════════════════════════════════════

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { MOCK_MEMBERS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

const CHAIRMAN_NAME = "Lê Thanh Hà";
const DEFAULT_PASSWORD = "123456";

/** Phải giữ giống hệt normalizePhone() trong src/auth.ts. */
function normalizePhone(raw: string): string {
  let s = raw.replace(/[\s.-]/g, "");
  if (s.startsWith("+84")) s = "0" + s.slice(3);
  else if (s.startsWith("84") && s.length > 9) s = "0" + s.slice(2);
  return s;
}

function loadPhoneMap(): Record<string, string> {
  if (process.env.MEMBER_PHONES_JSON) {
    return JSON.parse(process.env.MEMBER_PHONES_JSON);
  }
  const file = join(__dirname, "name_phone_map.json");
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  throw new Error("Thiếu MEMBER_PHONES_JSON hoặc scripts/name_phone_map.json");
}

const maskPhone = (p: string) => p.slice(0, 3) + "****" + p.slice(-3);

async function main() {
  console.log("🌱 Đồng bộ thành viên cho cổng tài chính...");
  const phoneMap = loadPhoneMap();

  const seen = new Map<string, string>();
  for (const [name, raw] of Object.entries(phoneMap)) {
    const p = normalizePhone(raw);
    if (seen.has(p)) throw new Error(`Trùng số điện thoại: ${seen.get(p)} & ${name}`);
    seen.set(p, name);
  }

  const passwordHash = await hash(DEFAULT_PASSWORD, 10);
  let created = 0;
  let updated = 0;

  for (const m of MOCK_MEMBERS) {
    const rawPhone = phoneMap[m.name];
    if (!rawPhone) {
      console.warn(`⚠️  Không có số điện thoại cho: ${m.name} — bỏ qua`);
      continue;
    }
    const phone = normalizePhone(rawPhone);
    const financeRole = m.name === CHAIRMAN_NAME ? "chairman" : "member";

    const existing = await prisma.member.findFirst({ where: { name: m.name } });
    if (existing) {
      await prisma.member.update({
        where: { id: existing.id },
        data: {
          phone,
          financeRole,
          ...(existing.passwordHash
            ? {}
            : { passwordHash, mustChangePassword: financeRole === "chairman" }),
        },
      });
      updated++;
    } else {
      await prisma.member.create({
        data: {
          id: `seed-${m.name.replace(/\s/g, "-").toLowerCase()}`,
          name: m.name,
          nickname: m.nickname,
          position: m.position,
          number: m.number,
          avatarUrl: m.avatarUrl,
          matches: m.matches,
          goals: m.goals,
          assists: m.assists,
          mvp: m.mvp,
          birthday: m.birthday ?? null,
          joinYear: m.joinYear ?? null,
          status: m.status ?? "Đang thi đấu",
          phone,
          financeRole,
          passwordHash,
          mustChangePassword: financeRole === "chairman",
        },
      });
      created++;
    }
    console.log(`✅ ${m.name} — ${maskPhone(phone)}${financeRole === "chairman" ? " (chủ tịch)" : ""}`);
  }

  console.log(`🎉 Xong: ${created} tạo mới, ${updated} cập nhật`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

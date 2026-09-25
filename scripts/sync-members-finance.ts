// ═══════════════════════════════════════
// GODA FC — Đồng bộ 26 thành viên thật (MOCK_MEMBERS) vào Prisma Member,
// gắn số điện thoại + mật khẩu mặc định cho cổng tài chính thành viên.
//
// Chỉ set các cột liên quan tới tài chính (phone/passwordHash/financeRole/
// mustChangePassword) khi thành viên đã có sẵn trong DB — KHÔNG ghi đè
// name/nickname/số áo/thống kê đã chỉnh qua /admin. Với thành viên hoàn
// toàn chưa có trong DB thì tạo mới đầy đủ từ MOCK_MEMBERS.
//
// Chạy 1 lần: npx tsx scripts/sync-members-finance.ts
// ═══════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { MOCK_MEMBERS } from "../src/lib/mock-data";
import phoneMapJson from "./name_phone_map.json";

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

async function main() {
  console.log("🌱 Đồng bộ thành viên cho cổng tài chính...\n");
  const passwordHash = await hash(DEFAULT_PASSWORD, 10);
  const phoneMap = phoneMapJson as Record<string, string>;

  for (const m of MOCK_MEMBERS) {
    const rawPhone = phoneMap[m.name];
    if (!rawPhone) {
      console.warn(`⚠️  Không có số điện thoại cho: ${m.name} — bỏ qua`);
      continue;
    }
    const phone = normalizePhone(rawPhone);
    const isChairman = m.name === CHAIRMAN_NAME;
    const id = `seed-${m.name.replace(/\s/g, "-").toLowerCase()}`;

    const financeFields = {
      phone,
      passwordHash,
      financeRole: isChairman ? "chairman" : "member",
      mustChangePassword: isChairman,
    };

    await prisma.member.upsert({
      where: { id },
      update: financeFields,
      create: {
        id,
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
        ...financeFields,
      },
    });
    console.log(`✅ ${m.name} — ${phone}${isChairman ? " (chủ tịch)" : ""}`);
  }

  console.log("\n🎉 Đồng bộ hoàn tất!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

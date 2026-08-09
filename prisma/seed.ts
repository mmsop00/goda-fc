// ═══════════════════════════════════════
// GODA FC — Database Seed Script
// ═══════════════════════════════════════
//
// Usage: npx prisma db seed
// (add to package.json: "prisma": { "seed": "tsx prisma/seed.ts" })
// ═══════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding GODA FC database...\n");

  // ── Admin User ──
  const adminEmail = process.env.ADMIN_EMAIL || "admin@goda-fc.vn";
  const adminPassword = process.env.ADMIN_PASSWORD || "GODA2026!";
  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin GODA FC",
      passwordHash,
      role: "admin",
    },
  });
  console.log(`✅ Admin user: ${adminEmail}`);

  // ── Members (16 real members) ──
  const members = [
    { name: "Vũ Ngọc Sơn", nickname: "Xuân Son", position: "Tiền vệ", number: 15, avatarUrl: "https://drive.google.com/uc?export=view&id=1vAWvXyQxnNuTMbQHuJCuYHz4b2xXq0ak", matches: 0, goals: 0, assists: 0, mvp: 0, birthday: "20/01", joinYear: 2025, status: "Đang thi đấu" },
    { name: "Phan Trần Phương", nickname: "Thầy giáo Phương", position: "Hậu vệ", number: 5, avatarUrl: "", matches: 82, goals: 9, assists: 15, mvp: 0, birthday: "14/03", joinYear: 2018, status: "Đang thi đấu" },
    { name: "Vũ Đăng Tuấn", nickname: "Trâu Đồ Sơn", position: "Tiền vệ", number: 80, avatarUrl: "", matches: 123, goals: 25, assists: 34, mvp: 1, birthday: "05/06", joinYear: 2019, status: "Đang thi đấu" },
    { name: "Trần Nguyên Bá", nickname: "Bá", position: "Tiền đạo", number: 37, avatarUrl: "", matches: 68, goals: 31, assists: 12, mvp: 2, birthday: "22/11", joinYear: 2021, status: "Đang thi đấu" },
    { name: "Lê Thanh Hà", nickname: "Hà", position: "Hậu vệ", number: 7, avatarUrl: "", matches: 210, goals: 18, assists: 42, mvp: 4, birthday: "15/08", joinYear: 2014, status: "Đang thi đấu" },
    { name: "Đào Thanh Tùng", nickname: "Tùng", position: "Thủ môn", number: 8, avatarUrl: "", matches: 320, goals: 0, assists: 5, mvp: 6, birthday: "03/04", joinYear: 1994, status: "Đang thi đấu" },
    { name: "Nguyễn Khắc Vĩnh", nickname: "Vĩnh", position: "Hậu vệ", number: 0, avatarUrl: "", matches: 45, goals: 2, assists: 8, mvp: 0, birthday: "12/09", joinYear: 2023, status: "Đang thi đấu" },
    { name: "Nguyễn Văn Mạnh", nickname: "Mạnh", position: "Tiền vệ", number: 0, avatarUrl: "", matches: 196, goals: 29, assists: 34, mvp: 1, birthday: "28/07", joinYear: 2015, status: "Đang thi đấu" },
    { name: "Chu Triệu Thành", nickname: "Thành", position: "Hậu vệ", number: 0, avatarUrl: "", matches: 0, goals: 0, assists: 0, mvp: 0, birthday: "10/12", joinYear: 2026, status: "Đang thi đấu" },
    { name: "Nguyễn An", nickname: "An", position: "Tiền vệ", number: 0, avatarUrl: "", matches: 104, goals: 16, assists: 30, mvp: 1, birthday: "17/05", joinYear: 2020, status: "Đang thi đấu" },
    { name: "Nguyễn Văn Bình", nickname: "Bình", position: "Tiền vệ", number: 0, avatarUrl: "", matches: 0, goals: 0, assists: 0, mvp: 0, birthday: "25/02", joinYear: 2026, status: "Đang thi đấu" },
    { name: "Nguyễn Minh Quang", nickname: "Quang", position: "Tiền đạo", number: 0, avatarUrl: "", matches: 151, goals: 52, assists: 19, mvp: 3, birthday: "08/10", joinYear: 2017, status: "Đang thi đấu" },
    { name: "Đinh Thái Bình", nickname: "Bình", position: "Tiền vệ", number: 0, avatarUrl: "", matches: 0, goals: 0, assists: 0, mvp: 0, birthday: "30/06", joinYear: 2026, status: "Đang thi đấu" },
    { name: "Phạm Trung Thông", nickname: "Thông", position: "Hậu vệ", number: 0, avatarUrl: "", matches: 0, goals: 0, assists: 0, mvp: 0, birthday: "19/01", joinYear: 2026, status: "Đang thi đấu" },
    { name: "Phạm Hồng Thái", nickname: "Thái", position: "Tiền đạo", number: 0, avatarUrl: "", matches: 182, goals: 59, assists: 15, mvp: 2, birthday: "14/02", joinYear: 2016, status: "Đang thi đấu" },
    { name: "Trần Đình Thanh", nickname: "Thanh", position: "Tiền vệ", number: 22, avatarUrl: "", matches: 175, goals: 26, assists: 29, mvp: 2, birthday: "09/03", joinYear: 2018, status: "Đang thi đấu" },
  ];

  for (const m of members) {
    await prisma.member.upsert({
      where: { id: `seed-${m.name.replace(/\s/g, "-").toLowerCase()}` },
      update: {},
      create: { id: `seed-${m.name.replace(/\s/g, "-").toLowerCase()}`, ...m },
    });
  }
  console.log(`✅ ${members.length} members seeded`);

  // ── Hall of Fame ──
  const hofEntries = [
    { name: "Quý Yếm, Ngọc Béo, Quang Gà", categories: ["Sáng lập"], title: "Đồng sáng lập GODA FC", year: "1994–2000", description: "Ba người bạn thân đã cùng nhau đặt nền móng cho GODA FC tại sân C500, Hà Nội.", highlight: true, sortOrder: 1 },
    { name: "Văn Cót, Huy", categories: ["Ban quản lý"], title: "Chủ tịch CLB giai đoạn 2000–2003", year: "2000–2003", description: "Dẫn dắt GODA FC đến chức vô địch sân 11 Lạng Sơn mở rộng 2000.", highlight: true, sortOrder: 2 },
    { name: "Chú Thôn", categories: ["Ban quản lý"], title: "Chủ tịch CLB giai đoạn 2003–2005", year: "2003–2005", description: "Đưa GODA FC giành giải Nhì sân 11 Hưng Yên mở rộng 2003.", highlight: false, sortOrder: 3 },
    { name: "Chú Minh Già", categories: ["Ban quản lý"], title: "Chủ tịch CLB giai đoạn 2005–2007", year: "2005–2007", description: "Người thầy lớn của GODA FC, vô địch phủi Hà Nội 2007.", highlight: true, sortOrder: 4 },
    { name: "Chú Quang Huy", categories: ["Ban quản lý"], title: "Chủ tịch CLB giai đoạn 2007–2009", year: "2007–2009", description: "Duy trì và phát triển CLB trong giai đoạn chuyển giao thế hệ.", highlight: false, sortOrder: 5 },
    { name: "Chú Bảo", categories: ["Ban quản lý"], title: "Chủ tịch CLB giai đoạn 2009–2013 (đã mất)", year: "2009–2013", description: "Một trái tim nhiệt huyết, một nhà lãnh đạo tận tụy. Mãi nhớ ơn chú.", highlight: true, sortOrder: 6 },
    { name: "Chú Thanh Béo", categories: ["Ban quản lý"], title: "Chủ tịch CLB giai đoạn 2013–2014", year: "2013–2014", description: "Giai đoạn ngắn nhưng đầy ý nghĩa, giúp CLB ổn định sau mất mát lớn.", highlight: false, sortOrder: 7 },
    { name: "Lê Thanh Hà", categories: ["Ban quản lý", "Đội trưởng", "Cầu thủ nổi bật"], title: "Chủ tịch CLB (2014–nay)", year: "2014–nay", description: "Dẫn dắt GODA FC bước vào kỷ nguyên mới.", highlight: true, sortOrder: 8 },
    { name: "Trần Đình Thanh", categories: ["Cầu thủ nổi bật"], title: "Đội phó GODA FC — Số 22", year: "2018–nay", description: "175 trận, 26 bàn, 29 kiến tạo.", highlight: false, sortOrder: 9 },
    { name: "Phan Trần Phương", categories: ["Cầu thủ nổi bật"], title: "Cựu đội trưởng — Số 5", year: "2018–2024", description: "82 trận, 9 bàn, 15 kiến tạo.", highlight: false, sortOrder: 10 },
    { name: "Đào Thanh Tùng", categories: ["Kỷ lục"], title: "Thủ môn huyền thoại — Số 8", year: "1994–nay", description: "Người gác đền trung thành nhất lịch sử GODA FC.", highlight: true, sortOrder: 11 },
  ];

  for (const h of hofEntries) {
    await prisma.hallOfFameEntry.create({ data: h });
  }
  console.log(`✅ ${hofEntries.length} Hall of Fame entries seeded`);

  // ── News ──
  const newsItems = [
    { slug: "goda-fc-thang-fc-thanh-xuan-3-1", title: "GODA FC thắng thuyết phục 3-1 trước FC Thanh Xuân", summary: "Chiến thắng ấn tượng với cú đúp của Hùng 'Goda' và bàn thắng từ Tuấn 'Tường'.", content: "Trong khuôn khổ giao hữu định kỳ, GODA FC đã có chiến thắng thuyết phục 3-1 trước FC Thanh Xuân...", date: "03/08/2026", category: "Trận đấu" },
    { slug: "chuc-mung-sinh-nhat-thanh-vien-thang-8", title: "Chúc mừng sinh nhật thành viên tháng 8", summary: "GODA FC gửi lời chúc mừng sinh nhật tới các thành viên có sinh nhật trong tháng 8.", content: "Thay mặt Ban quản lý và toàn thể thành viên...", date: "01/08/2026", category: "Sinh nhật" },
    { slug: "lich-tap-luyen-giao-huu-thang-8-2026", title: "Lịch tập luyện và giao hữu tháng 8/2026", summary: "Cập nhật lịch tập luyện định kỳ và các trận giao hữu trong tháng 8.", content: "Ban quản lý GODA FC xin thông báo lịch tập luyện...", date: "28/07/2026", category: "Thông báo" },
    { slug: "goda-fc-dang-cai-giai-phong-trao-ha-noi-2026", title: "GODA FC đăng cai tổ chức giải phong trào Hà Nội 2026", summary: "Lần đầu tiên GODA FC vinh dự được chọn làm đơn vị đăng cai.", content: "Tin vui cho cộng đồng GODA FC!...", date: "20/07/2026", category: "Giải đấu" },
    { slug: "ky-niem-32-nam-thanh-lap-goda-fc", title: "Kỷ niệm 32 năm thành lập GODA FC", summary: "Nhân dịp sinh nhật lần thứ 32, cùng nhìn lại chặng đường đáng tự hào.", content: "Tháng 9 này, GODA FC sẽ kỷ niệm 32 năm thành lập...", date: "15/07/2026", category: "Kỷ niệm" },
    { slug: "ra-mat-bo-nhan-dien-thuong-hieu-moi", title: "Ra mắt bộ nhận diện thương hiệu mới", summary: "GODA FC chính thức ra mắt logo mới, đồng phục thi đấu và bộ nhận diện thương hiệu 2026.", content: "Sau nhiều tháng ấp ủ...", date: "10/07/2026", category: "Tin CLB" },
  ];

  for (const n of newsItems) {
    await prisma.newsItem.upsert({
      where: { slug: n.slug },
      update: {},
      create: n,
    });
  }
  console.log(`✅ ${newsItems.length} news items seeded`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

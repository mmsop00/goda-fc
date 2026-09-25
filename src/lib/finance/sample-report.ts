// DỮ LIỆU MẪU cho trang báo cáo — chỉ dựng trên trình duyệt để xem thử giao
// diện, KHÔNG ghi vào DB. Cố định (seed) để lần nào mở cũng giống nhau.

import { buildReport, type FinanceReport, type RawBill, type RawEntry } from "./report-core";

const NAMES = [
  "Lê Thanh Hà", "Trần Đình Thanh", "Huy Quang", "Hoàng Trọng Nội", "Nguyễn Văn Bình", "Chu Triệu Thành",
  "Nguyễn Tiến Dũng", "Phạm Trung Thông", "Trần Tam Thịnh", "Phạm Duy Thắng", "Phan Trần Phương", "Nguyễn Việt Dũng",
  "Nguyễn Văn Mạnh", "Vũ Thái Thịnh", "Đinh Thái Bình", "Nguyễn Khắc Vĩnh", "Vũ Đăng Tuấn", "Đào Thanh Tùng",
  "Nguyễn An", "Trần Tiến Dũng", "Trương Quang Huy", "Phùng Văn Lục", "Nguyễn Mạnh Tuấn", "Vũ Ngọc Sơn",
  "Trần Nguyên Bá", "Phan Hồng Thái",
];
const MONTHLY_EXEMPT = new Set(["Nguyễn Văn Bình", "Chu Triệu Thành", "Nguyễn Tiến Dũng"]);

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function buildSampleReport(now = new Date()): FinanceReport {
  const rand = rng(32);
  const members = NAMES.map((name, i) => ({ id: `mau-${i}`, name }));
  const bills: RawBill[] = [];
  const entries: RawEntry[] = [];

  // 9 tháng gần nhất, tính cả tháng hiện tại
  const months = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 8 + i, 1);
    return { y: d.getFullYear(), m: d.getMonth() + 1, last: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() };
  });
  const isCurrent = (i: number) => i === months.length - 1;
  const day = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
  const today = now.getDate();

  const first = months[0];
  entries.push({ id: "mau-so-du", direction: "thu", category: "so_du", title: `Số dư chuyển sang`, amount: 25_160_000, date: day(first.y, first.m, 2), period: null, note: "Quỹ cũ trước khi dùng website" });

  months.forEach(({ y, m, last }, i) => {
    const cur = isCurrent(i);
    const maxDay = cur ? Math.max(1, today) : last;
    const pick = (lo: number, hi: number) => Math.min(maxDay, lo + Math.floor(rand() * (hi - lo + 1)));
    const period = `${y}-${pad(m)}`;
    // Ngày sang tháng sau (để có khoản đóng/trả muộn — khác nhau giữa 2 cách tính)
    const next = months[i + 1];
    const nextDay = (d: number) => (next ? day(next.y, next.m, isCurrent(i + 1) ? Math.min(d, Math.max(1, today)) : d) : null);

    bills.push({
      id: `mau-quy-${y}-${m}`,
      title: `Quỹ tháng ${pad(m)}/${y}`,
      kind: "quy_thang",
      period,
      dueDate: `${pad(last)}/${pad(m)}/${y}`,
      createdAt: day(y, m, 1),
      items: members
        .filter((mb) => !MONTHLY_EXEMPT.has(mb.name))
        .map((mb) => {
          const r = rand();
          if (cur) {
            const status = r < 0.45 ? "da_dong" : r < 0.6 ? "cho_duyet" : "chua_dong";
            return { memberId: mb.id, amount: 200_000, status, paidDate: status === "da_dong" ? day(y, m, pick(2, 25)) : null };
          }
          // ~80% đóng trong tháng, ~13% đóng muộn sang tháng sau, còn lại chưa đóng
          if (r < 0.8) return { memberId: mb.id, amount: 200_000, status: "da_dong", paidDate: day(y, m, pick(2, 25)) };
          if (r < 0.93) return { memberId: mb.id, amount: 200_000, status: "da_dong", paidDate: nextDay(1 + Math.floor(rand() * 10)) };
          return { memberId: mb.id, amount: 200_000, status: "chua_dong", paidDate: null };
        }),
    });

    // Tiền sân 4 buổi/tháng, nước uống
    // Tiền sân tháng m trả đầu tháng sau (kỳ áp dụng vẫn là tháng m)
    const sanDate = nextDay(2);
    if (sanDate) {
      entries.push({ id: `mau-san-${i}`, direction: "chi", category: "san_bai", title: `Tiền sân C500 tháng ${m}`, amount: 1_600_000, date: sanDate, period, note: "4 buổi × 400.000đ" });
    }
    entries.push({ id: `mau-nuoc-${i}`, direction: "chi", category: "an_uong", title: "Nước uống, đá sau trận", amount: 300_000 + Math.round(rand() * 6) * 50_000, date: day(y, m, pick(10, 20)), period, note: null });
  });

  const at = (i: number, d: number) => {
    const { y, m, last } = months[i];
    return day(y, m, Math.min(d, isCurrent(i) ? Math.max(1, today) : last));
  };
  entries.push({ id: "mau-ao", direction: "chi", category: "trang_phuc", title: "Áo đấu mùa giải mới", amount: 8_500_000, date: at(2, 15), period: null, note: "30 bộ" });
  entries.push({ id: "mau-bong", direction: "chi", category: "trang_phuc", title: "Bóng thi đấu Động Lực", amount: 1_200_000, date: at(2, 18), period: null, note: "3 quả" });
  entries.push({ id: "mau-hieu", direction: "chi", category: "hieu_hi", title: "Thăm hỏi gia đình thành viên", amount: 1_000_000, date: at(4, 6), period: null, note: null });
  entries.push({ id: "mau-giai", direction: "chi", category: "giai_dau", title: "Lệ phí giải phong trào Hà Nội", amount: 1_500_000, date: at(5, 2), period: null, note: null });
  entries.push({ id: "mau-khach", direction: "thu", category: "khach", title: "Đội bạn góp tiền sân giao hữu", amount: 800_000, date: at(5, 12), period: null, note: "FC Thanh Xuân" });

  // Sinh nhật CLB: thành viên ủng hộ + tài trợ, rồi chi tổ chức
  const sn = months.length - 2;
  bills.push({
    id: "mau-sinh-nhat",
    title: "Ủng hộ sinh nhật CLB 32 năm",
    kind: "khac",
    period: null,
    dueDate: null,
    createdAt: at(sn, 1),
    items: members.map((mb) => {
      const paid = rand() < 0.88;
      return { memberId: mb.id, amount: mb.name === "Lê Thanh Hà" ? 2_000_000 : 500_000, status: paid ? "da_dong" : "chua_dong", paidDate: paid ? at(sn, 3 + Math.floor(rand() * 20)) : null };
    }),
  });
  entries.push({ id: "mau-tai-tro", direction: "thu", category: "tai_tro", title: "Tài trợ giải sinh nhật 32 năm", amount: 31_500_000, date: at(sn, 20), period: null, note: "Khách mời và các đội bạn" });
  entries.push({ id: "mau-su-kien", direction: "chi", category: "su_kien", title: "Tổ chức sinh nhật 32 năm", amount: 42_340_000, date: at(sn, 28), period: null, note: "Sân, trọng tài, cúp, tiệc" });

  return buildReport(members, bills, entries);
}

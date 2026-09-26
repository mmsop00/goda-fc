// Hạng mục sổ quỹ — dùng chung server & trình duyệt.

export type Direction = "thu" | "chi";

export const EXPENSE_CATEGORIES = {
  san_bai: "Tiền sân",
  an_uong: "Ăn uống, nước",
  trang_phuc: "Trang phục, dụng cụ",
  giai_dau: "Giải đấu, lệ phí",
  su_kien: "Sự kiện, sinh nhật CLB",
  hieu_hi: "Hiếu hỉ, thăm hỏi",
  khac: "Chi khác",
} as const;

/** Thu không qua đóng quỹ thành viên. */
export const INCOME_CATEGORIES = {
  tai_tro: "Tài trợ, ủng hộ",
  khach: "Khách mời, đội bạn",
  so_du: "Số dư chuyển sang",
  khac: "Thu khác",
} as const;

/** Tiền thành viên đóng qua cổng (PaymentItem), theo loại khoản thu. */
export const MEMBER_PAYMENT_CATEGORIES = {
  quy_thang: "Quỹ tháng",
  dong_gop: "Đóng góp khác",
  nop_tien: "Thành viên nộp tiền",
  ung_ho: "Ủng hộ qua website",
} as const;

export function categoryLabel(direction: Direction, category: string): string {
  const map: Record<string, string> =
    direction === "chi" ? EXPENSE_CATEGORIES : { ...INCOME_CATEGORIES, ...MEMBER_PAYMENT_CATEGORIES };
  return map[category] ?? category;
}

export function isValidCategory(direction: Direction, category: string): boolean {
  return Object.hasOwn(direction === "chi" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES, category);
}

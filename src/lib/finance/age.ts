// Dùng được cả phía server lẫn trình duyệt (không import gì của Node).

export const MONTHLY_FUND_EXEMPT_AGE = 70;

/** Ngày sinh dạng "DD/MM/YYYY"; ngày/tháng chưa rõ có thể ghi "xx". */
function parseBirthday(s: string | null | undefined) {
  const parts = s?.split("/") ?? [];
  if (parts.length !== 3) return null;
  const year = parseInt(parts[2], 10);
  if (!Number.isFinite(year)) return null;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[0], 10);
  return {
    year,
    month: Number.isFinite(month) ? month : 1,
    day: Number.isFinite(day) ? day : 1,
  };
}

/** Tuổi tròn vào cuối tháng `month`/`year` (tháng 1-12). null nếu không rõ năm sinh. */
export function ageAtEndOfMonth(birthday: string | null | undefined, year: number, month: number): number | null {
  const b = parseBirthday(birthday);
  if (!b) return null;
  const lastDay = new Date(year, month, 0).getDate();
  let age = year - b.year;
  if (b.month > month || (b.month === month && b.day > lastDay)) age--;
  return age;
}

/** Từ 70 tuổi trở lên (tính tới cuối tháng thu) được miễn quỹ tháng. */
export function isMonthlyFundExempt(birthday: string | null | undefined, year: number, month: number): boolean {
  const age = ageAtEndOfMonth(birthday, year, month);
  return age !== null && age >= MONTHLY_FUND_EXEMPT_AGE;
}

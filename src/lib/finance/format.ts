export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

/** Rút gọn cho trục/nhãn biểu đồ: 1.500.000 → "1,5tr", 500.000 → "500k". */
export function formatCompactVnd(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  const fmt = (v: number) => v.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  if (abs >= 1e9) return `${sign}${fmt(abs / 1e9)} tỷ`;
  if (abs >= 1e6) return `${sign}${fmt(abs / 1e6)}tr`;
  if (abs >= 1e3) return `${sign}${fmt(abs / 1e3)}k`;
  return `${sign}${abs}`;
}

/** Tháng áp dụng dạng "YYYY-MM" */
export function isValidPeriod(p: string): boolean {
  const m = /^(\d{4})-(\d{2})$/.exec(p);
  return !!m && +m[1] >= 2020 && +m[1] <= 2100 && +m[2] >= 1 && +m[2] <= 12;
}

/** "2026-10" → "10/2026" */
export function formatPeriod(p: string): string {
  const [y, m] = p.split("-");
  return `${m}/${y}`;
}

/** "2026-10-05" → "05/10/2026" */
export function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** "200000" → "200.000" (ô nhập tiền: chỉ giữ chữ số, thêm dấu chấm cho dễ đọc). */
export function formatThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function onlyDigits(s: string): string {
  return s.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

/** Ô tiền vừa bị sửa thành `raw` (con trỏ ở `caret`): trả về chữ số mới và vị
 * trí con trỏ trong chuỗi đã định dạng — ngay sau đúng chữ số vừa gõ. */
export function reformatMoney(raw: string, caret: number): { digits: string; caret: number } {
  const digits = onlyDigits(raw);
  const droppedZeros = raw.replace(/\D/g, "").length - digits.length;
  const before = Math.max(0, raw.slice(0, caret).replace(/\D/g, "").length - droppedZeros);
  const formatted = formatThousands(digits);
  let pos = 0;
  for (let seen = 0; pos < formatted.length && seen < before; pos++) {
    if (/\d/.test(formatted[pos])) seen++;
  }
  return { digits, caret: pos };
}

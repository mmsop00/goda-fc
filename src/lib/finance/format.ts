export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

/** "200000" → "200.000" (ô nhập tiền: chỉ giữ chữ số, thêm dấu chấm cho dễ đọc). */
export function formatThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function onlyDigits(s: string): string {
  return s.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

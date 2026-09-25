// ═══════════════════════════════════════
// GODA FC — Mã nội dung chuyển khoản (nhúng trong VietQR addInfo)
// Crockford Base32: bỏ I/L/O/U vì dễ nhầm khi OCR/đọc bằng mắt.
// ═══════════════════════════════════════

import { randomBytes } from "crypto";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LEN = 6;
const PREFIX = "GODA";

/** Sinh mã ngẫu nhiên dạng "GODA7K3PQ2" — nhúng vào nội dung chuyển khoản. */
export function generatePaymentCode(): string {
  const bytes = randomBytes(CODE_LEN);
  let code = "";
  for (let i = 0; i < CODE_LEN; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return PREFIX + code;
}

// Bắt lại mã GODA###### từ text OCR đọc được trong ảnh bill.
const CODE_REGEX = /GODA([0-9A-HJKMNP-TV-Z]{6})/i;

export function extractPaymentCode(text: string): string | null {
  const match = text.toUpperCase().match(CODE_REGEX);
  return match ? PREFIX + match[1] : null;
}

/** Tìm các dãy số ≥4 chữ số trong text (đã bỏ dấu phẩy/chấm ngăn cách hàng nghìn). */
export function extractAmounts(text: string): number[] {
  const cleaned = text.replace(/[.,](?=\d{3}\b)/g, "");
  const matches = cleaned.match(/\d{4,}/g) ?? [];
  return matches.map((m) => parseInt(m, 10)).filter((n) => Number.isFinite(n));
}

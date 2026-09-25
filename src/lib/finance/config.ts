// ═══════════════════════════════════════
// GODA FC — Cấu hình tài khoản ngân hàng & VietQR
// ═══════════════════════════════════════

// BIDV — mã BIN theo chuẩn VietQR (napas), STK & tên chủ tài khoản chủ tịch
// Lê Thanh Hà, người giữ quỹ CLB.
export const BANK_BIN = "970418";
export const BANK_ACCOUNT_NO = "1261366011";
export const BANK_ACCOUNT_NAME = "LE THANH HA";
const VIETQR_TEMPLATE = "compact2";

/** Dựng URL ảnh QR VietQR (dịch vụ công khai img.vietqr.io, không cần API key). */
export function buildVietQrUrl(amount: number, addInfo: string): string {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo,
    accountName: BANK_ACCOUNT_NAME,
  });
  return `https://img.vietqr.io/image/${BANK_BIN}-${BANK_ACCOUNT_NO}-${VIETQR_TEMPLATE}.png?${params.toString()}`;
}

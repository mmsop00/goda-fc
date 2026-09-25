// ═══════════════════════════════════════
// GODA FC — Lọc ảnh bill bằng OCR (chỉ là GỢI Ý, không tự quyết định).
// Chủ tịch luôn là người xác nhận cuối cùng dựa trên tài khoản ngân hàng
// thật — OCR chỉ giúp lọc nhanh trước, không bao giờ được để lỗi/timeout
// của bước này chặn việc upload bill.
// ═══════════════════════════════════════

import { createWorker } from "tesseract.js";
import { extractPaymentCode, extractAmounts } from "./code";

export interface OcrResult {
  hint: "likely_match" | "needs_review";
  rawText: string;
}

const OCR_TIMEOUT_MS = 15_000;

async function runOcr(imageData: Buffer): Promise<string> {
  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(imageData);
    return text;
  } finally {
    await worker.terminate();
  }
}

/** So khớp mã GODA###### + số tiền trong text đọc được từ ảnh với khoản cần
 * đóng. Không bao giờ throw — timeout/lỗi đều rơi về "needs_review". */
export async function checkReceiptImage(
  imageData: Buffer,
  expectedCode: string,
  expectedAmount: number
): Promise<OcrResult> {
  try {
    const text = await Promise.race([
      runOcr(imageData),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("OCR timeout")), OCR_TIMEOUT_MS)
      ),
    ]);

    const foundCode = extractPaymentCode(text);
    const foundAmounts = extractAmounts(text);
    const codeMatches = foundCode === expectedCode;
    const amountMatches = foundAmounts.includes(expectedAmount);

    return {
      hint: codeMatches && amountMatches ? "likely_match" : "needs_review",
      rawText: text.slice(0, 500),
    };
  } catch (e) {
    console.error("OCR error (non-blocking):", e);
    return { hint: "needs_review", rawText: "" };
  }
}

// ═══════════════════════════════════════
// GODA FC — Thu nhỏ ảnh bill phía trình duyệt trước khi upload, để không
// nặng database (ảnh bill chỉ cần đọc được số tiền/nội dung, không cần độ
// phân giải gốc của ảnh chụp màn hình điện thoại).
// ═══════════════════════════════════════

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.82;

/** Nhận 1 File ảnh, trả về 1 File JPEG đã thu nhỏ (giữ nguyên nếu đã nhỏ). */
export async function resizeImageFile(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob) return file;

  return new File([blob], "bill.jpg", { type: "image/jpeg" });
}

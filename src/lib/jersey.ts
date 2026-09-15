// Màu áo đấu — dùng chung giữa thẻ trận đấu (match-card) và trang chi tiết
// (match-detail-hero) để 2 nơi luôn đồng bộ giao diện.

export function jerseyBadgeClass(color: string): string {
  if (color.startsWith("Vàng")) return "bg-yellow-200 text-yellow-800";
  if (color.startsWith("Xanh")) return "bg-blue-200 text-blue-800";
  if (color.startsWith("Đỏ")) return "bg-red-200 text-red-800";
  if (color.startsWith("Trắng")) return "bg-gray-200 text-gray-800";
  return "bg-gray-100 text-gray-700";
}

// Màu icon áo — cùng cách phân loại với jerseyBadgeClass, để icon và nền
// badge luôn khớp màu nhau.
export function jerseyIconColor(color: string): string {
  if (color.startsWith("Vàng")) return "text-yellow-500";
  if (color.startsWith("Xanh")) return "text-blue-500";
  if (color.startsWith("Đỏ")) return "text-red-500";
  if (color.startsWith("Trắng")) return "text-gray-400";
  return "text-gray-500";
}

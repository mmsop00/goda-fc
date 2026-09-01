// ─── GODA FC Mock Data ───
// Tất cả dữ liệu mock cho homepage prototype TASK-003.
// Sẽ được thay thế bằng API/Supabase ở Phase 2+.

// ═══════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════

export interface MatchInfo {
  id: string;
  type: "upcoming" | "recent";
  opponent: string;
  opponentLogo?: string;
  date: string;
  time?: string;
  venue: string;
  score?: { goda: number; opponent: number };
  isHome: boolean;
  detailId?: string;
  googleMapsUrl?: string;
  goalScorers?: string;
}

export interface PlayerSpotlight {
  id: string;
  name: string;
  nickname: string;
  position: string;
  number: number;
  avatarUrl: string;
  matches: number;
  goals: number;
  assists: number;
  mvp: number;
}

export interface HistoryMilestone {
  year: number;
  title: string;
  description: string;
}

export interface UpcomingEvent {
  id: string;
  type: "match" | "club_event" | "social" | "birthday";
  title: string;
  date: string;
  time?: string;
  description: string;
  level: "MAJOR" | "NORMAL" | "MINOR";
}

export interface TopDonor {
  id: string;
  name: string;
  amount: number;
  month?: string;
  anonymous: boolean;
}

export type NewsCategory =
  | "Tin CLB"
  | "Trận đấu"
  | "Sinh nhật"
  | "Giải đấu"
  | "Kỷ niệm"
  | "Thông báo";

export const NEWS_CATEGORY_COLORS: Record<NewsCategory, string> = {
  "Tin CLB": "bg-goda-navy text-white border-0",
  "Trận đấu": "bg-goda-yellow/20 text-goda-navy border-0",
  "Sinh nhật": "bg-pink-100 text-pink-700 border-0",
  "Giải đấu": "bg-goda-green/20 text-goda-green border-0",
  "Kỷ niệm": "bg-purple-100 text-purple-700 border-0",
  "Thông báo": "bg-blue-100 text-blue-700 border-0",
};

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: NewsCategory;
  author: string;
  thumbnailUrl: string;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string;
  caption: string;
}

// ═══════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════

export const MOCK_MATCHES: MatchInfo[] = [
  {
    id: "match-006",
    type: "recent",
    opponent: "Hồ Gươm FC",
    date: "30/08/2026",
    time: "16:00",
    venue: "Sân La Thành, Hà Nội",
    score: { goda: 5, opponent: 4 },
    isHome: false,
    detailId: "mr-006",
    googleMapsUrl: "https://maps.app.goo.gl/DTkNxGArmgyny5y88",
    goalScorers: "⚽ Hà 10', Hùng 25', Bá 40' 60' 75'",
  },
  {
    id: "match-005",
    type: "recent",
    opponent: "Tràng An FC",
    date: "16/08/2026",
    time: "16:45",
    venue: "Sân Hòa Phát, Hà Nội",
    score: { goda: 1, opponent: 4 },
    isHome: false,
    detailId: "mr-005",
    googleMapsUrl: "https://maps.app.goo.gl/S4a87o6VP4jk9vgW7",
    goalScorers: "⚽ Sơn 80'",
  },
  {
    id: "match-001",
    type: "recent",
    opponent: "Việt Nhật FC",
    date: "08/08/2026",
    time: "16:00",
    venue: "Sân Cổ Nhuế, Hà Nội",
    score: { goda: 0, opponent: 3 },
    isHome: false,
    detailId: "mr-004",
    googleMapsUrl: "https://maps.app.goo.gl/KoyeCaWrBjNVoyg46",
  },
  {
    id: "match-002",
    type: "recent",
    opponent: "Bắc Việt FC",
    date: "02/08/2026",
    time: "16:00",
    venue: "Sân Bắc Việt, Hà Nội",
    score: { goda: 1, opponent: 1 },
    isHome: false,
    detailId: "mr-003",
    googleMapsUrl: "https://maps.app.goo.gl/dwVAQCR4ZAVYtkFD9",
    goalScorers: "⚽ Bá 30'",
  },
  {
    id: "match-003",
    type: "recent",
    opponent: "Nguyên Dương FC",
    date: "26/07/2026",
    time: "16:00",
    venue: "Sân Nguyên Dương, Hà Nội",
    score: { goda: 2, opponent: 1 },
    isHome: true,
    detailId: "mr-002",
    googleMapsUrl: "https://maps.app.goo.gl/k9rrrGwQikdfVTDFA",
    goalScorers: "⚽ Quang 85', Thái 90+3'",
  },
  {
    id: "match-004",
    type: "recent",
    opponent: "Việt Nhật FC",
    date: "18/07/2026",
    time: "16:00",
    venue: "Sân Cổ Nhuế, Hà Nội",
    score: { goda: 1, opponent: 3 },
    isHome: false,
    detailId: "mr-001",
    googleMapsUrl: "https://maps.app.goo.gl/KoyeCaWrBjNVoyg46",
  },
];

export const MOCK_PLAYERS: PlayerSpotlight[] = [
  {
    id: "p-001",
    name: "Phạm Hồng Thái",
    nickname: "Thái",
    position: "Tiền đạo",
    number: 0,
    avatarUrl: "https://placehold.co/200x200/0B1E3A/F7C600?text=THÁ",
    matches: 182,
    goals: 59,
    assists: 15,
    mvp: 2,
  },
  {
    id: "p-002",
    name: "Nguyễn Minh Quang",
    nickname: "Quang",
    position: "Tiền đạo",
    number: 0,
    avatarUrl: "https://placehold.co/200x200/0B1E3A/F7C600?text=QUA",
    matches: 151,
    goals: 52,
    assists: 19,
    mvp: 3,
  },
  {
    id: "p-003",
    name: "Nguyễn Văn Mạnh",
    nickname: "Mạnh",
    position: "Tiền vệ",
    number: 0,
    avatarUrl: "https://placehold.co/200x200/0B1E3A/F7C600?text=MẠN",
    matches: 196,
    goals: 29,
    assists: 34,
    mvp: 1,
  },
  {
    id: "p-004",
    name: "Trần Đình Thanh",
    nickname: "Thanh",
    position: "Tiền vệ",
    number: 22,
    avatarUrl: "https://placehold.co/200x200/0B1E3A/F7C600?text=THA",
    matches: 175,
    goals: 26,
    assists: 29,
    mvp: 2,
  },
  {
    id: "p-005",
    name: "Vũ Đăng Tuấn",
    nickname: "Trâu Đồ Sơn",
    position: "Tiền vệ",
    number: 80,
    avatarUrl: "https://placehold.co/200x200/0B1E3A/F7C600?text=TUẤ",
    matches: 123,
    goals: 25,
    assists: 34,
    mvp: 1,
  },
  {
    id: "p-006",
    name: "Nguyễn An",
    nickname: "An",
    position: "Tiền vệ",
    number: 0,
    avatarUrl: "https://placehold.co/200x200/0B1E3A/F7C600?text=AN",
    matches: 104,
    goals: 16,
    assists: 30,
    mvp: 1,
  },
];

export const MOCK_HISTORY: HistoryMilestone[] = [
  {
    year: 1994,
    title: "Ý tưởng thành lập CLB",
    description:
      "Ngày 30/08/1994, dưới cây đa Thủ Lệ, Quý Yếm, Ngọc Béo, Quang Gà cùng nhóm bạn yêu bóng đá đã lên ý tưởng thành lập GODA FC.",
  },
  {
    year: 2000,
    title: "Vô địch sân 11 Lạng Sơn mở rộng",
    description:
      "Chức vô địch đầu tiên đánh dấu bước ngoặt phát triển của đội bóng.",
  },
  {
    year: 2007,
    title: "Vô địch phủi Hà Nội",
    description:
      "Lên ngôi tại giải đấu danh giá nhất làng bóng đá phong trào Thủ đô.",
  },
  {
    year: 2017,
    title: "Vô địch sân 11 Thái Nguyên mở rộng",
    description:
      "Trở lại đỉnh cao sau 10 năm, khẳng định bản lĩnh GODA FC.",
  },
  {
    year: 2026,
    title: "Ra mắt website chính thức",
    description:
      "Chuyển đổi số GODA FC. Website clbgoda.vn ra mắt, đánh dấu bước chuyển mình trong kỷ nguyên số.",
  },
];

export const MOCK_EVENTS: UpcomingEvent[] = [
  {
    id: "evt-002",
    type: "social",
    title: "Liên hoan sau giải — Bia hơi Thu Hằng",
    date: "05/09/2026",
    time: "18:30",
    description:
      "Liên hoan sau trận tại nhà hàng bia hơi Thu Hằng, 123 Nguyễn Phong Sắc.",
    level: "NORMAL",
  },
  {
    id: "evt-004",
    type: "club_event",
    title: "Giải chạy 100m mở màn — Nhóm dưới U40",
    date: "05/09/2026",
    time: "13:45",
    description: "08 VĐV tranh tài trên đường chạy 08 làn. Giải thưởng: Nhất 500k, Nhì 300k, Ba 200k.",
    level: "NORMAL",
  },
  {
    id: "evt-005",
    type: "club_event",
    title: "Giải chạy 100m — Nhóm U60 trở lên",
    date: "05/09/2026",
    time: "13:50",
    description: "Lượt chạy thứ hai của giải 100m. Giải thưởng: Nhất 500k, Nhì 300k, Ba 200k.",
    level: "NORMAL",
  },
  {
    id: "evt-006",
    type: "match",
    title: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    date: "05/09/2026",
    time: "14:00",
    description: "4 đội: GODA FC, Việt Nhật FC, Motor FC, FFC — 6 trận vòng tròn, sân 11 tại SVĐQG Mỹ Đình. Sau giải liên hoan tại nhà hàng bia hơi Thu Hằng, 123 Nguyễn Phong Sắc.",
    level: "MAJOR",
  },
];

export const MOCK_DONORS: TopDonor[] = [
  { id: "d-001", name: "Huy Quang", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-002", name: "Lê Thanh Hà", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-003", name: "Trần Đình Thanh", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-004", name: "Hoàng Trọng Nội", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-005", name: "Nguyễn Văn Bình", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-006", name: "Chu Triệu Thành", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-007", name: "Nguyễn Tiến Dũng", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-008", name: "Phạm Trung Thông", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-009", name: "Trần Tam Thịnh", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-010", name: "Phạm Duy Thắng", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-011", name: "Phan Trần Phương", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-012", name: "Nguyễn Việt Dũng", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-013", name: "Nguyễn Văn Mạnh", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-014", name: "Vũ Thái Thịnh", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-015", name: "Đinh Thái Bình", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-016", name: "Nguyễn Khắc Vĩnh", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-017", name: "Vũ Đăng Tuấn", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-018", name: "Đào Thanh Tùng", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-019", name: "Nguyễn An", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-020", name: "Trần Tiến Dũng", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-021", name: "Trương Quang Huy", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-022", name: "Phùng Văn Lục", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-023", name: "Nguyễn Mạnh Tuấn", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-024", name: "Vũ Ngọc Sơn", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-025", name: "Trần Nguyên Bá", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-026", name: "Phan Hồng Thái", amount: 0, month: "08/2026", anonymous: false },
  { id: "d-027", name: "Nguyễn Minh Quang", amount: 0, month: "08/2026", anonymous: false },
];

export interface RecentDonation {
  id: string;
  name: string;
  amount: number;
  date: string;
  message?: string;
}

export const MOCK_RECENT_DONATIONS: RecentDonation[] = Array.from({ length: 50 }, (_, i) => {
  const names = [
    "Huy Quang", "Lê Thanh Hà", "Trần Đình Thanh", "Vũ Đăng Tuấn", "Nguyễn Văn Mạnh",
    "Phan Hồng Thái", "Nguyễn Minh Quang", "Phạm Duy Thắng", "Vũ Ngọc Sơn", "Trần Nguyên Bá",
    "Đinh Thái Bình", "Nguyễn An", "Phạm Trung Thông", "Chu Triệu Thành", "Phan Trần Phương",
    "Nguyễn Khắc Vĩnh", "Đào Thanh Tùng", "Vũ Thái Thịnh", "Phùng Văn Lục", "Trương Quang Huy",
    "Nguyễn Văn Bình", "Nguyễn Việt Dũng", "Nguyễn Mạnh Tuấn", "Trần Tam Thịnh", "Hoàng Trọng Nội",
  ];
  const msgs = [
    "Ủng hộ đội bóng", "Góp quỹ tháng 8", "Tài trợ giải đấu", "Ủng hộ sinh nhật CLB",
    "Góp quỹ hoạt động", "Tài trợ trang phục", "Ủng hộ sân bãi", "Góp quỹ từ thiện",
    "", "", "", "", "",
  ];
  const d = new Date(2026, 7, 11 - i); // last 50 days
  return {
    id: `rd-${String(i + 1).padStart(3, "0")}`,
    name: names[i % names.length],
    amount: 0,
    date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
    message: i < 8 ? msgs[i] : undefined,
  };
});

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "news-001",
    slug: "fc-goda-vo-dich-giai-phui-ha-noi-2007",
    title: "FC Goda vô địch giải Phủi Hà Nội 2007 trong lần đầu tham dự",
    summary: "CLB Goda đã vượt qua đối thủ Cường Quốc trong loạt luân lưu nghẹt thở để đoạt cup vô địch Giải bóng đá các CLB Hà Nội mở rộng 2007.",
    content:
      "CLB Goda đã vượt qua đối thủ \"rắn\" Cường Quốc trong loạt luân lưu nghẹt thở để đoạt cup vô địch. Mất tiền đạo chủ lực vì thẻ đỏ, \"ngựa ô\" của giải phong trào truyền thống này đã cầm cự đến phút chót và bước lên bục nhận giải sau 6 loạt đá 11m.\n\nĐiều bất ngờ là có hàng nghìn CĐV trung thành của hai đội cờ quạt, mũ mão đến cổ vũ cho đội bóng \"con cưng\". Họ tạo ra một không khí rộn ràng trên sân Hàng Đẫy.\n\nThiếu 3 trụ cột, Goda vẫn nhập cuộc lấn lướt và ghi bàn thắng chỉ sau 10 phút bóng lăn. Bước ngoặt của trận đấu chỉ đến khi trọng tài chính rút 2 thẻ đỏ, truất quyền thi đấu mỗi bên một cầu thủ.\n\nMất chân sút chủ lực, Goda không gây được sức ép như trong nửa đầu hiệp 1 và bị CLB Cường Quốc san bằng tỷ số. Cường Quốc tiếp tục lấn lướt nhưng 10 cầu thủ Goda đã chơi phòng thủ chủ động và đưa số phận trận đấu lên chấm phạt đền.\n\nSau 6 loạt cân não, Goda đã lật ngược thế cờ và đoạt chức vô địch - một chiếc cup khó nhọc nhưng xứng đáng.\n\nÔng Chủ tịch Nguyễn Quang Huy hớn hở: \"Tôi muốn và đang có kế hoạch đưa Goda vào bản đồ bóng đá chuyên nghiệp. FC Goda là một công ty cổ phần, mà trong đó cổ phiếu chính là tình yêu và nhiệt huyết của các CĐV\".\n\nNguồn: Báo Dân Trí (11/06/2007)",
    date: "11/06/2007",
    category: "Giải đấu",
    author: "Báo Dân Trí",
    thumbnailUrl: "/photos/z8053184475382_01eca30330d964dec2cbe880b97c6af0.jpg",
  },
  {
    id: "news-002",
    slug: "giai-tu-hung-ky-niem-32-nam-thanh-lap-clb-goda",
    title: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    summary: "Ngày 05/09/2026, tại SVĐQG Mỹ Đình, GODA FC tổ chức Giải tứ hùng kỷ niệm 32 năm thành lập CLB với sự tham gia của Việt Nhật FC, Motor FC và FFC, cùng giải chạy 100m mở màn.",
    content: "<p>Nhân kỷ niệm 32 năm thành lập CLB (30/08/1994 — dưới cây đa Thủ Lệ), Ban tổ chức trân trọng giới thiệu <strong>Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA</strong> — ngày hội thể thao của 04 đội bóng thân thiết.</p><h2>Thông tin chung</h2><ul><li>Thời gian tập trung: <strong>13h30 ngày 05/09/2026</strong>.</li><li>Địa điểm: <strong>Sân chính — Sân vận động quốc gia Mỹ Đình</strong>.</li><li>Các đội tham dự: GODA FC, Việt Nhật FC, Motor FC và FFC.</li><li>Liên hoan: 18h30 — 21h00 tại Bia Thu Hằng, 123 Nguyễn Phong Sắc.</li></ul><h2>Chương trình</h2><table><thead><tr><th>Thời gian</th><th>Nội dung</th></tr></thead><tbody><tr><td>13h30</td><td>Các đội có mặt đầy đủ, check-in và chuẩn bị</td></tr><tr><td>13h45 — 13h50</td><td>Giải chạy 100m — nhóm dưới U40 (08 VĐV)</td></tr><tr><td>13h50 — 13h55</td><td>Giải chạy 100m — nhóm U60 trở lên (08 VĐV)</td></tr><tr><td>14h00 — 17h00</td><td>Bóng đá sân 11 — 06 trận vòng tròn</td></tr></tbody></table><h2>Giải chạy 100m mở màn</h2><ul><li>Thời gian: 13h45 — trước khi bắt đầu các trận bóng đá; cự ly 100m trên đường chạy 08 làn.</li><li>02 lượt thi đấu: Lượt 1 — nhóm dưới U40 (13h45); Lượt 2 — nhóm U60 trở lên (13h50).</li><li>Mỗi đội cử 02 đại diện mỗi lượt (08 VĐV/lượt); xếp hạng theo thứ tự về đích.</li><li>Giải thưởng từng lượt: Nhất 500.000đ, Nhì 300.000đ, Ba 200.000đ.</li><li>Lưu ý: Motor FC (xanh tím than) và FFC (xanh Chelsea) là hai tông xanh khác nhau; BTC ưu tiên không xếp VĐV hai đội ở hai làn liền kề.</li></ul><h2>Thể thức bóng đá</h2><ul><li>04 đội thi đấu vòng tròn 01 lượt tính điểm, tổng cộng 06 trận.</li><li>Mỗi trận 30 phút liên tục; mỗi đội đá 03 trận (tổng 90 phút).</li><li>Thi đấu sân 11, áp dụng luật việt vị, không đá hiệp phụ.</li><li>Thắng 03 điểm, hòa 01 điểm, thua 00 điểm. Nếu bằng điểm, xét lần lượt: hiệu số bàn thắng-bại, tổng số bàn thắng, sau đó đá luân lưu penalty.</li></ul><h2>Lịch thi đấu vòng tròn</h2><table><thead><tr><th>Thời gian</th><th>Trận</th><th>Cặp đấu</th></tr></thead><tbody><tr><td>14h00 — 14h30</td><td>1</td><td>GODA FC — Motor FC</td></tr><tr><td>14h30 — 15h00</td><td>2</td><td>Việt Nhật FC — FFC</td></tr><tr><td>15h00 — 15h30</td><td>3</td><td>GODA FC — FFC</td></tr><tr><td>15h30 — 16h00</td><td>4</td><td>Việt Nhật FC — Motor FC</td></tr><tr><td>16h00 — 16h30</td><td>5</td><td>Motor FC — FFC</td></tr><tr><td>16h30 — 17h00</td><td>6</td><td>GODA FC — Việt Nhật FC</td></tr></tbody></table><h2>Lịch thi đấu theo từng đội</h2><table><thead><tr><th>Đội</th><th>Trận 1</th><th>Trận 2</th><th>Trận 3</th></tr></thead><tbody><tr><td>GODA FC</td><td>14h00 — Motor FC</td><td>15h00 — FFC</td><td>16h30 — Việt Nhật FC</td></tr><tr><td>Việt Nhật FC</td><td>14h30 — FFC</td><td>15h30 — Motor FC</td><td>16h30 — GODA FC</td></tr><tr><td>Motor FC</td><td>14h00 — GODA FC</td><td>15h30 — Việt Nhật FC</td><td>16h00 — FFC</td></tr><tr><td>FFC</td><td>14h30 — Việt Nhật FC</td><td>15h00 — GODA FC</td><td>16h00 — Motor FC</td></tr></tbody></table><h2>Các đội tham dự</h2><p><img src='/logos/goda.png' alt='GODA FC' width='72' height='72' style='display:inline-block;margin:4px;border-radius:50%;object-fit:cover'/><img src='/logos/viet-nhat.png' alt='Việt Nhật FC' width='72' height='72' style='display:inline-block;margin:4px;border-radius:50%;object-fit:cover'/><img src='/logos/motor.png' alt='Motor FC' width='72' height='72' style='display:inline-block;margin:4px;border-radius:50%;object-fit:cover'/><img src='/logos/ffc.png' alt='FFC' width='72' height='72' style='display:inline-block;margin:4px;border-radius:50%;object-fit:cover'/></p><h2>Trang phục các đội</h2><table><thead><tr><th>Đội</th><th>Bộ sử dụng</th><th>Màu áo</th><th>Màu quần</th></tr></thead><tbody><tr><td>GODA FC</td><td>Bộ 1</td><td>Đỏ</td><td>Xanh than</td></tr><tr><td>Việt Nhật FC</td><td>Bộ 2</td><td>Vàng</td><td>Đen</td></tr><tr><td>Motor FC</td><td>Bộ 1</td><td>Xanh tím than</td><td>Xanh tím than</td></tr><tr><td>FFC</td><td>Bộ 1</td><td>Xanh Chelsea</td><td>Xanh Chelsea</td></tr></tbody></table><h2>Giải thưởng</h2><ul><li>Giải chạy 100m từng lượt: Nhất 500.000đ, Nhì 300.000đ, Ba 200.000đ.</li><li>Bóng đá: xếp hạng từ Nhất đến Tư; Ban tổ chức có thể trao thêm Vua phá lưới, Thủ môn xuất sắc, Cầu thủ xuất sắc và Cầu thủ fair-play.</li></ul><h2>Đăng ký đội, HLV, đội trưởng và đội hình từng trận</h2><ul><li>Mỗi đội điền thông tin vào tab riêng của đội mình trong Google Sheet: File đăng ký <a href='https://docs.google.com/spreadsheets/d/1Li8W-E-o33IFk1Iaug3SpfO9WbRZKulxecDV4OTPtM8/edit?usp=sharing' target='_blank' rel='noopener'>Danh sách đăng ký - Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA</a>.</li><li>Thông tin đội bóng: màu quần, màu áo, logo của đội.</li><li>Danh sách cầu thủ gồm: STT, họ tên, tuổi, số áo thi đấu. HLV thêm “(HLV)” sau tên; đội trưởng thêm “(C)” sau tên.</li><li>Mỗi đội đăng ký đội hình riêng cho 03 trận (đội hình chính tối đa 11 cầu thủ + đội hình phụ dự bị).</li><li>Mỗi đội đăng ký 02 VĐV nhóm dưới U40 và 02 VĐV nhóm U60 trở lên cho giải chạy 100m.</li></ul><h2>Xếp hạng và trao giải</h2><ul><li>Xếp hạng bóng đá chung cuộc từ Nhất đến Tư theo kết quả sau 06 trận.</li><li>Giải thưởng chạy 100m được trao riêng từng lượt: Nhất 500.000đ, Nhì 300.000đ, Ba 200.000đ.</li><li>Ban tổ chức có thể công bố thêm các danh hiệu: Vua phá lưới, Thủ môn xuất sắc, Cầu thủ xuất sắc và Cầu thủ fair-play.</li></ul><p>Kính mời toàn thể thành viên, gia đình và các CĐV đến cổ vũ cho ngày hội của GODA FC. Đề nghị các đội có mặt đầy đủ, đúng giờ để chương trình diễn ra đúng kế hoạch!</p>",
    date: "01/09/2026",
    category: "Kỷ niệm",
    author: "Ban truyền thông GODA FC",
    thumbnailUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GIAI+TU+HUNG+2026",
  },
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "gal-001",
    type: "image",
    url: "https://placehold.co/800x600/0B1E3A/F7C600?text=Team+Photo",
    thumbnailUrl: "https://placehold.co/400x300/0B1E3A/F7C600?text=Team",
    caption: "Ảnh đội hình GODA FC — Mùa giải 2026",
  },
  {
    id: "gal-002",
    type: "image",
    url: "https://placehold.co/800x600/F7C600/0B1E3A?text=Match+Day",
    thumbnailUrl: "https://placehold.co/400x300/F7C600/0B1E3A?text=Match",
    caption: "Ngày thi đấu — GODA FC vs FC Thanh Xuân",
  },
  {
    id: "gal-003",
    type: "image",
    url: "https://placehold.co/800x600/0F6B4D/FFFFFF?text=Celebration",
    thumbnailUrl: "https://placehold.co/400x300/0F6B4D/FFFFFF?text=Celebration",
    caption: "Khoảnh khắc ăn mừng sau chiến thắng",
  },
  {
    id: "gal-004",
    type: "image",
    url: "https://placehold.co/800x600/152033/F7C600?text=Training",
    thumbnailUrl: "https://placehold.co/400x300/152033/F7C600?text=Training",
    caption: "Buổi tập luyện thường kỳ tại sân Hoàng Gia",
  },
  {
    id: "gal-005",
    type: "video",
    url: "https://www.youtube.com/watch?v=placeholder",
    thumbnailUrl: "https://placehold.co/400x300/0B1E3A/F7C600?text=▶+Video",
    caption: "Highlights: GODA FC 3-1 FC Thanh Xuân",
  },
];

export const ABOUT_TEXT = {
  title: "GODA FC — Hơn cả một đội bóng",
  paragraphs: [
    "Thành lập năm 1994 tại Hà Nội, GODA FC là nơi hội tụ của những người yêu bóng đá, gắn kết bởi niềm đam mê và tinh thần thể thao.",
    "Trải qua hơn 30 năm, CLB đã xây dựng một cộng đồng vững mạnh với hơn 50 thành viên, tham gia hơn 1500 trận đấu và giải đấu từ phong trào đến chuyên nghiệp.",
    "Giá trị cốt lõi: Đoàn kết — Fair Play — Cống hiến — Gia đình.",
  ],
  stats: [
    { label: "Năm thành lập", value: "1994" },
    { label: "Thành viên", value: "50+" },
    { label: "Trận đấu", value: "1500+" },
    { label: "Mùa giải", value: "32" },
  ],
};

export const CTA_DATA = {
  title: "Tham gia GODA FC ngay hôm nay!",
  description:
    "Dù bạn là cầu thủ, cổ động viên hay người yêu bóng đá — GODA FC luôn chào đón bạn.",
  primaryButton: "Đăng ký thành viên",
  secondaryButton: "Liên hệ với chúng tôi",
};

export const FOOTER_DATA = {
  description:
    "Câu lạc bộ bóng đá GODA — Thành lập 1994 tại Hà Nội. Nơi kết nối đam mê bóng đá và tinh thần thể thao.",
  links: [
    { label: "Trang chủ", href: "/" },
    { label: "Giới thiệu", href: "/gioi-thieu" },
    { label: "Lịch sử", href: "/gioi-thieu" },
    { label: "Tin tức & Hình ảnh", href: "/tin-tuc" },
  ],
  contact: {
    address: "Hà Nội, Việt Nam",
    phone: "0974 617 962",
  },
};

// ═══════════════════════════════════════
// PHASE 1 — Type Definitions
// ═══════════════════════════════════════

export interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

export interface AboutTimelineItem {
  year: number;
  title: string;
  description: string;
}

export interface HistoryEntry {
  id: string;
  year: number;
  decade: "1990s" | "2000s" | "2010s" | "2020s";
  title: string;
  description: string;
  imageUrl: string;
  relatedPeople: string[];
  tournament?: string;
}

export type HallOfFameCategory =
  | "Sáng lập"
  | "Ban quản lý"
  | "Đội trưởng"
  | "Đội phó"
  | "Cầu thủ nổi bật"
  | "Kỷ lục"
  | "Khoảnh khắc"
  | "Nhà tài trợ";

export interface HallOfFameEntry {
  id: string;
  name: string;
  categories: HallOfFameCategory[];
  title: string;
  year: number | string;
  description: string;
  avatarUrl: string;
  highlight?: boolean;
}

export interface FullHistoryItem {
  year: number;
  type: "founding" | "achievement" | "president";
  title: string;
  subtitle: string;
  description: string;
}

// ═══════════════════════════════════════
// PHASE 1 — Mock Data
// ═══════════════════════════════════════

export const ABOUT_STORY = {
  title: "Câu chuyện GODA FC",
  paragraphs: [
    "GODA FC ra đời vào một buổi chiều mùa hè năm 1994, khi một nhóm bạn trẻ yêu bóng đá tại Hà Nội quyết định thành lập một đội bóng riêng. Từ một đội bóng 'tập thể dục cuối tuần', GODA FC dần phát triển thành một câu lạc bộ có tổ chức, tham gia các giải đấu phong trào và gặt hái nhiều thành tích đáng tự hào.",
    "Trải qua hơn 30 năm, GODA FC không chỉ là nơi để chơi bóng — đó là một gia đình, nơi các thế hệ cầu thủ gắn kết, chia sẻ niềm vui và cùng nhau trưởng thành. Từ những trận đấu giao hữu đầu tiên đến các chức vô địch, từ sân bóng đầu tiên đến những sân cỏ nhân tạo hiện đại, hành trình của GODA FC là câu chuyện về đam mê, tình bạn và sự bền bỉ.",
    "Hôm nay, GODA FC tiếp tục sứ mệnh kết nối cộng đồng yêu bóng đá, xây dựng một môi trường thể thao lành mạnh và truyền cảm hứng cho thế hệ trẻ.",
  ],
  imageUrl: "https://placehold.co/600x400/0B1E3A/F7C600?text=GODA+1994",
};

export const MOCK_CORE_VALUES: CoreValue[] = [
  {
    icon: "Heart",
    title: "Đoàn kết",
    description:
      "Tinh thần đồng đội là nền tảng. Mỗi thành viên là một mảnh ghép không thể thiếu của GODA FC.",
  },
  {
    icon: "Scale",
    title: "Fair Play",
    description:
      "Chơi đẹp, tôn trọng đối thủ và trọng tài. Bóng đá là niềm vui, không phải cuộc chiến.",
  },
  {
    icon: "Flame",
    title: "Cống hiến",
    description:
      "Mỗi trận đấu là một cơ hội để thể hiện đam mê và khát khao chiến thắng.",
  },
  {
    icon: "Home",
    title: "Gia đình",
    description:
      "GODA FC là mái nhà thứ hai. Nơi chia sẻ buồn vui, cùng nhau vượt qua thử thách.",
  },
];

export const MOCK_ABOUT_TIMELINE: AboutTimelineItem[] = [
  {
    year: 1994,
    title: "Ý tưởng thành lập",
    description: "Ngày 30/08/1994, dưới cây đa Thủ Lệ, Quý Yếm, Ngọc Béo, Quang Gà cùng nhóm bạn lên ý tưởng thành lập GODA FC tại Hà Nội.",
  },
  {
    year: 2000,
    title: "Vô địch sân 11 Lạng Sơn mở rộng",
    description: "Danh hiệu đầu tiên — GODA FC bước lên đỉnh vinh quang.",
  },
  {
    year: 2007,
    title: "Vô địch phủi Hà Nội",
    description: "Chinh phục giải đấu danh giá nhất làng bóng đá phong trào Thủ đô.",
  },
  {
    year: 2017,
    title: "Vô địch sân 11 Thái Nguyên mở rộng",
    description: "Trở lại đỉnh cao, mở ra kỷ nguyên mới cho GODA FC.",
  },
];

export const MOCK_HISTORY_ENTRIES: HistoryEntry[] = [
  {
    id: "hist-001",
    year: 1994,
    decade: "1990s",
    title: "Ý tưởng thành lập GODA FC",
    description:
      "Ngày 30/08/1994, dưới cây đa Thủ Lệ, Quý Yếm, Ngọc Béo, Quang Gà cùng nhóm bạn yêu bóng đá tại Hà Nội lên ý tưởng thành lập GODA FC, ghi dấu khởi nguồn của đội bóng.",
    imageUrl: "https://placehold.co/600x400/0B1E3A/F7C600?text=GODA+1994",
    relatedPeople: ["Quý Yếm", "Ngọc Béo", "Quang Gà"],
  },
  {
    id: "hist-002",
    year: 2000,
    decade: "2000s",
    title: "Vô địch sân 11 Lạng Sơn mở rộng",
    description:
      "Danh hiệu vô địch đầu tiên trong lịch sử CLB. GODA FC lên ngôi tại giải sân 11 Lạng Sơn mở rộng, đánh dấu bước ngoặt phát triển vượt bậc.",
    imageUrl: "https://placehold.co/600x400/F7C600/0B1E3A?text=LANG+SON+2000",
    relatedPeople: ["Văn Cót", "Huy"],
    tournament: "Sân 11 Lạng Sơn mở rộng",
  },
  {
    id: "hist-003",
    year: 2003,
    decade: "2000s",
    title: "Giải Nhì sân 11 Hưng Yên mở rộng",
    description:
      "GODA FC giành ngôi Á quân tại giải sân 11 Hưng Yên mở rộng, tiếp tục khẳng định sức mạnh ở đấu trường khu vực phía Bắc.",
    imageUrl: "https://placehold.co/600x400/0F6B4D/FFFFFF?text=HUNG+YEN+2003",
    relatedPeople: ["Chú Thôn"],
    tournament: "Sân 11 Hưng Yên mở rộng",
  },
  {
    id: "hist-004",
    year: 2007,
    decade: "2000s",
    title: "Vô địch phủi Hà Nội",
    description:
      "Chức vô địch phủi Hà Nội — giải đấu danh giá nhất làng bóng đá phong trào Thủ đô. GODA FC khẳng định vị thế là một trong những CLB hàng đầu.",
    imageUrl: "https://placehold.co/600x400/0B1E3A/F7C600?text=PHUI+HA+NOI+2007",
    relatedPeople: ["Chú Minh Già"],
    tournament: "Giải phủi Hà Nội",
  },
  {
    id: "hist-005",
    year: 2017,
    decade: "2010s",
    title: "Vô địch sân 11 Thái Nguyên mở rộng",
    description:
      "Sau 10 năm, GODA FC lại bước lên đỉnh vinh quang với chức vô địch sân 11 Thái Nguyên mở rộng. Chiến thắng này đánh dấu sự trở lại mạnh mẽ.",
    imageUrl: "https://placehold.co/600x400/0F6B4D/F7C600?text=THAI+NGUYEN+2017",
    relatedPeople: ["Lê Thanh Hà"],
    tournament: "Sân 11 Thái Nguyên mở rộng",
  },
];

export const MOCK_HALL_OF_FAME: HallOfFameEntry[] = [
  {
    id: "hof-001",
    name: "Chú Quý Yếm, Chú Ngọc Béo, Chú Quang Gà",
    categories: ["Sáng lập"],
    title: "Đồng sáng lập GODA FC",
    year: "1994–2000",
    description:
      "Ba người bạn thân đã cùng nhau đặt nền móng cho GODA FC tại Hà Nội. Tinh thần đoàn kết và đam mê bóng đá của họ là ngọn lửa đầu tiên thắp sáng CLB.",
    avatarUrl: "",
    highlight: true,
  },
  {
    id: "hof-002",
    name: "Chú Văn Cót, Chú Huy",
    categories: ["Ban quản lý"],
    title: "Chủ tịch CLB giai đoạn 2000–2003",
    year: "2000–2003",
    description:
      "Dẫn dắt GODA FC đến chức vô địch sân 11 Lạng Sơn mở rộng 2000 — danh hiệu đầu tiên trong lịch sử CLB.",
    avatarUrl: "",
    highlight: true,
  },
  {
    id: "hof-003",
    name: "Chú Thôn",
    categories: ["Ban quản lý"],
    title: "Chủ tịch CLB giai đoạn 2003–2005",
    year: "2003–2005",
    description:
      "Đưa GODA FC giành giải Nhì sân 11 Hưng Yên mở rộng 2003, tiếp tục khẳng định vị thế trong làng bóng đá phong trào.",
    avatarUrl: "",
  },
  {
    id: "hof-004",
    name: "Chú Minh Già",
    categories: ["Ban quản lý"],
    title: "Chủ tịch CLB giai đoạn 2005–2007",
    year: "2005–2007",
    description:
      "Người thầy lớn của GODA FC. Dưới sự dẫn dắt của chú, CLB đã vô địch giải phủi Hà Nội 2007.",
    avatarUrl: "",
    highlight: true,
  },
  {
    id: "hof-005",
    name: "Chú Quang Huy",
    categories: ["Ban quản lý"],
    title: "Chủ tịch CLB giai đoạn 2007–2009",
    year: "2007–2009",
    description:
      "Duy trì và phát triển CLB trong giai đoạn chuyển giao thế hệ, giữ vững tinh thần GODA.",
    avatarUrl: "",
  },
  {
    id: "hof-006",
    name: "Chú Bảo",
    categories: ["Ban quản lý"],
    title: "Chủ tịch CLB giai đoạn 2009–2013 (đã mất)",
    year: "2009–2013",
    description:
      "Một trái tim nhiệt huyết, một nhà lãnh đạo tận tụy. Chú Bảo đã ra đi nhưng di sản của chú vẫn sống mãi trong lòng GODA FC. Mãi nhớ ơn chú.",
    avatarUrl: "",
    highlight: true,
  },
  {
    id: "hof-008",
    name: "Lê Thanh Hà",
    categories: ["Ban quản lý", "Đội trưởng", "Cầu thủ nổi bật"],
    title: "Chủ tịch CLB (2014–nay) — Đội trưởng",
    year: "2009–nay",
    description:
      "Gắn bó từ 2009, dẫn dắt GODA FC từ 2014 đến nay. Vô địch sân 11 Thái Nguyên mở rộng 2017, chuyển đổi số 2025, ra mắt website chính thức. Tiếp tục đưa GODA FC vươn xa.",
    avatarUrl: "",
    highlight: true,
  },
  {
    id: "hof-010",
    name: "Trần Đình Thanh",
    categories: ["Sáng lập", "Ban quản lý", "Đội phó", "Cầu thủ nổi bật"],
    title: "Chủ tịch CLB (2013–2014) — Đội phó GODA FC",
    year: "1994–nay",
    description:
      "Thành viên sáng lập từ 1994. Chủ tịch CLB giai đoạn 2013–2014, giúp CLB ổn định sau mất mát lớn. 210 trận, 38 bàn, 45 kiến tạo. Trụ cột nơi tuyến giữa, cánh tay phải đắc lực của đội trưởng.",
    avatarUrl: "",
    highlight: true,
  },
  {
    id: "hof-011",
    name: "Huy Quang",
    categories: ["Sáng lập", "Nhà tài trợ", "Đội phó", "Kỷ lục"],
    title: "Nhà tài trợ chính — Đội phó GODA FC",
    year: "1994–nay",
    description:
      "Thành viên sáng lập từ 1994. Nhà tài trợ chính, đồng hành cùng đội bóng trong giai đoạn khó khăn nhất. Người tiếp lửa cho thế hệ cầu thủ trẻ, góp phần đưa GODA FC vươn xa.",
    avatarUrl: "",
    highlight: true,
  },
];

// ═══════════════════════════════════════
// TASK-030 — Unified History (8 presidents + 5 achievements = 13 items)
// ═══════════════════════════════════════

export const MOCK_FULL_HISTORY: FullHistoryItem[] = [
  {
    year: 1994,
    type: "founding",
    title: "Ý tưởng thành lập GODA FC",
    subtitle: "30/08/1994 — Cây đa Thủ Lệ, Hà Nội",
    description: "Ngày 30/08/1994, dưới cây đa Thủ Lệ, Chú Quý Yếm, Chú Ngọc Béo, Chú Quang Gà đã lên ý tưởng thành lập GODA FC. Đây là nơi khởi nguồn của mọi câu chuyện.",
  },
  {
    year: 2000,
    type: "achievement",
    title: "Vô địch sân 11 Lạng Sơn mở rộng",
    subtitle: "Chú Văn Cót, Chú Huy — Chủ tịch CLB",
    description: "Danh hiệu vô địch đầu tiên trong lịch sử, đánh dấu bước ngoặt phát triển vượt bậc.",
  },
  {
    year: 2000,
    type: "president",
    title: "Chú Văn Cót, Chú Huy",
    subtitle: "Chủ tịch CLB (2000–2003)",
    description: "Dẫn dắt GODA FC đến chức vô địch Lạng Sơn mở rộng — danh hiệu đầu tiên.",
  },
  {
    year: 2003,
    type: "achievement",
    title: "Giải Nhì sân 11 Hưng Yên mở rộng",
    subtitle: "Chú Thôn — Chủ tịch CLB",
    description: "Á quân giải sân 11 Hưng Yên, tiếp tục khẳng định vị thế khu vực phía Bắc.",
  },
  {
    year: 2003,
    type: "president",
    title: "Chú Thôn",
    subtitle: "Chủ tịch CLB (2003–2005)",
    description: "Đưa GODA FC giành giải Nhì Hưng Yên mở rộng, duy trì vị thế CLB.",
  },
  {
    year: 2005,
    type: "president",
    title: "Chú Minh Già",
    subtitle: "Chủ tịch CLB (2005–2007)",
    description: "Người thầy lớn của GODA FC, dẫn dắt CLB đến chức vô địch phủi Hà Nội 2007.",
  },
  {
    year: 2007,
    type: "achievement",
    title: "Vô địch phủi Hà Nội",
    subtitle: "Chú Minh Già — Chủ tịch CLB",
    description: "Lên ngôi tại giải đấu danh giá nhất làng bóng đá phong trào Thủ đô.",
  },
  {
    year: 2007,
    type: "president",
    title: "Chú Quang Huy",
    subtitle: "Chủ tịch CLB (2007–2009)",
    description: "Duy trì và phát triển CLB trong giai đoạn chuyển giao thế hệ.",
  },
  {
    year: 2009,
    type: "president",
    title: "Chú Bảo (đã mất)",
    subtitle: "Chủ tịch CLB (2009–2013)",
    description: "Một trái tim nhiệt huyết, một nhà lãnh đạo tận tụy. Mãi nhớ ơn chú.",
  },
  {
    year: 2013,
    type: "president",
    title: "Chú Thanh Béo",
    subtitle: "Chủ tịch CLB (2013–2014)",
    description: "Giai đoạn ngắn nhưng đầy ý nghĩa, giúp CLB ổn định sau mất mát lớn.",
  },
  {
    year: 2014,
    type: "president",
    title: "Lê Thanh Hà",
    subtitle: "Chủ tịch CLB (2014–nay)",
    description: "Dẫn dắt GODA FC bước vào kỷ nguyên mới với chức vô địch Thái Nguyên 2017 và chuyển đổi số.",
  },
  {
    year: 2017,
    type: "achievement",
    title: "Vô địch sân 11 Thái Nguyên mở rộng",
    subtitle: "Lê Thanh Hà — Chủ tịch CLB",
    description: "Sau 10 năm, GODA FC trở lại đỉnh cao với chức vô địch Thái Nguyên mở rộng.",
  },
  {
    year: 2026,
    type: "achievement",
    title: "Ra mắt website chính thức",
    subtitle: "Chuyển đổi số GODA FC",
    description: "Website clbgoda.vn ra mắt, đánh dấu bước chuyển mình trong kỷ nguyên số.",
  },
];

// ═══════════════════════════════════════
// TASK-007 — Type Definitions
// ═══════════════════════════════════════

export interface MatchPlayer {
  name: string;
  number: number;
  position: string;
}

export interface MatchGoal {
  player: string;
  minute: number;
  assist?: string;
  side: "GODA" | "opponent";
}

export interface MatchCard {
  player: string;
  minute: number;
  type: "yellow" | "red";
  side: "GODA" | "opponent";
}

export interface MatchResult {
  id: string;
  season: string;
  date: string;
  time?: string;
  venue: string;
  type: "Giao hữu" | "Giải đấu" | "Cúp" | "Sự kiện";
  tournament?: string;
  isHome: boolean;
  opponent: string;
  homeTeam?: string;
  awayTeam?: string;
  opponentScore: number;
  godaScore: number;
  godaLineup: MatchPlayer[];
  opponentLineup: MatchPlayer[];
  goals: MatchGoal[];
  cards: MatchCard[];
  mvp?: string;
  imageUrl: string;
  videoUrl?: string;
  googleMapsUrl?: string;
  godaJerseyColor?: string;
  opponentJerseyColor?: string;
  postponed?: boolean;
  postponedReason?: string;
  eventTitle?: string;
  eventDescription?: string;
}

// ═══════════════════════════════════════
// TASK-007 — Mock Data
// ═══════════════════════════════════════

const BASE_LINEUP: MatchPlayer[] = [
  { name: "Vũ Ngọc Sơn", number: 15, position: "TV" },
  { name: "Phan Trần Phương", number: 5, position: "HV" },
  { name: "Vũ Đăng Tuấn", number: 80, position: "TV" },
  { name: "Trần Nguyên Bá", number: 37, position: "TĐ" },
  { name: "Lê Thanh Hà", number: 7, position: "HV" },
  { name: "Đào Thanh Tùng", number: 8, position: "TM" },
  { name: "Nguyễn Khắc Vĩnh", number: 0, position: "HV" },
  { name: "Nguyễn Văn Mạnh", number: 0, position: "HV" },
  { name: "Chu Triệu Thành", number: 0, position: "TV" },
  { name: "Nguyễn An", number: 0, position: "TM" },
  { name: "Nguyễn Văn Bình", number: 0, position: "TV" },
  { name: "Nguyễn Minh Quang", number: 0, position: "TV" },
  { name: "Đinh Thái Bình", number: 0, position: "TV" },
  { name: "Phạm Trung Thông", number: 0, position: "HV" },
  { name: "Phạm Hồng Thái", number: 0, position: "TV" },
  { name: "Trần Đình Thanh", number: 22, position: "TV" },
];

const OPP_LINEUP: MatchPlayer[] = [];

export const MOCK_MATCH_RESULTS: MatchResult[] = [
  {
    id: "mr-005",
    season: "2026",
    date: "16/08/2026",
    time: "16:45",
    venue: "Sân Hòa Phát, Hà Nội",
    type: "Giao hữu",
    isHome: false,
    opponent: "Tràng An FC",
    opponentScore: 4,
    godaScore: 1,
    godaJerseyColor: "Vàng",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [
      { player: "Cầu thủ Tràng An FC", minute: 5, side: "opponent" },
      { player: "Cầu thủ Tràng An FC", minute: 20, side: "opponent" },
      { player: "Cầu thủ Tràng An FC", minute: 60, side: "opponent" },
      { player: "Cầu thủ Tràng An FC", minute: 75, side: "opponent" },
      { player: "Vũ Ngọc Sơn", minute: 80, assist: "Nguyễn Việt Dũng", side: "GODA" },
    ],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+1-4",
    googleMapsUrl: "https://maps.app.goo.gl/S4a87o6VP4jk9vgW7",
  },
  {
    id: "mr-006p",
    season: "2026",
    date: "23/08/2026",
    time: "16:00",
    venue: "Sân tập Mỹ Đình, Hà Nội",
    type: "Giao hữu",
    isHome: false,
    opponent: "Chè FC",
    opponentScore: 0,
    godaScore: 0,
    godaJerseyColor: "Vàng",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [],
    cards: [],
    postponed: true,
    postponedReason: "Hoãn vì thời tiết",
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+VS+Ch%C3%A8+FC",
    googleMapsUrl: "https://maps.app.goo.gl/zhp7WXiKqcF3shwT6",
  },
  {
    id: "mr-006",
    season: "2026",
    date: "30/08/2026",
    time: "16:00",
    venue: "Sân La Thành, Hà Nội",
    type: "Giao hữu",
    isHome: false,
    opponent: "Hồ Gươm FC",
    opponentScore: 4,
    godaScore: 5,
    godaJerseyColor: "Xanh",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [
      { player: "Lê Thanh Hà", minute: 10, side: "GODA" },
      { player: "Cầu thủ Hồ Gươm FC", minute: 20, side: "opponent" },
      { player: "Hùng", minute: 25, side: "GODA" },
      { player: "Trần Nguyên Bá", minute: 40, side: "GODA" },
      { player: "Trần Nguyên Bá", minute: 60, side: "GODA" },
      { player: "Trần Nguyên Bá", minute: 75, side: "GODA" },
      { player: "Cầu thủ Hồ Gươm FC", minute: 80, side: "opponent" },
      { player: "Cầu thủ Hồ Gươm FC", minute: 85, side: "opponent" },
      { player: "Cầu thủ Hồ Gươm FC", minute: 90, side: "opponent" },
    ],
    cards: [],
    mvp: "Trần Nguyên Bá",
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+5-4",
    googleMapsUrl: "https://maps.app.goo.gl/DTkNxGArmgyny5y88",
  },
  {
    id: "mr-011",
    season: "2026",
    date: "05/09/2026",
    time: "14:30",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Giải đấu",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "FFC",
    homeTeam: "Việt Nhật FC",
    awayTeam: "FFC",
    opponentScore: 0,
    godaScore: 0,
    godaJerseyColor: "Vàng - Đen",
    opponentJerseyColor: "Xanh Chelsea",
    godaLineup: OPP_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=Vi%E1%BB%87t+Nh%E1%BA%ADt+VS+FFC",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-012",
    season: "2026",
    date: "05/09/2026",
    time: "15:30",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Giải đấu",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "Motor FC",
    homeTeam: "Việt Nhật FC",
    awayTeam: "Motor FC",
    opponentScore: 0,
    godaScore: 0,
    godaJerseyColor: "Xanh da trời - Đen",
    opponentJerseyColor: "Đỏ",
    godaLineup: OPP_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=Vi%E1%BB%87t+Nh%E1%BA%ADt+VS+Motor+FC",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-013",
    season: "2026",
    date: "05/09/2026",
    time: "16:00",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Giải đấu",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "FFC",
    homeTeam: "Motor FC",
    awayTeam: "FFC",
    opponentScore: 0,
    godaScore: 0,
    godaJerseyColor: "Xanh tím than",
    opponentJerseyColor: "Đỏ - Đen",
    godaLineup: OPP_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=Motor+VS+FFC",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-race-01",
    season: "2026",
    date: "05/09/2026",
    time: "13:45",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Sự kiện",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "",
    opponentScore: 0,
    godaScore: 0,
    godaLineup: [],
    opponentLineup: [],
    goals: [],
    cards: [],
    eventTitle: "🏃 Giải chạy 100m — Nhóm dưới U40",
    eventDescription: "08 VĐV tranh tài trên đường chạy 08 làn. Giải thưởng: Nhất 500.000đ, Nhì 300.000đ, Ba 200.000đ.",
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=CHAY+100M",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-race-02",
    season: "2026",
    date: "05/09/2026",
    time: "13:50",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Sự kiện",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "",
    opponentScore: 0,
    godaScore: 0,
    godaLineup: [],
    opponentLineup: [],
    goals: [],
    cards: [],
    eventTitle: "🏃 Giải chạy 100m — Nhóm U60 trở lên",
    eventDescription: "Lượt chạy thứ hai của giải 100m. Giải thưởng: Nhất 500.000đ, Nhì 300.000đ, Ba 200.000đ.",
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=CHAY+100M",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-008",
    season: "2026",
    date: "05/09/2026",
    time: "14:00",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Giải đấu",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "Motor FC",
    opponentScore: 0,
    godaScore: 0,
    godaJerseyColor: "Đỏ - Xanh than",
    opponentJerseyColor: "Xanh tím than",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+VS+Motor+FC",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-009",
    season: "2026",
    date: "05/09/2026",
    time: "15:00",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Giải đấu",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "FFC",
    opponentScore: 0,
    godaScore: 0,
    godaJerseyColor: "Vàng - Xanh nước biển",
    opponentJerseyColor: "Đỏ - Đen",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+VS+FFC",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-010",
    season: "2026",
    date: "05/09/2026",
    time: "16:30",
    venue: "Sân vận động quốc gia Mỹ Đình, Hà Nội",
    type: "Giải đấu",
    tournament: "Giải tứ hùng kỷ niệm 32 năm thành lập CLB GODA",
    isHome: true,
    opponent: "Việt Nhật FC",
    opponentScore: 0,
    godaScore: 0,
    godaJerseyColor: "Đỏ - Xanh than",
    opponentJerseyColor: "Xanh da trời - Đen",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+VS+Vi%E1%BB%87t+Nh%E1%BA%ADt+FC",
    googleMapsUrl: "https://maps.app.goo.gl/6JSYpgsN5WsA6tyS8",
  },
  {
    id: "mr-004",
    season: "2026",
    date: "08/08/2026",
    time: "16:00",
    venue: "Sân Cổ Nhuế, Hà Nội",
    type: "Giao hữu",
    isHome: false,
    opponent: "Việt Nhật FC",
    opponentScore: 3,
    godaScore: 0,
    godaJerseyColor: "Vàng",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [
      { player: "Cầu thủ Việt Nhật FC", minute: 30, side: "opponent" },
      { player: "Cầu thủ Việt Nhật FC", minute: 65, side: "opponent" },
      { player: "Cầu thủ Việt Nhật FC", minute: 80, side: "opponent" },
    ],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+0-3",
    googleMapsUrl: "https://maps.app.goo.gl/KoyeCaWrBjNVoyg46",
  },
  {
    id: "mr-003",
    season: "2026",
    date: "02/08/2026",
    time: "16:00",
    venue: "Sân Bắc Việt, Hà Nội",
    type: "Giao hữu",
    isHome: false,
    opponent: "Bắc Việt FC",
    opponentScore: 1,
    godaScore: 1,
    godaJerseyColor: "Vàng",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [
      { player: "Trần Nguyên Bá", minute: 30, assist: "Trần Đình Thanh", side: "GODA" },
      { player: "Cầu thủ Bắc Việt FC", minute: 85, side: "opponent" },
    ],
    cards: [],
    mvp: "Trần Nguyên Bá",
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+1-1",
    googleMapsUrl: "https://maps.app.goo.gl/dwVAQCR4ZAVYtkFD9",
  },
  {
    id: "mr-002",
    season: "2026",
    date: "26/07/2026",
    time: "16:00",
    venue: "Sân Nguyên Dương, Hà Nội",
    type: "Giao hữu",
    isHome: true,
    opponent: "Nguyên Dương FC",
    opponentScore: 1,
    godaScore: 2,
    godaJerseyColor: "Xanh",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [
      { player: "Cầu thủ Nguyên Dương FC", minute: 80, side: "opponent" },
      { player: "Nguyễn Minh Quang", minute: 85, side: "GODA" },
      { player: "Phan Hồng Thái", minute: 93, side: "GODA" },
    ],
    cards: [],
    mvp: "Phan Hồng Thái",
    imageUrl: "https://placehold.co/800x400/0F6B4D/F7C600?text=GODA+2-1",
    googleMapsUrl: "https://maps.app.goo.gl/k9rrrGwQikdfVTDFA",
  },
  {
    id: "mr-001",
    season: "2026",
    date: "18/07/2026",
    time: "16:00",
    venue: "Sân Cổ Nhuế, Hà Nội",
    type: "Giao hữu",
    isHome: false,
    opponent: "Việt Nhật FC",
    opponentScore: 3,
    godaScore: 1,
    godaJerseyColor: "Vàng",
    godaLineup: BASE_LINEUP,
    opponentLineup: OPP_LINEUP,
    goals: [
      { player: "Cầu thủ GODA FC", minute: 20, side: "GODA" },
      { player: "Cầu thủ Việt Nhật FC", minute: 60, side: "opponent" },
      { player: "Cầu thủ Việt Nhật FC", minute: 80, side: "opponent" },
      { player: "Cầu thủ Việt Nhật FC", minute: 90, side: "opponent" },
    ],
    cards: [],
    imageUrl: "https://placehold.co/800x400/0B1E3A/F7C600?text=GODA+1-3",
    googleMapsUrl: "https://maps.app.goo.gl/KoyeCaWrBjNVoyg46",
  },
];
// ═══════════════════════════════════════
// TASK-008 — Type Definitions
// ═══════════════════════════════════════

export type MemberPosition = "Thủ môn" | "Hậu vệ" | "Tiền vệ" | "Tiền đạo";

export interface MemberPublic {
  id: string;
  name: string;
  nickname: string;
  position: MemberPosition;
  number: number;
  avatarUrl: string;
  matches: number;
  goals: number;
  assists: number;
  mvp: number;
  birthday?: string;
  joinYear?: number;
  joinDate?: string;
  status?: string;
}

export type AlbumCategory = "Trận đấu" | "Sự kiện" | "Sinh hoạt" | "Kỷ niệm" | "Video";

export interface AlbumPhoto {
  id: string;
  category: AlbumCategory;
  title: string;
  date: string;
  thumbnailUrl: string;
  fullUrl: string;
  videoUrl?: string;
}

// ═══════════════════════════════════════
// TASK-008 — Mock Data
// ═══════════════════════════════════════

export const MOCK_MEMBERS: MemberPublic[] = [
  // ── Đội trưởng ──
  { id: "m-001", name: "Lê Thanh Hà", nickname: "Chủ tịch", position: "Hậu vệ", number: 7, avatarUrl: "", matches: 187, goals: 8, assists: 22, mvp: 32, birthday: "01/08/1975", joinYear: 2009, joinDate: "13/05/2009", status: "Đội trưởng" },
  // ── Đội phó (sắp xếp theo tuổi) ──
  { id: "m-002", name: "Trần Đình Thanh", nickname: "Thanh", position: "Tiền vệ", number: 16, avatarUrl: "", matches: 210, goals: 38, assists: 45, mvp: 45, birthday: "15/10/1969", joinYear: 1994, joinDate: "1994", status: "Đội phó" },
  { id: "m-003", name: "Huy Quang", nickname: "Quang", position: "Hậu vệ", number: 3, avatarUrl: "", matches: 95, goals: 6, assists: 18, mvp: 15, birthday: "xx/01/1970", joinYear: 1994, joinDate: "1994", status: "Đội phó" },
  { id: "m-004", name: "Hoàng Trọng Nội", nickname: "Nội", position: "Hậu vệ", number: 11, avatarUrl: "", matches: 88, goals: 4, assists: 15, mvp: 12, birthday: "23/05/1979", joinYear: 0, status: "Đội phó" },
  // ── Cầu thủ (sắp xếp theo tuổi, già nhất trước) ──
  { id: "m-005", name: "Nguyễn Văn Bình", nickname: "Bình", position: "Tiền vệ", number: 55, avatarUrl: "", matches: 130, goals: 12, assists: 21, mvp: 14, birthday: "19/04/1955", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-006", name: "Chu Triệu Thành", nickname: "Thầy giáo", position: "Tiền vệ", number: 56, avatarUrl: "", matches: 156, goals: 15, assists: 28, mvp: 16, birthday: "25/02/1956", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-007", name: "Nguyễn Tiến Dũng", nickname: "Tiến Dũng", position: "Tiền vệ", number: 11, avatarUrl: "", matches: 45, goals: 1, assists: 6, mvp: 10, birthday: "25/06/1958", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-008", name: "Phạm Trung Thông", nickname: "Thông", position: "Hậu vệ", number: 33, avatarUrl: "", matches: 230, goals: 6, assists: 20, mvp: 35, birthday: "08/07/1967", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-009", name: "Trần Tam Thịnh", nickname: "Thịnh", position: "Tiền vệ", number: 22, avatarUrl: "", matches: 68, goals: 14, assists: 22, mvp: 13, birthday: "16/08/1970", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-010", name: "Phạm Duy Thắng", nickname: "Thành Toldo", position: "Tiền đạo", number: 13, avatarUrl: "", matches: 82, goals: 55, assists: 18, mvp: 48, birthday: "25/11/1972", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-011", name: "Phan Trần Phương", nickname: "Thầy giáo Phương", position: "Hậu vệ", number: 5, avatarUrl: "", matches: 142, goals: 15, assists: 27, mvp: 30, birthday: "14/03/1976", joinYear: 2018, joinDate: "07/01/2018", status: "Đang thi đấu" },
  { id: "m-012", name: "Nguyễn Việt Dũng", nickname: "Dũng", position: "Hậu vệ", number: 76, avatarUrl: "", matches: 65, goals: 3, assists: 10, mvp: 11, birthday: "27/06/1976", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-013", name: "Nguyễn Văn Mạnh", nickname: "Mạnh", position: "Hậu vệ", number: 77, avatarUrl: "", matches: 245, goals: 38, assists: 48, mvp: 42, birthday: "28/08/1976", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-014", name: "Vũ Thái Thịnh", nickname: "Thịnh tỉnh táo", position: "Tiền vệ", number: 17, avatarUrl: "", matches: 85, goals: 18, assists: 25, mvp: 17, birthday: "17/02/1979", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-015", name: "Đinh Thái Bình", nickname: "Bình", position: "Tiền vệ", number: 10, avatarUrl: "", matches: 128, goals: 25, assists: 52, mvp: 38, birthday: "18/10/1979", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-016", name: "Nguyễn Khắc Vĩnh", nickname: "Vĩnh", position: "Hậu vệ", number: 6, avatarUrl: "", matches: 145, goals: 16, assists: 28, mvp: 17, birthday: "18/07/1980", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-017", name: "Vũ Đăng Tuấn", nickname: "Trâu Đồ Sơn", position: "Tiền vệ", number: 80, avatarUrl: "", matches: 198, goals: 42, assists: 55, mvp: 46, birthday: "02/08/1980", joinYear: 1994, joinDate: "30/09/1994", status: "Đang thi đấu" },
  { id: "m-018", name: "Đào Thanh Tùng", nickname: "Tùng Lò Gạch", position: "Thủ môn", number: 8, avatarUrl: "", matches: 168, goals: 3, assists: 8, mvp: 18, birthday: "18/03/1984", joinYear: 2025, joinDate: "15/12/2025", status: "Đang thi đấu" },
  { id: "m-019", name: "Nguyễn An", nickname: "An", position: "Thủ môn", number: 1, avatarUrl: "", matches: 155, goals: 22, assists: 42, mvp: 36, birthday: "10/05/1984", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-020", name: "Trần Tiến Dũng", nickname: "Tiến Dũng", position: "Hậu vệ", number: 100, avatarUrl: "", matches: 52, goals: 2, assists: 8, mvp: 10, birthday: "04/10/1985", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-021", name: "Trương Quang Huy", nickname: "Huy", position: "Hậu vệ", number: 4, avatarUrl: "", matches: 78, goals: 7, assists: 14, mvp: 13, birthday: "21/06/1987", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-022", name: "Phùng Văn Lục", nickname: "Lục Cờ Đỏ", position: "Tiền vệ", number: 16, avatarUrl: "", matches: 88, goals: 10, assists: 20, mvp: 15, birthday: "05/08/1988", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-023", name: "Nguyễn Mạnh Tuấn", nickname: "Tuấn", position: "Hậu vệ", number: 23, avatarUrl: "", matches: 92, goals: 8, assists: 19, mvp: 12, birthday: "21/05/1991", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-024", name: "Vũ Ngọc Sơn", nickname: "Xuân Son", position: "Tiền vệ", number: 20, avatarUrl: "https://drive.google.com/uc?export=view&id=1vAWvXyQxnNuTMbQHuJCuYHz4b2xXq0ak", matches: 98, goals: 26, assists: 34, mvp: 33, birthday: "20/01/1993", joinYear: 2025, joinDate: "10/01/2025", status: "Đang thi đấu" },
  { id: "m-025", name: "Trần Nguyên Bá", nickname: "Bá Nghệ", position: "Tiền đạo", number: 19, avatarUrl: "", matches: 72, goals: 45, assists: 16, mvp: 44, birthday: "09/04/1994", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-026", name: "Phan Hồng Thái", nickname: "Thái", position: "Tiền vệ", number: 38, avatarUrl: "", matches: 220, goals: 78, assists: 28, mvp: 50, birthday: "02/03/1995", joinYear: 0, status: "Đang thi đấu" },
  { id: "m-027", name: "Nguyễn Minh Quang", nickname: "Quang", position: "Tiền vệ", number: 2, avatarUrl: "", matches: 195, goals: 68, assists: 32, mvp: 47, birthday: "26/09/2003", joinYear: 0, status: "Đang thi đấu" },
];

export const MOCK_ALBUM: AlbumPhoto[] = [
  // ── Video: Kỷ niệm 30 năm thành lập GODA FC (28/09/2024) ──
  { id: "alb-v01", category: "Video", title: "Toàn cảnh Giải bóng đá Kỷ niệm 30 năm thành lập CLB GODA: GODA FC - 5T FC", date: "28/09/2024", thumbnailUrl: "https://img.youtube.com/vi/zum8IuoT4BA/hqdefault.jpg", fullUrl: "https://img.youtube.com/vi/zum8IuoT4BA/hqdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=zum8IuoT4BA" },
  { id: "alb-v02", category: "Video", title: "FC GODA -vs- FC 5B | Giải bóng đá kỷ niệm 30 năm thành lập CLB GODA", date: "28/09/2024", thumbnailUrl: "https://img.youtube.com/vi/AgPt9pHzAM8/hqdefault.jpg", fullUrl: "https://img.youtube.com/vi/AgPt9pHzAM8/hqdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=AgPt9pHzAM8" },
  { id: "alb-v03", category: "Video", title: "FC GODA -vs- FC 5T | Giải bóng đá kỷ niệm 30 năm thành lập CLB GODA", date: "28/09/2024", thumbnailUrl: "https://img.youtube.com/vi/6JYJNApzsXc/hqdefault.jpg", fullUrl: "https://img.youtube.com/vi/6JYJNApzsXc/hqdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=6JYJNApzsXc" },
  { id: "alb-v04", category: "Video", title: "Full: FC MOTOR HÀ NỘI -vs- FC 5B | Giải bóng đá kỷ niệm 30 năm thành lập CLB GODA", date: "28/09/2024", thumbnailUrl: "https://img.youtube.com/vi/B8hOlIa7bYs/hqdefault.jpg", fullUrl: "https://img.youtube.com/vi/B8hOlIa7bYs/hqdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=B8hOlIa7bYs" },
  { id: "alb-001", category: "Trận đấu", title: "Pha bóng đẹp", date: "14/02/2023", thumbnailUrl: "/photos/z8053179951528_5c1e87b1e2caf22cde3cd584133220e9.jpg", fullUrl: "/photos/z8053179951528_5c1e87b1e2caf22cde3cd584133220e9.jpg" },
  { id: "alb-002", category: "Sự kiện", title: "Tiệc BBQ", date: "26/04/2023", thumbnailUrl: "/photos/1784284566161_1879959454207999809_1879959454207999809_f51d837da341814b9e4863f6b9b3ee48.jpg", fullUrl: "/photos/1784284566161_1879959454207999809_1879959454207999809_f51d837da341814b9e4863f6b9b3ee48.jpg" },
  { id: "alb-003", category: "Sinh hoạt", title: "Rèn thể lực", date: "18/02/2026", thumbnailUrl: "/photos/1784284566088_1879959454207999809_1879959454207999809_e6d7930a6c6e6ade692ef730ec772f4e.jpg", fullUrl: "/photos/1784284566088_1879959454207999809_1879959454207999809_e6d7930a6c6e6ade692ef730ec772f4e.jpg" },
  { id: "alb-004", category: "Kỷ niệm", title: "Kỷ niệm 28 năm", date: "28/09/2023", thumbnailUrl: "/photos/z8053179704898_9b48ae1d79226549cde6028623245c67.jpg", fullUrl: "/photos/z8053179704898_9b48ae1d79226549cde6028623245c67.jpg" },
  { id: "alb-005", category: "Trận đấu", title: "Pha cứu thua", date: "12/09/2026", thumbnailUrl: "/photos/1784284566040_1879959454207999809_1879959454207999809_39ce3130a04154561ed7c5b300301251.jpg", fullUrl: "/photos/1784284566040_1879959454207999809_1879959454207999809_39ce3130a04154561ed7c5b300301251.jpg" },
  { id: "alb-006", category: "Sự kiện", title: "Bế mạc mùa giải", date: "12/10/2026", thumbnailUrl: "/photos/1784284566010_1879959454207999809_1879959454207999809_78d3cc2650bf182cfa721eab468b6906.jpg", fullUrl: "/photos/1784284566010_1879959454207999809_1879959454207999809_78d3cc2650bf182cfa721eab468b6906.jpg" },
  { id: "alb-007", category: "Sinh hoạt", title: "Bài tập phối hợp", date: "17/11/2023", thumbnailUrl: "/photos/z8053180149929_3e31c23ba214f478a97241063c0c85f2.jpg", fullUrl: "/photos/z8053180149929_3e31c23ba214f478a97241063c0c85f2.jpg" },
  { id: "alb-008", category: "Kỷ niệm", title: "Trận chung kết", date: "19/06/2026", thumbnailUrl: "/photos/1784284566017_1879959454207999809_1879959454207999809_689d36845d281e475367cbd32392ac63.jpg", fullUrl: "/photos/1784284566017_1879959454207999809_1879959454207999809_689d36845d281e475367cbd32392ac63.jpg" },
  { id: "alb-009", category: "Trận đấu", title: "Huddle trước trận", date: "18/11/2026", thumbnailUrl: "/photos/z8053184574132_34845101c4b6e25ba1efa5e79499d792.jpg", fullUrl: "/photos/z8053184574132_34845101c4b6e25ba1efa5e79499d792.jpg" },
  { id: "alb-010", category: "Sự kiện", title: "Tất niên", date: "06/01/2026", thumbnailUrl: "/photos/z8053180062593_6be896fa844bd5cd80efcae993a4b047.jpg", fullUrl: "/photos/z8053180062593_6be896fa844bd5cd80efcae993a4b047.jpg" },
  { id: "alb-011", category: "Sinh hoạt", title: "Khởi động làm nóng", date: "25/07/2026", thumbnailUrl: "/photos/z8053184470393_cba3e0b14c67f4ca6b5a309c200f1c3b.jpg", fullUrl: "/photos/z8053184470393_cba3e0b14c67f4ca6b5a309c200f1c3b.jpg" },
  { id: "alb-012", category: "Kỷ niệm", title: "Ký ức những ngày đầu", date: "22/10/2026", thumbnailUrl: "/photos/z8053184562712_cd2a9252e2f3b2b415747adf1e2970f8.jpg", fullUrl: "/photos/z8053184562712_cd2a9252e2f3b2b415747adf1e2970f8.jpg" },
  { id: "alb-013", category: "Trận đấu", title: "Tình huống cố định", date: "17/07/2026", thumbnailUrl: "/photos/z8053184543075_18a4ba86d31f679d9ab2c4a45ee38419.jpg", fullUrl: "/photos/z8053184543075_18a4ba86d31f679d9ab2c4a45ee38419.jpg" },
  { id: "alb-014", category: "Sự kiện", title: "Lễ vinh danh", date: "03/01/2026", thumbnailUrl: "/photos/z8053184562428_7ddb53725f36ca1e01452fbd6526a8d5.jpg", fullUrl: "/photos/z8053184562428_7ddb53725f36ca1e01452fbd6526a8d5.jpg" },
  { id: "alb-015", category: "Sinh hoạt", title: "Rèn kỹ thuật cá nhân", date: "23/03/2026", thumbnailUrl: "/photos/z8053179712048_402eef6bb32ad1d49a0bdad50faa31da.jpg", fullUrl: "/photos/z8053179712048_402eef6bb32ad1d49a0bdad50faa31da.jpg" },
  { id: "alb-016", category: "Kỷ niệm", title: "Vô địch Hà Nội 2000", date: "01/01/2026", thumbnailUrl: "/photos/z8053179652169_d8c0913b852a88b1612dcedb8deedc91.jpg", fullUrl: "/photos/z8053179652169_d8c0913b852a88b1612dcedb8deedc91.jpg" },
  { id: "alb-017", category: "Trận đấu", title: "Đội hình ra sân", date: "06/08/2026", thumbnailUrl: "/photos/1784284566032_1879959454207999809_1879959454207999809_2d3450c44052b94f00f9ed386e8fd094.jpg", fullUrl: "/photos/1784284566032_1879959454207999809_1879959454207999809_2d3450c44052b94f00f9ed386e8fd094.jpg" },
  { id: "alb-018", category: "Sự kiện", title: "Họp BQL", date: "23/06/2026", thumbnailUrl: "/photos/1784284566105_1879959454207999809_1879959454207999809_56fce8c0a6a230b5a898735ac272bfc8.jpg", fullUrl: "/photos/1784284566105_1879959454207999809_1879959454207999809_56fce8c0a6a230b5a898735ac272bfc8.jpg" },
  { id: "alb-019", category: "Sinh hoạt", title: "Tập chiến thuật", date: "04/09/2026", thumbnailUrl: "/photos/z8053184541526_bcdde0c19b4722a38f1e205e7c3e4b9d.jpg", fullUrl: "/photos/z8053184541526_bcdde0c19b4722a38f1e205e7c3e4b9d.jpg" },
  { id: "alb-020", category: "Kỷ niệm", title: "Khoảnh khắc lịch sử", date: "07/10/2026", thumbnailUrl: "/photos/z8053180044895_eff38be4e7118125dc0397ac346e158b.jpg", fullUrl: "/photos/z8053180044895_eff38be4e7118125dc0397ac346e158b.jpg" },
  { id: "alb-021", category: "Trận đấu", title: "Tranh bóng quyết liệt", date: "27/09/2023", thumbnailUrl: "/photos/1784284566121_1879959454207999809_1879959454207999809_2cfc6927b6fa8c929069758c3e581bdf.jpg", fullUrl: "/photos/1784284566121_1879959454207999809_1879959454207999809_2cfc6927b6fa8c929069758c3e581bdf.jpg" },
  { id: "alb-022", category: "Sự kiện", title: "Đại hội thành viên", date: "15/02/2026", thumbnailUrl: "/photos/z8053179649428_de3b39bd595a234ca2c1f76d7a492037.jpg", fullUrl: "/photos/z8053179649428_de3b39bd595a234ca2c1f76d7a492037.jpg" },
  { id: "alb-023", category: "Sinh hoạt", title: "Recovery session", date: "22/07/2026", thumbnailUrl: "/photos/1784284566048_1879959454207999809_1879959454207999809_66afc5c97918b843a9ef1a7235fffa64.jpg", fullUrl: "/photos/1784284566048_1879959454207999809_1879959454207999809_66afc5c97918b843a9ef1a7235fffa64.jpg" },
  { id: "alb-024", category: "Kỷ niệm", title: "Cột mốc 1000 trận", date: "24/04/2026", thumbnailUrl: "/photos/z8053180004798_f0d3fc62d57ae554b3be1805ae7180fb.jpg", fullUrl: "/photos/z8053180004798_f0d3fc62d57ae554b3be1805ae7180fb.jpg" },
  { id: "alb-025", category: "Trận đấu", title: "Góc chiến thuật", date: "05/08/2023", thumbnailUrl: "/photos/z8053184482640_ac025e999f64eadc8f99cad3e4ee1f80.jpg", fullUrl: "/photos/z8053184482640_ac025e999f64eadc8f99cad3e4ee1f80.jpg" },
  { id: "alb-026", category: "Sự kiện", title: "Kick-off mùa mới", date: "23/02/2026", thumbnailUrl: "/photos/1784284566145_1879959454207999809_1879959454207999809_cbdcd52f54d75798233469f4dda8d76f.jpg", fullUrl: "/photos/1784284566145_1879959454207999809_1879959454207999809_cbdcd52f54d75798233469f4dda8d76f.jpg" },
  { id: "alb-027", category: "Sinh hoạt", title: "Bài tập chuyền bóng", date: "07/12/2026", thumbnailUrl: "/photos/z8053184500824_8283bccabcfcd97361548ceb99434312.jpg", fullUrl: "/photos/z8053184500824_8283bccabcfcd97361548ceb99434312.jpg" },
  { id: "alb-028", category: "Kỷ niệm", title: "Thế hệ vàng", date: "09/12/2026", thumbnailUrl: "/photos/z8053179697866_efa74f44b4ae184bae2444d5653b8645.jpg", fullUrl: "/photos/z8053179697866_efa74f44b4ae184bae2444d5653b8645.jpg" },
  { id: "alb-029", category: "Trận đấu", title: "Phản xạ thủ môn", date: "28/01/2023", thumbnailUrl: "/photos/1784284566080_1879959454207999809_1879959454207999809_a620e30eeacc206da242d340ae61f278.jpg", fullUrl: "/photos/1784284566080_1879959454207999809_1879959454207999809_a620e30eeacc206da242d340ae61f278.jpg" },
  { id: "alb-030", category: "Sự kiện", title: "Sự kiện cộng đồng", date: "19/05/2026", thumbnailUrl: "/photos/1784284566056_1879959454207999809_1879959454207999809_76c2e264b231a4f940317afdba994e44.jpg", fullUrl: "/photos/1784284566056_1879959454207999809_1879959454207999809_76c2e264b231a4f940317afdba994e44.jpg" },
  { id: "alb-031", category: "Sinh hoạt", title: "Buổi tập thường kỳ", date: "12/04/2026", thumbnailUrl: "/photos/1784284566096_1879959454207999809_1879959454207999809_221034d7867ae8e253d5e0792470713d.jpg", fullUrl: "/photos/1784284566096_1879959454207999809_1879959454207999809_221034d7867ae8e253d5e0792470713d.jpg" },
  { id: "alb-032", category: "Kỷ niệm", title: "Cúp vô địch", date: "16/06/2023", thumbnailUrl: "/photos/1784284566072_1879959454207999809_1879959454207999809_fbacb5ccf975bb9464f1a459d96f731a.jpg", fullUrl: "/photos/1784284566072_1879959454207999809_1879959454207999809_fbacb5ccf975bb9464f1a459d96f731a.jpg" },
  { id: "alb-033", category: "Trận đấu", title: "Khởi động trước trận", date: "28/03/2026", thumbnailUrl: "/photos/z8053184553643_37ac238c0e17c911e8a119c5b61f7863.jpg", fullUrl: "/photos/z8053184553643_37ac238c0e17c911e8a119c5b61f7863.jpg" },
  { id: "alb-034", category: "Sự kiện", title: "Trao giải", date: "01/11/2023", thumbnailUrl: "/photos/z8053179846489_d323d3ae3b49ff5a41b0c3832ada8833.jpg", fullUrl: "/photos/z8053179846489_d323d3ae3b49ff5a41b0c3832ada8833.jpg" },
  { id: "alb-035", category: "Sinh hoạt", title: "Đá tập nội bộ", date: "13/08/2023", thumbnailUrl: "/photos/z8053179727466_71c881f001208e04899c96a328bd075c.jpg", fullUrl: "/photos/z8053179727466_71c881f001208e04899c96a328bd075c.jpg" },
  { id: "alb-036", category: "Kỷ niệm", title: "Chân dung huyền thoại", date: "05/10/2026", thumbnailUrl: "/photos/z8053179876780_83e0f95b9644f4ea6955f48aed700221.jpg", fullUrl: "/photos/z8053179876780_83e0f95b9644f4ea6955f48aed700221.jpg" },
  { id: "alb-037", category: "Trận đấu", title: "Phút nghỉ giữa hiệp", date: "04/04/2026", thumbnailUrl: "/photos/z8053184524254_a0bda9fbee6ae5488608a1a51c47b10e.jpg", fullUrl: "/photos/z8053184524254_a0bda9fbee6ae5488608a1a51c47b10e.jpg" },
  { id: "alb-038", category: "Sự kiện", title: "Gala dinner", date: "11/06/2023", thumbnailUrl: "/photos/z8053179993832_ca7f750091c67ba6859cbea1c206baf4.jpg", fullUrl: "/photos/z8053179993832_ca7f750091c67ba6859cbea1c206baf4.jpg" },
  { id: "alb-039", category: "Sinh hoạt", title: "Tập gym", date: "23/10/2026", thumbnailUrl: "/photos/z8053179985176_b08a52d35988cb2bc08d62e2b93d5d74.jpg", fullUrl: "/photos/z8053179985176_b08a52d35988cb2bc08d62e2b93d5d74.jpg" },
  { id: "alb-040", category: "Kỷ niệm", title: "Gặp mặt cựu thành viên", date: "06/02/2026", thumbnailUrl: "/photos/z8053179825164_5f989c92ec177f80e527917879108067.jpg", fullUrl: "/photos/z8053179825164_5f989c92ec177f80e527917879108067.jpg" },
  { id: "alb-041", category: "Trận đấu", title: "Bàn thắng đẹp", date: "02/03/2026", thumbnailUrl: "/photos/z8053179790570_fe5a39ab3ef83a405bed18b999f44311.jpg", fullUrl: "/photos/z8053179790570_fe5a39ab3ef83a405bed18b999f44311.jpg" },
  { id: "alb-042", category: "Sự kiện", title: "Training camp", date: "05/03/2026", thumbnailUrl: "/photos/z8053179638244_bba31e5fedae904df5d3143afbcb91eb.jpg", fullUrl: "/photos/z8053179638244_bba31e5fedae904df5d3143afbcb91eb.jpg" },
  { id: "alb-043", category: "Sinh hoạt", title: "Tập đối kháng", date: "04/03/2026", thumbnailUrl: "/photos/1784284566025_1879959454207999809_1879959454207999809_296e0fabfc210b55275bc1146c3d65a5.jpg", fullUrl: "/photos/1784284566025_1879959454207999809_1879959454207999809_296e0fabfc210b55275bc1146c3d65a5.jpg" },
  { id: "alb-044", category: "Kỷ niệm", title: "Hành trình 32 năm", date: "09/12/2023", thumbnailUrl: "/photos/z8053184521354_5e1cc85301cce7cd1fc12c4feacef400.jpg", fullUrl: "/photos/z8053184521354_5e1cc85301cce7cd1fc12c4feacef400.jpg" },
  { id: "alb-045", category: "Trận đấu", title: "Sút xa ngoạn mục", date: "24/09/2023", thumbnailUrl: "/photos/1784284565985_1879959454207999809_1879959454207999809_a5b3baa4c24ce8364f35cbb2011f3f1f.jpg", fullUrl: "/photos/1784284565985_1879959454207999809_1879959454207999809_a5b3baa4c24ce8364f35cbb2011f3f1f.jpg" },
  { id: "alb-046", category: "Sự kiện", title: "Sinh nhật CLB", date: "15/02/2026", thumbnailUrl: "/photos/z8053179934658_6eb2a17fd197c1b672bb0d376694dd17.jpg", fullUrl: "/photos/z8053179934658_6eb2a17fd197c1b672bb0d376694dd17.jpg" },
  { id: "alb-047", category: "Sinh hoạt", title: "Khởi động", date: "09/12/2023", thumbnailUrl: "/photos/z8053184497447_195ba4806af8d90357576e387b3da9fc.jpg", fullUrl: "/photos/z8053184497447_195ba4806af8d90357576e387b3da9fc.jpg" },
  { id: "alb-048", category: "Kỷ niệm", title: "Kỷ niệm 26 năm", date: "01/09/2026", thumbnailUrl: "/photos/1784284566001_1879959454207999809_1879959454207999809_c95a4f519355fac6f0221191a544747a.jpg", fullUrl: "/photos/1784284566001_1879959454207999809_1879959454207999809_c95a4f519355fac6f0221191a544747a.jpg" },
  { id: "alb-049", category: "Trận đấu", title: "Khoảnh khắc ghi bàn", date: "15/08/2026", thumbnailUrl: "/photos/z8053184475382_01eca30330d964dec2cbe880b97c6af0.jpg", fullUrl: "/photos/z8053184475382_01eca30330d964dec2cbe880b97c6af0.jpg" },
  { id: "alb-050", category: "Sự kiện", title: "Khai mạc mùa giải", date: "21/10/2026", thumbnailUrl: "/photos/z8053184466149_f3ae972a516823475eeba5e312867064.jpg", fullUrl: "/photos/z8053184466149_f3ae972a516823475eeba5e312867064.jpg" },
  { id: "alb-051", category: "Sinh hoạt", title: "Thực hành sút phạt", date: "05/06/2023", thumbnailUrl: "/photos/z8053184507841_635abc1d02e5d53c9b44510e921d3167.jpg", fullUrl: "/photos/z8053184507841_635abc1d02e5d53c9b44510e921d3167.jpg" },
  { id: "alb-052", category: "Kỷ niệm", title: "Ngày đầu thành lập", date: "06/11/2026", thumbnailUrl: "/photos/z8053184518145_9a2c28e8187e6f8102534c6eb2ba9879.jpg", fullUrl: "/photos/z8053184518145_9a2c28e8187e6f8102534c6eb2ba9879.jpg" },
  { id: "alb-053", category: "Trận đấu", title: "Ăn mừng bàn thắng", date: "27/09/2026", thumbnailUrl: "/photos/1784284566113_1879959454207999809_1879959454207999809_de9015d6692a159b6b945eedba172733.jpg", fullUrl: "/photos/1784284566113_1879959454207999809_1879959454207999809_de9015d6692a159b6b945eedba172733.jpg" },
  { id: "alb-054", category: "Sự kiện", title: "Team building", date: "13/10/2026", thumbnailUrl: "/photos/1784284566137_1879959454207999809_1879959454207999809_6a37ac16bb3ead15a0b69f92bce1b36e.jpg", fullUrl: "/photos/1784284566137_1879959454207999809_1879959454207999809_6a37ac16bb3ead15a0b69f92bce1b36e.jpg" },
  { id: "alb-055", category: "Sinh hoạt", title: "Chạy bền", date: "07/11/2026", thumbnailUrl: "/photos/1784284566153_1879959454207999809_1879959454207999809_16897483e291bc1aaae6b91ffe365b30.jpg", fullUrl: "/photos/1784284566153_1879959454207999809_1879959454207999809_16897483e291bc1aaae6b91ffe365b30.jpg" },
  { id: "alb-056", category: "Kỷ niệm", title: "Khoảnh khắc vinh danh", date: "25/05/2026", thumbnailUrl: "/photos/1784284565993_1879959454207999809_1879959454207999809_7083a4f47b80f49828c1f2b6479e88c3.jpg", fullUrl: "/photos/1784284565993_1879959454207999809_1879959454207999809_7083a4f47b80f49828c1f2b6479e88c3.jpg" },
  { id: "alb-057", category: "Trận đấu", title: "Đường chuyền quyết định", date: "10/02/2026", thumbnailUrl: "/photos/1784284566063_1879959454207999809_1879959454207999809_43802d39b8ee2e56151f028390dc9b3a.jpg", fullUrl: "/photos/1784284566063_1879959454207999809_1879959454207999809_43802d39b8ee2e56151f028390dc9b3a.jpg" },
  { id: "alb-058", category: "Sự kiện", title: "Chụp ảnh đội hình", date: "19/08/2026", thumbnailUrl: "/photos/z8053179956875_a897be84ff97f76b4b81cb68acc1409d.jpg", fullUrl: "/photos/z8053179956875_a897be84ff97f76b4b81cb68acc1409d.jpg" },
  { id: "alb-059", category: "Sinh hoạt", title: "Thả lỏng sau tập", date: "28/02/2026", thumbnailUrl: "/photos/z8053179623607_c6a1f9ab2f7b23f3497edd10134a15fd.jpg", fullUrl: "/photos/z8053179623607_c6a1f9ab2f7b23f3497edd10134a15fd.jpg" },
  { id: "alb-060", category: "Kỷ niệm", title: "Niềm tự hào GODA", date: "04/12/2026", thumbnailUrl: "/photos/z8053179673964_efe7a825564ab004cb6a5e9da363fdbf.jpg", fullUrl: "/photos/z8053179673964_efe7a825564ab004cb6a5e9da363fdbf.jpg" },
  { id: "alb-061", category: "Trận đấu", title: "Pha bóng đẹp", date: "24/05/2026", thumbnailUrl: "/photos/z8053180080092_4917fbb2e069940f703a3bb88b75945e.jpg", fullUrl: "/photos/z8053180080092_4917fbb2e069940f703a3bb88b75945e.jpg" },
  { id: "alb-062", category: "Sự kiện", title: "Tiệc BBQ", date: "20/11/2023", thumbnailUrl: "/photos/1784284566129_1879959454207999809_1879959454207999809_5736e51111204d4b30781cda559ca97b.jpg", fullUrl: "/photos/1784284566129_1879959454207999809_1879959454207999809_5736e51111204d4b30781cda559ca97b.jpg" },
  { id: "alb-063", category: "Sinh hoạt", title: "Rèn thể lực", date: "16/08/2023", thumbnailUrl: "/photos/z8053179996882_54c1c0b6287bb6369e51ed9594d8e119.jpg", fullUrl: "/photos/z8053179996882_54c1c0b6287bb6369e51ed9594d8e119.jpg" },
  { id: "alb-064", category: "Kỷ niệm", title: "Kỷ niệm 28 năm", date: "16/05/2026", thumbnailUrl: "/photos/z8053184531263_aec1f50384a4387ab65e320508c9e257.jpg", fullUrl: "/photos/z8053184531263_aec1f50384a4387ab65e320508c9e257.jpg" },
  { id: "alb-065", category: "Trận đấu", title: "Pha cứu thua", date: "19/03/2026", thumbnailUrl: "/photos/z8053184555238_15b672b9f7420b236c733356a5b05aef.jpg", fullUrl: "/photos/z8053184555238_15b672b9f7420b236c733356a5b05aef.jpg" },
  // ── Videos (YouTube embed) ──
  { id: "vid-001", category: "Video", title: "GODA FC - Trận giao hữu 08/08", date: "10/08/2026", thumbnailUrl: "https://img.youtube.com/vi/Q_9gtkBDT7I/hqdefault.jpg", fullUrl: "https://img.youtube.com/vi/Q_9gtkBDT7I/hqdefault.jpg", videoUrl: "https://www.youtube.com/embed/Q_9gtkBDT7I" },
  { id: "vid-002", category: "Video", title: "GODA FC - Trận giao hữu 26/07", date: "10/08/2026", thumbnailUrl: "https://img.youtube.com/vi/HSu3jQ-DSQI/hqdefault.jpg", fullUrl: "https://img.youtube.com/vi/HSu3jQ-DSQI/hqdefault.jpg", videoUrl: "https://www.youtube.com/embed/HSu3jQ-DSQI" },
  { id: "vid-003", category: "Video", title: "GODA FC - Trận giao hữu 18/07", date: "10/08/2026", thumbnailUrl: "https://img.youtube.com/vi/AZXx8O7Tw5M/hqdefault.jpg", fullUrl: "https://img.youtube.com/vi/AZXx8O7Tw5M/hqdefault.jpg", videoUrl: "https://www.youtube.com/embed/AZXx8O7Tw5M" },
];

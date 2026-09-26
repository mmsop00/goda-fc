// Tính báo cáo tài chính từ dữ liệu thô — hàm thuần, không đụng DB, dùng được
// cả trên server (dữ liệu thật) lẫn trình duyệt (dữ liệu mẫu).

import { categoryLabel, type Direction } from "./categories";

export type ItemStatus = "chua_dong" | "cho_duyet" | "da_dong";

export interface RawBill {
  id: string;
  title: string;
  kind: string; // quy_thang | khac
  /** YYYY-MM tháng áp dụng; null (dữ liệu cũ) = tháng tạo */
  period: string | null;
  dueDate: string | null;
  createdAt: string; // YYYY-MM-DD giờ VN
  items: { id: string; memberId: string; amount: number; status: string; paidDate: string | null }[];
}

/** 1 lượt ủng hộ công khai đã được chủ tịch xác nhận */
export interface RawDonation {
  id: string;
  name: string;
  amount: number; // số thực nhận
  date: string; // YYYY-MM-DD giờ VN
  message: string | null;
}

/** 1 dòng sổ số dư thành viên (nộp thừa/thiếu) */
export interface RawCredit {
  id: string;
  memberId: string;
  kind: string; // nop | tru | dieu_chinh
  amount: number; // + tăng, − giảm số dư
  date: string; // YYYY-MM-DD giờ VN
  paymentIntentId: string | null;
  paymentItemId: string | null;
  note: string | null;
}

export interface RawEntry {
  id: string;
  direction: string; // thu | chi
  category: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  /** YYYY-MM tháng áp dụng; null = tháng của `date` */
  period: string | null;
  note: string | null;
}

export interface LedgerRow {
  id: string;
  /** YYYY-MM-DD — ngày tiền thực vào/ra (báo cáo theo dòng tiền) */
  date: string;
  /** YYYY-MM — tháng khoản này thuộc về (báo cáo theo kỳ áp dụng) */
  period: string;
  direction: Direction;
  /** "dong_quy" = 1 khoản thành viên đã đóng; "nop_tien" = 1 lần thành viên chuyển tiền
   * (thực nhận); "so_quy" = chủ tịch ghi tay (sửa/xoá được) */
  source: "dong_quy" | "nop_tien" | "so_quy" | "ung_ho";
  /** Tính vào cách xem nào: tiền thực nhận chỉ "cash", khoản đã đóng qua sổ số dư chỉ
   * "accrual" (tránh đếm 2 lần); dữ liệu cũ & sổ quỹ tính cả hai. */
  basis: "both" | "cash" | "accrual";
  /** Khoản thu (Bill) của lượt đóng quỹ; null với dòng sổ quỹ ghi tay */
  billId: string | null;
  category: string;
  categoryLabel: string;
  title: string;
  memberName: string | null;
  note: string | null;
  amount: number;
}

export interface BillMemberItem {
  memberId: string;
  memberName: string;
  amount: number;
  status: ItemStatus;
  paidDate: string | null;
}

export interface BillProgress {
  id: string;
  title: string;
  period: string;
  dueDate: string | null;
  createdAt: string;
  expected: number;
  collected: number;
  pending: number;
  memberCount: number;
  paidCount: number;
  items: BillMemberItem[];
}

export interface MemberStanding {
  memberId: string;
  name: string;
  daDong: number;
  choDuyet: number;
  chuaDong: number;
  /** Số dư nộp thừa/thiếu đang giữ */
  soDu: number;
}

export interface CreditRow {
  id: string;
  memberId: string;
  kind: string;
  amount: number;
  date: string;
  note: string | null;
}

export interface FinanceReport {
  /** Số dư quỹ = tiền thực có (theo dòng tiền) */
  balance: number;
  /** creditHeld: tổng số dư thành viên đang giữ (nộp thừa/thiếu chưa trừ vào khoản nào) */
  outstanding: { chuaDong: number; choDuyet: number; creditHeld: number };
  ledger: LedgerRow[];
  bills: BillProgress[];
  members: MemberStanding[];
  credits: CreditRow[];
}

const asStatus = (s: string): ItemStatus => (s === "da_dong" || s === "cho_duyet" ? s : "chua_dong");

export function buildReport(
  members: { id: string; name: string }[],
  bills: RawBill[],
  entries: RawEntry[],
  credits: RawCredit[] = [],
  donations: RawDonation[] = []
): FinanceReport {
  const nameOf = new Map(members.map((m) => [m.id, m.name]));
  const standing = new Map(
    members.map((m) => [m.id, { memberId: m.id, name: m.name, daDong: 0, choDuyet: 0, chuaDong: 0, soDu: 0 }])
  );
  // Khoản được trừ qua sổ số dư → tiền mặt đã tính ở dòng "nộp tiền", không tính lại
  const viaCredit = new Set(credits.filter((c) => c.kind === "tru" && c.paymentItemId).map((c) => c.paymentItemId!));
  const billTitleOfItem = new Map(bills.flatMap((b) => b.items.map((it) => [it.id, b.title] as const)));
  const order = new Map(members.map((m, i) => [m.id, i]));

  const ledger: LedgerRow[] = [];
  const billProgress: BillProgress[] = [];
  const outstanding = { chuaDong: 0, choDuyet: 0, creditHeld: 0 };

  for (const bill of [...bills].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    const p: BillProgress = {
      id: bill.id,
      title: bill.title,
      period: bill.period ?? bill.createdAt.slice(0, 7),
      dueDate: bill.dueDate,
      createdAt: bill.createdAt,
      expected: 0,
      collected: 0,
      pending: 0,
      memberCount: bill.items.length,
      paidCount: 0,
      items: [],
    };
    const category = bill.kind === "quy_thang" ? "quy_thang" : "dong_gop";
    for (const item of bill.items) {
      const status = asStatus(item.status);
      const memberName = nameOf.get(item.memberId) ?? "—";
      p.expected += item.amount;
      p.items.push({ memberId: item.memberId, memberName, amount: item.amount, status, paidDate: item.paidDate });
      const s = standing.get(item.memberId);
      if (status === "da_dong") {
        p.collected += item.amount;
        p.paidCount++;
        if (s) s.daDong += item.amount;
        ledger.push({
          id: `${bill.id}:${item.memberId}`,
          date: item.paidDate ?? bill.createdAt,
          period: p.period,
          direction: "thu",
          source: "dong_quy",
          basis: viaCredit.has(item.id) ? "accrual" : "both",
          billId: bill.id,
          category,
          categoryLabel: categoryLabel("thu", category),
          title: bill.title,
          memberName,
          note: null,
          amount: item.amount,
        });
      } else if (status === "cho_duyet") {
        p.pending += item.amount;
        outstanding.choDuyet += item.amount;
        if (s) s.choDuyet += item.amount;
      } else {
        outstanding.chuaDong += item.amount;
        if (s) s.chuaDong += item.amount;
      }
    }
    p.items.sort((a, b) => (order.get(a.memberId) ?? 999) - (order.get(b.memberId) ?? 999));
    billProgress.push(p);
  }

  for (const e of entries) {
    const direction: Direction = e.direction === "thu" ? "thu" : "chi";
    ledger.push({
      id: e.id,
      date: e.date,
      period: e.period ?? e.date.slice(0, 7),
      direction,
      source: "so_quy",
      basis: "both",
      billId: null,
      category: e.category,
      categoryLabel: categoryLabel(direction, e.category),
      title: e.title,
      memberName: null,
      note: e.note,
      amount: e.amount,
    });
  }

  // Mỗi lần thành viên chuyển tiền = 1 dòng thu theo dòng tiền (số thực nhận)
  for (const c of credits) {
    const st = standing.get(c.memberId);
    if (st) st.soDu += c.amount;
    if (c.kind !== "nop") continue;
    const used = credits.filter((x) => x.kind === "tru" && x.paymentIntentId && x.paymentIntentId === c.paymentIntentId);
    const titles = used.map((x) => billTitleOfItem.get(x.paymentItemId ?? "")).filter(Boolean);
    const extra = c.amount + used.reduce((t, x) => t + x.amount, 0);
    const parts = [titles.length ? `Cho: ${titles.join(", ")}` : "Chưa đủ trọn khoản nào"];
    if (extra > 0) parts.push(`${extra.toLocaleString("vi-VN")}đ vào số dư`);
    if (extra < 0) parts.push(`dùng thêm ${(-extra).toLocaleString("vi-VN")}đ số dư`);
    ledger.push({
      id: c.id,
      date: c.date,
      period: c.date.slice(0, 7),
      direction: "thu",
      source: "nop_tien",
      basis: "cash",
      billId: null,
      category: "nop_tien",
      categoryLabel: categoryLabel("thu", "nop_tien"),
      title: "Nộp tiền quỹ",
      memberName: nameOf.get(c.memberId) ?? null,
      note: parts.join(" · "),
      amount: c.amount,
    });
  }
  for (const st of standing.values()) outstanding.creditHeld += st.soDu;

  // Ủng hộ qua trang chủ — tiền thực nhận, tính vào quỹ ở cả 2 cách xem
  for (const d of donations) {
    ledger.push({
      id: d.id,
      date: d.date,
      period: d.date.slice(0, 7),
      direction: "thu",
      source: "ung_ho",
      basis: "both",
      billId: null,
      category: "ung_ho",
      categoryLabel: categoryLabel("thu", "ung_ho"),
      title: `Ủng hộ — ${d.name}`,
      memberName: null,
      note: d.message,
      amount: d.amount,
    });
  }

  ledger.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  const balance = ledger
    .filter((r) => r.basis !== "accrual")
    .reduce((t, r) => t + (r.direction === "thu" ? r.amount : -r.amount), 0);

  return {
    balance,
    outstanding,
    ledger,
    bills: billProgress,
    members: [...standing.values()],
    credits: credits
      .map((c) => ({ id: c.id, memberId: c.memberId, kind: c.kind, amount: c.amount, date: c.date, note: c.note }))
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

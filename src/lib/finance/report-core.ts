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
  items: { memberId: string; amount: number; status: string; paidDate: string | null }[];
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
  /** "dong_quy" = thành viên đóng qua cổng; "so_quy" = chủ tịch ghi tay (xoá được) */
  source: "dong_quy" | "so_quy";
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
}

export interface FinanceReport {
  balance: number;
  outstanding: { chuaDong: number; choDuyet: number };
  ledger: LedgerRow[];
  bills: BillProgress[];
  members: MemberStanding[];
}

const asStatus = (s: string): ItemStatus => (s === "da_dong" || s === "cho_duyet" ? s : "chua_dong");

export function buildReport(members: { id: string; name: string }[], bills: RawBill[], entries: RawEntry[]): FinanceReport {
  const nameOf = new Map(members.map((m) => [m.id, m.name]));
  const standing = new Map(members.map((m) => [m.id, { memberId: m.id, name: m.name, daDong: 0, choDuyet: 0, chuaDong: 0 }]));
  const order = new Map(members.map((m, i) => [m.id, i]));

  const ledger: LedgerRow[] = [];
  const billProgress: BillProgress[] = [];
  const outstanding = { chuaDong: 0, choDuyet: 0 };

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
      billId: null,
      category: e.category,
      categoryLabel: categoryLabel(direction, e.category),
      title: e.title,
      memberName: null,
      note: e.note,
      amount: e.amount,
    });
  }

  ledger.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  const balance = ledger.reduce((s, r) => s + (r.direction === "thu" ? r.amount : -r.amount), 0);

  return { balance, outstanding, ledger, bills: billProgress, members: [...standing.values()] };
}

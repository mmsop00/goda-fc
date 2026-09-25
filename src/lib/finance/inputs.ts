// Kiểm tra dữ liệu gửi lên khi tạo/sửa khoản thu và dòng sổ quỹ — dùng chung
// cho POST (tạo) và PATCH (sửa) để 2 đường không lệch luật nhau.

import { prisma } from "@/lib/prisma";
import { getFinanceMembers } from "./members";
import { monthlyFundExemption } from "./age";
import { isValidPeriod } from "./format";
import { isValidCategory, type Direction } from "./categories";

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string; status?: number };

const MAX_BILL_AMOUNT = 100_000_000;
const isValidAmount = (n: unknown, max = MAX_BILL_AMOUNT): n is number =>
  typeof n === "number" && Number.isInteger(n) && n > 0 && n <= max;

export interface BillInput {
  kind: "quy_thang" | "khac";
  title: string;
  period: string;
  amountPerMember: number;
  dueDate: string | null;
  items: { memberId: string; amount: number }[];
}

/**
 * @param opts.kind   khi sửa: loại thu cố định theo khoản đang có (không đổi được)
 * @param opts.billId khi sửa: bỏ qua chính nó lúc chặn trùng quỹ tháng
 * @param opts.lockedMemberIds người đã đóng / chờ duyệt — giữ nguyên, không xét miễn quỹ
 */
export async function parseBillInput(
  body: Record<string, unknown>,
  opts: { kind?: string; billId?: string; lockedMemberIds?: Set<string> } = {}
): Promise<Parsed<BillInput>> {
  const fail = (error: string, status?: number): Parsed<BillInput> => ({ ok: false, error, status });
  const kind = opts.kind ?? body.kind;
  if (kind !== "quy_thang" && kind !== "khac") return fail("Loại thu không hợp lệ");

  let title: string;
  let period: string;
  let month = 0;
  let year = 0;
  if (kind === "quy_thang") {
    month = Number(body.month);
    year = Number(body.year);
    if (!Number.isInteger(month) || month < 1 || month > 12) return fail("Tháng không hợp lệ");
    if (!Number.isInteger(year) || year < 2020 || year > 2100) return fail("Năm không hợp lệ");
    const mm = String(month).padStart(2, "0");
    title = `Quỹ tháng ${mm}/${year}`;
    period = `${year}-${mm}`;
    const existing = await prisma.bill.findFirst({
      where: { kind, period, ...(opts.billId ? { id: { not: opts.billId } } : {}) },
    });
    if (existing) return fail(`Đã có ${title} rồi`, 409);
  } else {
    title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return fail("Vui lòng nhập tên khoản thu");
    if (title.length > 120) return fail("Tên khoản thu quá dài");
    period = String(body.period ?? "");
    if (!isValidPeriod(period)) return fail("Vui lòng chọn tháng áp dụng");
  }

  const amountPerMember = body.amountPerMember;
  if (!isValidAmount(amountPerMember)) return fail("Số tiền không hợp lệ");

  const dueDate = typeof body.dueDate === "string" && body.dueDate ? body.dueDate : null;
  if (dueDate !== null && !/^\d{2}\/\d{2}\/\d{4}$/.test(dueDate)) return fail("Hạn đóng không hợp lệ");

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) return fail("Chọn ít nhất 1 thành viên");

  const members = new Map((await getFinanceMembers()).map((m) => [m.id, m]));
  const seen = new Set<string>();
  const items: BillInput["items"] = [];
  for (const it of rawItems as { memberId?: string; amount?: unknown }[]) {
    const member = members.get(String(it?.memberId));
    if (!member || seen.has(member.id)) return fail("Danh sách thành viên không hợp lệ");
    if (!isValidAmount(it.amount)) return fail(`Số tiền của ${member.name} không hợp lệ`);
    if (kind === "quy_thang" && !opts.lockedMemberIds?.has(member.id) && monthlyFundExemption(member, year, month)) {
      return fail(`${member.name} được miễn quỹ tháng`);
    }
    seen.add(member.id);
    items.push({ memberId: member.id, amount: it.amount });
  }

  return { ok: true, value: { kind, title, period, amountPerMember, dueDate, items } };
}

export interface EntryInput {
  direction: Direction;
  category: string;
  title: string;
  amount: number;
  date: string;
  period: string;
  note: string | null;
}

export function parseEntryInput(body: Record<string, unknown>): Parsed<EntryInput> {
  const fail = (error: string): Parsed<EntryInput> => ({ ok: false, error });
  const direction = body.direction;
  if (direction !== "thu" && direction !== "chi") return fail("Loại không hợp lệ");
  const category = String(body.category ?? "");
  if (!isValidCategory(direction, category)) return fail("Vui lòng chọn hạng mục");
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return fail("Vui lòng nhập nội dung");
  if (title.length > 120) return fail("Nội dung quá dài");
  if (!isValidAmount(body.amount, 1_000_000_000)) return fail("Số tiền không hợp lệ");
  const date = String(body.date ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return fail("Ngày không hợp lệ");
  const period = body.period ? String(body.period) : date.slice(0, 7);
  if (!isValidPeriod(period)) return fail("Tháng áp dụng không hợp lệ");
  const note = typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 500) : null;
  return { ok: true, value: { direction, category, title, amount: body.amount as number, date, period, note } };
}

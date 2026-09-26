// Hồ sơ cầu thủ do thành viên tự sửa — hàm thuần, dùng được cả server lẫn trình duyệt.

import type { MemberPosition, MemberPublic } from "@/lib/mock-data";

export const POSITIONS: MemberPosition[] = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];

export const FOOT_LABEL = { phai: "Chân phải", trai: "Chân trái", hai_chan: "Hai chân" } as const;
export type PreferredFoot = keyof typeof FOOT_LABEL;

export interface MemberProfile {
  nickname: string;
  position: MemberPosition;
  preferredFoot: PreferredFoot | null;
  /** DD/MM/YYYY */
  birthday: string | null;
  /** DD/MM/YYYY hoặc chỉ năm YYYY */
  joinDate: string | null;
  hometown: string | null;
}

/** Hồ sơ đã lưu trong DB (chỉ các trường thành viên được tự sửa). */
export interface StoredProfile {
  nickname: string;
  position: string;
  preferredFoot: string | null;
  birthday: string | null;
  joinDate: string | null;
  hometown: string | null;
}

/** Ghép hồ sơ tự sửa lên thẻ cầu thủ mặc định. Số áo, thống kê, chức vụ giữ nguyên. */
export function applyProfile(m: MemberPublic, p: StoredProfile | undefined | null): MemberPublic {
  if (!p) return m;
  const position = (POSITIONS as string[]).includes(p.position) ? (p.position as MemberPosition) : m.position;
  const joinYear = p.joinDate ? Number(p.joinDate.slice(-4)) : m.joinYear;
  return {
    ...m,
    nickname: p.nickname || m.nickname,
    position,
    birthday: p.birthday ?? m.birthday,
    joinDate: p.joinDate ?? m.joinDate,
    joinYear,
    preferredFoot: p.preferredFoot && p.preferredFoot in FOOT_LABEL ? (p.preferredFoot as PreferredFoot) : undefined,
    hometown: p.hometown ?? undefined,
  };
}

function isRealDate(d: number, m: number, y: number) {
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function parseProfile(body: Record<string, unknown>, now = new Date()): { ok: true; value: MemberProfile } | { ok: false; error: string } {
  const fail = (error: string) => ({ ok: false as const, error });
  const year = now.getFullYear();

  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  if (nickname.length > 40) return fail("Biệt danh tối đa 40 ký tự");

  const position = body.position;
  if (typeof position !== "string" || !(POSITIONS as string[]).includes(position)) return fail("Vui lòng chọn vị trí");

  const foot = body.preferredFoot || null;
  if (foot !== null && !(typeof foot === "string" && foot in FOOT_LABEL)) return fail("Chân thuận không hợp lệ");

  let birthday: string | null = null;
  if (body.birthday) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(body.birthday));
    if (!m || !isRealDate(+m[1], +m[2], +m[3]) || +m[3] < 1930 || +m[3] > year - 5) return fail("Ngày sinh không hợp lệ");
    birthday = String(body.birthday);
  }

  let joinDate: string | null = null;
  if (body.joinDate) {
    const s = String(body.joinDate);
    const full = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
    const onlyYear = /^\d{4}$/.test(s);
    const y = full ? +full[3] : onlyYear ? +s : NaN;
    if ((!full && !onlyYear) || (full && !isRealDate(+full[1], +full[2], y)) || y < 1994 || y > year) {
      return fail("Ngày gia nhập không hợp lệ (CLB thành lập năm 1994)");
    }
    joinDate = s;
  }

  const hometown = typeof body.hometown === "string" && body.hometown.trim() ? body.hometown.trim() : null;
  if (hometown && hometown.length > 60) return fail("Quê quán tối đa 60 ký tự");

  return { ok: true, value: { nickname, position: position as MemberPosition, preferredFoot: foot as PreferredFoot | null, birthday, joinDate, hometown } };
}

// ═══════════════════════════════════════
// GODA FC — Hồ sơ cầu thủ của chính thành viên đang đăng nhập
// GET   /api/member/profile → hồ sơ hiện tại + thẻ cầu thủ xem trước
// PATCH /api/member/profile → lưu { nickname, position, preferredFoot, birthday, joinDate, hometown }
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/finance-auth";
import { MOCK_MEMBERS, type MemberPublic } from "@/lib/mock-data";
import { applyProfile, parseProfile, type MemberProfile } from "@/lib/member-profile";

export const dynamic = "force-dynamic";

const SELECT = {
  name: true,
  nickname: true,
  position: true,
  number: true,
  preferredFoot: true,
  birthday: true,
  joinDate: true,
  hometown: true,
  profileUpdatedAt: true,
} as const;

type Row = { name: string; nickname: string; position: string; number: number; preferredFoot: string | null; birthday: string | null; joinDate: string | null; hometown: string | null; profileUpdatedAt: Date | null };

function build(row: Row): { profile: MemberProfile; card: MemberPublic } {
  const base: MemberPublic = MOCK_MEMBERS.find((m) => m.name === row.name) ?? {
    id: row.name,
    name: row.name,
    nickname: row.nickname,
    position: "Tiền vệ",
    number: row.number,
    avatarUrl: "",
    matches: 0,
    goals: 0,
    assists: 0,
    mvp: 0,
  };
  const card = applyProfile(base, row.profileUpdatedAt ? row : null);
  return {
    // Chưa tự sửa lần nào → điền sẵn đúng thông tin đang hiện trên thẻ
    profile: {
      nickname: card.nickname,
      position: card.position,
      preferredFoot: card.preferredFoot ?? null,
      birthday: card.birthday && /^\d{2}\/\d{2}\/\d{4}$/.test(card.birthday) ? card.birthday : null,
      joinDate: card.joinDate && /^(\d{2}\/\d{2}\/)?\d{4}$/.test(card.joinDate) ? card.joinDate : card.joinYear ? String(card.joinYear) : null,
      hometown: card.hometown ?? null,
    },
    card,
  };
}

export async function GET() {
  const { session, error } = await requireMember();
  if (error) return error;
  const row = await prisma.member.findUnique({ where: { id: session.memberId }, select: SELECT });
  if (!row) return NextResponse.json({ error: "Không tìm thấy thành viên" }, { status: 404 });
  return NextResponse.json(build(row));
}

export async function PATCH(request: NextRequest) {
  const { session, error } = await requireMember();
  if (error) return error;
  try {
    const parsed = parseProfile(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const p = parsed.value;
    const row = await prisma.member.update({
      where: { id: session.memberId },
      data: {
        nickname: p.nickname,
        position: p.position,
        preferredFoot: p.preferredFoot,
        birthday: p.birthday,
        joinDate: p.joinDate,
        joinYear: p.joinDate ? Number(p.joinDate.slice(-4)) : null,
        hometown: p.hometown,
        profileUpdatedAt: new Date(),
      },
      select: SELECT,
    });
    // Thẻ cầu thủ công khai cập nhật ngay
    revalidatePath("/thanh-vien");
    revalidatePath("/");
    return NextResponse.json(build(row));
  } catch (e) {
    console.error("PATCH /api/member/profile error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

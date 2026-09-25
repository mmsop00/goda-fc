// ═══════════════════════════════════════
// GODA FC — Đổi mật khẩu (thành viên & chủ tịch)
// POST /api/member/change-password
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/finance-auth";

export async function POST(request: NextRequest) {
  const { session, error } = await requireMember();
  if (error) return error;

  try {
    const body = await request.json();
    const currentPassword = body.currentPassword as string | undefined;
    const newPassword = body.newPassword as string | undefined;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    const member = await prisma.member.findUnique({ where: { id: session.memberId } });
    if (!member || !member.passwordHash) {
      return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
    }

    // Chỉ bắt buộc nhập đúng mật khẩu cũ khi KHÔNG phải lần đổi bắt buộc đầu
    // tiên (mustChangePassword) — màn hình đổi bắt buộc không hỏi mật khẩu cũ
    // vì mật khẩu cũ là mật khẩu mặc định "123456" ai cũng biết.
    if (!member.mustChangePassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Vui lòng nhập mật khẩu hiện tại" }, { status: 400 });
      }
      const isValid = await compare(currentPassword, member.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Mật khẩu hiện tại không đúng" }, { status: 400 });
      }
    }

    const passwordHash = await hash(newPassword, 10);
    await prisma.member.update({
      where: { id: session.memberId },
      data: { passwordHash, mustChangePassword: false },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/member/change-password error:", e);
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

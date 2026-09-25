// ═══════════════════════════════════════
// GODA FC — Guard cho các API route tài chính
// Không tin memberId do client gửi lên — luôn lấy từ session.
// ═══════════════════════════════════════

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export interface MemberSession {
  memberId: string;
  financeRole: string;
}

/** 401 nếu chưa đăng nhập bằng tài khoản thành viên; ngược lại trả về memberId từ session. */
export async function requireMember(): Promise<
  { session: MemberSession; error: null } | { session: null; error: NextResponse }
> {
  const session = await auth();
  const user = session?.user;
  if (!user || user.kind !== "member" || !user.id) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return {
    session: { memberId: user.id, financeRole: user.financeRole ?? "member" },
    error: null,
  };
}

/** 401/403 nếu không phải chủ tịch. */
export async function requireChairman(): Promise<
  { session: MemberSession; error: null } | { session: null; error: NextResponse }
> {
  const result = await requireMember();
  if (result.error) return result;
  if (result.session.financeRole !== "chairman") {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return result;
}

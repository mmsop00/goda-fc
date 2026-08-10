import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/members — list all members
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: [{ joinYear: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(members);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// POST /api/members — create a new member
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const member = await prisma.member.create({
      data: {
        name: body.name,
        nickname: body.nickname || "",
        position: body.position || "Tiền vệ",
        number: body.number || 0,
        avatarUrl: body.avatarUrl || "",
        matches: body.matches || 0,
        goals: body.goals || 0,
        assists: body.assists || 0,
        mvp: body.mvp || 0,
        birthday: body.birthday || "",
        joinYear: body.joinYear || new Date().getFullYear(),
        status: body.status || "Đang thi đấu",
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}

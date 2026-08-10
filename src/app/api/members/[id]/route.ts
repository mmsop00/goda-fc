import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PUT /api/members/[id] — update a member
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const member = await prisma.member.update({
      where: { id },
      data: {
        name: body.name,
        nickname: body.nickname,
        position: body.position,
        number: body.number,
        avatarUrl: body.avatarUrl,
        matches: body.matches,
        goals: body.goals,
        assists: body.assists,
        mvp: body.mvp,
        birthday: body.birthday,
        joinYear: body.joinYear,
        status: body.status,
      },
    });
    return NextResponse.json(member);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

// DELETE /api/members/[id] — delete a member
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}

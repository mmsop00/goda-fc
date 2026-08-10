// ═══════════════════════════════════════
// GODA FC — Single Match API (CRUD)
// GET    /api/matches/[id]  → get one
// PUT    /api/matches/[id]  → update
// DELETE /api/matches/[id]  → delete
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function checkAuth() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const unauth = await checkAuth();
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: { goals: true, cards: true },
    });
    if (!match) {
      return NextResponse.json(
        { error: "Không tìm thấy trận đấu" },
        { status: 404 }
      );
    }
    return NextResponse.json(match);
  } catch (e) {
    console.error("GET /api/matches/[id] error:", e);
    return NextResponse.json(
      { error: "Lỗi khi tải trận đấu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const unauth = await checkAuth();
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.match.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy trận đấu" },
        { status: 404 }
      );
    }

    const match = await prisma.match.update({
      where: { id },
      data: {
        season: body.season,
        date: body.date,
        time: body.time,
        venue: body.venue,
        type: body.type,
        tournament: body.tournament,
        isHome: body.isHome,
        opponent: body.opponent,
        opponentScore: body.opponentScore,
        godaScore: body.godaScore,
        godaLineup: body.godaLineup,
        opponentLineup: body.opponentLineup,
        mvp: body.mvp,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        googleMapsUrl: body.googleMapsUrl,
      },
      include: { goals: true, cards: true },
    });
    return NextResponse.json(match);
  } catch (e) {
    console.error("PUT /api/matches/[id] error:", e);
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const unauth = await checkAuth();
  if (unauth) return unauth;

  try {
    const { id } = await params;

    const existing = await prisma.match.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy trận đấu" },
        { status: 404 }
      );
    }

    await prisma.match.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/matches/[id] error:", e);
    return NextResponse.json(
      { error: "Không thể xóa trận đấu" },
      { status: 500 }
    );
  }
}

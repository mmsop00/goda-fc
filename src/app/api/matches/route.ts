// ═══════════════════════════════════════
// GODA FC — Matches API (CRUD)
// GET  /api/matches       → list all
// POST /api/matches       → create
// ═══════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauth = await checkAuth();
  if (unauth) return unauth;

  try {
    const matches = await prisma.match.findMany({
      orderBy: { createdAt: "desc" },
      include: { goals: true, cards: true },
    });
    return NextResponse.json(matches);
  } catch (e) {
    console.error("GET /api/matches error:", e);
    return NextResponse.json(
      { error: "Không thể tải danh sách trận đấu" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauth = await checkAuth();
  if (unauth) return unauth;

  try {
    const body = await request.json();
    const match = await prisma.match.create({
      data: {
        season: body.season || "2026",
        date: body.date,
        time: body.time || "16:00",
        venue: body.venue,
        type: body.type || "Giao hữu",
        tournament: body.tournament || null,
        isHome: body.isHome ?? false,
        opponent: body.opponent,
        opponentScore: body.opponentScore ?? 0,
        godaScore: body.godaScore ?? 0,
        godaLineup: body.godaLineup || [],
        opponentLineup: body.opponentLineup || [],
        mvp: body.mvp || null,
        imageUrl: body.imageUrl || "",
        videoUrl: body.videoUrl || null,
        googleMapsUrl: body.googleMapsUrl || null,
      },
      include: { goals: true, cards: true },
    });
    return NextResponse.json(match, { status: 201 });
  } catch (e) {
    console.error("POST /api/matches error:", e);
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@goda-fc.vn" },
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json({
      ok: true,
      userCount,
      adminUser,
      dbUrl: process.env.DATABASE_URL ? "set" : "missing",
      authSecret: process.env.AUTH_SECRET ? "set" : "missing",
    });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e.message,
      stack: e.stack?.split("\n").slice(0, 5),
    }, { status: 500 });
  }
}

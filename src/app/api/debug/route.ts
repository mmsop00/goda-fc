import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const env: Record<string, string> = {
    DATABASE_URL: process.env.DATABASE_URL ? "set (" + process.env.DATABASE_URL.substring(0, 30) + "...)" : "missing",
    AUTH_SECRET: process.env.AUTH_SECRET ? "set" : "missing",
    AUTH_URL: process.env.AUTH_URL ? "set" : "missing",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "missing",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "set (length " + process.env.ADMIN_PASSWORD.length + ")" : "missing",
    NODE_ENV: process.env.NODE_ENV || "missing",
  };

  let dbOk = false;
  let dbError: string | null = null;
  try {
    const count = await prisma.user.count();
    dbOk = true;
    env["DB_USER_COUNT"] = String(count);
  } catch (e: unknown) {
    dbError = (e as Error).message;
  }

  return NextResponse.json({
    dbOk,
    dbError,
    env,
  });
}

// ═══════════════════════════════════════
// GODA FC — NextAuth.js v5 Configuration
// ═══════════════════════════════════════

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.passwordHash) return null;

          const isValid = await compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            kind: "admin" as const,
          };
        } catch (e) {
          console.error("Authorize error:", e);
          return null;
        }
      },
    }),
    Credentials({
      id: "member-phone",
      name: "member-phone",
      credentials: {
        phone: { label: "Số điện thoại", type: "text" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        try {
          const phone = normalizePhone(credentials.phone as string);
          const member = await prisma.member.findFirst({ where: { phone } });

          if (!member || !member.passwordHash) return null;

          const isValid = await compare(
            credentials.password as string,
            member.passwordHash
          );

          if (!isValid) return null;

          return {
            id: member.id,
            name: member.name,
            kind: "member" as const,
            financeRole: member.financeRole,
            mustChangePassword: member.mustChangePassword,
          };
        } catch (e) {
          console.error("Member authorize error:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const u = user as {
          role?: string;
          kind?: string;
          financeRole?: string;
          mustChangePassword?: boolean;
        };
        token.role = u.role;
        token.kind = u.kind;
        token.financeRole = u.financeRole;
        token.mustChangePassword = u.mustChangePassword;
      }
      // Sau khi đổi mật khẩu, trang gọi `update()` phía client để JWT (vốn
      // không tự đọc lại DB) biết ngay là mustChangePassword đã tắt — nếu
      // không, proxy.ts vẫn thấy cờ cũ và bắt đổi mật khẩu lặp vô hạn.
      if (trigger === "update" && token.sub && token.kind === "member") {
        const member = await prisma.member.findUnique({
          where: { id: token.sub },
          select: { mustChangePassword: true, financeRole: true },
        });
        if (member) {
          token.mustChangePassword = member.mustChangePassword;
          token.financeRole = member.financeRole;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const su = session.user as {
          id?: string;
          role?: string;
          kind?: string;
          financeRole?: string;
          mustChangePassword?: boolean;
        };
        su.id = token.sub;
        su.role = token.role as string;
        su.kind = token.kind as string;
        su.financeRole = token.financeRole as string | undefined;
        su.mustChangePassword = token.mustChangePassword as boolean | undefined;
      }
      return session;
    },
  },
});

/** Chuẩn hoá số điện thoại VN về dạng 0xxxxxxxxx — dùng chung cho đăng nhập
 * và script đồng bộ thành viên, tránh lệch định dạng (+84, khoảng trắng, dấu
 * gạch ngang) khiến đăng nhập sai dù đúng mật khẩu. */
export function normalizePhone(raw: string): string {
  let s = raw.replace(/[\s.-]/g, "");
  if (s.startsWith("+84")) s = "0" + s.slice(3);
  else if (s.startsWith("84") && s.length > 9) s = "0" + s.slice(2);
  return s;
}

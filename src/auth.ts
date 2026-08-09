// ═══════════════════════════════════════
// GODA FC — NextAuth.js v5 Configuration
// ═══════════════════════════════════════
//
// NOTE: Uses env-var credentials fallback because Vercel serverless
// cannot reach IPv6-only Supabase free tier. When a production DB
// with IPv4 is available, switch back to PrismaAdapter + DB auth.
// ═══════════════════════════════════════

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Admin credentials from environment variables (trimmed for safety)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@goda-fc.vn").trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "GODA2026!").trim();

export const { handlers, auth, signIn, signOut } = NextAuth({
  // No adapter needed — JWT strategy stores session in token
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Simple env-var credential check (for serverless/edge compatibility)
        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return {
            id: "admin-1",
            email: ADMIN_EMAIL,
            name: "Admin GODA FC",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});

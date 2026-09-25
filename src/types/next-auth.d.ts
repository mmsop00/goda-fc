import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      kind?: string; // "admin" | "member"
      financeRole?: string; // "member" | "chairman"
      mustChangePassword?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    kind?: string;
    financeRole?: string;
    mustChangePassword?: boolean;
  }
}

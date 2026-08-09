import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
const p = new PrismaClient();
async function main() {
  const user = await p.user.findUnique({ where: { email: "admin@goda-fc.vn" } });
  if (user && user.passwordHash) {
    const isValid = await compare("GODA2026!", user.passwordHash);
    console.log("Password valid:", isValid);
  }
  await p.$disconnect();
}
main();

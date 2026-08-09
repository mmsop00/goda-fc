import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const user = await p.user.findUnique({ where: { email: "admin@goda-fc.vn" } });
  console.log("User exists:", !!user);
  if (user) {
    console.log("Name:", user.name);
    console.log("Role:", user.role);
    console.log("Has passwordHash:", !!user.passwordHash);
  }
  await p.$disconnect();
}
main();

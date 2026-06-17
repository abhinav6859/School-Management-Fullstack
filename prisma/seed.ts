import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash(
    "admin123",
    10
  );

  const admin =
    await prisma.admin.upsert({
      where: {
        username: "admin",
      },
      update: {},
      create: {
        username: "admin",
        email: "admin@school.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

  console.log(
    "✅ Admin created:",
    admin.username
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from "../../src/prisma/client";
import organizations from "./organizations";
import users from "./users";

const prisma = new PrismaClient();

async function main() {
  await organizations.down();
  await organizations.up();
  await users.down();
  await users.up();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });
import { PrismaClient } from "../../src/prisma/client";

const prisma = new PrismaClient();

const down = async () => {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE organizations`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
};

const up = async () => {
  await prisma.organization.createMany({
    data: [
      {
        id: "bb7a2d33-edc8-4bcf-8f32-d56a0ed5bb55",
        name: "Microservice",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  });
};

export default { down, up };
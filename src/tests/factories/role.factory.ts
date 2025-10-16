import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();

export const roleFactory = (organizationId: string) => ({
  id: uuidv4(),
  name: faker.company.name(),
  organizationId,
  createdAt: new Date(),
  updatedAt: new Date()
});

export const createRole = async (organizationId: string) => prisma.role.create({
  data: roleFactory(organizationId)
});
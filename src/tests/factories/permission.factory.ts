import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();

export const permissionFactory = (organizationId: string) => ({
  id: uuidv4(),
  action: faker.hacker.verb(),
  resource: faker.hacker.noun(),
  organizationId,
  createdAt: new Date(),
  updatedAt: new Date()
});

export const createPermission = async (organizationId: string) => prisma.permission.create({
  data: permissionFactory(organizationId)
});
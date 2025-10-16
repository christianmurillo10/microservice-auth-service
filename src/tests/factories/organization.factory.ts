import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();

export const organizationFactory = (overrides: Partial<any> = {}) => ({
  id: uuidv4(),
  name: faker.company.name(),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createOrganization = async () => prisma.organization.create({
  data: organizationFactory()
});
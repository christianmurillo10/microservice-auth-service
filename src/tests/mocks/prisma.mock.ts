import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "../../prisma/client";
import { hashPassword } from "../../shared/utils/bcrypt";

const prisma = new PrismaClient();

export const createOrganization = async () => {
  return await prisma.organization.create({
    data: {
      id: uuidv4(),
      name: faker.company.name(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

export const createUser = async (overrides?: Record<string, unknown>) => {
  return await prisma.user.create({
    data: {
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashPassword("password"),
      accessType: "PORTAL",
      isLogged: true,
      isActive: true,
      isSuperAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    }
  });
};
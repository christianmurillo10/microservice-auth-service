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

export const createUser = async (organizationId?: string) => {
  return await prisma.user.create({
    data: {
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashPassword("password"),
      accessType: "PORTAL",
      organizationId,
      isLogged: true,
      isActive: true,
      isSuperAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
};

export const createRole = async (organizationId: string) => {
  return await prisma.role.create({
    data: {
      id: uuidv4(),
      name: faker.company.name(),
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
};

export const createPermission = async (organizationId: string) => {
  return await prisma.permission.create({
    data: {
      id: uuidv4(),
      action: faker.hacker.verb(),
      resource: faker.hacker.noun(),
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
};
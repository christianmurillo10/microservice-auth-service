import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "../../prisma/client";
import { hashPassword } from "../../shared/utils/bcrypt";

const prisma = new PrismaClient();

export const userFactory = (organizationId?: string) => ({
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
});

export const createUser = async (organizationId?: string) => prisma.user.create({
  data: userFactory(organizationId)
});
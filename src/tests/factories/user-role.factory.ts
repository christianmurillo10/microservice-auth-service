import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();

export const userRoleFactory = (
  userId: string,
  roleId: string
) => ({
  id: uuidv4(),
  userId,
  roleId,
  assignedAt: new Date()
});

export const createUserRole = async (
  userId: string,
  roleId: string
) => prisma.userRole.create({
  data: userRoleFactory(userId, roleId)
});
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();

export const userPermissionFactory = (
  userId: string,
  permissionId: string
) => ({
  id: uuidv4(),
  userId,
  permissionId,
  grantedAt: new Date()
});

export const createUserPermission = async (
  userId: string,
  permissionId: string
) => prisma.userPermission.create({
  data: userPermissionFactory(userId, permissionId)
});
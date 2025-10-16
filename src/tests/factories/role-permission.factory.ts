import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();

export const rolePermissionFactory = (
  roleId: string,
  permissionId: string
) => ({
  id: uuidv4(),
  roleId,
  permissionId,
  grantedAt: new Date()
});

export const createRolePermission = async (
  roleId: string,
  permissionId: string
) => prisma.rolePermission.create({
  data: rolePermissionFactory(roleId, permissionId)
});
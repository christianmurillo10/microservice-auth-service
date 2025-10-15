import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaRolePermissionRepository from "../../../repositories/prisma/role-permission.repository";
import RolePermissionEntity from "../../../entities/role-permission.entity";

vi.mock("../../../prisma/client", () => {
  const prisma = setupPrismaMock(["rolePermission"]);
  return { PrismaClient: vi.fn(() => prisma), prisma };
});

// Import after mocking
import prisma from "../../../config/prisma.config";

describe("Role Permission Repository - Unit", () => {
  let repo: PrismaRolePermissionRepository;
  const basedata = {
    id: faker.string.uuid(),
    roleId: faker.string.uuid(),
    permissionId: faker.string.uuid(),
    grantedAt: new Date()
  };

  beforeEach(() => {
    repo = new PrismaRolePermissionRepository();
    vi.clearAllMocks();
  });

  it("should create role permission", async () => {
    const result = await repo.create({
      params: new RolePermissionEntity(basedata)
    });

    expect(prisma.rolePermission.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          permissionId: basedata.permissionId,
        }),
      }),
    );
    expect(result.permissionId).toBe(basedata.permissionId);
  });

  it("should return all role permissions", async () => {
    const result = await repo.findAll({});

    expect(prisma.rolePermission.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return all role permissions by roleId", async () => {
    const result = await repo.findAllByRoleId({ roleId: basedata.roleId });
    
    expect(prisma.rolePermission.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should find role permission by id", async () => {
    const result = await repo.findById({ id: basedata.id });

    expect(prisma.rolePermission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: basedata.id }),
      }),
    );
    expect(result?.id).toBe(basedata.id);
  });

  it("should find role permission by roleId and permissionId", async () => {
    const result = await repo.findByRoleIdAndPermissionId({
      roleId: basedata.roleId,
      permissionId: basedata.permissionId
    });

    expect(prisma.rolePermission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          roleId: basedata.roleId,
          permissionId: basedata.permissionId
        }),
      }),
    );
    expect(result?.roleId).toBe(basedata.roleId);
    expect(result?.permissionId).toBe(basedata.permissionId);
  });

  it("should delete role permission", async () => {
    await repo.delete({ id: basedata.id });

    expect(prisma.rolePermission.delete).toHaveBeenCalled();
  });

  it("should count role permissions", async () => {
    const result = await repo.count();

    expect(prisma.rolePermission.count).toHaveBeenCalled();
    expect(result).toBeGreaterThan(0);
  });
});
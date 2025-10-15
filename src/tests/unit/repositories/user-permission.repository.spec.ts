import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaUserPermissionRepository from "../../../repositories/prisma/user-permission.repository";
import UserPermissionEntity from "../../../entities/user-permission.entity";

vi.mock("../../../prisma/client", () => {
  const prisma = setupPrismaMock(["userPermission"]);
  return { PrismaClient: vi.fn(() => prisma), prisma };
});

// Import after mocking
import prisma from "../../../config/prisma.config";

describe("User Permission Repository - Unit", () => {
  let repo: PrismaUserPermissionRepository;
  const basedata = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    permissionId: faker.string.uuid(),
    grantedAt: new Date()
  };

  beforeEach(() => {
    repo = new PrismaUserPermissionRepository();
    vi.clearAllMocks();
  });

  it("should create user permission", async () => {
    const result = await repo.create({
      params: new UserPermissionEntity(basedata)
    });
    
    expect(prisma.userPermission.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          permissionId: basedata.permissionId,
        }),
      }),
    );
    expect(result.permissionId).toBe(basedata.permissionId);
  });

  it("should return all user permissions", async () => {
    const result = await repo.findAll({});

    expect(prisma.userPermission.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return all user permissions by userId", async () => {
    const result = await repo.findAllByUserId({ userId: basedata.userId });
    
    expect(prisma.userPermission.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should find user permission by id", async () => {
    const result = await repo.findById({ id: basedata.id });

    expect(prisma.userPermission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: basedata.id }),
      }),
    );
    expect(result?.id).toBe(basedata.id);
  });

  it("should find user permission by userId and permissionId", async () => {
    const result = await repo.findByUserIdAndPermissionId({
      userId: basedata.userId,
      permissionId: basedata.permissionId
    });

    expect(prisma.userPermission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: basedata.userId,
          permissionId: basedata.permissionId
        }),
      }),
    );
    expect(result?.userId).toBe(basedata.userId);
    expect(result?.permissionId).toBe(basedata.permissionId);
  });

  it("should delete user permission", async () => {
    await repo.delete({ id: basedata.id });

    expect(prisma.userPermission.delete).toHaveBeenCalled();
  });

  it("should count user permissions", async () => {
    const result = await repo.count();
    
    expect(prisma.userPermission.count).toHaveBeenCalled();
    expect(result).toBeGreaterThan(0);
  });
});
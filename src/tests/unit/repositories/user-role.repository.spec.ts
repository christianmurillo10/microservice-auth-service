import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaUserRoleRepository from "../../../repositories/prisma/user-role.repository";
import UserRoleEntity from "../../../entities/user-role.entity";

vi.mock("../../../prisma/client", () => {
  const prisma = setupPrismaMock(["userRole"]);
  return { PrismaClient: vi.fn(() => prisma), prisma };
});

// Import after mocking
import prisma from "../../../config/prisma.config";

describe("User Role Repository - Unit", () => {
  let repo: PrismaUserRoleRepository;
  const basedata = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    roleId: faker.string.uuid(),
    assignedAt: new Date()
  };

  beforeEach(() => {
    repo = new PrismaUserRoleRepository();
    vi.clearAllMocks();
  });

  it("should create user role", async () => {
    const result = await repo.create({
      params: new UserRoleEntity(basedata)
    });

    expect(prisma.userRole.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          roleId: basedata.roleId,
        }),
      }),
    );
    expect(result.roleId).toBe(basedata.roleId);
  });

  it("should return all user roles", async () => {
    const result = await repo.findAll({});

    expect(prisma.userRole.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return all user roles by userId", async () => {
    const result = await repo.findAllByUserId({ userId: basedata.userId });
    
    expect(prisma.userRole.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should find user role by id", async () => {
    const result = await repo.findById({ id: basedata.id });

    expect(prisma.userRole.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: basedata.id }),
      }),
    );
    expect(result?.id).toBe(basedata.id);
  });

  it("should find user role by userId and roleId", async () => {
    const result = await repo.findByUserIdAndRoleId({
      userId: basedata.userId,
      roleId: basedata.roleId
    });

    expect(prisma.userRole.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: basedata.userId,
          roleId: basedata.roleId
        }),
      }),
    );
    expect(result?.userId).toBe(basedata.userId);
    expect(result?.roleId).toBe(basedata.roleId);
  });

  it("should delete user role", async () => {
    await repo.delete({ id: basedata.id });

    expect(prisma.userRole.delete).toHaveBeenCalled();
  });

  it("should count user roles", async () => {
    const result = await repo.count();
    
    expect(prisma.userRole.count).toHaveBeenCalled();
    expect(result).toBeGreaterThan(0);
  });
});
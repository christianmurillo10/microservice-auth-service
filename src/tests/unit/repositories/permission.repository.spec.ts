import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaPermissionRepository from "../../../repositories/prisma/permission.repository";
import PermissionEntity from "../../../entities/permission.entity";

vi.mock("../../../prisma/client", () => {
  const prisma = setupPrismaMock(["permission"]);
  return { PrismaClient: vi.fn(() => prisma), prisma };
});

// Import after mocking
import prisma from "../../../config/prisma.config";

describe("Permission Repository - Unit", () => {
  let repo: PrismaPermissionRepository;
  const basedata = {
    id: faker.string.uuid(),
    action: faker.word.sample(),
    resource: faker.word.sample(),
    organizationId: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    repo = new PrismaPermissionRepository();
    vi.clearAllMocks();
  });

  it("should create permission", async () => {
    const result = await repo.create({
      params: new PermissionEntity(basedata)
    });

    expect(prisma.permission.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: basedata.action,
        }),
      }),
    );
    expect(result.action).toBe(basedata.action);
  });

  it("should update permission", async () => {
    const newAction = faker.word.sample();
    const result = await repo.update({
      id: basedata.id,
      params: new PermissionEntity({
        ...basedata,
        action: newAction
      })
    });

    expect(prisma.permission.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: basedata.id },
      }),
    );
    expect(result.action).toBe(newAction);
  });

  it("should return all permissions", async () => {
    const result = await repo.findAll({});

    expect(prisma.permission.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should find permission by id", async () => {
    const result = await repo.findById({ id: basedata.id });

    expect(prisma.permission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: basedata.id }),
      }),
    );
    expect(result?.id).toBe(basedata.id);
  });

  it("should find permission by organizationId, action and resource", async () => {
    const result = await repo.findByOrganizationIdAndActionAndResource({
      organizationId: basedata.organizationId,
      action: basedata.action,
      resource: basedata.resource
    });

    expect(prisma.permission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: basedata.organizationId,
          action: basedata.action,
          resource: basedata.resource
        }),
      }),
    );
    expect(result?.organizationId).toBe(basedata.organizationId);
    expect(result?.action).toBe(basedata.action);
    expect(result?.resource).toBe(basedata.resource);
  });

  it("should delete permission", async () => {
    const result = await repo.softDelete({ id: basedata.id });

    expect(prisma.permission.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: basedata.id },
      }),
    );
    expect(result.deletedAt).toBeInstanceOf(Date);
    expect(result.deletedAt).toBeDefined();
  });

  it("should count permissions", async () => {
    const result = await repo.count();
    
    expect(prisma.permission.count).toHaveBeenCalled();
    expect(result).toBeGreaterThan(0);
  });
});
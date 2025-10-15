import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaRoleRepository from "../../../repositories/prisma/role.repository";
import RoleEntity from "../../../entities/role.entity";

vi.mock("../../../prisma/client", () => {
  const prisma = setupPrismaMock(["role"]);
  return { PrismaClient: vi.fn(() => prisma), prisma };
});

// Import after mocking
import prisma from "../../../config/prisma.config";

describe("Role Repository - Unit", () => {
  let repo: PrismaRoleRepository;
  const basedata = {
    id: faker.string.uuid(),
    name: faker.word.sample(),
    organizationId: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    repo = new PrismaRoleRepository();
    vi.clearAllMocks();
  });

  it("should create role", async () => {
    const result = await repo.create({
      params: new RoleEntity(basedata)
    });

    expect(prisma.role.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: basedata.name,
        }),
      }),
    );
    expect(result.name).toBe(basedata.name);
  });

  it("should update role", async () => {
    const newName = faker.word.sample();
    const result = await repo.update({
      id: basedata.id,
      params: new RoleEntity({
        ...basedata,
        name: newName
      })
    });

    expect(prisma.role.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: basedata.id },
      }),
    );
    expect(result.name).toBe(newName);
  });

  it("should return all roles", async () => {
    const result = await repo.findAll({});

    expect(prisma.role.findMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should find role by id", async () => {
    const result = await repo.findById({ id: basedata.id });

    expect(prisma.role.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: basedata.id }),
      }),
    );
    expect(result?.id).toBe(basedata.id);
  });

  it("should find role by organizationId and name", async () => {
    const result = await repo.findByOrganizationIdAndName({
      organizationId: basedata.organizationId,
      name: basedata.name
    });

    expect(prisma.role.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: basedata.organizationId,
          name: basedata.name
        }),
      }),
    );
    expect(result?.organizationId).toBe(basedata.organizationId);
    expect(result?.name).toBe(basedata.name);
  });

  it("should delete role", async () => {
    const result = await repo.softDelete({ id: basedata.id });

    expect(prisma.role.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: basedata.id },
      }),
    );
    expect(result.deletedAt).toBeInstanceOf(Date);
    expect(result.deletedAt).toBeDefined();
  });

  it("should count roles", async () => {
    const result = await repo.count();
    
    expect(prisma.role.count).toHaveBeenCalled();
    expect(result).toBeGreaterThan(0);
  });
});
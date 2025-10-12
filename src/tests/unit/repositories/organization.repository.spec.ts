import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaOrganizationRepository from "../../../repositories/prisma/organization.repository";
import OrganizationEntity from "../../../entities/organization.entity";

vi.mock("../../../prisma/client", () => {
  return {
    PrismaClient: vi.fn(() => setupPrismaMock()),
  };
});

// Import after mocking
import prisma from "../../../config/prisma.config";

describe("Organization Repository - Unit", () => {
  let repo: PrismaOrganizationRepository;
  const basedata = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    repo = new PrismaOrganizationRepository();
    vi.clearAllMocks();
  });

  it("should create organization", async () => {
    const result = await repo.create({
      params: new OrganizationEntity(basedata)
    });
    expect(prisma.organization.create).toHaveBeenCalled();
    expect(result.name).toBe(basedata.name);
  });

  it("should update organization", async () => {
    const result = await repo.update({
      id: basedata.id,
      params: new OrganizationEntity({
        ...basedata,
        isActive: true
      })
    });
    expect(prisma.organization.update).toHaveBeenCalled();
    expect(result.isActive).toBe(true);
  });

  it("should return all organizations", async () => {
    const result = await repo.findAll({});
    expect(prisma.organization.findMany).toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should find organization by id", async () => {
    const result = await repo.findById({ id: basedata.id });
    expect(prisma.organization.findFirst).toHaveBeenCalled();
    expect(result?.id).toBe(basedata.id);
  });

  it("should find organization by name", async () => {
    const result = await repo.findByName({ name: basedata.name });
    expect(prisma.organization.findFirst).toHaveBeenCalled();
    expect(result?.name).toBe(basedata.name);
  });

  it("should delete organization", async () => {
    const result = await repo.softDelete({ id: basedata.id });
    expect(prisma.organization.update).toHaveBeenCalled();
    expect(result.deletedAt).toBeInstanceOf(Date);
    expect(result.deletedAt).toBeDefined();
  });

  it("should count organizations", async () => {
    const result = await repo.count();
    expect(prisma.organization.count).toHaveBeenCalled();
    expect(result).toBeGreaterThan(0);
  });
});
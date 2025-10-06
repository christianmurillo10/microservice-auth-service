import { describe, it, expect, vi, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import prisma from "../../../config/prisma.config";
import PrismaOrganizationRepository from "../../../repositories/prisma/organization.repository";
import OrganizationEntity from "../../../entities/organization.entity";

vi.mock("../../../src/config/prisma.config", () => ({
  Prisma: {
    organization: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn()
    }
  },
}));

describe("Organization Repository - Unit", () => {
  let repo: PrismaOrganizationRepository;

  beforeEach(() => {
    repo = new PrismaOrganizationRepository();
    vi.clearAllMocks();
  });

  it("should create organization with prisma", async () => {
    const data = {
      id: uuidv4(),
      name: faker.company.name(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    (prisma.organization.create as any).mockResolvedValue(data);
    const result = await repo.create({ params: new OrganizationEntity(data) });
    expect(prisma.organization.create).toHaveBeenCalled();
    expect(result.name).toBe(data.name);
  });
});
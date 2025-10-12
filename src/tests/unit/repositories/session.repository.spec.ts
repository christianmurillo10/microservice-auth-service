import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaSessionRepository from "../../../repositories/prisma/session.repository";
import SessionEntity from "../../../entities/session.entity";

vi.mock("../../../prisma/client", () => {
  return {
    PrismaClient: vi.fn(() => setupPrismaMock()),
  };
});

// Import after mocking
import prisma from "../../../config/prisma.config";
import { UserAccessType } from "../../../entities/user.entity";

describe("Session Repository - Unit", () => {
  let repo: PrismaSessionRepository;
  const basedata = {
    id: faker.string.uuid(),
    accessType: UserAccessType.Portal,
    accessToken: faker.string.alphanumeric(32),
    refreshToken: faker.string.uuid(),
    userId: faker.string.uuid(),
    refreshTokenExpiresAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    repo = new PrismaSessionRepository();
    vi.clearAllMocks();
  });

  it("should create session", async () => {
    const result = await repo.create({
      params: new SessionEntity(basedata)
    });
    expect(prisma.session.create).toHaveBeenCalled();
    expect(result.accessToken).toBe(basedata.accessToken);
  });

  it("should update session", async () => {
    const newUserId = faker.string.alphanumeric(32);
    const result = await repo.update({
      id: basedata.id,
      params: new SessionEntity({
        ...basedata,
        userId: newUserId
      })
    });
    expect(prisma.session.update).toHaveBeenCalled();
    expect(result.userId).toBe(newUserId);
  });

  it("should find session by id", async () => {
    const result = await repo.findById({ id: basedata.id });
    expect(prisma.session.findFirst).toHaveBeenCalled();
    expect(result?.id).toBe(basedata.id);
  });

  it("should find session by accessToken", async () => {
    const result = await repo.findByAccessToken({ accessToken: basedata.accessToken });
    expect(prisma.session.findFirst).toHaveBeenCalled();
    expect(result?.accessToken).toBe(basedata.accessToken);
  });

  it("should find session by refreshToken", async () => {
    const result = await repo.findByRefreshToken({ refreshToken: basedata.refreshToken });
    expect(prisma.session.findFirst).toHaveBeenCalled();
    expect(result?.refreshToken).toBe(basedata.refreshToken);
  });

  it("should delete session", async () => {
    const result = await repo.softDelete({ id: basedata.id });
    expect(prisma.session.update).toHaveBeenCalled();
    expect(result.deletedAt).toBeInstanceOf(Date);
    expect(result.deletedAt).toBeDefined();
  });
});
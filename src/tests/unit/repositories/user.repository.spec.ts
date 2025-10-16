import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { setupPrismaMock } from "../../mocks/prisma.helper";
import PrismaUserRepository from "../../../repositories/prisma/user.repository";
import UserEntity, { UserAccessType } from "../../../entities/user.entity";

vi.mock("../../../prisma/client", () => {
  const prisma = setupPrismaMock(["user"]);
  return { PrismaClient: vi.fn(() => prisma), prisma };
});

import prisma from "../../../config/prisma.config";

describe("User Repository - Unit", () => {
  let repo: PrismaUserRepository;

  const basedata = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.string.alphanumeric(32),
    accessType: UserAccessType.Portal,
    isActive: true,
    isLogged: true,
    isSuperAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repo = new PrismaUserRepository();
    vi.clearAllMocks();
  });

  it("should create a user", async () => {
    const result = await repo.create({
      params: new UserEntity(basedata),
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: basedata.email,
          username: basedata.username,
        }),
      }),
    );
    expect(result.email).toBe(basedata.email);
    expect(result.isActive).toBe(true);
  });

  it("should update a user", async () => {
    const newName = faker.person.fullName();

    const result = await repo.update({
      id: basedata.id,
      params: new UserEntity({
        ...basedata,
        name: newName,
      }),
    });

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: basedata.id },
      }),
    );
    expect(result.name).toBe(newName);
  });

  it("should find a user by ID", async () => {
    const result = await repo.findById({ id: basedata.id });

    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: basedata.id }),
      }),
    );
    expect(result?.id).toBe(basedata.id);
  });

  it("should find a user by username or email with username value", async () => {
    const result = await repo.findByUsernameOrEmail({
      username: basedata.username,
      email: basedata.username,
    });

    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { username: { equals: basedata.username } },
            { email: { equals: basedata.username } },
          ],
        }),
      }),
    );
    expect(result?.username).toBe(basedata.username);
  });

  it("should find a user by username or email with email value", async () => {
    const result = await repo.findByUsernameOrEmail({
      username: basedata.email,
      email: basedata.email,
    });

    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { username: { equals: basedata.email } },
            { email: { equals: basedata.email } },
          ],
        }),
      }),
    );
    expect(result?.email).toBe(basedata.email);
  });
});

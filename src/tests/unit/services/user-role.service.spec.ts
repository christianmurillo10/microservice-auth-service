import { describe, it, expect, vi, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import UserRoleEntity from "../../../entities/user-role.entity";
import { userRoleFactory } from "../../factories/user-role.factory";

const mockRepoInstance = {
  create: vi.fn(),
  findById: vi.fn(),
  findByUserIdAndRoleId: vi.fn(),
  findAll: vi.fn(),
  findAllByUserId: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
};

vi.mock("../../../repositories/prisma/user-role.repository", () => {
  return {
    default: vi.fn(() => mockRepoInstance),
  };
});

// Import after mocking
import PrismaUserRepository from "../../../repositories/prisma/user-role.repository";
import UserService from "../../../services/user-role.service";

describe("User Role Service - Unit", () => {
  let service: UserService;
  let fakeUser: UserRoleEntity;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeUser = new UserRoleEntity(userRoleFactory(uuidv4(), uuidv4()));
    service = new UserService(new PrismaUserRepository() as any);
  });

  it("should create user role", async () => {
    mockRepoInstance.create.mockResolvedValue(fakeUser);

    const createData = new UserRoleEntity({
      ...fakeUser,
      id: undefined
    });
    const result = await service.save(createData);

    expect(mockRepoInstance.create).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        params: createData
      })
    );
    expect(result.roleId).toBe(fakeUser.roleId);
  });

  it("should return all user roles", async () => {
    mockRepoInstance.findAll.mockResolvedValue([fakeUser]);

    const result = await service.getAll();

    expect(mockRepoInstance.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(UserRoleEntity);
  });

  it("should return all user roles by user", async () => {
    mockRepoInstance.findAllByUserId.mockResolvedValue([fakeUser]);

    const result = await service.getAllByUserId({ userId: fakeUser.userId });

    expect(mockRepoInstance.findAllByUserId).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(UserRoleEntity);
  });

  it("should find user role by id", async () => {
    mockRepoInstance.findById.mockResolvedValue(fakeUser);

    const result = await service.getById(fakeUser.id!);

    expect(mockRepoInstance.findById).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findById).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakeUser.id,
      })
    );
    expect(result).toBeInstanceOf(UserRoleEntity);
    expect(result.id).toBe(fakeUser.id);
  });

  it("should find user role by roleId", async () => {
    mockRepoInstance.findByUserIdAndRoleId.mockResolvedValue(fakeUser);

    const result = await service.getByUserIdAndRoleId(fakeUser.userId, fakeUser.roleId);

    expect(mockRepoInstance.findByUserIdAndRoleId).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findByUserIdAndRoleId).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: fakeUser.userId,
        roleId: fakeUser.roleId,
      })
    );
    expect(result).toBeInstanceOf(UserRoleEntity);
    expect(result.userId).toBe(fakeUser.userId);
    expect(result.roleId).toBe(fakeUser.roleId);
  });

  it("should delete user role", async () => {
    const deleted = { ...fakeUser, deletedAt: new Date() };
    mockRepoInstance.delete.mockResolvedValue(deleted);

    await service.delete(fakeUser.id!);

    expect(mockRepoInstance.delete).toHaveBeenCalledTimes(1);
  });

  it("should count user role", async () => {
    mockRepoInstance.count.mockResolvedValue(5);

    const result = await service.count({});

    expect(mockRepoInstance.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(5);
  });
});

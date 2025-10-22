import { describe, it, expect, vi, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import UserPermissionEntity from "../../../entities/user-permission.entity";
import { userPermissionFactory } from "../../factories/user-permission.factory";

const mockRepoInstance = {
  create: vi.fn(),
  findById: vi.fn(),
  findByUserIdAndPermissionId: vi.fn(),
  findAll: vi.fn(),
  findAllByUserId: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
};

vi.mock("../../../repositories/prisma/user-permission.repository", () => {
  return {
    default: vi.fn(() => mockRepoInstance),
  };
});

// Import after mocking
import PrismaUserRepository from "../../../repositories/prisma/user-permission.repository";
import UserService from "../../../services/user-permission.service";

describe("User Permission Service - Unit", () => {
  let service: UserService;
  let fakeUser: UserPermissionEntity;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeUser = new UserPermissionEntity(userPermissionFactory(uuidv4(), uuidv4()));
    service = new UserService(new PrismaUserRepository() as any);
  });

  it("should create user permission", async () => {
    mockRepoInstance.create.mockResolvedValue(fakeUser);

    const createData = new UserPermissionEntity({
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
    expect(result.permissionId).toBe(fakeUser.permissionId);
  });

  it("should return all user permissions", async () => {
    mockRepoInstance.findAll.mockResolvedValue([fakeUser]);

    const result = await service.getAll();

    expect(mockRepoInstance.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(UserPermissionEntity);
  });

  it("should return all user permissions by user", async () => {
    mockRepoInstance.findAllByUserId.mockResolvedValue([fakeUser]);

    const result = await service.getAllByUserId({ userId: fakeUser.userId });

    expect(mockRepoInstance.findAllByUserId).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(UserPermissionEntity);
  });

  it("should find user permission by id", async () => {
    mockRepoInstance.findById.mockResolvedValue(fakeUser);

    const result = await service.getById(fakeUser.id!);

    expect(mockRepoInstance.findById).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findById).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakeUser.id,
      })
    );
    expect(result).toBeInstanceOf(UserPermissionEntity);
    expect(result.id).toBe(fakeUser.id);
  });

  it("should find user permission by permissionId", async () => {
    mockRepoInstance.findByUserIdAndPermissionId.mockResolvedValue(fakeUser);

    const result = await service.getByUserIdAndPermissionId(fakeUser.userId, fakeUser.permissionId);

    expect(mockRepoInstance.findByUserIdAndPermissionId).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findByUserIdAndPermissionId).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: fakeUser.userId,
        permissionId: fakeUser.permissionId,
      })
    );
    expect(result).toBeInstanceOf(UserPermissionEntity);
    expect(result.userId).toBe(fakeUser.userId);
    expect(result.permissionId).toBe(fakeUser.permissionId);
  });

  it("should delete user permission", async () => {
    const deleted = { ...fakeUser, deletedAt: new Date() };
    mockRepoInstance.delete.mockResolvedValue(deleted);

    await service.delete(fakeUser.id!);

    expect(mockRepoInstance.delete).toHaveBeenCalledTimes(1);
  });

  it("should count user permission", async () => {
    mockRepoInstance.count.mockResolvedValue(5);

    const result = await service.count({});

    expect(mockRepoInstance.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(5);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import RolePermissionEntity from "../../../entities/role-permission.entity";
import { rolePermissionFactory } from "../../factories/role-permission.factory";

const mockRepoInstance = {
  create: vi.fn(),
  findById: vi.fn(),
  findByRoleIdAndPermissionId: vi.fn(),
  findAll: vi.fn(),
  findAllByRoleId: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
};

vi.mock("../../../repositories/prisma/role-permission.repository", () => {
  return {
    default: vi.fn(() => mockRepoInstance),
  };
});

// Import after mocking
import PrismaRoleRepository from "../../../repositories/prisma/role-permission.repository";
import RoleService from "../../../services/role-permission.service";

describe("Role Permission Service - Unit", () => {
  let service: RoleService;
  let fakeRole: RolePermissionEntity;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeRole = new RolePermissionEntity(rolePermissionFactory(uuidv4(), uuidv4()));
    service = new RoleService(new PrismaRoleRepository() as any);
  });

  it("should create role permission", async () => {
    mockRepoInstance.create.mockResolvedValue(fakeRole);

    const createData = new RolePermissionEntity({
      ...fakeRole,
      id: undefined
    });
    const result = await service.save(createData);

    expect(mockRepoInstance.create).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        params: createData
      })
    );
    expect(result.permissionId).toBe(fakeRole.permissionId);
  });

  it("should return all role permissions", async () => {
    mockRepoInstance.findAll.mockResolvedValue([fakeRole]);

    const result = await service.getAll();

    expect(mockRepoInstance.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(RolePermissionEntity);
  });

  it("should return all role permissions by role", async () => {
    mockRepoInstance.findAllByRoleId.mockResolvedValue([fakeRole]);

    const result = await service.getAllByRoleId({ roleId: fakeRole.roleId });

    expect(mockRepoInstance.findAllByRoleId).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(RolePermissionEntity);
  });

  it("should find role permission by id", async () => {
    mockRepoInstance.findById.mockResolvedValue(fakeRole);

    const result = await service.getById(fakeRole.id!);

    expect(mockRepoInstance.findById).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findById).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakeRole.id,
      })
    );
    expect(result).toBeInstanceOf(RolePermissionEntity);
    expect(result.id).toBe(fakeRole.id);
  });

  it("should find role permission by permissionId", async () => {
    mockRepoInstance.findByRoleIdAndPermissionId.mockResolvedValue(fakeRole);

    const result = await service.getByRoleIdAndPermissionId(fakeRole.roleId, fakeRole.permissionId);

    expect(mockRepoInstance.findByRoleIdAndPermissionId).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findByRoleIdAndPermissionId).toHaveBeenCalledWith(
      expect.objectContaining({
        roleId: fakeRole.roleId,
        permissionId: fakeRole.permissionId,
      })
    );
    expect(result).toBeInstanceOf(RolePermissionEntity);
    expect(result.roleId).toBe(fakeRole.roleId);
    expect(result.permissionId).toBe(fakeRole.permissionId);
  });

  it("should delete role permission", async () => {
    const deleted = { ...fakeRole, deletedAt: new Date() };
    mockRepoInstance.delete.mockResolvedValue(deleted);

    await service.delete(fakeRole.id!);

    expect(mockRepoInstance.delete).toHaveBeenCalledTimes(1);
  });

  it("should count role permission", async () => {
    mockRepoInstance.count.mockResolvedValue(5);

    const result = await service.count({});

    expect(mockRepoInstance.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(5);
  });
});

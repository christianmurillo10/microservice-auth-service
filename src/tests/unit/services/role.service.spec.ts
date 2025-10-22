import { describe, it, expect, vi, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import RoleEntity from "../../../entities/role.entity";
import { roleFactory } from "../../factories/role.factory";

const mockRepoInstance = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findByOrganizationIdAndName: vi.fn(),
  findAll: vi.fn(),
  softDelete: vi.fn(),
  count: vi.fn(),
};

vi.mock("../../../repositories/prisma/role.repository", () => {
  return {
    default: vi.fn(() => mockRepoInstance),
  };
});

// Import after mocking
import PrismaRoleRepository from "../../../repositories/prisma/role.repository";
import RoleService from "../../../services/role.service";

describe("Role Service - Unit", () => {
  let service: RoleService;
  let fakeRole: RoleEntity;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeRole = new RoleEntity(roleFactory(uuidv4()));
    service = new RoleService(new PrismaRoleRepository() as any);
  });

  it("should create role", async () => {
    mockRepoInstance.create.mockResolvedValue(fakeRole);

    const createData = new RoleEntity({
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
    expect(result.name).toBe(fakeRole.name);
  });

  it("should update role", async () => {
    const updatedEntity = new RoleEntity({
      ...fakeRole,
      id: uuidv4()
    });
    mockRepoInstance.update.mockResolvedValue(updatedEntity);

    const result = await service.save(updatedEntity);

    expect(mockRepoInstance.update).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: updatedEntity.id,
        params: updatedEntity,
      })
    );
    expect(result.name).toBe(updatedEntity.name);
  });

  it("should return all roles", async () => {
    mockRepoInstance.findAll.mockResolvedValue([fakeRole]);

    const result = await service.getAll();

    expect(mockRepoInstance.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(RoleEntity);
  });

  it("should find role by id", async () => {
    mockRepoInstance.findById.mockResolvedValue(fakeRole);

    const result = await service.getById(fakeRole.id!);

    expect(mockRepoInstance.findById).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findById).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakeRole.id,
      })
    );
    expect(result).toBeInstanceOf(RoleEntity);
    expect(result.id).toBe(fakeRole.id);
  });

  it("should find role by name", async () => {
    mockRepoInstance.findByOrganizationIdAndName.mockResolvedValue(fakeRole);

    const result = await service.getByOrganizationIdAndName(fakeRole.organizationId, fakeRole.name);

    expect(mockRepoInstance.findByOrganizationIdAndName).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findByOrganizationIdAndName).toHaveBeenCalledWith(
      expect.objectContaining({
        name: fakeRole.name,
      })
    );
    expect(result).toBeInstanceOf(RoleEntity);
    expect(result.name).toBe(fakeRole.name);
  });

  it("should delete role", async () => {
    const deleted = { ...fakeRole, deletedAt: new Date() };
    mockRepoInstance.softDelete.mockResolvedValue(deleted);

    const result = await service.delete(fakeRole.id!);

    expect(mockRepoInstance.softDelete).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.softDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakeRole.id,
      })
    );
    expect(result.deletedAt).toBeInstanceOf(Date);
  });

  it("should count role", async () => {
    mockRepoInstance.count.mockResolvedValue(5);

    const result = await service.count({});

    expect(mockRepoInstance.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(5);
  });
});

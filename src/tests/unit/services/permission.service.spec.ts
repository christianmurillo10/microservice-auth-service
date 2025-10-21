import { describe, it, expect, vi, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import PermissionEntity from "../../../entities/permission.entity";
import { permissionFactory } from "../../factories/permission.factory";

const mockRepoInstance = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findByOrganizationIdAndActionAndResource: vi.fn(),
  findAll: vi.fn(),
  softDelete: vi.fn(),
  count: vi.fn(),
};

vi.mock("../../../repositories/prisma/permission.repository", () => {
  return {
    default: vi.fn(() => mockRepoInstance),
  };
});

// 3️⃣ Import after mocking
import PrismaPermissionRepository from "../../../repositories/prisma/permission.repository";
import PermissionService from "../../../services/permission.service";

describe("Permission Service - Unit", () => {
  let service: PermissionService;
  let fakePermission: PermissionEntity;

  beforeEach(() => {
    vi.clearAllMocks();
    fakePermission = new PermissionEntity(permissionFactory(uuidv4()));
    service = new PermissionService(new PrismaPermissionRepository() as any);
  });

  it("should create permission", async () => {
    mockRepoInstance.create.mockResolvedValue(fakePermission);

    const createData = new PermissionEntity({
      ...fakePermission,
      id: undefined
    });
    const result = await service.save(createData);

    expect(mockRepoInstance.create).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        params: createData
      })
    );
    expect(result.action).toBe(fakePermission.action);
    expect(result.resource).toBe(fakePermission.resource);
  });

  it("should update permission", async () => {
    const updatedEntity = new PermissionEntity({
      ...fakePermission,
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
    expect(result.action).toBe(updatedEntity.action);
    expect(result.resource).toBe(updatedEntity.resource);
  });

  it("should return all permissions", async () => {
    mockRepoInstance.findAll.mockResolvedValue([fakePermission]);

    const result = await service.getAll();

    expect(mockRepoInstance.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(PermissionEntity);
  });

  it("should find permission by id", async () => {
    mockRepoInstance.findById.mockResolvedValue(fakePermission);

    const result = await service.getById(fakePermission.id!);

    expect(mockRepoInstance.findById).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findById).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakePermission.id,
      })
    );
    expect(result).toBeInstanceOf(PermissionEntity);
    expect(result.id).toBe(fakePermission.id);
  });

  it("should find permission by organizationId, action and resource", async () => {
    mockRepoInstance.findByOrganizationIdAndActionAndResource.mockResolvedValue(fakePermission);

    const result = await service.getByOrganizationIdAndActionAndResource(
      fakePermission.organizationId,
      fakePermission.action,
      fakePermission.resource
    );

    expect(mockRepoInstance.findByOrganizationIdAndActionAndResource).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findByOrganizationIdAndActionAndResource).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: fakePermission.organizationId,
        action: fakePermission.action,
        resource: fakePermission.resource
      })
    );
    expect(result).toBeInstanceOf(PermissionEntity);
    expect(result.organizationId).toBe(fakePermission.organizationId);
    expect(result.action).toBe(fakePermission.action);
    expect(result.resource).toBe(fakePermission.resource);
  });

  it("should delete permission", async () => {
    const deleted = { ...fakePermission, deletedAt: new Date() };
    mockRepoInstance.softDelete.mockResolvedValue(deleted);

    const result = await service.delete(fakePermission.id!);

    expect(mockRepoInstance.softDelete).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.softDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakePermission.id,
      })
    );
    expect(result.deletedAt).toBeInstanceOf(Date);
  });

  it("should count permission", async () => {
    mockRepoInstance.count.mockResolvedValue(5);

    const result = await service.count({});

    expect(mockRepoInstance.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(5);
  });
});

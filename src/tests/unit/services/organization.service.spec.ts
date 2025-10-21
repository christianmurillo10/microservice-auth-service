import { describe, it, expect, vi, beforeEach } from "vitest";
import { v4 as uuidv4 } from "uuid";
import OrganizationEntity from "../../../entities/organization.entity";
import { organizationFactory } from "../../factories/organization.factory";

const mockRepoInstance = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findByName: vi.fn(),
  findAll: vi.fn(),
  findAllBetweenCreatedAt: vi.fn(),
  softDelete: vi.fn(),
  softDeleteMany: vi.fn(),
  count: vi.fn(),
};

vi.mock("../../../repositories/prisma/organization.repository", () => {
  return {
    default: vi.fn(() => mockRepoInstance),
  };
});

// 3️⃣ Import after mocking
import PrismaOrganizationRepository from "../../../repositories/prisma/organization.repository";
import OrganizationService from "../../../services/organization.service";

describe("Organization Service - Unit", () => {
  let service: OrganizationService;
  let fakeOrganization: OrganizationEntity;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeOrganization = new OrganizationEntity(organizationFactory());
    service = new OrganizationService(new PrismaOrganizationRepository() as any);
  });

  it("should create organization", async () => {
    mockRepoInstance.create.mockResolvedValue(fakeOrganization);

    const createData = new OrganizationEntity({
      ...fakeOrganization,
      id: undefined
    });
    const result = await service.save(createData);

    expect(mockRepoInstance.create).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        params: createData
      })
    );
    expect(result.name).toBe(fakeOrganization.name);
  });

  it("should update organization", async () => {
    const updatedEntity = new OrganizationEntity({
      ...organizationFactory(),
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

  it("should return all organizations", async () => {
    mockRepoInstance.findAll.mockResolvedValue([fakeOrganization]);

    const result = await service.getAll();

    expect(mockRepoInstance.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(OrganizationEntity);
  });

  it("should find organization by id", async () => {
    mockRepoInstance.findById.mockResolvedValue(fakeOrganization);

    const result = await service.getById(fakeOrganization.id!);

    expect(mockRepoInstance.findById).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findById).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakeOrganization.id,
      })
    );
    expect(result).toBeInstanceOf(OrganizationEntity);
    expect(result.id).toBe(fakeOrganization.id);
  });

  it("should find organization by name", async () => {
    mockRepoInstance.findByName.mockResolvedValue(fakeOrganization);

    const result = await service.getByName(fakeOrganization.name);

    expect(mockRepoInstance.findByName).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.findByName).toHaveBeenCalledWith(
      expect.objectContaining({
        name: fakeOrganization.name,
      })
    );
    expect(result).toBeInstanceOf(OrganizationEntity);
    expect(result.name).toBe(fakeOrganization.name);
  });

  it("should delete organization", async () => {
    const deleted = { ...fakeOrganization, deletedAt: new Date() };
    mockRepoInstance.softDelete.mockResolvedValue(deleted);

    const result = await service.delete(fakeOrganization.id!);
    
    expect(mockRepoInstance.softDelete).toHaveBeenCalledTimes(1);
    expect(mockRepoInstance.softDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fakeOrganization.id,
      })
    );
    expect(result.deletedAt).toBeInstanceOf(Date);
  });

  it("should count organization", async () => {
    mockRepoInstance.count.mockResolvedValue(5);

    const result = await service.count({});

    expect(mockRepoInstance.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(5);
  });
});

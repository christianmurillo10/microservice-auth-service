import { vi } from "vitest";

/**
 * Common reusable Prisma mock implementations
 */
export const mockPrismaCreate = vi.fn(async (args: any) => ({
  id: args?.data?.id ?? "mocked-id",
  ...args?.data,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const mockPrismaUpdate = vi.fn(async (args: any) => ({
  id: args?.where?.id ?? "mocked-id",
  ...args?.data,
  updatedAt: new Date(),
}));

export const mockPrismaDelete = vi.fn(async (args: any) => ({
  id: args?.where?.id ?? "mocked-id",
  deletedAt: new Date(),
}));

export const mockPrismaFindMany = vi.fn(async (args?: any) => {
  const count = args?.take ?? 3;
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-${i + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
});

export const mockPrismaFindFirst = vi.fn(async (args?: any) => {
  return (
    args?.where ?? {
      id: "mock-first-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
});

export const mockPrismaCreateMany = vi.fn(async () => ({ count: 1 }));
export const mockPrismaUpdateMany = vi.fn(async () => ({ count: 1 }));
export const mockPrismaCount = vi.fn(async () => 5);

export const setupPrismaMock = (models: string[] = []) => {
  const baseMock = {
    create: mockPrismaCreate,
    update: mockPrismaUpdate,
    delete: mockPrismaDelete,
    findMany: mockPrismaFindMany,
    findFirst: mockPrismaFindFirst,
    createMany: mockPrismaCreateMany,
    updateMany: mockPrismaUpdateMany,
    count: mockPrismaCount,
  };

  return models.reduce((acc, model) => {
    acc[model] = { ...baseMock };
    return acc;
  }, {} as Record<string, typeof baseMock>);
};

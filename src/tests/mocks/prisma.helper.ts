import { vi } from "vitest";

export const mockPrismaCreate = vi.fn(async (args: any) => ({
  id: args.data?.id ?? "mocked-id",
  ...args.data,
}));

export const mockPrismaUpdate = vi.fn(async (args: any) => ({
  id: args.where?.id ?? "mocked-id",
  ...args.data,
}));

export const mockPrismaFindAll = vi.fn(async (args?: any) => {
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

export const mockPrismaUpdateMany = vi.fn(async (_args?: any) => ({
  count: 1,
}));

export const mockPrismaCount = vi.fn(async (args?: any) => {
  return args?.where ? 1 : 5;
});

export const setupPrismaMock = () => ({
  organization: {
    create: mockPrismaCreate,
    update: mockPrismaUpdate,
    findMany: mockPrismaFindAll,
    findFirst: mockPrismaFindFirst,
    updateMany: mockPrismaUpdateMany,
    count: mockPrismaCount,
  },
  permission: {
    create: mockPrismaCreate,
    update: mockPrismaUpdate,
    findMany: mockPrismaFindAll,
    findFirst: mockPrismaFindFirst,
    updateMany: mockPrismaUpdateMany,
    count: mockPrismaCount,
  },
  role: {
    create: mockPrismaCreate,
    update: mockPrismaUpdate,
    findMany: mockPrismaFindAll,
    findFirst: mockPrismaFindFirst,
    updateMany: mockPrismaUpdateMany,
    count: mockPrismaCount,
  },
});

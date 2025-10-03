import { describe, it, expect } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import OrganizationEntity from "../../../entities/organization.entity";

describe("Organization Entity", () => {
  it("should activate organization", async () => {
    const organization = new OrganizationEntity({
      id: uuidv4(),
      name: faker.company.name(),
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    organization.activate();
    expect(organization.isActive).toBe(true);
  });

  it("should deactivate organization", async () => {
    const organization = new OrganizationEntity({
      id: uuidv4(),
      name: faker.company.name(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    organization.deactivate();
    expect(organization.isActive).toBe(false);
  });
});
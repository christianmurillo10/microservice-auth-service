import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { faker } from "@faker-js/faker";
import OrganizationService from "../../../services/organization.service";
import PrismaOrganizationRepository from "../../../repositories/prisma/organization.repository";
import OrganizationEntity from "../../../entities/organization.entity";

vi.mock("../../../repositories/prisma/user.repository");

describe("Organization Service - Unit", () => {
  let service: OrganizationService;
  let mockRepo: Mocked<PrismaOrganizationRepository>;
  let fakeOrganization: OrganizationEntity;

  beforeEach(() => {
    vi.clearAllMocks();
  });
});
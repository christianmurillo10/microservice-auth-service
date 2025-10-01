import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";
import { createOrganization, createUser } from "../mocks/prisma.mock";
import { getAccessToken } from "../../shared/helpers/common.helper";
import { UserAccessTypeValue } from "../../entities/user.entity";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let organizationId = "";
let userId = "";
let id = "";

describe("Permission - Integration", () => {
  beforeAll(async () => {
    const organization = await createOrganization();
    const user = await createUser({ organizationId: organization.id });
    const { accessToken } = getAccessToken(
      user.id as unknown as number,
      user.email,
      user.accessType as UserAccessTypeValue,
      organization.id as unknown as number,
      new Date(),
      5
    );

    token = accessToken;
    organizationId = organization.id;
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.permission.delete({ where: { id } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.organization.delete({ where: { id: organizationId } });
    await prisma.$disconnect();
  });

  it("should create permission", async () => {
    const res = await request(app)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create permission if duplicate", async () => {
    const res = await request(app)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(409);
  });

  it("should update permission", async () => {
    const res = await request(app)
      .put(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(200);
  });

  it("should fail update permission if id not found", async () => {
    const res = await request(app)
      .put(`/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(404);
  });

  it("should read permission", async () => {
    const res = await request(app)
      .get(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read permission if id not found", async () => {
    const res = await request(app)
      .get(`/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list permissions", async () => {
    const res = await request(app)
      .get("/permissions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete permission", async () => {
    const res = await request(app)
      .delete(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";
import { createOrganization } from "../factories/organization.factory";
import { createUser } from "../factories/user.factory";
import { getAccessToken } from "../../shared/helpers/common.helper";
import { UserAccessTypeValue } from "../../entities/user.entity";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let organizationId = "";
let userId = "";
let id = "";

describe("Role - Integration", () => {
  beforeAll(async () => {
    const organization = await createOrganization();
    const user = await createUser(organization.id);
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
    await prisma.role.delete({ where: { id } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.organization.delete({ where: { id: organizationId } });
    await prisma.$disconnect();
  });

  it("should create role", async () => {
    const res = await request(app)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create role if duplicate", async () => {
    const res = await request(app)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role" });
    expect(res.status).toBe(409);
  });

  it("should update role", async () => {
    const res = await request(app)
      .put(`/roles/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(200);
  });

  it("should fail update role if id not found", async () => {
    const res = await request(app)
      .put(`/roles/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(404);
  });

  it("should read role", async () => {
    const res = await request(app)
      .get(`/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read role if id not found", async () => {
    const res = await request(app)
      .get(`/roles/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list roles", async () => {
    const res = await request(app)
      .get("/roles")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete role", async () => {
    const res = await request(app)
      .delete(`/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
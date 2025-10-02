import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";
import { createOrganization, createPermission, createUser } from "../mocks/prisma.mock";
import { getAccessToken } from "../../shared/helpers/common.helper";
import { UserAccessTypeValue } from "../../entities/user.entity";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let organizationId = "";
let userId = "";
let id = "";
let permissionId = "";

describe("User Permission - Integration", () => {
  beforeAll(async () => {
    const organization = await createOrganization();
    const user = await createUser(organization.id);
    const permission = await createPermission(organization.id);
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
    permissionId = permission.id;
  });

  afterAll(async () => {
    await prisma.permission.delete({ where: { id: permissionId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.organization.delete({ where: { id: organizationId } });
    await prisma.$disconnect();
  });

  it("should create user permission", async () => {
    const res = await request(app)
      .post(`/users/${userId}/permissions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create user permission if duplicate", async () => {
    const res = await request(app)
      .post(`/users/${userId}/permissions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionId });
    expect(res.status).toBe(409);
  });

  it("should sync user permission", async () => {
    const res = await request(app)
      .put(`/users/${userId}/permissions/sync`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionIds: [permissionId] });
    expect(res.status).toBe(200);
  });

  it("should read user permission", async () => {
    const res = await request(app)
      .get(`/users/${userId}/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read user permission if id not found", async () => {
    const res = await request(app)
      .get(`/users/${userId}/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list user permissions", async () => {
    const res = await request(app)
      .get(`/users/${userId}/permissions`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete user permission", async () => {
    const res = await request(app)
      .delete(`/users/${userId}/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
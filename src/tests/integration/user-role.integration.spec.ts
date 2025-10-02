import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";
import { createOrganization, createRole, createUser } from "../mocks/prisma.mock";
import { getAccessToken } from "../../shared/helpers/common.helper";
import { UserAccessTypeValue } from "../../entities/user.entity";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let organizationId = "";
let userId = "";
let id = "";
let roleId = "";

describe("User Role - Integration", () => {
  beforeAll(async () => {
    const organization = await createOrganization();
    const user = await createUser(organization.id);
    const role = await createRole(organization.id);
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
    roleId = role.id;
  });

  afterAll(async () => {
    await prisma.role.delete({ where: { id: roleId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.organization.delete({ where: { id: organizationId } });
    await prisma.$disconnect();
  });

  it("should create user role", async () => {
    const res = await request(app)
      .post(`/users/${userId}/roles`)
      .set("Authorization", `Bearer ${token}`)
      .send({ roleId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create user role if duplicate", async () => {
    const res = await request(app)
      .post(`/users/${userId}/roles`)
      .set("Authorization", `Bearer ${token}`)
      .send({ roleId });
    expect(res.status).toBe(409);
  });

  it("should sync user role", async () => {
    const res = await request(app)
      .put(`/users/${userId}/roles/sync`)
      .set("Authorization", `Bearer ${token}`)
      .send({ roleIds: [roleId] });
    expect(res.status).toBe(200);
  });

  it("should read user role", async () => {
    const res = await request(app)
      .get(`/users/${userId}/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read user role if id not found", async () => {
    const res = await request(app)
      .get(`/users/${userId}/roles/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list user roles", async () => {
    const res = await request(app)
      .get(`/users/${userId}/roles`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete user role", async () => {
    const res = await request(app)
      .delete(`/users/${userId}/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
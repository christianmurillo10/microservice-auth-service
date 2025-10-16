import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";
import { createOrganization } from "../factories/organization.factory";
import { createUser } from "../factories/user.factory";
import { createPermission } from "../factories/permission.factory";
import { createRole } from "../factories/role.factory";
import { getAccessToken } from "../../shared/helpers/common.helper";
import { UserAccessTypeValue } from "../../entities/user.entity";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let organizationId = "";
let userId = "";
let id = "";
let roleId = "";
let permissionId = "";

describe("Role Permission - Integration", () => {
  beforeAll(async () => {
    const organization = await createOrganization();
    const user = await createUser(organization.id);
    const role = await createRole(organization.id);
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
    roleId = role.id;
    permissionId = permission.id;
  });

  afterAll(async () => {
    await prisma.role.delete({ where: { id: roleId } });
    await prisma.permission.delete({ where: { id: permissionId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.organization.delete({ where: { id: organizationId } });
    await prisma.$disconnect();
  });

  it("should create role permission", async () => {
    const res = await request(app)
      .post(`/roles/${roleId}/permissions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create role permission if duplicate", async () => {
    const res = await request(app)
      .post(`/roles/${roleId}/permissions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionId });
    expect(res.status).toBe(409);
  });

  it("should sync role permission", async () => {
    const res = await request(app)
      .put(`/roles/${roleId}/permissions/sync`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionIds: [permissionId] });
    expect(res.status).toBe(200);
  });

  it("should read role permission", async () => {
    const res = await request(app)
      .get(`/roles/${roleId}/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read role permission if id not found", async () => {
    const res = await request(app)
      .get(`/roles/${roleId}/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list role permissions", async () => {
    const res = await request(app)
      .get(`/roles/${roleId}/permissions`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete role permission", async () => {
    const res = await request(app)
      .delete(`/roles/${roleId}/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
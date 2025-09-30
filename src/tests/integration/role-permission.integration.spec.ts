import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let id = "";
let roleId = "";
let permissionId = "";

describe("Role Permission - Integration", () => {
  beforeAll(async () => {
    // Login as admin and set headers
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    token = res.body.data.token;

    // Create and set roleId
    const resRole = await request(app)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role for role permission" });
    roleId = resRole.body.data.id;

    // Create and set permissionId
    const resPermission = await request(app)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action for role permission", resource: "test-resource for role permission" });
    permissionId = resPermission.body.data.id;
  });

  afterAll(async () => {
    await prisma.role.delete({ where: { id: roleId } });
    await prisma.permission.delete({ where: { id: permissionId } });
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
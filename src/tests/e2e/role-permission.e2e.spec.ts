import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import http from "http";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
let server: http.Server;
let token = "";
let id = "";
let roleId = "";
let permissionId = "";

describe("Role Permission - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    // Login as admin and set headers
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    token = res.body.data.token;

    // Create and set roleId
    const resRole = await request(server)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role for role permission" });
    roleId = resRole.body.data.id;

    // Create and set permissionId
    const resPermission = await request(server)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action for role permission", resource: "test-resource for role permission" });
    permissionId = resPermission.body.data.id;
  });

  afterAll(async () => {
    await prisma.role.delete({ where: { id: roleId } });
    await prisma.permission.delete({ where: { id: permissionId } });
    await prisma.$disconnect();
    server.close();
  });

  it("should create role permission", async () => {
    const res = await request(server)
      .post(`/roles/${roleId}/permissions`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should sync role permission", async () => {
    const res = await request(server)
      .put(`/roles/${roleId}/permissions/sync`)
      .set("Authorization", `Bearer ${token}`)
      .send({ permissionIds: [permissionId] });
    expect(res.status).toBe(200);
  });

  it("should read role permission", async () => {
    const res = await request(server)
      .get(`/roles/${roleId}/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should list role permissions", async () => {
    const res = await request(server)
      .get(`/roles/${roleId}/permissions`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete role permission", async () => {
    const res = await request(server)
      .delete(`/roles/${roleId}/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
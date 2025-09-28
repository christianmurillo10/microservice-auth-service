import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import http from "http";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let server: http.Server;
let id = "";
let roleId = "";
let permissionId = "";
let headers = {};

describe("Role Permission - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    // Login as admin and set headers
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    headers = { "authorization": `Bearer ${res.body.data.token}` };

    // Create and set roleId
    const resRole = await request(server)
      .post("/roles")
      .set(headers)
      .send({ name: "Test Role for role permission" });
    roleId = resRole.body.data.id;

    // Create and set permissionId
    const resPermission = await request(server)
      .post("/permissions")
      .set(headers)
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
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create role permission if duplicate", async () => {
    const res = await request(server)
      .post(`/roles/${roleId}/permissions`)
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(409);
  });

  it("should sync role permission", async () => {
    const res = await request(server)
      .put(`/roles/${roleId}/permissions/sync`)
      .set(headers)
      .send({ permissionIds: [permissionId] });
    expect(res.status).toBe(200);
  });

  it("should read role permission", async () => {
    const res = await request(server)
      .get(`/roles/${roleId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read role permission if id not found", async () => {
    const res = await request(server)
      .get(`/roles/${roleId}/permissions/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list role permissions", async () => {
    const res = await request(server)
      .get(`/roles/${roleId}/permissions`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete role permission", async () => {
    const res = await request(server)
      .delete(`/roles/${roleId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});
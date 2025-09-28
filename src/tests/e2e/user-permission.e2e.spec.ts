import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import http from "http";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let server: http.Server;
let id = "";
let userId = "";
let permissionId = "";
let headers = {};

describe("User Permission - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    // Login as admin and set headers
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    headers = { "authorization": `Bearer ${res.body.data.token}` };
    userId = res.body.data.userId;

    // Create and set permissionId
    const resPermission = await request(server)
      .post("/permissions")
      .set(headers)
      .send({ action: "test-action for user permission", resource: "test-resource for user permission" });
    permissionId = resPermission.body.data.id;
  });

  afterAll(async () => {
    await prisma.permission.delete({ where: { id: permissionId } });
    await prisma.$disconnect();
    server.close();
  });

  it("should create user permission", async () => {
    const res = await request(server)
      .post(`/users/${userId}/permissions`)
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create user permission if duplicate", async () => {
    const res = await request(server)
      .post(`/users/${userId}/permissions`)
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(409);
  });

  it("should sync user permission", async () => {
    const res = await request(server)
      .put(`/users/${userId}/permissions/sync`)
      .set(headers)
      .send({ permissionIds: [permissionId] });
    expect(res.status).toBe(200);
  });

  it("should read user permission", async () => {
    const res = await request(server)
      .get(`/users/${userId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read user permission if id not found", async () => {
    const res = await request(server)
      .get(`/users/${userId}/permissions/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list user permissions", async () => {
    const res = await request(server)
      .get(`/users/${userId}/permissions`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete user permission", async () => {
    const res = await request(server)
      .delete(`/users/${userId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});
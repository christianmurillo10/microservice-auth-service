import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let id = "";
let userId = "";
let permissionId = "";

describe("User Permission - Integration", () => {
  beforeAll(async () => {
    // Login as admin and set headers
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    token = res.body.data.token;
    userId = res.body.data.userId;

    // Create and set permissionId
    const resPermission = await request(app)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action for user permission", resource: "test-resource for user permission" });
    permissionId = resPermission.body.data.id;
  });

  afterAll(async () => {
    await prisma.permission.delete({ where: { id: permissionId } });
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
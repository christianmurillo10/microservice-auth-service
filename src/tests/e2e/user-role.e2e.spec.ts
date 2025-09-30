import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import http from "http";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let server: http.Server;
let token = "";
let id = "";
let userId = "";
let roleId = "";

describe("User Role - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    // Login as admin and set headers
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    token = res.body.data.token;
    userId = res.body.data.userId;

    // Create and set roleId
    const resRole = await request(server)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role for user role" });
    roleId = resRole.body.data.id;
  });

  afterAll(async () => {
    await prisma.role.delete({ where: { id: roleId } });
    await prisma.$disconnect();
    server.close();
  });

  it("should create user role", async () => {
    const res = await request(server)
      .post(`/users/${userId}/roles`)
      .set("Authorization", `Bearer ${token}`)
      .send({ roleId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create user role if duplicate", async () => {
    const res = await request(server)
      .post(`/users/${userId}/roles`)
      .set("Authorization", `Bearer ${token}`)
      .send({ roleId });
    expect(res.status).toBe(409);
  });

  it("should sync user role", async () => {
    const res = await request(server)
      .put(`/users/${userId}/roles/sync`)
      .set("Authorization", `Bearer ${token}`)
      .send({ roleIds: [roleId] });
    expect(res.status).toBe(200);
  });

  it("should read user role", async () => {
    const res = await request(server)
      .get(`/users/${userId}/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read user role if id not found", async () => {
    const res = await request(server)
      .get(`/users/${userId}/roles/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list user roles", async () => {
    const res = await request(server)
      .get(`/users/${userId}/roles`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete user role", async () => {
    const res = await request(server)
      .delete(`/users/${userId}/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
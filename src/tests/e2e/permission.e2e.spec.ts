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

describe("Permission - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    // Login as admin and set headers
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    token = res.body.data.token;
  });

  afterAll(async () => {
    await prisma.permission.delete({ where: { id } });
    await prisma.$disconnect();
    server.close();
  });

  it("should create permission", async () => {
    const res = await request(server)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create permission if duplicate", async () => {
    const res = await request(server)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(409);
  });

  it("should update permission", async () => {
    const res = await request(server)
      .put(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(200);
  });

  it("should fail update permission if id not found", async () => {
    const res = await request(server)
      .put(`/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(404);
  });

  it("should read permission", async () => {
    const res = await request(server)
      .get(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read permission if id not found", async () => {
    const res = await request(server)
      .get(`/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list permissions", async () => {
    const res = await request(server)
      .get("/permissions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete permission", async () => {
    const res = await request(server)
      .delete(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
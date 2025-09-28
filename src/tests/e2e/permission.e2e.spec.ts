import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import http from "http";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let server: http.Server;
let id = "";
let headers = {};

describe("Permission - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    // Login as admin and set headers
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    headers = { "authorization": `Bearer ${res.body.data.token}` };
  });

  afterAll(async () => {
    await prisma.permission.delete({ where: { id } });
    await prisma.$disconnect();
    server.close();
  });

  it("should create permission", async () => {
    const res = await request(server)
      .post("/permissions")
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create permission if duplicate", async () => {
    const res = await request(server)
      .post("/permissions")
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(409);
  });

  it("should update permission", async () => {
    const res = await request(server)
      .put(`/permissions/${id}`)
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(200);
  });

  it("should fail update permission if id not found", async () => {
    const res = await request(server)
      .put(`/permissions/${noutFoundId}`)
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(404);
  });

  it("should read permission", async () => {
    const res = await request(server)
      .get(`/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read permission if id not found", async () => {
    const res = await request(server)
      .get(`/permissions/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list permissions", async () => {
    const res = await request(server)
      .get("/permissions")
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete permission", async () => {
    const res = await request(server)
      .delete(`/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});